import React, { useState, useEffect } from 'react';
import { colors } from '../constants/colors';
import Icon from '../components/Icon';
import { getQuestions, deleteQuestion, getAppSettings, initializeDefaultData } from '../services/questionsService';

const AdminScreen = ({ onNavigate }) => {
  const [questions, setQuestions] = useState([]);
  const [appSettings, setAppSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'edit', 'settings'
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await initializeDefaultData(); // Inicializa dados se necessário
      const [questionsData, settingsData] = await Promise.all([
        getQuestions(),
        getAppSettings()
      ]);
      setQuestions(questionsData);
      setAppSettings(settingsData);
    } catch (error) {
      alert('Erro ao carregar dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = (question) => {
    if (window.confirm(`Tem certeza que deseja excluir a pergunta ${question.id}?`)) {
      deleteQuestion(question.firebaseId)
        .then(() => {
          loadData();
          alert('Pergunta excluída com sucesso!');
        })
        .catch(error => {
          alert('Erro ao excluir pergunta: ' + error.message);
        });
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setCurrentView('edit');
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setCurrentView('edit');
  };

  const handleEditSettings = () => {
    setCurrentView('settings');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setEditingQuestion(null);
    loadData(); // Recarrega dados quando volta para lista
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <div style={styles.loadingText}>Carregando...</div>
      </div>
    );
  }

  // Renderizar tela de edição
  if (currentView === 'edit') {
    return (
      <AdminEditScreen 
        question={editingQuestion}
        onBack={handleBackToList}
      />
    );
  }

  // Renderizar tela de configurações
  if (currentView === 'settings') {
    return (
      <AdminSettingsScreen 
        settings={appSettings}
        onBack={handleBackToList}
      />
    );
  }

  // Renderizar lista principal
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button 
          style={styles.backButton}
          onClick={() => onNavigate('home')}
        >
          <Icon name="arrow-back" size={20} color={colors.white} />
        </button>
        <div style={styles.headerTitle}>Painel de Administração</div>
        <button 
          style={styles.addButton}
          onClick={handleAddQuestion}
        >
          <Icon name="checkmark" size={20} color={colors.white} />
          <span style={styles.addButtonText}>Nova Pergunta</span>
        </button>
      </div>

      <div style={styles.content}>
        {/* Configurações do App */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Icon name="settings-outline" size={24} color={colors.primary} />
            <div style={styles.sectionTitle}>Configurações do App</div>
            <button 
              style={styles.editButton}
              onClick={handleEditSettings}
            >
              <Icon name="pencil" size={16} color={colors.primary} />
            </button>
          </div>
          
          <div style={styles.settingsCard}>
            <div style={styles.settingsTitle}>{appSettings.appTitle}</div>
            <div style={styles.settingsDescription}>{appSettings.appDescription}</div>
          </div>
        </div>

        {/* Lista de Perguntas */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Icon name="help-circle-outline" size={24} color={colors.primary} />
            <div style={styles.sectionTitle}>Perguntas ({questions.length})</div>
          </div>

          {questions.map((question) => (
            <div key={question.firebaseId} style={styles.questionCard}>
              <div style={styles.questionHeader}>
                <div style={styles.questionNumber}>
                  <div style={styles.questionNumberText}>{question.id}</div>
                </div>
                <div style={styles.questionActions}>
                  <button 
                    style={styles.actionButton}
                    onClick={() => handleEditQuestion(question)}
                  >
                    <Icon name="pencil" size={16} color={colors.primary} />
                  </button>
                  <button 
                    style={[styles.actionButton, styles.deleteButton]}
                    onClick={() => handleDeleteQuestion(question)}
                  >
                    <Icon name="close" size={16} color={colors.error} />
                  </button>
                </div>
              </div>
              
              <div style={styles.questionText}>
                {question.pergunta}
              </div>
              
              <div style={styles.questionFooter}>
                <div style={styles.answerBadge}>
                  <div style={styles.answerText}>
                    {question.resposta ? 'Verdadeiro' : 'Falso'}
                  </div>
                </div>
                <Icon name={question.icon} size={20} color={colors.gray} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente de edição (simplificado para o exemplo)
const AdminEditScreen = ({ question, onBack }) => {
  const [formData, setFormData] = useState({
    id: question?.id?.toString() || '',
    pergunta: question?.pergunta || '',
    resposta: question?.resposta || true,
    explicacao: question?.explicacao || '',
    icon: question?.icon || 'help-circle-outline'
  });

  const availableIcons = [
    'help-circle-outline', 'warning-outline', 'happy-outline', 'color-palette-outline',
    'medical-outline', 'leaf-outline', 'construct-outline', 'balance-outline',
    'ban-outline', 'chatbubble-outline', 'shield-checkmark-outline'
  ];

  const handleSave = async () => {
    if (!formData.pergunta.trim() || !formData.explicacao.trim() || !formData.id.trim()) {
      alert('Todos os campos são obrigatórios');
      return;
    }

    try {
      const { addQuestion, updateQuestion } = await import('../services/questionsService');
      
      const questionData = {
        id: parseInt(formData.id),
        pergunta: formData.pergunta.trim(),
        resposta: formData.resposta,
        explicacao: formData.explicacao.trim(),
        icon: formData.icon
      };

      if (question) {
        await updateQuestion(question.firebaseId, questionData);
        alert('Pergunta atualizada com sucesso!');
      } else {
        await addQuestion(questionData);
        alert('Pergunta adicionada com sucesso!');
      }

      onBack();
    } catch (error) {
      alert('Erro ao salvar pergunta: ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          <Icon name="arrow-back" size={20} color={colors.white} />
        </button>
        <div style={styles.headerTitle}>
          {question ? 'Editar Pergunta' : 'Nova Pergunta'}
        </div>
        <button style={styles.saveButton} onClick={handleSave}>
          <Icon name="checkmark" size={20} color={colors.white} />
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.field}>
          <label style={styles.label}>ID da Pergunta *</label>
          <input
            style={styles.input}
            type="number"
            value={formData.id}
            onChange={(e) => setFormData({...formData, id: e.target.value})}
            placeholder="Ex: 1, 2, 3..."
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Pergunta *</label>
          <textarea
            style={[styles.input, styles.textArea]}
            value={formData.pergunta}
            onChange={(e) => setFormData({...formData, pergunta: e.target.value})}
            placeholder="Digite a pergunta aqui..."
            rows={4}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Resposta Correta</label>
          <div style={styles.switchContainer}>
            <label style={styles.switchLabel}>
              <input
                type="radio"
                name="resposta"
                checked={!formData.resposta}
                onChange={() => setFormData({...formData, resposta: false})}
              />
              Falso
            </label>
            <label style={styles.switchLabel}>
              <input
                type="radio"
                name="resposta"
                checked={formData.resposta}
                onChange={() => setFormData({...formData, resposta: true})}
              />
              Verdadeiro
            </label>
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Explicação *</label>
          <textarea
            style={[styles.input, styles.textArea]}
            value={formData.explicacao}
            onChange={(e) => setFormData({...formData, explicacao: e.target.value})}
            placeholder="Digite a explicação da resposta..."
            rows={4}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Ícone</label>
          <div style={styles.iconGrid}>
            {availableIcons.map((iconName) => (
              <button
                key={iconName}
                style={[
                  styles.iconOption,
                  formData.icon === iconName && styles.iconOptionSelected
                ]}
                onClick={() => setFormData({...formData, icon: iconName})}
              >
                <Icon name={iconName} size={24} color={formData.icon === iconName ? colors.white : colors.primary} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de configurações (simplificado)
const AdminSettingsScreen = ({ settings, onBack }) => {
  const [formData, setFormData] = useState({
    appTitle: settings?.appTitle || 'Odontologia Estética',
    appDescription: settings?.appDescription || 'Descubra os bastidores da saúde e estética bucal'
  });

  const handleSave = async () => {
    if (!formData.appTitle.trim() || !formData.appDescription.trim()) {
      alert('Todos os campos são obrigatórios');
      return;
    }

    try {
      const { updateAppSettings } = await import('../services/questionsService');
      
      await updateAppSettings({
        appTitle: formData.appTitle.trim(),
        appDescription: formData.appDescription.trim()
      });
      
      alert('Configurações atualizadas com sucesso!');
      onBack();
    } catch (error) {
      alert('Erro ao salvar configurações: ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          <Icon name="arrow-back" size={20} color={colors.white} />
        </button>
        <div style={styles.headerTitle}>Configurações do App</div>
        <button style={styles.saveButton} onClick={handleSave}>
          <Icon name="checkmark" size={20} color={colors.white} />
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.field}>
          <label style={styles.label}>Título do App *</label>
          <input
            style={styles.input}
            value={formData.appTitle}
            onChange={(e) => setFormData({...formData, appTitle: e.target.value})}
            placeholder="Ex: Odontologia Estética"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Descrição do App *</label>
          <textarea
            style={[styles.input, styles.textArea]}
            value={formData.appDescription}
            onChange={(e) => setFormData({...formData, appDescription: e.target.value})}
            placeholder="Ex: Descubra os bastidores da saúde e estética bucal"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.secondary,
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: `4px solid ${colors.secondary}`,
    borderTop: `4px solid ${colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '16px',
    fontSize: '16px',
    color: colors.primary,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    backgroundColor: colors.primary,
  },
  backButton: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    cursor: 'pointer',
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: colors.white,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colors.success,
    padding: '8px 16px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
  },
  addButtonText: {
    color: colors.white,
    marginLeft: '8px',
    fontSize: '14px',
    fontWeight: '500',
  },
  saveButton: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    backgroundColor: colors.success,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    cursor: 'pointer',
  },
  content: {
    padding: '20px',
  },
  section: {
    marginBottom: '30px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: '10px',
    flex: 1,
  },
  editButton: {
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    backgroundColor: colors.secondary,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    cursor: 'pointer',
  },
  settingsCard: {
    backgroundColor: colors.white,
    padding: '20px',
    borderRadius: '15px',
  },
  settingsTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: '8px',
  },
  settingsDescription: {
    fontSize: '14px',
    color: colors.gray,
    lineHeight: '20px',
  },
  questionCard: {
    backgroundColor: colors.white,
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '12px',
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  questionNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    backgroundColor: colors.primary,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionNumberText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: '14px',
  },
  questionActions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    backgroundColor: colors.secondary,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  questionText: {
    fontSize: '14px',
    color: colors.primary,
    lineHeight: '20px',
    marginBottom: '12px',
  },
  questionFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answerBadge: {
    backgroundColor: colors.secondary,
    padding: '4px 12px',
    borderRadius: '12px',
  },
  answerText: {
    fontSize: '12px',
    color: colors.primary,
    fontWeight: '500',
  },
  field: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '16px',
    fontWeight: '600',
    color: colors.primary,
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: '12px',
    padding: '16px',
    fontSize: '16px',
    color: colors.primary,
    border: `1px solid ${colors.secondary}`,
    boxSizing: 'border-box',
  },
  textArea: {
    minHeight: '100px',
    resize: 'vertical',
  },
  switchContainer: {
    display: 'flex',
    gap: '20px',
    backgroundColor: colors.white,
    borderRadius: '12px',
    padding: '16px',
  },
  switchLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px',
    color: colors.primary,
    cursor: 'pointer',
  },
  iconGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },
  iconOption: {
    width: '48px',
    height: '48px',
    borderRadius: '24px',
    backgroundColor: colors.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: `2px solid ${colors.secondary}`,
    cursor: 'pointer',
  },
  iconOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
};

export default AdminScreen;