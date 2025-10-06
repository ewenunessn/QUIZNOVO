import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Alert, BackHandler, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../constants/colors';
import { getQuestions, saveUserAnswer } from '../services/questionsService';
import soundEffects from '../utils/soundEffects';
import { normalize, moderateScale } from '../utils/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuizScreen = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Ref para garantir valor correto do score (evita race condition)
  const scoreRef = useRef(0);

  // Animações apenas com opacity - zero artefatos
  const progressWidth = useRef(new Animated.Value(0)).current;
  const scoreScale = useRef(new Animated.Value(1)).current;
  const questionOpacity = useRef(new Animated.Value(1)).current;
  const buttonsOpacity = useRef(new Animated.Value(1)).current;
  const explanationOpacity = useRef(new Animated.Value(0)).current;

  // Carregar perguntas do Firebase (apenas uma vez)
  useEffect(() => {
    let isMounted = true; // ✅ Prevenir race condition
    
    const fetchQuestions = async () => {
      if (isMounted) {
        await loadQuestions();
      }
    };
    
    fetchQuestions();
    
    return () => {
      isMounted = false; // ✅ Cleanup
    };
  }, []); // ✅ Array vazio = executa apenas uma vez

  // ✅ Sincronizar scoreRef com score inicial
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const questionsData = await getQuestions();
      
      console.log(`📊 Total de perguntas recebidas: ${questionsData.length}`);
      
      if (questionsData.length > 0) {
        // ✅ Garantir que não há duplicatas antes de setar
        const uniqueQuestions = questionsData.filter((question, index, self) =>
          index === self.findIndex((q) => q.id === question.id)
        );
        
        console.log(`✅ Perguntas únicas após filtro: ${uniqueQuestions.length}`);
        setQuestions(uniqueQuestions);
      } else {
        Alert.alert('Erro', 'Nenhuma pergunta encontrada. Verifique sua conexão.');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as perguntas: ' + error.message);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (answer) => {
    const correct = answer === questions[currentQuestion].resposta;
    setIsCorrect(correct);

    // ✅ Salvar resposta no Firebase
    try {
      const userName = await AsyncStorage.getItem('userName');
      await saveUserAnswer({
        userName: userName || 'Anônimo',
        questionId: questions[currentQuestion].id,
        questionText: questions[currentQuestion].pergunta,
        userAnswer: answer,
        correctAnswer: questions[currentQuestion].resposta,
        isCorrect: correct,
        timestamp: new Date().toISOString()
      });
      console.log('✅ Resposta registrada no banco de dados');
    } catch (error) {
      console.error('❌ Erro ao salvar resposta:', error);
      // Não bloqueia o fluxo do quiz se houver erro
    }

    // Reproduz som de acordo com a resposta
    if (correct) {
      soundEffects.playCorrect();
      
      // ✅ Atualizar ref imediatamente (síncrono)
      scoreRef.current += 1;
      
      // ✅ Atualizar state para UI
      setScore(scoreRef.current);
      
      // Animação no score
      Animated.sequence([
        Animated.spring(scoreScale, {
          toValue: 1.2,
          tension: 200,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.spring(scoreScale, {
          toValue: 1,
          tension: 200,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      soundEffects.playIncorrect();
    }

    // Fade out dos botões
    Animated.timing(buttonsOpacity, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setShowExplanation(true);

      // Fade in da explicação
      Animated.timing(explanationOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  };



  const confirmExit = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Você perderá todo o progresso atual. Tem certeza que deseja sair?')) {
        navigation.navigate('Welcome');
      }
    } else {
      Alert.alert(
        'Sair do Quiz?',
        'Você perderá todo o progresso atual. Tem certeza que deseja sair?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Sair',
            style: 'destructive',
            onPress: () => navigation.navigate('Welcome'),
          },
        ],
        { cancelable: true }
      );
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      // Fade out tudo
      Animated.parallel([
        Animated.timing(questionOpacity, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(explanationOpacity, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        })
      ]).start(() => {
        // Resetar estados
        setCurrentQuestion(currentQuestion + 1);
        setShowExplanation(false);

        // Resetar valores
        buttonsOpacity.setValue(0);
        explanationOpacity.setValue(0);

        // Fade in da nova pergunta
        Animated.timing(questionOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();

        // Botões aparecem depois
        setTimeout(() => {
          Animated.timing(buttonsOpacity, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start();
        }, 200);
      });
    } else {
      // ✅ Usar scoreRef para garantir valor correto (evita race condition)
      navigation.navigate('Result', { 
        score: scoreRef.current,
        totalQuestions: questions.length 
      });
    }
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  // Animar barra de progresso
  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: progress,
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [currentQuestion]);

  // Animação inicial
  useEffect(() => {
    Animated.timing(questionOpacity, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(buttonsOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }, 300);
  }, [questions.length]);

  // Intercepta o botão de voltar do Android
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        const onBackPress = () => {
          confirmExit();
          return true; // Impede o comportamento padrão
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => subscription?.remove();
      }
    }, [])
  );

  // Loading screen
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando perguntas...</Text>
      </View>
    );
  }

  // Se não há perguntas, não renderiza nada
  if (questions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header com barra de progresso moderna */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={confirmExit}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>

        <View style={styles.progressSection}>
          <Text style={styles.questionNumber}>
            {String(currentQuestion + 1).padStart(2, '0')}
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    })
                  }
                ]}
              />
            </View>
            <Text style={styles.totalQuestions}>/{questions.length}</Text>
          </View>
        </View>

        <View style={styles.scoreContainer}>
          <View style={styles.scoreBadge}>
            <Ionicons name="star" size={16} color={colors.secondary} />
            <Animated.Text
              style={[
                styles.scoreText,
                { transform: [{ scale: scoreScale }] }
              ]}
            >
              {score}
            </Animated.Text>
          </View>
        </View>
      </View>

      {/* Question Card */}
      <Animated.View
        style={[
          styles.questionCard,
          { opacity: questionOpacity }
        ]}
      >
        {/* Círculo com ícone no topo */}
        <View style={styles.iconCircle}>
          <Ionicons name={questions[currentQuestion].icon} size={28} color={colors.white} />
        </View>

        <Text style={styles.questionText}>
          {questions[currentQuestion].pergunta}
        </Text>
      </Animated.View>

      {/* Answer Buttons */}
      {!showExplanation && (
        <Animated.View
          style={[
            styles.answersContainer,
            { opacity: buttonsOpacity }
          ]}
        >
          <TouchableOpacity
            style={[styles.answerButton, styles.trueButton]}
            onPress={() => handleAnswer(true)}
          >
            <View style={styles.answerLetter}>
              <Text style={styles.answerLetterText}>V</Text>
            </View>
            <Text style={styles.answerText}>Verdadeiro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.answerButton, styles.falseButton]}
            onPress={() => handleAnswer(false)}
          >
            <View style={styles.answerLetter}>
              <Text style={styles.answerLetterText}>F</Text>
            </View>
            <Text style={styles.answerText}>Falso</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Explanation */}
      {showExplanation && (
        <Animated.View
          style={[
            styles.explanationContainer,
            { opacity: explanationOpacity }
          ]}
        >
          <View
            style={[
              styles.resultBanner,
              { backgroundColor: isCorrect ? colors.success : colors.error }
            ]}
          >
            <Ionicons
              name={isCorrect ? "checkmark-circle" : "close-circle"}
              size={24}
              color={colors.white}
            />
            <Text style={styles.resultText}>
              {isCorrect ? 'Correto!' : 'Incorreto!'}
            </Text>
          </View>

          <View style={styles.explanationCard}>
            <Text style={styles.correctAnswerLabel}>
              Resposta correta: {questions[currentQuestion].resposta ? 'Verdadeiro' : 'Falso'}
            </Text>
            <Text style={styles.explanationText}>
              {questions[currentQuestion].explicacao}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={nextQuestion}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestion < questions.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color={colors.white} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionNumber: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: moderateScale(12),
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressTrack: {
    flex: 1,
    height: moderateScale(8),
    backgroundColor: 'rgba(3, 56, 96, 0.2)',
    borderRadius: moderateScale(4),
    overflow: 'hidden',
    marginRight: moderateScale(8),
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: moderateScale(4),
  },
  totalQuestions: {
    fontSize: normalize(16),
    color: colors.primary,
    fontWeight: '600',
  },
  scoreContainer: {
    marginLeft: moderateScale(16),
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(20),
  },
  scoreText: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: moderateScale(4),
  },
  questionCard: {
    backgroundColor: colors.white,
    marginHorizontal: moderateScale(20),
    padding: moderateScale(20),
    paddingTop: moderateScale(36),
    borderRadius: moderateScale(20),
    marginBottom: moderateScale(20),
    position: 'relative',
    flex: 1,
    maxHeight: '35%',
  },
  iconCircle: {
    position: 'absolute',
    top: moderateScale(-20),
    alignSelf: 'center',
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  questionText: {
    fontSize: normalize(18),
    color: colors.primary,
    textAlign: 'center',
    lineHeight: normalize(24),
    fontWeight: '500',
  },
  answersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: moderateScale(16),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(16),
    marginBottom: moderateScale(12),
    width: '100%',
  },
  trueButton: {
    opacity: 0.9,
  },
  falseButton: {
    backgroundColor: colors.error,
    opacity: 0.9,
  },
  answerLetter: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(16),
  },
  answerLetterText: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: colors.primary,
  },
  answerText: {
    fontSize: normalize(18),
    color: colors.white,
    fontWeight: '500',
  },
  explanationContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(16),
  },
  resultText: {
    color: colors.white,
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginLeft: moderateScale(8),
  },
  explanationCard: {
    backgroundColor: colors.white,
    padding: moderateScale(20),
    borderRadius: moderateScale(16),
    marginBottom: moderateScale(16),
    flex: 1,
  },
  correctAnswerLabel: {
    fontSize: normalize(15),
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: moderateScale(8),
  },
  explanationText: {
    fontSize: normalize(15),
    color: colors.gray,
    lineHeight: normalize(22),
  },
  nextButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(16),
  },
  nextButtonText: {
    color: colors.white,
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginRight: moderateScale(8),
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
});

export default QuizScreen;