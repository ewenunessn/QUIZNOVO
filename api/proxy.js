export default async function handler(req, res) {
  const targetUrl = 'http://192.168.18.12:8081';
  
  try {
    // Construir a URL completa
    const url = new URL(req.url, targetUrl);
    
    // Fazer a requisição para o servidor local
    const response = await fetch(url.toString(), {
      method: req.method,
      headers: {
        ...req.headers,
        host: '192.168.18.12:8081'
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });
    
    // Copiar headers da resposta
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    // Definir status code
    res.status(response.status);
    
    // Enviar o conteúdo
    const content = await response.text();
    res.send(content);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: 'Não foi possível conectar ao servidor local. Certifique-se de que o Expo está rodando em localhost:8081',
      details: error.message 
    });
  }
}