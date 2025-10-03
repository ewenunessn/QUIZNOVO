import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Alert, BackHandler, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../constants/colors';
import { getQuestions } from '../services/questionsService';
import soundEffects from '../utils/soundEffects';

const QuizScreen = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Animações apenas com opacity - zero artefatos
  const progressWidth = useRef(new Animated.Value(0)).current;
  const scoreScale = useRef(new Animated.Value(1)).current;
  const questionOpacity = useRef(new Animated.Value(1)).current;
  const buttonsOpacity = useRef(new Animated.Value(1)).current;
  const explanationOpacity = useRef(new Animated.Value(0)).current;

  // Carregar perguntas do Firebase
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const questionsData = await getQuestions();
      if (questionsData.length > 0) {
        setQuestions(questionsData);
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

  const handleAnswer = (answer) => {
    const correct = answer === questions[currentQuestion].resposta;
    setIsCorrect(correct);

    // Reproduz som de acordo com a resposta
    if (correct) {
      soundEffects.playCorrect();
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

    if (correct) {
      setScore(score + 1);
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
    }
  };



  const confirmExit = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Você perderá todo o progresso atual. Tem certeza que deseja sair?')) {
        navigation.goBack();
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
            onPress: () => navigation.goBack(),
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
      navigation.navigate('Result', { 
        score: score + (isCorrect ? 1 : 0),
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
    paddingTop: 50,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 12,
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(3, 56, 96, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  totalQuestions: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  scoreContainer: {
    marginLeft: 16,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 4,
  },
  questionCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    padding: 20,
    paddingTop: 36,
    borderRadius: 20,
    marginBottom: 20,
    position: 'relative',
    flex: 1,
    maxHeight: '35%',
  },
  iconCircle: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 24,
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  answerLetterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  answerText: {
    fontSize: 18,
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
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  resultText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  explanationCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    flex: 1,
  },
  correctAnswerLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 15,
    color: colors.gray,
    lineHeight: 22,
  },
  nextButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
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
});

export default QuizScreen;