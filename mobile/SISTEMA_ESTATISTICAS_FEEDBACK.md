# Sistema de Estatísticas e Feedback

## 📊 Implementação Completa

Este documento descreve o sistema de estatísticas e feedback implementado no aplicativo de quiz de odontologia.

---

## ✅ Funcionalidades Implementadas

### 1. **Registro de Respostas dos Usuários**

Cada resposta do usuário durante o quiz é automaticamente registrada no Firebase com as seguintes informações:

- **Nome do usuário**
- **ID da pergunta**
- **Texto da pergunta**
- **Resposta do usuário** (Verdadeiro/Falso)
- **Resposta correta**
- **Se acertou ou errou**
- **Data e hora** (timestamp)

**Arquivo:** `mobile/src/screens/QuizScreen.js`
- Função `handleAnswer()` modificada para salvar cada resposta no Firebase
- Utiliza `AsyncStorage` para obter o nome do usuário
- Não bloqueia o fluxo do quiz em caso de erro

---

### 2. **Sistema de Feedback**

Após completar o quiz, o usuário é direcionado para uma tela de feedback onde pode:

- **Avaliar a experiência** com 1 a 5 estrelas
- **Deixar um comentário** (opcional, até 500 caracteres)
- **Pular o feedback** e voltar ao início

**Arquivo:** `mobile/src/screens/FeedbackScreen.js`

#### Características:
- Animações suaves e intuitivas
- Validação de avaliação obrigatória
- Contador de caracteres para o comentário
- Feedback visual ao selecionar estrelas
- Suporte para teclado (KeyboardAvoidingView)

**Dados salvos no Firebase:**
- Nome do usuário
- Avaliação (1-5 estrelas)
- Comentário
- Pontuação obtida no quiz
- Total de questões
- Porcentagem de acerto
- Data e hora

---

### 3. **Tela de Estatísticas para Administradores**

Tela completa com 5 abas de visualização:

**Arquivo:** `mobile/src/screens/StatisticsScreen.js`

#### **Aba 1: Geral**
- Total de usuários únicos
- Total de respostas
- Total de acertos
- Total de erros
- Taxa de acerto geral (%)
- Barra de progresso visual

#### **Aba 2: Usuários**
- Lista de todos os usuários
- Estatísticas individuais:
  - Total de respostas
  - Acertos
  - Erros
  - Taxa de acerto (%)
- Ordenado por número de respostas

#### **Aba 3: Perguntas**
- Estatísticas por pergunta:
  - Número da pergunta
  - Texto da pergunta
  - Total de respostas
  - Acertos
  - Erros
  - Taxa de acerto (%)
- Identifica perguntas mais difíceis

#### **Aba 4: Feedbacks** ⭐ NOVO
- Total de feedbacks recebidos
- Média de avaliação geral
- Distribuição de estrelas (gráfico de barras)
- Lista completa de feedbacks com:
  - Nome do usuário
  - Avaliação em estrelas
  - Comentário
  - Pontuação no quiz
  - Data e hora

#### **Aba 5: Detalhes**
- Lista detalhada das últimas 50 respostas
- Informações completas:
  - Nome do usuário
  - Pergunta respondida
  - Resposta dada
  - Resposta correta
  - Se acertou ou errou
  - Data e hora

---

### 4. **Serviços do Firebase**

**Arquivo:** `mobile/src/services/questionsService.js`

#### Funções de Estatísticas:
- `saveUserAnswer()` - Salva resposta individual
- `getAllUserAnswers()` - Busca todas as respostas
- `getStatistics()` - Calcula estatísticas agregadas

#### Funções de Feedback:
- `saveFeedback()` - Salva feedback do usuário
- `getAllFeedbacks()` - Busca todos os feedbacks
- `getFeedbackStatistics()` - Calcula estatísticas de feedback

---

## 🗄️ Estrutura do Firebase

### Coleção: `user-answers`
```javascript
{
  userName: "João Silva",
  questionId: 1,
  questionText: "Clareamento dental em excesso...",
  userAnswer: true,
  correctAnswer: true,
  isCorrect: true,
  timestamp: "2025-10-06T14:30:00.000Z"
}
```

### Coleção: `feedbacks`
```javascript
{
  userName: "João Silva",
  rating: 5,
  comment: "Adorei o quiz! Muito educativo.",
  score: 8,
  totalQuestions: 10,
  percentage: 80,
  timestamp: "2025-10-06T14:35:00.000Z"
}
```

---

## 🎯 Fluxo do Usuário

