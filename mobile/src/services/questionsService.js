import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  orderBy,
  query 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Função de teste para verificar conectividade
export const testFirebaseConnection = async () => {
  try {
    console.log('Testando conexão com Firebase...');
    const testDoc = doc(db, 'test', 'connection');
    await setDoc(testDoc, { timestamp: new Date(), test: true });
    console.log('✅ Firebase conectado com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão com Firebase:', error);
    return false;
  }
};

const COLLECTION_NAME = 'questions';
const SETTINGS_DOC = 'app-settings';

// Buscar todas as perguntas
export const getQuestions = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('id', 'asc'));
    const querySnapshot = await getDocs(q);
    const questions = [];
    
    querySnapshot.forEach((doc) => {
      questions.push({
        firebaseId: doc.id,
        ...doc.data()
      });
    });
    
    return questions;
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error);
    throw error;
  }
};

// Buscar pergunta por ID
export const getQuestionById = async (firebaseId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, firebaseId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        firebaseId: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Pergunta não encontrada');
    }
  } catch (error) {
    console.error('Erro ao buscar pergunta:', error);
    throw error;
  }
};

// Adicionar nova pergunta
export const addQuestion = async (questionData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), questionData);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar pergunta:', error);
    throw error;
  }
};

// Atualizar pergunta
export const updateQuestion = async (firebaseId, questionData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, firebaseId);
    await updateDoc(docRef, questionData);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar pergunta:', error);
    throw error;
  }
};

// Deletar pergunta
export const deleteQuestion = async (firebaseId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, firebaseId));
    return true;
  } catch (error) {
    console.error('Erro ao deletar pergunta:', error);
    throw error;
  }
};

// Buscar configurações do app (descrição, etc.)
export const getAppSettings = async () => {
  try {
    console.log('Buscando configurações do Firebase...');
    const docRef = doc(db, 'settings', SETTINGS_DOC);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('Configurações encontradas no Firebase:', data);
      return data;
    } else {
      console.log('Documento de configurações não existe, retornando padrão');
      const defaultSettings = {
        appDescription: "Descubra os bastidores da saúde e estética bucal",
        appTitle: "Odontologia Estética",
        appLongDescription: "Este jogo foi criado para transmitir informações sobre os bastidores da odontologia estética — saúde e estética bucal — aspectos que nem sempre aparecem nas redes sociais, mas que são discutidos em consultas e baseados em conhecimentos técnicos. Com perguntas de verdadeiro ou falso, você aprenderá a diferenciar expectativas irreais de práticas seguras, adquirindo conhecimento que ajuda a cuidar do sorriso de forma consciente e saudável.",
        prizeMessage: "Procure nossa equipe para retirar seu presente especial por ter participado do quiz."
      };
      return defaultSettings;
    }
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    console.error('Detalhes do erro:', error.code, error.message);
    throw error;
  }
};

