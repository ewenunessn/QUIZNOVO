# Instruções de Instalação e Deployment

## Pré-requisitos

### Para Mobile (React Native + Expo)
- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI: `npm install -g @expo/cli`
- EAS CLI: `npm install -g eas-cli`

### Para Web (React)
- Node.js (versão 16 ou superior)
- npm ou yarn

## Instalação

### 1. Mobile (React Native + Expo)

```bash
cd mobile
npm install
```

### 2. Web (React)

```bash
cd web
npm install
```

## Executar Localmente

### Mobile
```bash
cd mobile
npx expo start
```

Opções:
- Pressione `a` para abrir no Android
- Pressione `i` para abrir no iOS
- Pressione `w` para abrir no navegador
- Escaneie o QR code com o app Expo Go

### Web
```bash
cd web
npm start
```

O aplicativo será aberto em `http://localhost:3000`

## Build para Produção

### Android APK

1. Configure o EAS:
```bash
cd mobile
eas login
eas build:configure
```

2. Gere o APK:
```bash
eas build --platform android --profile preview
```

3. Para produção:
```bash
eas build --platform android --profile production
```

### iOS

1. Configure o EAS (necessário conta Apple Developer):
```bash
cd mobile
eas build --platform ios --profile preview
```

2. Para produção:
```bash
eas build --platform ios --profile production
```

### Web

```bash
cd web
npm run build
```

Os arquivos de produção estarão na pasta `build/`

## Deploy Web

### Netlify
1. Faça build: `npm run build`
2. Arraste a pasta `build` para o Netlify
3. Configure redirects criando `public/_redirects`:
```
/*    /index.html   200
```

### Vercel
```bash
npm install -g vercel
cd web
vercel
```

### GitHub Pages
1. Instale gh-pages: `npm install --save-dev gh-pages`
2. Adicione no package.json:
```json
{
  "homepage": "https://seuusuario.github.io/quiz-odonto",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```
3. Execute: `npm run deploy`

## Estrutura de Arquivos

```
projeto-quiz-odonto/
├── mobile/                 # App React Native
│   ├── src/
│   │   └── screens/       # Telas do app
│   ├── App.js             # Componente principal
│   ├── app.json           # Configuração Expo
│   └── package.json
├── web/                   # App React Web
│   ├── src/
│   │   └── screens/       # Telas do app
│   ├── public/
│   └── package.json
├── shared/                # Código compartilhado
│   ├── constants/         # Cores e constantes
│   └── data/             # Dados das questões
└── README.md
```

## Personalização

### Cores
Edite `shared/constants/colors.js` para alterar as cores do tema.

### Questões
Edite `shared/data/questions.js` para modificar as perguntas do quiz.

### Ícones e Splash Screen
- Substitua os arquivos em `mobile/assets/`
- Use o Expo Icon Generator: https://docs.expo.dev/guides/app-icons/

## Troubleshooting

### Erro de dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro no Expo
```bash
npx expo install --fix
```

### Erro de importação no React Web
Se aparecer erro "falls outside of src/ directory":
- Os arquivos compartilhados já estão duplicados em `web/src/`
- Use os imports locais: `../constants/colors` e `../data/questions`

### Warnings do ESLint
```bash
# Para corrigir automaticamente
npm run build
# Ou ignore warnings temporariamente
GENERATE_SOURCEMAP=false npm run build
```

### Erro de build Android
- Verifique se o Java SDK está instalado
- Configure as variáveis de ambiente ANDROID_HOME

### Erro de build iOS
- Necessário macOS e Xcode
- Conta Apple Developer ativa

## Suporte

Para dúvidas sobre:
- Expo: https://docs.expo.dev/
- React Navigation: https://reactnavigation.org/
- EAS Build: https://docs.expo.dev/build/introduction/