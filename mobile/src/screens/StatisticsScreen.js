import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { getStatistics, getFeedbackStatistics, deleteAllUserData } from '../services/questionsService';
import { normalize, moderateScale } from '../utils/responsive';

const StatisticsScreen = ({ navigation }) => {
  const [statistics, setStatistics] = useState(null);
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // general, users, questions, details, feedbacks
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const [stats, feedbacks] = await Promise.all([
        getStatistics(),
        getFeedbackStatistics()
      ]);
      setStatistics(stats);
      setFeedbackStats(feedbacks);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as estatísticas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStatistics();
    setRefreshing(false);
  };

  const handleDeleteUser = (userName) => {
    setUserToDelete(userName);
    setDeleteModalVisible(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setDeleteModalVisible(false);
      setLoading(true);
      
      const result = await deleteAllUserData(userToDelete);
      
      await loadStatistics();
      
      if (Platform.OS === 'web') {
        alert(`Sucesso!\n${result.totalDeleted} registros de ${userToDelete} foram deletados.`);
      } else {
        Alert.alert(
          'Sucesso',
          `${result.totalDeleted} registros de ${userToDelete} foram deletados.`
        );
      }
    } catch (error) {
      if (Platform.OS === 'web') {
        alert('Erro ao deletar: ' + error.message);
      } else {
        Alert.alert('Erro', 'Não foi possível deletar os dados: ' + error.message);
      }
    } finally {
      setUserToDelete(null);
      setLoading(false);
    }
  };

  const cancelDeleteUser = () => {
    setDeleteModalVisible(false);
    setUserToDelete(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando estatísticas...</Text>
      </View>
    );
  }

  if (!statistics) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="stats-chart-outline" size={64} color={colors.gray} />
        <Text style={styles.emptyText}>Nenhuma estatística disponível</Text>
      </View>
    );
  }

  const renderGeneralStats = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📊 Estatísticas Gerais</Text>
      
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.primaryCard]}>
          <Ionicons name="people" size={32} color={colors.primary} />
          <Text style={styles.statValue}>{statistics.general.totalUsers}</Text>
          <Text style={styles.statLabel}>Usuários</Text>
        </View>

        <View style={[styles.statCard, styles.secondaryCard]}>
          <Ionicons name="help-circle" size={32} color={colors.secondary} />
          <Text style={styles.statValue}>{statistics.general.totalAnswers}</Text>
          <Text style={styles.statLabel}>Respostas</Text>
        </View>

        <View style={[styles.statCard, styles.successCard]}>
          <Ionicons name="checkmark-circle" size={32} color={colors.success} />
          <Text style={styles.statValue}>{statistics.general.correctAnswers}</Text>
          <Text style={styles.statLabel}>Acertos</Text>
        </View>

        <View style={[styles.statCard, styles.errorCard]}>
          <Ionicons name="close-circle" size={32} color={colors.error} />
          <Text style={styles.statValue}>{statistics.general.incorrectAnswers}</Text>
          <Text style={styles.statLabel}>Erros</Text>
        </View>
      </View>

      <View style={styles.accuracyCard}>
        <Text style={styles.accuracyLabel}>Taxa de Acerto Geral</Text>
        <Text style={styles.accuracyValue}>{statistics.general.accuracyRate}%</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${statistics.general.accuracyRate}%` }
            ]} 
          />
        </View>
      </View>
    </View>
  );

  const renderUserStats = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>👥 Estatísticas por Usuário</Text>
      
      {statistics.byUser.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="person-outline" size={48} color={colors.gray} />
          <Text style={styles.emptyCardText}>Nenhum usuário registrado</Text>
        </View>
      ) : (
        statistics.byUser.map((user, index) => (
          <View key={index} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <Ionicons name="person-circle" size={24} color={colors.primary} />
                <Text style={styles.userName}>{user.userName}</Text>
              </View>
              <View style={styles.userHeaderActions}>
                <View style={styles.userBadge}>
                  <Text style={styles.userBadgeText}>{user.accuracyRate}%</Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteUserButton}
                  onPress={() => handleDeleteUser(user.userName)}
                >
                  <Ionicons name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.userStats}>
              <View style={styles.userStat}>
                <Text style={styles.userStatValue}>{user.totalAnswers}</Text>
                <Text style={styles.userStatLabel}>Respostas</Text>
              </View>
              <View style={styles.userStat}>
                <Text style={[styles.userStatValue, { color: colors.success }]}>
                  {user.correctAnswers}
                </Text>
                <Text style={styles.userStatLabel}>Acertos</Text>
              </View>
              <View style={styles.userStat}>
                <Text style={[styles.userStatValue, { color: colors.error }]}>
                  {user.incorrectAnswers}
                </Text>
                <Text style={styles.userStatLabel}>Erros</Text>
              </View>
            </View>

            <View style={styles.userProgressBar}>
              <View 
                style={[
                  styles.userProgressFill, 
                  { width: `${user.accuracyRate}%` }
                ]} 
              />
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderQuestionStats = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>❓ Estatísticas por Pergunta</Text>
      
      {statistics.byQuestion.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="help-circle-outline" size={48} color={colors.gray} />
          <Text style={styles.emptyCardText}>Nenhuma pergunta respondida</Text>
        </View>
      ) : (
        statistics.byQuestion.map((question, index) => (
          <View key={index} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.questionNumber}>
                <Text style={styles.questionNumberText}>{question.questionId}</Text>
              </View>
              <View style={styles.questionBadge}>
                <Text style={styles.questionBadgeText}>{question.accuracyRate}%</Text>
              </View>
            </View>
            
            <Text style={styles.questionText} numberOfLines={2}>
              {question.questionText}
            </Text>
            
            <View style={styles.questionStats}>
              <View style={styles.questionStat}>
                <Ionicons name="people" size={16} color={colors.gray} />
                <Text style={styles.questionStatText}>{question.totalAnswers} respostas</Text>
              </View>
              <View style={styles.questionStat}>
                <Ionicons name="checkmark" size={16} color={colors.success} />
                <Text style={styles.questionStatText}>{question.correctAnswers} acertos</Text>
              </View>
              <View style={styles.questionStat}>
                <Ionicons name="close" size={16} color={colors.error} />
                <Text style={styles.questionStatText}>{question.incorrectAnswers} erros</Text>
              </View>
            </View>

            <View style={styles.questionProgressBar}>
              <View 
                style={[
                  styles.questionProgressFill, 
                  { width: `${question.accuracyRate}%` }
                ]} 
              />
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderFeedbacks = () => {
    if (!feedbackStats) {
      return (
        <View style={styles.emptyCard}>
          <Ionicons name="chatbox-ellipses-outline" size={48} color={colors.gray} />
          <Text style={styles.emptyCardText}>Nenhum feedback disponível</Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💬 Feedbacks dos Usuários</Text>
        
        {/* Estatísticas de Feedback */}
        <View style={styles.feedbackStatsCard}>
          <View style={styles.feedbackStatRow}>
            <View style={styles.feedbackStatItem}>
              <Text style={styles.feedbackStatValue}>{feedbackStats.totalFeedbacks}</Text>
              <Text style={styles.feedbackStatLabel}>Total de Feedbacks</Text>
            </View>
            <View style={styles.feedbackStatItem}>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.feedbackStatValue}>{feedbackStats.averageRating}</Text>
              </View>
              <Text style={styles.feedbackStatLabel}>Média de Avaliação</Text>
            </View>
          </View>

          {/* Distribuição de Estrelas */}
          <View style={styles.ratingDistribution}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = feedbackStats.ratingDistribution[star];
              const percentage = feedbackStats.totalFeedbacks > 0 
                ? (count / feedbackStats.totalFeedbacks) * 100 
                : 0;
              
              return (
                <View key={star} style={styles.ratingRow}>
                  <View style={styles.ratingStars}>
                    <Text style={styles.ratingNumber}>{star}</Text>
                    <Ionicons name="star" size={14} color="#FFD700" />
                  </View>
                  <View style={styles.ratingBarContainer}>
                    <View 
                      style={[
                        styles.ratingBar, 
                        { width: `${percentage}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.ratingCount}>{count}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Lista de Feedbacks */}
        {feedbackStats.feedbacks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="chatbox-outline" size={48} color={colors.gray} />
            <Text style={styles.emptyCardText}>Nenhum feedback registrado</Text>
          </View>
        ) : (
          feedbackStats.feedbacks.map((feedback, index) => (
            <View key={index} style={styles.feedbackCard}>
              <View style={styles.feedbackHeader}>
                <View style={styles.feedbackUser}>
                  <Ionicons name="person-circle" size={20} color={colors.primary} />
                  <Text style={styles.feedbackUserName}>{feedback.userName}</Text>
                </View>
                <View style={styles.feedbackRating}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < feedback.rating ? 'star' : 'star-outline'}
                      size={16}
                      color="#FFD700"
                    />
                  ))}
                </View>
              </View>

              {feedback.comment && (
                <Text style={styles.feedbackComment}>"{feedback.comment}"</Text>
              )}

              <View style={styles.feedbackFooter}>
                <Text style={styles.feedbackScore}>
                  Pontuação: {feedback.score}/{feedback.totalQuestions} ({feedback.percentage}%)
                </Text>
                <Text style={styles.feedbackTime}>
                  {new Date(feedback.timestamp).toLocaleString('pt-BR')}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    );
  };

  const renderDetailedAnswers = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📝 Respostas Detalhadas</Text>
      
      {statistics.allAnswers.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="document-text-outline" size={48} color={colors.gray} />
          <Text style={styles.emptyCardText}>Nenhuma resposta registrada</Text>
        </View>
      ) : (
        statistics.allAnswers.slice(0, 50).map((answer, index) => (
          <View key={index} style={styles.answerCard}>
            <View style={styles.answerHeader}>
              <View style={styles.answerUser}>
                <Ionicons name="person" size={16} color={colors.primary} />
                <Text style={styles.answerUserName}>{answer.userName}</Text>
              </View>
              <View style={[
                styles.answerBadge, 
                { backgroundColor: answer.isCorrect ? colors.success : colors.error }
              ]}>
                <Ionicons 
                  name={answer.isCorrect ? "checkmark" : "close"} 
                  size={14} 
                  color={colors.white} 
                />
                <Text style={styles.answerBadgeText}>
                  {answer.isCorrect ? 'Acerto' : 'Erro'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.answerQuestion} numberOfLines={2}>
              Q{answer.questionId}: {answer.questionText}
            </Text>
            
            <View style={styles.answerDetails}>
              <Text style={styles.answerDetailText}>
                Resposta: {answer.userAnswer ? 'Verdadeiro' : 'Falso'}
              </Text>
              <Text style={styles.answerDetailText}>
                Correto: {answer.correctAnswer ? 'Verdadeiro' : 'Falso'}
              </Text>
            </View>
            
            <Text style={styles.answerTime}>
              {new Date(answer.timestamp).toLocaleString('pt-BR')}
            </Text>
          </View>
        ))
      )}
      
      {statistics.allAnswers.length > 50 && (
        <Text style={styles.moreText}>
          Mostrando 50 de {statistics.allAnswers.length} respostas
        </Text>
      )}
    </View>
  );

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
        <Text style={styles.headerTitle}>Estatísticas</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <Ionicons name="refresh" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'general' && styles.activeTab]}
          onPress={() => setActiveTab('general')}
        >
          <Ionicons 
            name="stats-chart" 
            size={20} 
            color={activeTab === 'general' ? colors.primary : colors.gray} 
          />
          <Text style={[styles.tabText, activeTab === 'general' && styles.activeTabText]}>
            Geral
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Ionicons 
            name="people" 
            size={20} 
            color={activeTab === 'users' ? colors.primary : colors.gray} 
          />
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            Usuários
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'questions' && styles.activeTab]}
          onPress={() => setActiveTab('questions')}
        >
          <Ionicons 
            name="help-circle" 
            size={20} 
            color={activeTab === 'questions' ? colors.primary : colors.gray} 
          />
          <Text style={[styles.tabText, activeTab === 'questions' && styles.activeTabText]}>
            Perguntas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'feedbacks' && styles.activeTab]}
          onPress={() => setActiveTab('feedbacks')}
        >
          <Ionicons 
            name="chatbox-ellipses" 
            size={20} 
            color={activeTab === 'feedbacks' ? colors.primary : colors.gray} 
          />
          <Text style={[styles.tabText, activeTab === 'feedbacks' && styles.activeTabText]}>
            Feedbacks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'details' && styles.activeTab]}
          onPress={() => setActiveTab('details')}
        >
          <Ionicons 
            name="list" 
            size={20} 
            color={activeTab === 'details' ? colors.primary : colors.gray} 
          />
          <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
            Detalhes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'general' && renderGeneralStats()}
        {activeTab === 'users' && renderUserStats()}
        {activeTab === 'questions' && renderQuestionStats()}
        {activeTab === 'feedbacks' && renderFeedbacks()}
        {activeTab === 'details' && renderDetailedAnswers()}
      </ScrollView>

      {/* Modal de Confirmação de Exclusão de Usuário */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={cancelDeleteUser}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Ionicons name="warning" size={48} color={colors.error} />
            </View>
            
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            
            <Text style={styles.modalMessage}>
              Tem certeza que deseja excluir TODOS os dados de:
            </Text>
            
            {userToDelete && (
              <View style={styles.modalUserPreview}>
                <Ionicons name="person-circle" size={32} color={colors.primary} />
                <Text style={styles.modalUserName}>{userToDelete}</Text>
              </View>
            )}
            
            <Text style={styles.modalWarning}>
              ⚠️ Isso irá deletar:
            </Text>
            <Text style={styles.modalWarningList}>
              • Todas as respostas do quiz{'\n'}
              • Todos os feedbacks{'\n'}
              • Estatísticas relacionadas
            </Text>
            
            <Text style={styles.modalWarningFinal}>
              Esta ação não pode ser desfeita!
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelDeleteUser}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmDeleteButton]}
                onPress={confirmDeleteUser}
              >
                <Ionicons name="trash" size={18} color={colors.white} />
                <Text style={styles.confirmDeleteButtonText}>Excluir Tudo</Text>
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
    marginTop: moderateScale(16),
    fontSize: normalize(16),
    color: colors.primary,
  },
  emptyText: {
    marginTop: moderateScale(16),
    fontSize: normalize(16),
    color: colors.gray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(60),
    paddingBottom: moderateScale(20),
    backgroundColor: colors.primary,
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: colors.white,
    flex: 1,
    marginLeft: moderateScale(16),
  },
  refreshButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(8),
    borderRadius: moderateScale(8),
    gap: moderateScale(4),
  },
  activeTab: {
    backgroundColor: colors.secondary,
  },
  tabText: {
    fontSize: normalize(12),
    color: colors.gray,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: moderateScale(20),
  },
  section: {
    marginBottom: moderateScale(20),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: moderateScale(16),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(12),
    marginBottom: moderateScale(16),
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  primaryCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  secondaryCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  successCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  errorCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  statValue: {
    fontSize: normalize(28),
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: moderateScale(8),
  },
  statLabel: {
    fontSize: normalize(12),
    color: colors.gray,
    marginTop: moderateScale(4),
  },
  accuracyCard: {
    backgroundColor: colors.white,
    padding: moderateScale(20),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  accuracyLabel: {
    fontSize: normalize(14),
    color: colors.gray,
    marginBottom: moderateScale(8),
  },
  accuracyValue: {
    fontSize: normalize(36),
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: moderateScale(12),
  },
  progressBar: {
    width: '100%',
    height: moderateScale(12),
    backgroundColor: colors.secondary,
    borderRadius: moderateScale(6),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: moderateScale(6),
  },
  userCard: {
    backgroundColor: colors.white,
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(12),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    flex: 1,
  },
  userName: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: colors.primary,
  },
  userBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
  },
  userBadgeText: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: colors.white,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: moderateScale(12),
  },
  userStat: {
    alignItems: 'center',
  },
  userStatValue: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: colors.primary,
  },
  userStatLabel: {
    fontSize: normalize(11),
    color: colors.gray,
    marginTop: moderateScale(2),
  },
  userProgressBar: {
    width: '100%',
    height: moderateScale(6),
    backgroundColor: colors.secondary,
    borderRadius: moderateScale(3),
    overflow: 'hidden',
  },
  userProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: moderateScale(3),
  },
  questionCard: {
    backgroundColor: colors.white,
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(12),
  },
  questionNumber: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionNumberText: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: colors.white,
  },
  questionBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
  },
  questionBadgeText: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: colors.primary,
  },
  questionText: {
    fontSize: normalize(14),
    color: colors.primary,
    lineHeight: normalize(20),
    marginBottom: moderateScale(12),
  },
  questionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(12),
  },
  questionStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  questionStatText: {
    fontSize: normalize(11),
    color: colors.gray,
  },
  questionProgressBar: {
    width: '100%',
    height: moderateScale(6),
    backgroundColor: colors.secondary,
    borderRadius: moderateScale(3),
    overflow: 'hidden',
  },
  questionProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: moderateScale(3),
  },
  answerCard: {
    backgroundColor: colors.white,
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  answerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(8),
  },
  answerUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
  },
  answerUserName: {
    fontSize: normalize(13),
    fontWeight: '600',
    color: colors.primary,
  },
  answerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(10),
  },
  answerBadgeText: {
    fontSize: normalize(11),
    fontWeight: 'bold',
    color: colors.white,
  },
  answerQuestion: {
    fontSize: normalize(12),
    color: colors.primary,
    lineHeight: normalize(18),
    marginBottom: moderateScale(8),
  },
  answerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(6),
  },
  answerDetailText: {
    fontSize: normalize(11),
    color: colors.gray,
  },
  answerTime: {
    fontSize: normalize(10),
    color: colors.gray,
    fontStyle: 'italic',
  },
  emptyCard: {
    backgroundColor: colors.white,
    padding: moderateScale(40),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  emptyCardText: {
    fontSize: normalize(14),
    color: colors.gray,
    marginTop: moderateScale(12),
  },
  moreText: {
    fontSize: normalize(12),
    color: colors.gray,
    textAlign: 'center',
    marginTop: moderateScale(12),
    fontStyle: 'italic',
  },
  feedbackStatsCard: {
    backgroundColor: colors.white,
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(16),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  feedbackStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: moderateScale(20),
  },
  feedbackStatItem: {
    alignItems: 'center',
  },
  feedbackStatValue: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: colors.primary,
  },
  feedbackStatLabel: {
    fontSize: normalize(11),
    color: colors.gray,
    marginTop: moderateScale(4),
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  ratingDistribution: {
    gap: moderateScale(8),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(2),
    width: moderateScale(40),
  },
  ratingNumber: {
    fontSize: normalize(12),
    fontWeight: '600',
    color: colors.primary,
  },
  ratingBarContainer: {
    flex: 1,
    height: moderateScale(8),
    backgroundColor: colors.secondary,
    borderRadius: moderateScale(4),
    overflow: 'hidden',
  },
  ratingBar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: moderateScale(4),
  },
  ratingCount: {
    fontSize: normalize(12),
    fontWeight: '600',
    color: colors.gray,
    width: moderateScale(30),
    textAlign: 'right',
  },
  feedbackCard: {
    backgroundColor: colors.white,
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(12),
  },
  feedbackUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  feedbackUserName: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: colors.primary,
  },
  feedbackRating: {
    flexDirection: 'row',
    gap: moderateScale(2),
  },
  feedbackComment: {
    fontSize: normalize(14),
    color: colors.primary,
    lineHeight: normalize(20),
    fontStyle: 'italic',
    marginBottom: moderateScale(12),
    paddingLeft: moderateScale(12),
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
  },
  feedbackFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: moderateScale(12),
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
  },
  feedbackScore: {
    fontSize: normalize(12),
    color: colors.gray,
    fontWeight: '600',
  },
  feedbackTime: {
    fontSize: normalize(10),
    color: colors.gray,
    fontStyle: 'italic',
  },
  userHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  deleteUserButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    padding: moderateScale(24),
    width: '100%',
    maxWidth: moderateScale(400),
    alignItems: 'center',
  },
  modalIcon: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },
  modalTitle: {
    fontSize: normalize(22),
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: moderateScale(12),
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: normalize(16),
    color: colors.gray,
    textAlign: 'center',
    marginBottom: moderateScale(16),
    lineHeight: normalize(22),
  },
  modalUserPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
    backgroundColor: colors.secondary,
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(16),
  },
  modalUserName: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: colors.primary,
  },
  modalWarning: {
    fontSize: normalize(14),
    color: colors.error,
    fontWeight: '600',
    marginBottom: moderateScale(8),
    textAlign: 'center',
  },
  modalWarningList: {
    fontSize: normalize(13),
    color: colors.gray,
    lineHeight: normalize(20),
    marginBottom: moderateScale(16),
    textAlign: 'left',
  },
  modalWarningFinal: {
    fontSize: normalize(13),
    color: colors.error,
    fontWeight: '600',
    marginBottom: moderateScale(24),
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: moderateScale(12),
    width: '100%',
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(6),
  },
  cancelButton: {
    backgroundColor: colors.secondary,
  },
  cancelButtonText: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: colors.primary,
  },
  confirmDeleteButton: {
    backgroundColor: colors.error,
  },
  confirmDeleteButtonText: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: colors.white,
  },
});

export default StatisticsScreen;
