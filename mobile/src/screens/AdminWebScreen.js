import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, Alert, ScrollView, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { normalize, moderateScale } from '../utils/responsive';
import { 
  getQuestions, 
  addQuestion, 
  updateQuestion, 
  deleteQuestion,
  getAppSettings,
  updateAppSettings,
  initializeDefaultData
} from '../services/questionsService';

const AdminWebScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [appSettings, setAppSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'edit', 'settings'
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Só inicializar dados padrão na primeira vez
      await initializeDefaultData();
      
      // Carregar dados atuais do Firebase
      const [questionsData, settingsData] = await Promise.all([
        getQuestions(),
        getAppSettings()
      ]);
      
      console.log('Dados carregados - Configurações:', settingsData);
      setQuestions(questionsData);
      setAppSettings(settingsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = (question) => {
    console.log('🗑️ Abrindo modal de exclusão para pergunta:', question.id);
    setQuestionToDelete(question);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!questionToDelete) return;
    
    try {
      setDeleteModalVisible(false);
      setLoading(true);
      console.log('Excluindo pergunta:', questionToDelete.firebaseId);
      await deleteQuestion(questionToDelete.firebaseId);
      await loadData();
      
      if (Platform.OS === 'web') {
        alert('Pergunta excluída com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Pergunta excluída com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      if (Platform.OS === 'web') {
        alert('Erro ao excluir: ' + error.message);
      } else {
        Alert.alert('Erro', 'Não foi possível excluir a pergunta: ' + error.message);
      }
    } finally {
      setQuestionToDelete(null);
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setQuestionToDelete(null);
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
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  // Renderizar tela de edição
  if (currentView === 'edit') {
    return (
      <AdminEditWebScreen 
        question={editingQuestion}
        onBack={handleBackToList}
      />
    );
  }

  // Renderizar tela de configurações
  if (currentView === 'settings') {
    return (
      <AdminSettingsWebScreen 
        settings={appSettings}
        onBack={handleBackToList}
      />
    );
  }

  // Renderizar lista principal
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Painel de Administração</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={loadData}
          >
            <Ionicons name="refresh" size={22} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddQuestion}
          >
            <Ionicons name="add" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Configurações do App */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings-outline" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Configurações do App</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditSettings}
            >
              <Ionicons name="pencil" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>{appSettings.appTitle}</Text>
            <Text style={styles.settingsDescription}>{appSettings.appDescription}</Text>
            {appSettings.appLongDescription && (
              <Text style={styles.settingsLongDescription} numberOfLines={3}>
                {appSettings.appLongDescription}
              </Text>
            )}
          </View>
        </View>

        {/* Lista de Perguntas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="help-circle-outline" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Perguntas ({questions.length})</Text>
          </View>

          {questions.map((question) => (
            <View key={question.firebaseId} style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <View style={styles.questionNumber}>
                  <Text style={styles.questionNumberText}>{question.id}</Text>
                </View>
                <View style={styles.questionActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleEditQuestion(question)}
                  >
                    <Ionicons name="pencil" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteQuestion(question)}
                  >
                    <Ionicons name="trash" size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <Text style={styles.questionText} numberOfLines={Platform.OS === 'web' ? undefined : 3}>
                {question.pergunta}
              </Text>
              
              <View style={styles.questionFooter}>
                <View style={styles.answerBadge}>
                  <Text style={styles.answerText}>
                    {question.resposta ? 'Verdadeiro' : 'Falso'}
                  </Text>
                </View>
                <Ionicons name={question.icon} size={20} color={colors.gray} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Ionicons name="warning" size={48} color={colors.error} />
            </View>
            
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            
            <Text style={styles.modalMessage}>
              Tem certeza que deseja excluir a pergunta {questionToDelete?.id}?
            </Text>
            
            {questionToDelete && (
              <View style={styles.modalQuestionPreview}>
                <Text style={styles.modalQuestionText} numberOfLines={2}>
                  "{questionToDelete.pergunta}"
                </Text>
              </View>
            )}
            
            <Text style={styles.modalWarning}>
              Esta ação não pode ser desfeita!
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelDelete}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmDelete}
              >
                <Ionicons name="trash" size={18} color={colors.white} />
                <Text style={styles.confirmButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Componente de edição
const AdminEditWebScreen = ({ question, onBack }) => {
  const [formData, setFormData] = useState({
    id: question?.id?.toString() || '',
    pergunta: question?.pergunta || '',
    resposta: question?.resposta || true,
    explicacao: question?.explicacao || '',
    icon: question?.icon || 'help-circle-outline'
  });

  const [saving, setSaving] = useState(false);

  const availableIcons = [
    'help-circle-outline', 'warning-outline', 'happy-outline', 'color-palette-outline',
    'medical-outline', 'leaf-outline', 'construct-outline', 'scale-outline',
    'ban-outline', 'chatbubble-outline', 'shield-checkmark-outline', 'information-circle-outline'
  ];

  const handleSave = async () => {
    if (!formData.pergunta.trim() || !formData.explicacao.trim() || !formData.id.trim()) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    try {
      setSaving(true);

      const questionData = {
        id: parseInt(formData.id),
        pergunta: formData.pergunta.trim(),
        resposta: formData.resposta,
        explicacao: formData.explicacao.trim(),
        icon: formData.icon
      };

      if (question) {
        await updateQuestion(question.firebaseId, questionData);
        Alert.alert('Sucesso', 'Pergunta atualizada com sucesso!');
      } else {
        await addQuestion(questionData);
        Alert.alert('Sucesso', 'Pergunta adicionada com sucesso!');
      }

      onBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a pergunta: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {question ? 'Editar Pergunta' : 'Nova Pergunta'}
        </Text>
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Ionicons name="checkmark" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>ID da Pergunta *</Text>
          <TextInput
            style={styles.input}
            value={formData.id}
            onChangeText={(text) => setFormData({...formData, id: text})}
            placeholder="Ex: 1, 2, 3..."
            keyboardType="numeric"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Pergunta *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.pergunta}
            onChangeText={(text) => setFormData({...formData, pergunta: text})}
            placeholder="Digite a pergunta aqui..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Resposta Correta</Text>
          <View style={styles.switchContainer}>
            <TouchableOpacity
              style={[styles.switchOption, !formData.resposta && styles.switchOptionActive]}
              onPress={() => setFormData({...formData, resposta: false})}
            >
              <Text style={[styles.switchText, !formData.resposta && styles.switchTextActive]}>
                Falso
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.switchOption, formData.resposta && styles.switchOptionActive]}
              onPress={() => setFormData({...formData, resposta: true})}
            >
              <Text style={[styles.switchText, formData.resposta && styles.switchTextActive]}>
                Verdadeiro
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Explicação *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.explicacao}
            onChangeText={(text) => setFormData({...formData, explicacao: text})}
            placeholder="Digite a explicação da resposta..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Ícone</Text>
          <View style={styles.iconGrid}>
            {availableIcons.map((iconName) => (
              <TouchableOpacity
                key={iconName}
                style={[
                  styles.iconOption,
                  formData.icon === iconName && styles.iconOptionSelected
                ]}
                onPress={() => setFormData({...formData, icon: iconName})}
              >
                <Ionicons 
                  name={iconName} 
                  size={24} 
                  color={formData.icon === iconName ? colors.white : colors.primary} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Componente de configurações
const AdminSettingsWebScreen = ({ settings, onBack }) => {
  const [formData, setFormData] = useState({
    appTitle: '',
    appDescription: '',
    appLongDescription: '',
    prizeMessage: ''
  });

  // Carregar dados atuais do Firebase quando o componente monta
  useEffect(() => {
    if (settings) {
      setFormData({
        appTitle: settings.appTitle || '',
        appDescription: settings.appDescription || '',
        appLongDescription: settings.appLongDescription || '',
        prizeMessage: settings.prizeMessage || ''
      });
    }
  }, [settings]);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.appTitle.trim() || !formData.appDescription.trim() || !formData.appLongDescription.trim() || !formData.prizeMessage.trim()) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    try {
      setSaving(true);

      const settingsData = {
        appTitle: formData.appTitle.trim(),
        appDescription: formData.appDescription.trim(),
        appLongDescription: formData.appLongDescription.trim(),
        prizeMessage: formData.prizeMessage.trim()
      };

      console.log('Salvando configurações:', settingsData);
      await updateAppSettings(settingsData);
      
      // Verificar se foi salvo corretamente
      const savedSettings = await getAppSettings();
      console.log('Configurações após salvar:', savedSettings);
      
      Alert.alert('Sucesso', 'Configurações atualizadas com sucesso!');
      onBack();
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      Alert.alert('Erro', 'Não foi possível salvar as configurações: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações do App</Text>
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Ionicons name="checkmark" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>Título do App *</Text>
          <TextInput
            style={styles.input}
            value={formData.appTitle}
            onChangeText={(text) => setFormData({...formData, appTitle: text})}
            placeholder="Ex: Odontologia Estética"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descrição do App *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.appDescription}
            onChangeText={(text) => setFormData({...formData, appDescription: text})}
            placeholder="Ex: Descubra os bastidores da saúde e estética bucal"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descrição Longa do App *</Text>
          <TextInput
            style={[styles.input, styles.textAreaLarge]}
            value={formData.appLongDescription}
            onChangeText={(text) => setFormData({...formData, appLongDescription: text})}
            placeholder="Descrição detalhada sobre o propósito do app..."
            multiline
            numberOfLines={6}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Mensagem do Brinde *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.prizeMessage}
            onChangeText={(text) => setFormData({...formData, prizeMessage: text})}
            placeholder="Ex: Procure nossa equipe para retirar seu presente especial..."
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 60,
    paddingBottom: 20,
    backgroundColor: colors.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.gray,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 10,
    flex: 1,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 15,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  settingsDescription: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  settingsLongDescription: {
    fontSize: 12,
    color: colors.gray,
    lineHeight: 18,
    marginTop: 8,
    fontStyle: 'italic',
  },
  questionCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionNumberText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  questionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  questionText: {
    fontSize: 14,
    color: colors.primary,
    lineHeight: 20,
    marginBottom: 12,
  },
  questionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answerBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  answerText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  textArea: {
    height: Platform.OS === 'web' ? 100 : 80,
    textAlignVertical: 'top',
  },
  textAreaLarge: {
    height: Platform.OS === 'web' ? 150 : 120,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  switchOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  switchOptionActive: {
    backgroundColor: colors.primary,
  },
  switchText: {
    fontSize: 16,
    color: colors.primary,
  },
  switchTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  iconOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  modalQuestionPreview: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
  },
  modalQuestionText: {
    fontSize: 14,
    color: colors.primary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  modalWarning: {
    fontSize: 13,
    color: colors.error,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  cancelButton: {
    backgroundColor: colors.secondary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  confirmButton: {
    backgroundColor: colors.error,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

export default AdminWebScreen;