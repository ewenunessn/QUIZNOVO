# Deploy do Quiz Odontologia Estética

## 🚀 Deploy no Vercel

Este projeto está configurado para deploy automático no Vercel via GitHub.

### Passos para Deploy:

1. **Fazer commit e push para GitHub:**
   ```bash
   git add .
   git commit -m "Deploy: Quiz Odontologia Estética"
   git push origin main
   ```

2. **Conectar ao Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub
   - Clique em "New Project"
   - Selecione o repositório do quiz
   - O Vercel detectará automaticamente as configurações

3. **Configurações automáticas:**
   - Build Command: `cd web && npm run build`
   - Output Directory: `web/build`
   - Install Command: `cd web && npm install`

### 📱 Funcionalidades da Versão Web:

- ✅ Interface responsiva para mobile e desktop
- ✅ Ícones SVG monocromáticos consistentes
- ✅ Armazenamento local do nome do usuário
- ✅ Sistema de pontuação
- ✅ Explicações detalhadas das respostas
- ✅ Configurações com edição de perfil
- ✅ Botão de sair funcional

### 🔧 Tecnologias:

- React 18
- React Router DOM
- Create React App
- Ícones SVG customizados
- CSS-in-JS para estilos

### 📊 Performance:

- Otimizado para carregamento rápido
- Compatível com todos os navegadores modernos
- PWA-ready (pode ser instalado como app)