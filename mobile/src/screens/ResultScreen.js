import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';
import { getAppSettings } from '../services/questionsService';
import soundEffects from '../utils/soundEffects';
import { normalize, moderateScale } from '../utils/responsive';

const ResultScreen = ({ navigation, route }) => {
  const { score, totalQuestions = 10 } = route.params;
  
  // Validar e garantir que os valores são consistentes
  const validScore = Math.min(Math.max(0, score), totalQuestions); // Entre 0 e totalQuestions
  const validTotal = Math.max(1, totalQuestions); // Mínimo 1 para evitar divisão por zero
  const percentage = Math.min(100, Math.round((validScore / validTotal) * 100)); // Máximo 100%
  
  const [prizeMessage, setPrizeMessage] = useState('Procure nossa equipe para retirar seu presente especial por ter participado do quiz.');

  // Animações fluidas
  const iconScale = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const performanceOpacity = useRef(new Animated.Value(0)).current;
  const performanceTranslateY = useRef(new Animated.Value(30)).current;
  const scoreOpacity = useRef(new Animated.Value(0)).current;
  const scoreTranslateY = useRef(new Animated.Value(30)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const prizeOpacity = useRef(new Animated.Value(0)).current;
  const prizeScale = useRef(new Animated.Value(0.8)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    loadSettings();
    saveResult();
    startAnimations();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await getAppSettings();
      if (settings.prizeMessage) {
        setPrizeMessage(settings.prizeMessage);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      // Mantém a mensagem padrão se houver erro
    }
  };

  const startAnimations = () => {
    // Som de whoosh no início
    soundEffects.playWhoosh();
    
    Animated.sequence([
      // Ícone bounce
      Animated.spring(iconScale, {
        toValue: 1,
        tension: 150,
        friction: 6,
        useNativeDriver: true,
      }),
      
      // Título
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(titleTranslateY, {
          toValue: 0,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        })
      ]),
      
      // Performance
      Animated.parallel([
        Animated.timing(performanceOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(performanceTranslateY, {
          toValue: 0,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        })
      ]),
      
      // Score
      Animated.parallel([
        Animated.timing(scoreOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(scoreTranslateY, {
          toValue: 0,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        })
      ]),
    ]).start(() => {
      // Som de ding após título
      soundEffects.playDing();
      
      // Barra de progresso
      soundEffects.playSweep();
      Animated.timing(progressWidth, {
        toValue: percentage,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
      
      // Prize
      setTimeout(() => {
        soundEffects.playFanfare();
        Animated.parallel([
          Animated.timing(prizeOpacity, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.spring(prizeScale, {
            toValue: 1,
            tension: 150,
            friction: 8,
            useNativeDriver: true,
          })
        ]).start();
      }, 100);
      
      // Button
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(buttonOpacity, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.spring(buttonScale, {
            toValue: 1,
            tension: 150,
            friction: 8,
            useNativeDriver: true,
          })
        ]).start();
      }, 200);
    });
  };

  const saveResult = async () => {
    try {
      const result = {
        score: validScore,
        totalQuestions: validTotal,
        percentage,
        date: new Date().toISOString(),
      };
      
      const existingResults = await AsyncStorage.getItem('quizResults');
      const results = existingResults ? JSON.parse(existingResults) : [];
      results.push(result);
      
      await AsyncStorage.setItem('quizResults', JSON.stringify(results));
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
    }
  };

  const getPerformanceMessage = () => {
    if (percentage >= 80) return "Excelente!";
    if (percentage >= 60) return "Muito bem!";
    if (percentage >= 40) return "Bom trabalho!";
    return "Continue estudando!";
  };

  const getPerformanceIcon = () => {
    if (percentage >= 80) return "trophy";
    if (percentage >= 60) return "medal";
    if (percentage >= 40) return "ribbon";
    return "school";
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.iconContainer,
          { transform: [{ scale: iconScale }] }
        ]}
      >
        <Ionicons 
          name={getPerformanceIcon()} 
          size={100} 
          color={colors.secondary} 
        />
      </Animated.View>
      
      <Animated.Text 
        style={[
          styles.title,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }]
          }
        ]}
      >
        Parabéns!
      </Animated.Text>
      
      <Animated.Text 
        style={[
          styles.performanceText,
          {
            opacity: performanceOpacity,
            transform: [{ translateY: performanceTranslateY }]
          }
        ]}
      >
        {getPerformanceMessage()}
      </Animated.Text>
      
      <Animated.View 
        style={[
          styles.scoreContainer,
          {
            opacity: scoreOpacity,
            transform: [{ translateY: scoreTranslateY }]
          }
        ]}
      >
        <Text style={styles.scoreText}>
          Você acertou {validScore} de {validTotal} questões
        </Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
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
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.prizeContainer,
          {
            opacity: prizeOpacity,
            transform: [{ scale: prizeScale }]
          }
        ]}
      >
        <View style={styles.prizeCard}>
          <Ionicons name="gift" size={40} color={colors.primary} />
          <Text style={styles.prizeTitle}>🎁 Você ganhou um brinde!</Text>
          <Text style={styles.prizeText}>
            {prizeMessage}
          </Text>
        </View>
      </Animated.View>
      
      <Animated.View 
        style={{
          opacity: buttonOpacity,
          transform: [{ scale: buttonScale }]
        }}
      >
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Feedback', { score: validScore, totalQuestions: validTotal })}
        >
          <Ionicons name="chatbox-ellipses" size={20} color={colors.primary} />
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
        
        <Text style={styles.feedbackNote}>
          Deixe seu feedback para finalizar
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  iconContainer: {
    marginBottom: moderateScale(20),
  },
  title: {
    fontSize: normalize(32),
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: moderateScale(8),
  },
  performanceText: {
    fontSize: normalize(18),
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: moderateScale(30),
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: moderateScale(30),
  },
  scoreText: {
    fontSize: normalize(16),
    color: colors.white,
    textAlign: 'center',
    marginBottom: moderateScale(16),
  },
  progressContainer: {
    width: '100%',
    maxWidth: moderateScale(250),
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: moderateScale(10),
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: moderateScale(5),
    overflow: 'hidden',
    marginBottom: moderateScale(8),
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: moderateScale(5),
  },
  percentageText: {
    fontSize: normalize(22),
    fontWeight: 'bold',
    color: colors.secondary,
  },
  prizeContainer: {
    marginBottom: moderateScale(30),
    width: '100%',
  },
  prizeCard: {
    backgroundColor: colors.white,
    padding: moderateScale(20),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  prizeTitle: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginVertical: moderateScale(12),
  },
  prizeText: {
    fontSize: normalize(13),
    color: colors.gray,
    textAlign: 'center',
    lineHeight: normalize(18),
  },
  button: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(24),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(20),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: colors.primary,
    fontSize: normalize(16),
    fontWeight: 'bold',
    marginLeft: moderateScale(8),
  },
  feedbackNote: {
    color: colors.secondary,
    fontSize: normalize(13),
    textAlign: 'center',
    marginTop: moderateScale(12),
    fontStyle: 'italic',
  },
});

export default ResultScreen;