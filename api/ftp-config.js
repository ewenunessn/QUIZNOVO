/**
 * API para configurar dinamicamente o túnel FTP
 * Permite atualizar IPs e configurações remotamente
 */

// Armazenamento em memória (em produção, usar banco de dados)
let ftpConfig = {
  targets: [
    'http://192.168.1.100:8080',
    'http://192.168.0.100:8080', 
    'http://192.168.18.100:8080',
    'http://10.0.0.100:8080'
  ],
  activeTarget: null,
  lastUpdate: new Date().toISOString(),
  credentials: {
    username: 'admin',
    password: 'admin123'
  },
  settings: {
    timeout: 10000,
    checkInterval: 30000,
    autoDiscovery: true
  }
};

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    switch (req.method) {
      case 'GET':
        // Retornar configuração atual
        res.json({
          success: true,
          config: ftpConfig,
          endpoints: {
            tunnel: '/api/ftp-tunnel',
            config: '/api/ftp-config',
            status: '/api/ftp-status',
            discover: '/api/ftp-discover'
          },
          usage: {
            'Acessar arquivos': 'https://SEU_DOMINIO.vercel.app/api/ftp-tunnel/',
            'Ver configuração': 'https://SEU_DOMINIO.vercel.app/api/ftp-config',
            'Verificar status': 'https://SEU_DOMINIO.vercel.app/api/ftp-status',
            'Descobrir dispositivos': 'https://SEU_DOMINIO.vercel.app/api/ftp-discover'
          }
        });
        break;
        
      case 'POST':
        // Atualizar configuração
        const updates = req.body;
        
        if (updates.targets) {
          ftpConfig.targets = updates.targets;
        }
        
        if (updates.credentials) {
          ftpConfig.credentials = { ...ftpConfig.credentials, ...updates.credentials };
        }
        
        if (updates.settings) {
          ftpConfig.settings = { ...ftpConfig.settings, ...updates.settings };
        }
        
        if (updates.activeTarget) {
          ftpConfig.activeTarget = updates.activeTarget;
        }
        
        ftpConfig.lastUpdate = new Date().toISOString();
        
        res.json({
          success: true,
          message: 'Configuração atualizada com sucesso',
          config: ftpConfig
        });
        break;
        
      case 'PUT':
        // Adicionar novo target
        const { target } = req.body;
        
        if (!target) {
          return res.status(400).json({
            success: false,
            error: 'Target é obrigatório'
          });
        }
        
        if (!ftpConfig.targets.includes(target)) {
          ftpConfig.targets.push(target);
          ftpConfig.lastUpdate = new Date().toISOString();
        }
        
        res.json({
          success: true,
          message: 'Target adicionado com sucesso',
          targets: ftpConfig.targets
        });
        break;
        
      case 'DELETE':
        // Remover target
        const { target: targetToRemove } = req.body;
        
        if (!targetToRemove) {
          return res.status(400).json({
            success: false,
            error: 'Target é obrigatório'
          });
        }
        
        ftpConfig.targets = ftpConfig.targets.filter(t => t !== targetToRemove);
        
        if (ftpConfig.activeTarget === targetToRemove) {
          ftpConfig.activeTarget = null;
        }
        
        ftpConfig.lastUpdate = new Date().toISOString();
        
        res.json({
          success: true,
          message: 'Target removido com sucesso',
          targets: ftpConfig.targets
        });
        break;
        
      default:
        res.status(405).json({
          success: false,
          error: 'Método não permitido'
        });
    }
    
  } catch (error) {
    console.error('Erro na API de configuração FTP:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
}