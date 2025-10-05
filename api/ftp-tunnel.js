import { createProxyMiddleware } from 'http-proxy-middleware';

// Configuração do túnel FTP
const FTP_CONFIG = {
  // IP padrão do dispositivo Android (será atualizado dinamicamente)
  defaultTarget: 'http://192.168.1.100:8080',
  
  // Múltiplos IPs possíveis para tentar
  possibleTargets: [
    'http://192.168.1.100:8080',
    'http://192.168.0.100:8080', 
    'http://192.168.18.100:8080',
    'http://10.0.0.100:8080'
  ],
  
  // Timeout para conexões
  timeout: 10000
};

// Cache do IP ativo
let activeTarget = null;
let lastCheck = 0;
const CHECK_INTERVAL = 30000; // 30 segundos

/**
 * Testa conectividade com um target
 */
async function testTarget(target) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(target, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'Authorization': 'Basic ' + Buffer.from('admin:admin123').toString('base64')
      }
    });
    
    clearTimeout(timeoutId);
    return response.ok || response.status === 401; // 401 é OK (servidor ativo, só precisa auth)
  } catch (error) {
    return false;
  }
}

/**
 * Encontra o target ativo
 */
async function findActiveTarget() {
  const now = Date.now();
  
  // Se já temos um target ativo e não passou o intervalo, usar ele
  if (activeTarget && (now - lastCheck) < CHECK_INTERVAL) {
    return activeTarget;
  }
  
  console.log('🔍 Procurando servidor FTP Android ativo...');
  
  // Testar targets em paralelo
  const tests = FTP_CONFIG.possibleTargets.map(async (target) => {
    const isActive = await testTarget(target);
    return { target, isActive };
  });
  
  const results = await Promise.all(tests);
  const activeResult = results.find(r => r.isActive);
  
  if (activeResult) {
    activeTarget = activeResult.target;
    lastCheck = now;
    console.log('✅ Servidor FTP encontrado:', activeTarget);
  } else {
    console.log('❌ Nenhum servidor FTP encontrado');
    activeTarget = null;
  }
  
  return activeTarget;
}

/**
 * Handler principal do túnel FTP
 */
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // Encontrar servidor ativo
    const target = await findActiveTarget();
    
    if (!target) {
      return res.status(503).json({
        error: 'Servidor FTP não encontrado',
        message: 'Nenhum dispositivo Android com servidor FTP foi encontrado na rede',
        possibleCauses: [
          'Dispositivo Android não está conectado à mesma rede',
          'Servidor FTP não está rodando no dispositivo',
          'Firewall bloqueando a conexão',
          'IP do dispositivo mudou'
        ],
        instructions: [
          'Verifique se o app FTP está instalado e rodando',
          'Confirme que o dispositivo está na mesma rede Wi-Fi',
          'Use o comando: adb shell ip route get 1.1.1.1 para ver o IP',
          'Atualize o IP em FTP_CONFIG.possibleTargets se necessário'
        ]
      });
    }
    
    // Construir URL completa
    const targetUrl = new URL(req.url, target);
    
    console.log(`🌐 Proxy FTP: ${req.method} ${req.url} -> ${targetUrl}`);
    
    // Preparar headers
    const headers = {
      ...req.headers,
      host: new URL(target).host,
      'x-forwarded-for': req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown',
      'x-forwarded-proto': 'https',
      'x-original-url': req.url
    };
    
    // Remover headers problemáticos
    delete headers['content-length'];
    delete headers['transfer-encoding'];
    
    // Fazer requisição para o servidor Android
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FTP_CONFIG.timeout);
    
    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Copiar headers da resposta (filtrar alguns)
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (!['content-encoding', 'transfer-encoding', 'connection'].includes(lowerKey)) {
        responseHeaders[key] = value;
      }
    });
    
    // Adicionar headers de túnel
    responseHeaders['x-tunnel-source'] = 'vercel-ftp-tunnel';
    responseHeaders['x-tunnel-target'] = target;
    responseHeaders['x-tunnel-timestamp'] = new Date().toISOString();
    
    // Definir headers na resposta
    Object.entries(responseHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    // Definir status
    res.status(response.status);
    
    // Enviar conteúdo
    if (response.headers.get('content-type')?.includes('application/json')) {
      const json = await response.json();
      res.json(json);
    } else {
      const content = await response.text();
      res.send(content);
    }
    
  } catch (error) {
    console.error('❌ Erro no túnel FTP:', error);
    
    // Se o target atual falhou, limpar cache
    if (error.name === 'AbortError' || error.code === 'ECONNREFUSED') {
      activeTarget = null;
      lastCheck = 0;
    }
    
    res.status(500).json({
      error: 'Erro no túnel FTP',
      message: 'Não foi possível conectar ao servidor FTP Android',
      details: error.message,
      target: activeTarget,
      timestamp: new Date().toISOString(),
      troubleshooting: {
        'ECONNREFUSED': 'Servidor FTP não está rodando ou IP incorreto',
        'AbortError': 'Timeout na conexão - servidor muito lento ou inativo',
        'TypeError': 'Erro de rede ou DNS'
      }[error.name] || 'Erro desconhecido'
    });
  }
}