import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  RefreshControl,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { getQuestions, deleteQuestion, getAppSettings } from '../services/questionsService';

const AdminScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [appSettings, setAppSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a pergunta ${question.id}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteQuestion(question.firebaseId);
              await loadData();
              Alert.alert('Sucesso', 'Pergunta excluída com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a pergunta: ' + error.message);
            }
          }
        }
      ]
    );
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
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AdminEdit', { mode: 'add' })}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
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
});

export default AdminScreen;