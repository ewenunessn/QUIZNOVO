import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../../shared/constants/colors';

const ResultScreen = ({ navigation, route }) => {
  const { score } = route.params;
  const totalQuestions = 10;
  const percentage = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    saveResult();
  }, []);

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
      <Animatable.View 
        animation="bounceIn" 
        duration={1500}
        style={styles.iconContainer}
      >
        <Ionicons 
          name={getPerformanceIcon()} 
          size={100} 
          color={colors.secondary} 
        />
      </Animatable.View>
      
      <Animatable.Text 
        animation="fadeInUp" 
        delay={500}
        style={styles.title}
      >
        Parabéns!
      </Animatable.Text>
      
      <Animatable.Text 
        animation="fadeInUp" 
        delay={700}
        style={styles.performanceText}
      >
        {getPerformanceMessage()}
      </Animatable.Text>
      
      <Animatable.View 
        animation="fadeInUp" 
        delay={900}
        style={styles.scoreContainer}
      >
        <Text style={styles.scoreText}>
          Você acertou {score} de {totalQuestions} questões
        </Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animatable.View 
              animation="slideInLeft"
              delay={1200}
              duration={1000}
              style={[styles.progressFill, { width: `${percentage}%` }]} 
            />
          </View>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>
      </Animatable.View>
      
      <Animatable.View 
        animation="fadeInUp" 
        delay={1400}
        style={styles.prizeContainer}
      >
        <View style={styles.prizeCard}>
          <Ionicons name="gift" size={40} color={colors.primary} />
          <Text style={styles.prizeTitle}>🎁 Você ganhou um brinde!</Text>
          <Text style={styles.prizeText}>
            Procure nossa equipe para retirar seu presente especial por ter participado do quiz.
          </Text>
        </View>
      </Animatable.View>
      
      <Animatable.View animation="fadeInUp" delay={1600}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Ionicons name="home" size={20} color={colors.white} />
          <Text style={styles.buttonText}>Voltar ao Início</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  performanceText: {
    fontSize: 20,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  scoreText: {
    fontSize: 18,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    width: 250,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  prizeContainer: {
    marginBottom: 40,
  },
  prizeCard: {
    backgroundColor: colors.white,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  prizeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginVertical: 15,
  },
  prizeText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ResultScreen;