# Deploy do Quiz Odontologia Estética - Expo Web

## 🚀 Deploy no Vercel

Este projeto Expo está configurado para deploy automático da versão web no Vercel via GitHub.

### Passos para Deploy:

1. **Fazer commit e push para GitHub:**
   ```bash
   git add .
   git commit -m "Deploy: Quiz Odontologia Estética - Expo Web"
   git push origin main
   ```

2. **Conectar ao Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub
   - Clique em "New Project"
   - Selecione o repositório do quiz
   - O Vercel detectará automaticamente as configurações

3. **Configurações automáticas:**
   - Build Command: `cd mobile && npm install && npx expo export --platform web`
   - Output Directory: `mobile/dist`
   - Install Command: `cd mobile && npm install`

### 📱 Funcionalidades da Versão Web Expo:

- ✅ Interface responsiva para mobile e desktop
- ✅ Ícones Ionicons nativos do Expo
- ✅ Armazenamento local com AsyncStorage
- ✅ Sistema de pontuação completo
- ✅ Animações suaves
- ✅ Explicações detalhadas das respostas
- ✅ Configurações com edição de perfil
- ✅ Botão de sair funcional (web + nativo)
- ✅ Navegação com React Navigation
- ✅ Compatível com Expo Go

### 🔧 Tecnologias:

- Expo SDK
- React Native Web
- React Navigation
- Ionicons
- AsyncStorage
- Animated API

### 📊 Performance:

- Otimizado para carregamento rápido
- Compatível com todos os navegadores modernos
- Mesma base de código para mobile e web
- PWA-ready (pode ser instalado como app)

### 🎯 Versão Atual:

Esta é a versão web do projeto Expo que você acessa em `http://localhost:8081` quando roda `npx expo start --web`.