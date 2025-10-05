# 🌐 Túnel FTP Android - Acesso Global

Sistema completo de túnel reverso para acessar o servidor FTP Android de qualquer lugar do mundo através da Vercel.

## 🚀 Como Funciona

O sistema cria um **túnel reverso** que permite acessar seu dispositivo Android através da internet:

```
Internet → Vercel (Túnel) → Rede Local → Dispositivo Android
```

## 📡 Endpoints da API

### 1. **Túnel Principal**
```
GET https://odontoquiz.vercel.app/api/ftp-tunnel/
```
- **Função**: Proxy principal para acessar arquivos
- **Uso**: Navegador de arquivos web
- **Auth**: admin / admin123

### 2. **Painel de Controle**
```
GET https://odontoquiz.vercel.app/api/ftp-panel
```
- **Função**: Interface web para gerenciar o túnel
- **Recursos**: Status, configuração, descoberta, logs

### 3. **Status do Túnel**
```
GET https://odontoquiz.vercel.app/api/ftp-status
```
- **Função**: Verificar conectividade dos servidores
- **Retorna**: Status online/offline, tempos de resposta

### 4. **Configuração**
```
GET/POST/PUT/DELETE https://odontoquiz.vercel.app/api/ftp-config
```
- **GET**: Ver configuração atual
- **POST**: Atualizar configurações
- **PUT**: Adicionar novo IP
- **DELETE**: Remover IP

### 5. **Descoberta Automática**
```
GET https://odontoquiz.vercel.app/api/ftp-discover
```
- **Função**: Escanear rede para encontrar dispositivos
- **Escaneia**: Ranges de IP comuns (192.168.x.x, 10.0.x.x, etc.)

## 🛠️ Configuração Inicial

### 1. Deploy na Vercel
```bash
# No diretório raiz do projeto
vercel --prod
```

### 2. Configurar IPs do Dispositivo
```bash
# Descobrir IP do Android
adb shell ip route get 1.1.1.1

# Adicionar IP via API
curl -X PUT https://odontoquiz.vercel.app/api/ftp-config \
  -H "Content-Type: application/json" \
  -d '{"target": "http://192.168.1.100:8080"}'
```

### 3. Testar Conectividade
```bash
# Verificar status
curl https://odontoquiz.vercel.app/api/ftp-status

# Descobrir dispositivos automaticamente
curl https://odontoquiz.vercel.app/api/ftp-discover
```

## 🌐 Formas de Acesso

### 1. **Navegador Web**
```
https://odontoquiz.vercel.app/api/ftp-tunnel/
```
- Interface HTML completa
- Upload/download de arquivos
- Navegação por pastas
- Autenticação integrada

### 2. **API REST**
```bash
# Listar arquivos
curl -u admin:admin123 https://odontoquiz.vercel.app/api/ftp-tunnel/

# Download de arquivo
curl -u admin:admin123 https://odontoquiz.vercel.app/api/ftp-tunnel/download/arquivo.pdf

# Upload via POST (se implementado)
curl -u admin:admin123 -X POST -F "file=@local.txt" https://odontoquiz.vercel.app/api/ftp-tunnel/upload/
```

### 3. **Painel de Controle**
```
https://odontoquiz.vercel.app/api/ftp-panel
```
- Interface gráfica completa
- Monitoramento em tempo real
- Configuração visual
- Logs detalhados

## 🔧 Configuração Avançada

### Múltiplos Dispositivos
```javascript
// Configurar vários IPs
const targets = [
  "http://192.168.1.100:8080",  // Casa
  "http://192.168.0.150:8080",  // Trabalho
  "http://10.0.0.200:8080"      // Outro local
];

fetch('/api/ftp-config', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ targets })
});
```

### Credenciais Personalizadas
```javascript
// Atualizar usuário/senha
fetch('/api/ftp-config', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    credentials: {
      username: "meuuser",
      password: "minhasenha"
    }
  })
});
```

### Configurações de Timeout
```javascript
// Ajustar timeouts
fetch('/api/ftp-config', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    settings: {
      timeout: 15000,        // 15 segundos
      checkInterval: 60000   // 1 minuto
    }
  })
});
```

## 🔒 Segurança

### Autenticação
- **Básica HTTP**: Usuário/senha obrigatórios
- **Headers personalizados**: Identificação de origem
- **CORS configurado**: Acesso controlado

### Logs e Monitoramento
- **Logs detalhados**: Todas as requisições registradas
- **Headers de rastreamento**: Origem e timestamp
- **Detecção de falhas**: Auto-recuperação

### Limitações de Segurança
- **Rede local apenas**: Dispositivo deve estar na mesma rede
- **Sem criptografia adicional**: Use HTTPS da Vercel
- **Rate limiting**: Implementar se necessário

## 🐛 Solução de Problemas

### Erro 503 - Servidor não encontrado
```bash
# Verificar se dispositivo está online
ping 192.168.1.100

# Testar porta diretamente
curl -I http://192.168.1.100:8080

# Descobrir novos IPs
curl https://odontoquiz.vercel.app/api/ftp-discover
```

### Timeout de Conexão
```bash
# Verificar configurações
curl https://odontoquiz.vercel.app/api/ftp-config

# Aumentar timeout
curl -X POST https://odontoquiz.vercel.app/api/ftp-config \
  -H "Content-Type: application/json" \
  -d '{"settings": {"timeout": 20000}}'
```

### Dispositivo mudou de IP
```bash
# Descobrir novo IP
adb shell ip route get 1.1.1.1

# Atualizar configuração
curl -X PUT https://odontoquiz.vercel.app/api/ftp-config \
  -H "Content-Type: application/json" \
  -d '{"target": "http://NOVO_IP:8080"}'
```

## 📊 Monitoramento

### Status em Tempo Real
```javascript
// Verificar status periodicamente
setInterval(async () => {
  const response = await fetch('/api/ftp-status');
  const status = await response.json();
  console.log('Servidores online:', status.tunnel.activeServers);
}, 30000);
```

### Métricas Disponíveis
- **Servidores online/offline**
- **Tempo de resposta médio**
- **Última verificação**
- **Histórico de conectividade**

## 🚀 Casos de Uso

### 1. **Acesso Remoto a Arquivos**
- Trabalhar com arquivos do celular no computador
- Backup automático via scripts
- Sincronização de documentos

### 2. **Desenvolvimento Mobile**
- Testar uploads/downloads
- Debug de aplicações
- Transferência de builds

### 3. **Compartilhamento Temporário**
- Enviar arquivos grandes
- Galeria de fotos acessível
- Documentos para apresentações

## 🔄 Atualizações Futuras

### Recursos Planejados
- [ ] Upload via interface web
- [ ] Autenticação JWT
- [ ] Rate limiting
- [ ] Compressão de arquivos
- [ ] Preview de imagens/vídeos
- [ ] Histórico de acessos
- [ ] Notificações push
- [ ] API webhooks

### Melhorias de Performance
- [ ] Cache inteligente
- [ ] Compressão gzip
- [ ] CDN para arquivos estáticos
- [ ] Load balancing múltiplos dispositivos

---

**💡 Dica**: Use o painel web em `/api/ftp-panel` para uma experiência mais amigável!