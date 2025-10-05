/**
 * API para verificar status do túnel FTP
 * Testa conectividade e retorna informações detalhadas
 */

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Apenas método GET é permitido'
    });
  }
  
  const targets = [
    'http://192.168.1.100:8080',
    'http://192.168.0.100:8080', 
    'http://192.168.18.100:8080',
    'http://10.0.0.100:8080'
  ];
  
  const credentials = Buffer.from('admin:admin123').toString('base64');
  
  try {
    console.log('🔍 Verificando status dos servidores FTP...');
    
    // Testar todos os targets em paralelo
    const statusPromises = targets.map(async (target) => {
      const startTime = Date.now();
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(target, {
          method: 'HEAD',
          signal: controller.signal,
          headers: {
            'Authorization': `Basic ${credentials}`,
            'User-Agent': 'Vercel-FTP-Tunnel/1.0'
          }
        });
        
        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;
        
        return {
          target,
          status: 'online',
          responseTime,
          httpStatus: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          lastCheck: new Date().toISOString()
        };
        
      } catch (error) {
        const responseTime = Date.now() - startTime;
        
        return {
          target,
          status: 'offline',
          responseTime,
          error: error.message,
          errorType: error.name,
          lastCheck: new Date().toISOString()
        };
      }
    });
    
    const results = await Promise.all(statusPromises);
    
    // Encontrar servidores online
    const onlineServers = results.filter(r => r.status === 'online');
    const offlineServers = results.filter(r => r.status === 'offline');
    
    // Estatísticas
    const stats = {
      total: results.length,
      online: onlineServers.length,
      offline: offlineServers.length,
      averageResponseTime: onlineServers.length > 0 
        ? Math.round(onlineServers.reduce((sum, s) => sum + s.responseTime, 0) / onlineServers.length)
        : null
    };
    
    // Servidor recomendado (menor tempo de resposta)
    const recommended = onlineServers.length > 0 
      ? onlineServers.reduce((best, current) => 
          current.responseTime < best.responseTime ? current : best
        )
      : null;
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      tunnel: {
        status: onlineServers.length > 0 ? 'active' : 'inactive',
        activeServers: onlineServers.length,
        recommended: recommended?.target || null
      },
      statistics: stats,
      servers: {
        online: onlineServers,
        offline: offlineServers
      },
      instructions: {
        access: recommended 
          ? `Use: https://SEU_DOMINIO.vercel.app/api/ftp-tunnel/ para acessar ${recommended.target}`
          : 'Nenhum servidor disponível',
        configure: 'POST /api/ftp-config para atualizar configurações',
        discover: 'GET /api/ftp-discover para buscar novos dispositivos'
      },
      troubleshooting: offlineServers.length > 0 ? {
        commonIssues: [
          'Dispositivo Android não está na mesma rede',
          'Servidor FTP não está rodando',
          'Firewall bloqueando conexões',
          'IP do dispositivo mudou'
        ],
        solutions: [
          'Verifique se o app FTP está instalado e ativo',
          'Confirme conexão Wi-Fi do dispositivo',
          'Use: adb shell ip route get 1.1.1.1 para ver IP atual',
          'Atualize IPs em /api/ftp-config'
        ]
      } : null
    });
    
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    
    res.status(500).json({
      success: false,
      error: 'Erro ao verificar status dos servidores',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}