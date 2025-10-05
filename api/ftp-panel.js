/**
 * Painel web para gerenciar o túnel FTP
 * Interface HTML simples para configurar e monitorar
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Apenas método GET permitido' });
  }
  
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌐 Painel do Túnel FTP Android</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 15px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white; 
            padding: 30px; 
            text-align: center; 
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { opacity: 0.9; font-size: 1.1em; }
        .content { padding: 30px; }
        .section { 
            margin-bottom: 30px; 
            padding: 25px; 
            border: 2px solid #f0f0f0; 
            border-radius: 10px;
            background: #fafafa;
        }
        .section h2 { 
            color: #333; 
            margin-bottom: 15px; 
            font-size: 1.5em;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .btn { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            border: none; 
            padding: 12px 25px; 
            border-radius: 8px; 
            cursor: pointer; 
            font-size: 1em;
            margin: 5px;
            transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn.success { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        .btn.warning { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
        .btn.danger { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); }
        .status { 
            padding: 15px; 
            border-radius: 8px; 
            margin: 10px 0; 
            font-weight: bold;
        }
        .status.online { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .status.offline { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .status.loading { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .card { 
            background: white; 
            padding: 20px; 
            border-radius: 10px; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border-left: 4px solid #667eea;
        }
        .input-group { margin: 15px 0; }
        .input-group label { display: block; margin-bottom: 5px; font-weight: bold; color: #555; }
        .input-group input { 
            width: 100%; 
            padding: 10px; 
            border: 2px solid #ddd; 
            border-radius: 5px; 
            font-size: 1em;
        }
        .input-group input:focus { border-color: #667eea; outline: none; }
        .log { 
            background: #2d3748; 
            color: #e2e8f0; 
            padding: 15px; 
            border-radius: 8px; 
            font-family: 'Courier New', monospace; 
            max-height: 300px; 
            overflow-y: auto;
            white-space: pre-wrap;
        }
        .url-box { 
            background: #f8f9fa; 
            border: 2px dashed #667eea; 
            padding: 15px; 
            border-radius: 8px; 
            text-align: center; 
            margin: 15px 0;
        }
        .url-box a { 
            color: #667eea; 
            text-decoration: none; 
            font-weight: bold; 
            font-size: 1.1em;
        }
        .url-box a:hover { text-decoration: underline; }
        .stats { display: flex; justify-content: space-around; text-align: center; }
        .stat { padding: 15px; }
        .stat-number { font-size: 2em; font-weight: bold; color: #667eea; }
        .stat-label { color: #666; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌐 Túnel FTP Android</h1>
            <p>Acesse seus arquivos Android de qualquer lugar do mundo</p>
        </div>
        
        <div class="content">
            <!-- Status Section -->
            <div class="section">
                <h2>📊 Status do Túnel</h2>
                <div id="status" class="status loading">🔄 Verificando status...</div>
                <div class="stats" id="stats" style="display: none;">
                    <div class="stat">
                        <div class="stat-number" id="onlineCount">-</div>
                        <div class="stat-label">Servidores Online</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number" id="responseTime">-</div>
                        <div class="stat-label">Tempo Resposta (ms)</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number" id="lastCheck">-</div>
                        <div class="stat-label">Última Verificação</div>
                    </div>
                </div>
                <button class="btn success" onclick="checkStatus()">🔄 Atualizar Status</button>
                <button class="btn" onclick="discoverDevices()">🔍 Descobrir Dispositivos</button>
            </div>
            
            <!-- Access Section -->
            <div class="section">
                <h2>🌐 Acessar Arquivos</h2>
                <div class="url-box">
                    <p>URL do Túnel FTP:</p>
                    <a href="/api/ftp-tunnel/" target="_blank" id="tunnelUrl">
                        https://odontoquiz.vercel.app/api/ftp-tunnel/
                    </a>
                </div>
                <p><strong>Credenciais:</strong> admin / admin123</p>
                <button class="btn success" onclick="openTunnel()">🚀 Abrir Navegador de Arquivos</button>
            </div>
            
            <!-- Configuration Section -->
            <div class="grid">
                <div class="card">
                    <h3>⚙️ Configuração</h3>
                    <div class="input-group">
                        <label>IP do Dispositivo Android:</label>
                        <input type="text" id="newTarget" placeholder="http://192.168.1.100:8080">
                    </div>
                    <button class="btn" onclick="addTarget()">➕ Adicionar IP</button>
                    <button class="btn warning" onclick="loadConfig()">📋 Ver Configuração</button>
                </div>
                
                <div class="card">
                    <h3>🔧 Ações Rápidas</h3>
                    <button class="btn success" onclick="testConnection()">🧪 Testar Conexão</button>
                    <button class="btn" onclick="clearCache()">🗑️ Limpar Cache</button>
                    <button class="btn warning" onclick="resetConfig()">🔄 Reset Configuração</button>
                </div>
            </div>
            
            <!-- Logs Section -->
            <div class="section">
                <h2>📝 Logs e Informações</h2>
                <div id="logs" class="log">Carregando informações do sistema...</div>
                <button class="btn" onclick="clearLogs()">🗑️ Limpar Logs</button>
            </div>
        </div>
    </div>

    <script>
        let logContainer = document.getElementById('logs');
        
        function log(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
            logContainer.textContent += \`[\${timestamp}] \${prefix} \${message}\\n\`;
            logContainer.scrollTop = logContainer.scrollHeight;
        }
        
        async function checkStatus() {
            log('Verificando status dos servidores...');
            try {
                const response = await fetch('/api/ftp-status');
                const data = await response.json();
                
                const statusDiv = document.getElementById('status');
                const statsDiv = document.getElementById('stats');
                
                if (data.success && data.tunnel.status === 'active') {
                    statusDiv.className = 'status online';
                    statusDiv.textContent = \`✅ Túnel Ativo - \${data.tunnel.activeServers} servidor(es) online\`;
                    
                    document.getElementById('onlineCount').textContent = data.tunnel.activeServers;
                    document.getElementById('responseTime').textContent = data.statistics.averageResponseTime || '-';
                    document.getElementById('lastCheck').textContent = new Date().toLocaleTimeString();
                    statsDiv.style.display = 'flex';
                    
                    log(\`Status: \${data.tunnel.activeServers} servidores online\`, 'success');
                    if (data.tunnel.recommended) {
                        log(\`Servidor recomendado: \${data.tunnel.recommended}\`, 'success');
                    }
                } else {
                    statusDiv.className = 'status offline';
                    statusDiv.textContent = '❌ Nenhum servidor FTP encontrado';
                    statsDiv.style.display = 'none';
                    log('Nenhum servidor FTP ativo encontrado', 'error');
                }
            } catch (error) {
                log(\`Erro ao verificar status: \${error.message}\`, 'error');
            }
        }
        
        async function discoverDevices() {
            log('Iniciando descoberta de dispositivos...');
            const statusDiv = document.getElementById('status');
            statusDiv.className = 'status loading';
            statusDiv.textContent = '🔍 Descobrindo dispositivos...';
            
            try {
                const response = await fetch('/api/ftp-discover');
                const data = await response.json();
                
                if (data.success && data.servers.length > 0) {
                    log(\`Descoberta concluída: \${data.servers.length} servidores encontrados\`, 'success');
                    data.servers.forEach(server => {
                        log(\`Encontrado: \${server.target} (confiança: \${server.confidence})\`);
                    });
                    
                    if (data.recommendations.primary) {
                        log(\`Servidor primário recomendado: \${data.recommendations.primary}\`, 'success');
                    }
                } else {
                    log('Nenhum dispositivo encontrado na descoberta', 'error');
                }
                
                // Atualizar status após descoberta
                setTimeout(checkStatus, 1000);
            } catch (error) {
                log(\`Erro na descoberta: \${error.message}\`, 'error');
            }
        }
        
        async function addTarget() {
            const target = document.getElementById('newTarget').value.trim();
            if (!target) {
                log('Digite um IP válido', 'error');
                return;
            }
            
            try {
                const response = await fetch('/api/ftp-config', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ target })
                });
                
                const data = await response.json();
                if (data.success) {
                    log(\`IP adicionado: \${target}\`, 'success');
                    document.getElementById('newTarget').value = '';
                    setTimeout(checkStatus, 500);
                } else {
                    log(\`Erro ao adicionar IP: \${data.error}\`, 'error');
                }
            } catch (error) {
                log(\`Erro: \${error.message}\`, 'error');
            }
        }
        
        async function loadConfig() {
            try {
                const response = await fetch('/api/ftp-config');
                const data = await response.json();
                
                if (data.success) {
                    log('Configuração atual:', 'success');
                    log(\`Targets: \${data.config.targets.join(', ')}\`);
                    log(\`Target ativo: \${data.config.activeTarget || 'Nenhum'}\`);
                    log(\`Última atualização: \${data.config.lastUpdate}\`);
                }
            } catch (error) {
                log(\`Erro ao carregar configuração: \${error.message}\`, 'error');
            }
        }
        
        function openTunnel() {
            const url = '/api/ftp-tunnel/';
            window.open(url, '_blank');
            log('Abrindo navegador de arquivos...', 'success');
        }
        
        function clearLogs() {
            logContainer.textContent = '';
            log('Logs limpos');
        }
        
        async function testConnection() {
            log('Testando conexão com o túnel...');
            try {
                const response = await fetch('/api/ftp-tunnel/', { method: 'HEAD' });
                if (response.ok) {
                    log('Conexão com túnel bem-sucedida!', 'success');
                } else {
                    log(\`Erro na conexão: HTTP \${response.status}\`, 'error');
                }
            } catch (error) {
                log(\`Erro de conexão: \${error.message}\`, 'error');
            }
        }
        
        // Inicializar painel
        document.addEventListener('DOMContentLoaded', function() {
            log('Painel do Túnel FTP inicializado');
            log('Verificando status inicial...');
            checkStatus();
            
            // Atualizar status a cada 30 segundos
            setInterval(checkStatus, 30000);
        });
    </script>
</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
}