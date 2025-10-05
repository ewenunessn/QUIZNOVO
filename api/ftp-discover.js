/**
 * API para descobrir automaticamente dispositivos Android com servidor FTP
 * Escaneia ranges de IP comuns para encontrar servidores ativos
 */

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Apenas métodos GET e POST são permitidos'
    });
  }
  
  try {
    // Ranges de IP para escanear
    const ipRanges = [
      '192.168.1', '192.168.0', '192.168.18', '192.168.2',
      '10.0.0', '10.0.1', '172.16.0', '172.16.1'
    ];
    
    // Portas comuns para FTP/HTTP
    const ports = [8080, 8081, 8000, 3000, 5000];
    
    // IPs específicos para testar (últimos octetos comuns)
    const commonLastOctets = [100, 101, 102, 103, 104, 105, 110, 150, 200];
    
    const credentials = Buffer.from('admin:admin123').toString('base64');
    
    console.log('🔍 Iniciando descoberta de dispositivos FTP...');
    
    // Gerar lista de targets para testar
    const targets = [];
    
    for (const range of ipRanges) {
      for (const port of ports) {
        for (const lastOctet of commonLastOctets) {
          targets.push(`http://${range}.${lastOctet}:${port}`);
        }
      }
    }
    
    console.log(`📡 Testando ${targets.length} possíveis endereços...`);
    
    // Função para testar um target
    const testTarget = async (target) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // Timeout menor para descoberta
        
        const response = await fetch(target, {
          method: 'HEAD',
          signal: controller.signal,
          headers: {
            'Authorization': `Basic ${credentials}`,
            'User-Agent': 'FTP-Discovery/1.0'
          }
        });
        
        clearTimeout(timeoutId);
        
        // Verificar se é realmente um servidor FTP Android
        const serverHeader = response.headers.get('server') || '';
        const contentType = response.headers.get('content-type') || '';
        
        const isFtpServer = 
          response.status === 200 || 
          response.status === 401 || 
          contentType.includes('text/html') ||
          serverHeader.toLowerCase().includes('android') ||
          serverHeader.toLowerCase().includes('ftp');
        
        if (isFtpServer) {
          return {
            target,
            status: 'found',
            httpStatus: response.status,
            server: serverHeader,
            contentType,
            headers: Object.fromEntries(response.headers.entries()),
            confidence: response.status === 200 ? 'high' : 'medium'
          };
        }
        
        return null;
        
      } catch (error) {
        return null; // Ignorar erros silenciosamente na descoberta
      }
    };
    
    // Testar em lotes para não sobrecarregar
    const batchSize = 20;
    const foundServers = [];
    
    for (let i = 0; i < targets.length; i += batchSize) {
      const batch = targets.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(testTarget));
      
      const batchFound = batchResults.filter(result => result !== null);
      foundServers.push(...batchFound);
      
      // Log de progresso
      if ((i + batchSize) % 100 === 0 || i + batchSize >= targets.length) {
        console.log(`📊 Progresso: ${Math.min(i + batchSize, targets.length)}/${targets.length} testados, ${foundServers.length} encontrados`);
      }
    }
    
    // Ordenar por confiança e status HTTP
    foundServers.sort((a, b) => {
      if (a.confidence !== b.confidence) {
        return a.confidence === 'high' ? -1 : 1;
      }
      return a.httpStatus - b.httpStatus;
    });
    
    console.log(`✅ Descoberta concluída: ${foundServers.length} servidores encontrados`);
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      discovery: {
        totalTested: targets.length,
        serversFound: foundServers.length,
        duration: `${Math.round(targets.length / batchSize * 0.5)}s estimado`
      },
      servers: foundServers,
      recommendations: foundServers.length > 0 ? {
        primary: foundServers[0]?.target,
        backup: foundServers.slice(1, 3).map(s => s.target),
        updateConfig: `POST /api/ftp-config com targets: ${JSON.stringify(foundServers.slice(0, 5).map(s => s.target))}`
      } : {
        message: 'Nenhum servidor encontrado',
        suggestions: [
          'Verifique se o dispositivo Android está conectado à rede',
          'Confirme se o servidor FTP está rodando',
          'Tente executar a descoberta novamente em alguns minutos',
          'Configure manualmente via /api/ftp-config'
        ]
      },
      usage: foundServers.length > 0 ? {
        access: `https://SEU_DOMINIO.vercel.app/api/ftp-tunnel/`,
        configure: 'POST /api/ftp-config para salvar os servidores encontrados',
        status: 'GET /api/ftp-status para verificar conectividade'
      } : null
    });
    
  } catch (error) {
    console.error('❌ Erro na descoberta:', error);
    
    res.status(500).json({
      success: false,
      error: 'Erro durante a descoberta de dispositivos',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}