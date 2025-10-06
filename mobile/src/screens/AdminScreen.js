import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { getQuestions, deleteQuestion, getAppSettings } from '../services/questionsService';

const AdminScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [appSettings, setAppSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [questionsData, settingsData] = await Promise.all([
        getQuestions(),
        getAppSettings()
      ]);
      setQuestions(questionsData);
      setAppSettings(settingsData);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDeleteQuestion = (question) => {
    setQuestionToDelete(question);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!questionToDelete) return;
    
    try {
      setDeleteModalVisible(false);
      setLoading(true);
      await deleteQuestion(questionToDelete.firebaseId);
      await loadData();
      
      if (Platform.OS === 'web') {
        alert('Pergunta excluída com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Pergunta excluída com sucesso!');
      }
    } catch (error) {
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Administração</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={onRefresh}
          >
            <Ionicons name="refresh" size={22} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('AdminEdit', { mode: 'add' })}
          >
            <Ionicons name="add" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Configurações do App */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings-outline" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Configurações do App</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate('AdminSettings', { settings: appSettings })}
            >
              <Ionicons name="pencil" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>{appSettings.appTitle}</Text>
            <Text style={styles.settingsDescription}>{appSettings.appDescription}</Text>
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
                    onPress={() => navigation.navigate('AdminEdit', { 
                      mode: 'edit', 
                      question: question 
                    })}
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
              
              <Text style={styles.questionText} numberOfLines={3}>
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
    marginTop: 10,
    fontSize: 16,
    color: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    flex: 1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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

export default AdminScreen;