// Atualizar configurações do app
export const updateAppSettings = async (settings) => {
  try {
    console.log('Tentando salvar configurações no Firebase:', settings);
    const docRef = doc(db, 'settings', SETTINGS_DOC);
    console.log('Referência do documento:', docRef.path);
    
    // Usar setDoc com merge para preservar outros campos
    await setDoc(docRef, settings, { merge: true });
    console.log('Configurações salvas com sucesso no Firebase');
    
    // Verificar se realmente foi salvo
    const savedDoc = await getDoc(docRef);
    if (savedDoc.exists()) {
      console.log('Verificação: dados salvos no Firebase:', savedDoc.data());
    } else {
      console.error('Erro: documento não foi criado');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    console.error('Detalhes do erro:', error.code, error.message);
    throw error;
  }
};

// Inicializar dados padrão (executar uma vez)
export const initializeDefaultData = async () => {
  try {
    // Verificar se já existem perguntas
    const questions = await getQuestions();
    
    if (questions.length === 0) {
      // Dados padrão das perguntas
      const defaultQuestions = [
        {
          id: 1,
          pergunta: "Clareamento dental em excesso pode causar sensibilidade e até danos irreversíveis ao esmalte do dente.",
          resposta: true,
          explicacao: "O uso exagerado de agentes clareadores desgasta o esmalte e expõe a dentina, aumentando a sensibilidade.",
          icon: "warning-outline"
        },
        {
          id: 2,
          pergunta: "A busca por um sorriso padronizado e branco é sempre benéfica para a saúde bucal.",
          resposta: false,
          explicacao: "A padronização ignora características individuais e pode gerar resultados artificiais e pouco saudáveis.",
          icon: "happy-outline"
        },
        {
          id: 3,
          pergunta: "O tom de pele e a pigmentação influenciam na percepção da cor dos dentes e próteses.",
          resposta: true,
          explicacao: "O contraste entre dentes e pele muda a percepção estética do sorriso.",
          icon: "color-palette-outline"
        },
        {
          id: 4,
          pergunta: "Pacientes com doenças sistêmicas, como diabetes, podem ter resultados diferentes em tratamentos estéticos.",
          resposta: true,
          explicacao: "Condições sistêmicas afetam cicatrização, estabilidade e durabilidade dos resultados.",
          icon: "medical-outline"
        },
        {
          id: 5,
          pergunta: "A gengiva também influencia na estética do sorriso.",
          resposta: true,
          explicacao: "Alterações gengivais impactam diretamente na harmonia estética.",
          icon: "leaf-outline"
        },
        {
          id: 6,
          pergunta: "Alterar a forma dos dentes sem considerar a mastigação pode gerar problemas de Articulação?",
          resposta: true,
          explicacao: "Alterações inadequadas comprometem a articulação e a função mastigatória.",
          icon: "construct-outline"
        },
        {
          id: 7,
          pergunta: "A simetria perfeita é indispensável para um sorriso bonito.",
          resposta: false,
          explicacao: "Pequenas assimetrias tornam o sorriso mais natural e harmônico.",
          icon: "scale-outline"
        },
        {
          id: 8,
          pergunta: "Pacientes fumantes têm resultados estéticos menos previsíveis em clareamento e próteses.",
          resposta: true,
          explicacao: "O tabaco mancha dentes e próteses, além de prejudicar a gengiva.",
          icon: "ban-outline"
        },
        {
          id: 9,
          pergunta: "Procedimentos estéticos odontológicos podem impactar a fala.",
          resposta: true,
          explicacao: "Alterações mal planejadas podem afetar fonemas como 'f' e 'v'.",
          icon: "chatbubble-outline"
        },
        {
          id: 10,
          pergunta: "O desgaste excessivo de dentes saudáveis apenas para fins estéticos é considerado antiético e pode trazer prejuízos irreversíveis.",
          resposta: true,
          explicacao: "O desgaste desnecessário de dentes saudáveis é antiético, pois causa perda irreversível de estrutura dentária e possíveis danos à saúde bucal.",
          icon: "shield-checkmark-outline"
        }
      ];

      // Adicionar perguntas padrão
      for (const question of defaultQuestions) {
        await addQuestion(question);
      }

      console.log('Dados padrão inicializados com sucesso!');
    }

    // Verificar se já existem configurações antes de sobrescrever
    try {
      const docRef = doc(db, 'settings', SETTINGS_DOC);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        // Só inicializar configurações padrão se não existirem
        await updateAppSettings({
          appDescription: "Descubra os bastidores da saúde e estética bucal",
          appTitle: "Odontologia Estética",
          appLongDescription: "Este jogo foi criado para transmitir informações sobre os bastidores da odontologia estética — saúde e estética bucal — aspectos que nem sempre aparecem nas redes sociais, mas que são discutidos em consultas e baseados em conhecimentos técnicos. Com perguntas de verdadeiro ou falso, você aprenderá a diferenciar expectativas irreais de práticas seguras, adquirindo conhecimento que ajuda a cuidar do sorriso de forma consciente e saudável.",
          prizeMessage: "Procure nossa equipe para retirar seu presente especial por ter participado do quiz."
        });
        console.log('Configurações padrão inicializadas');
      } else {
        console.log('Configurações já existem, mantendo valores atuais');
      }
    } catch (error) {
      console.error('Erro ao verificar configurações:', error);
    }

    return true;
  } catch (error) {
    console.error('Erro ao inicializar dados padrão:', error);
    throw error;
  }
};