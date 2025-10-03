import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';
import { getAppSettings } from '../services/questionsService';
import soundEffects from '../utils/soundEffects';

const ResultScreen = ({ navigation, route }) => {
  const { score, totalQuestions = 10 } = route.params;
  const percentage = Math.round((score / totalQuestions) * 100);
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
        score,
        totalQuestions,
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
          Você acertou {score} de {totalQuestions} questões
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
          onPress={() => navigation.navigate('Welcome')}
        >
          <Ionicons name="home" size={20} color={colors.white} />
          <Text style={styles.buttonText}>Voltar ao Início</Text>
        </TouchableOpacity>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  performanceText: {
    fontSize: 18,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    maxWidth: 250,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 5,
  },
  percentageText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  prizeContainer: {
    marginBottom: 30,
    width: '100%',
  },
  prizeCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  prizeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginVertical: 12,
  },
  prizeText: {
    fontSize: 13,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 18,
  },
  button: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ResultScreen;