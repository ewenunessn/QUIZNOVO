# Quiz Odontologia Estética

Aplicativo multiplataforma (iOS, Android e Web) para quiz educativo sobre odontologia estética.

## Estrutura do Projeto

```
projeto-quiz-odonto/
├── mobile/          # React Native + Expo
├── web/            # React Web
├── shared/         # Componentes e dados compartilhados
└── README.md
```

## Tecnologias

- **Mobile**: React Native + Expo SDK 51 (compatível com Expo Go 54)
- **Web**: React 18
- **Navegação**: React Navigation
- **Armazenamento**: AsyncStorage (mobile) / localStorage (web)

## Cores do Tema

- Primária: #033860 (azul escuro)
- Secundária: #b2d2d1 (verde-água suave)

## Como Executar

### Mobile (React Native + Expo)
```bash
cd mobile
npm install
npx expo start
```

### Web
```bash
cd web
npm install
npm start
```

## Build para Produção

### Android APK
```bash
cd mobile
eas build --platform android
```

### iOS
```bash
cd mobile
eas build --platform ios
```

### Web
```bash
cd web
npm run build
```