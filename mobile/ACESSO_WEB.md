# 🌐 Acesso Web - URLs Diretas

## URLs Disponíveis

Quando o app está rodando na web (Expo Web), você pode acessar diretamente as seguintes URLs:

---

## 📊 Estatísticas

### URL Principal:
```
http://localhost:19006/statistics
```

### URL Alternativa (em português):
```
http://localhost:19006/estatisticas
```

**O que você verá:**
- Tela completa de estatísticas
- 5 abas de navegação:
  - Geral
  - Usuários
  - Perguntas
  - Feedbacks
  - Detalhes

---

## 👨‍💼 Admin

### URL:
```
http://localhost:19006/admin
```

**O que você verá:**
- Painel administrativo
- Gerenciamento de perguntas
- Configurações do app
- Botão para acessar estatísticas

---

## 🏠 Página Inicial

### URL:
```
http://localhost:19006/
```

**O que você verá:**
- Tela de boas-vindas
- Fluxo normal do app

---

## 🚀 Como Usar

### 1. Inicie o servidor de desenvolvimento:
```bash
cd mobile
npm start
```

### 2. Pressione `w` para abrir no navegador web

### 3. Acesse diretamente as URLs:

#### Para ver estatísticas:
- Digite na barra de endereços: `http://localhost:19006/statistics`
- Ou: `http://localhost:19006/estatisticas`

#### Para acessar admin:
- Digite na barra de endereços: `http://localhost:19006/admin`

---

## 🌍 Em Produção (Vercel/Netlify)

Quando o app estiver publicado, as URLs serão:

```
https://seu-dominio.com/statistics
https://seu-dominio.com/estatisticas
https://seu-dominio.com/admin
```

---

## 🔐 Segurança

**Importante:** 
- Essas URLs são públicas quando o app está na web
- Considere adicionar autenticação para proteger:
  - `/admin`
  - `/statistics`
  - `/estatisticas`

### Sugestão de Proteção:

Você pode adicionar uma senha simples ou autenticação Firebase para proteger essas rotas.

---

## 📱 Navegação Interna (App Mobile)

No app mobile (iOS/Android), o acesso continua sendo:

```
Home → Admin → Ver Estatísticas
```

---

## 🔄 Navegação entre Páginas

Todas as páginas têm botão de voltar que funciona tanto no app quanto na web:

- **Botão "Voltar"** no canto superior esquerdo
- **Navegação do navegador** (setas voltar/avançar)
- **Histórico do navegador** funciona normalmente

---

## 🎯 Resumo Rápido

| Página | URL | Acesso |
|--------|-----|--------|
| Início | `/` | Público |
| Admin | `/admin` | Direto via URL |
| Estatísticas | `/statistics` | Direto via URL |
| Estatísticas (PT) | `/estatisticas` | Direto via URL |

---

## 💡 Dicas

1. **Marque como favorito** as URLs que você mais usa
2. **Compartilhe** as URLs com outros administradores
3. **Use atalhos** do navegador para acesso rápido
4. **Atualize a página** (F5) para recarregar os dados

---

## 🐛 Troubleshooting

### Página não carrega?
- Verifique se o servidor está rodando (`npm start`)
- Confirme a porta (geralmente 19006)
- Limpe o cache do navegador

### Dados não aparecem?
- Verifique a conexão com Firebase
- Abra o console do navegador (F12) para ver erros
- Recarregue a página

### Botão voltar não funciona?
- Use o botão "Voltar" da própria tela
- Ou navegue manualmente para `/`

---

**Atualizado em:** 06/10/2025
**Status:** ✅ Funcional