1. **Usuário inicia o quiz** → Nome é capturado na WelcomeScreen
2. **Responde cada pergunta** → Resposta é salva automaticamente no Firebase
3. **Completa o quiz** → Vê a tela de resultado (ResultScreen)
4. **Clica em "Deixar Feedback"** → Vai para FeedbackScreen
5. **Avalia e comenta** → Feedback é salvo no Firebase
6. **Volta ao início** → Pode fazer o quiz novamente

---

## 👨‍💼 Acesso do Administrador

1. **Acessa a tela de Admin** (HomeScreen → botão Admin)
2. **Clica em "Ver Estatísticas"** → Abre StatisticsScreen
3. **Navega pelas abas** para ver diferentes análises:
   - Estatísticas gerais
   - Desempenho por usuário
   - Dificuldade das perguntas
   - **Feedbacks dos usuários** ⭐
   - Respostas detalhadas

---

## 🎨 Características Visuais

- **Animações suaves** em todas as telas
- **Cores consistentes** com o tema do app
- **Ícones intuitivos** (Ionicons)
- **Responsividade** para diferentes tamanhos de tela
- **Feedback visual** para todas as ações
- **Gráficos e barras de progresso** para visualização de dados

---

## 🔒 Segurança e Privacidade

- Dados salvos no Firebase Firestore
- Apenas administradores têm acesso às estatísticas
- Nomes de usuários são opcionais (pode ser "Anônimo")
- Feedbacks são anônimos para outros usuários

---

## 📱 Navegação Atualizada

```
App.js
├── Welcome
├── Home
├── Instructions
├── Quiz → (salva respostas)
├── Result → (botão para Feedback)
├── Feedback → (nova tela) ⭐
├── Settings
├── Admin
│   ├── AdminEdit
│   ├── AdminSettings
│   └── Statistics → (nova tela com feedbacks) ⭐
└── AdminWeb
```

---

## 🚀 Como Usar

### Para Usuários:
1. Complete o quiz normalmente
2. Na tela de resultado, clique em "Deixar Feedback"
3. Avalie com estrelas (obrigatório)
4. Deixe um comentário (opcional)
5. Clique em "Enviar Feedback"

### Para Administradores:
1. Acesse a tela de Admin
2. Clique em "📊 Ver Estatísticas"
3. Navegue pelas abas:
   - **Geral**: Visão geral dos dados
   - **Usuários**: Desempenho individual
   - **Perguntas**: Análise de dificuldade
   - **Feedbacks**: Avaliações e comentários ⭐
   - **Detalhes**: Respostas individuais

---

## 📊 Métricas Disponíveis

### Estatísticas de Quiz:
- Taxa de acerto geral
- Desempenho por usuário
- Perguntas mais difíceis
- Total de participações

### Estatísticas de Feedback:
- Média de avaliação (1-5 estrelas)
- Distribuição de avaliações
- Total de feedbacks
- Comentários dos usuários
- Correlação entre pontuação e satisfação

---

## ✨ Melhorias Futuras Sugeridas

1. **Exportação de dados** (CSV, Excel)
2. **Filtros por data** nas estatísticas
3. **Gráficos mais avançados** (charts)
4. **Notificações** para novos feedbacks
5. **Resposta aos feedbacks** pelos administradores
6. **Dashboard analítico** mais completo
7. **Comparação temporal** (evolução ao longo do tempo)

---

## 🐛 Tratamento de Erros

- Todas as operações do Firebase têm try-catch
- Erros não bloqueiam o fluxo do usuário
- Mensagens de erro amigáveis
- Logs detalhados no console para debug
- Fallback para dados padrão quando necessário

---

## 📝 Notas Técnicas

- **AsyncStorage** usado para armazenar nome do usuário localmente
- **Firebase Firestore** para persistência de dados
- **React Navigation** para navegação entre telas
- **Animated API** para animações suaves
- **Responsive utils** para adaptação de tamanhos

---

## ✅ Checklist de Implementação

- [x] Registro automático de respostas
- [x] Tela de feedback com avaliação por estrelas
- [x] Campo de comentário opcional
- [x] Salvamento de feedback no Firebase
- [x] Tela de estatísticas completa
- [x] Aba de feedbacks na tela de estatísticas
- [x] Cálculo de média de avaliação
- [x] Distribuição visual de estrelas
- [x] Integração com fluxo do quiz
- [x] Navegação atualizada
- [x] Tratamento de erros
- [x] Animações e UX

---

**Implementado em:** 06/10/2025
**Status:** ✅ Completo e funcional
