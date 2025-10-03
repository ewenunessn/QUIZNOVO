import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase (substitua pelos seus dados)
const firebaseConfig = {
  apiKey: "AIzaSyBvOiHselO2cZllRjFHPBn0Ta-siHiPVts",
  authDomain: "quiz-odonto-estetica.firebaseapp.com",
  projectId: "quiz-odonto-estetica",
  storageBucket: "quiz-odonto-estetica.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

export default app;