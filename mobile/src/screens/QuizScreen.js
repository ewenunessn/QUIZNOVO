import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../shared/constants/colors';
import { questions } from '../../../shared/data/questions';

const QuizScreen = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = (answer) => {
    const correct = answer === questions[currentQuestion].resposta;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
    } else {
      navigation.navigate('Result', { score: score + (isCorrect ? 1 : 0) });
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentQuestion + 1} de {questions.length}
          </Text>
        </View>
        <View style={styles.scoreContainer}>
          <Ionicons name="star" size={20} color={colors.secondary} />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      {/* Question */}
      <Animatable.View 
        key={currentQuestion}
        animation="fadeInUp"
        style={styles.questionContainer}
      >
        <Text style={styles.questionText}>
          {questions[currentQuestion].pergunta}
        </Text>
      </Animatable.View>

      {/* Answer Buttons */}
      {!showExplanation && (
        <Animatable.View animation="fadeInUp" delay={300} style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.answerButton, styles.trueButton]}
            onPress={() => handleAnswer(true)}
          >
            <Ionicons name="checkmark" size={24} color={colors.white} />
            <Text style={styles.answerButtonText}>Verdadeiro</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.answerButton, styles.falseButton]}
            onPress={() => handleAnswer(false)}
          >
            <Ionicons name="close" size={24} color={colors.white} />
            <Text style={styles.answerButtonText}>Falso</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}

      {/* Explanation */}
      {showExplanation && (
        <Animatable.View animation="fadeInUp" style={styles.explanationContainer}>
          <View style={[
            styles.resultIndicator, 
            { backgroundColor: isCorrect ? colors.success : colors.error }
          ]}>
            <Ionicons 
              name={isCorrect ? "checkmark-circle" : "close-circle"} 
              size={30} 
              color={colors.white} 
            />
            <Text style={styles.resultText}>
              {isCorrect ? 'Correto!' : 'Incorreto!'}
            </Text>
          </View>
          
          <View style={styles.explanationCard}>
            <Text style={styles.correctAnswerText}>
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
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  progressContainer: {
    flex: 1,
    marginRight: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.white,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 5,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 5,
  },
  questionContainer: {
    backgroundColor: colors.white,
    margin: 20,
    padding: 25,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  questionText: {
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  trueButton: {
    backgroundColor: colors.success,
  },
  falseButton: {
    backgroundColor: colors.error,
  },
  answerButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  explanationContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  resultText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  explanationCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  correctAnswerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  explanationText: {
    fontSize: 16,
    color: colors.gray,
    lineHeight: 22,
  },
  nextButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default QuizScreen;