import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  Animated,
  Easing,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';
import { saveFeedback } from '../services/questionsService';
import { normalize, moderateScale } from '../utils/responsive';

const FeedbackScreen = ({ navigation, route }) => {
  const { score, totalQuestions } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Animações
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const starsOpacity = useRef(new Animated.Value(0)).current;
  const starsScale = useRef(new Animated.Value(0.8)).current;
  const inputOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.sequence([
      // Título
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(titleTranslateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      ]),
      
      // Estrelas
      Animated.parallel([
        Animated.timing(starsOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(starsScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      ]),
      
      // Input
      Animated.timing(inputOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      
      // Botão
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleRating = (value) => {
    setRating(value);
    
    // Animação de feedback ao selecionar estrela
    Animated.sequence([
      Animated.spring(starsScale, {
        toValue: 1.1,
        tension: 200,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.spring(starsScale, {
        toValue: 1,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Avaliação necessária', 'Por favor, selecione uma avaliação de 1 a 5 estrelas.');
      return;
    }

    try {
      setSubmitting(true);
      const userName = await AsyncStorage.getItem('userName');
      
      await saveFeedback({
        userName: userName || 'Anônimo',
        rating,
        comment: comment.trim(),
        score,
        totalQuestions,
        timestamp: new Date().toISOString()
      });

      if (Platform.OS === 'web') {
        alert('Obrigado! 🎉\nSeu feedback foi registrado com sucesso!');
        navigation.navigate('Welcome');
      } else {
        Alert.alert(
          'Obrigado! 🎉',
          'Seu feedback foi registrado com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Welcome')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      Alert.alert('Erro', 'Não foi possível enviar seu feedback. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };



  const getRatingText = () => {
    switch (rating) {
      case 1: return 'Muito Ruim 😞';
      case 2: return 'Ruim 😕';
      case 3: return 'Regular 😐';
      case 4: return 'Bom 😊';
      case 5: return 'Excelente 🤩';
      default: return 'Selecione sua avaliação';
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Ícone */}
        <View style={styles.iconContainer}>
          <Ionicons name="chatbox-ellipses" size={80} color={colors.secondary} />
        </View>

        {/* Título */}
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }]
          }}
        >
          <Text style={styles.title}>Sua opinião é importante!</Text>
          <Text style={styles.subtitle}>
            Como foi sua experiência com o quiz?
          </Text>
        </Animated.View>

        {/* Avaliação por Estrelas */}
        <Animated.View
          style={[
            styles.ratingContainer,
            {
              opacity: starsOpacity,
              transform: [{ scale: starsScale }]
            }
          ]}
        >
          <Text style={styles.ratingLabel}>{getRatingText()}</Text>
          
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRating(star)}
                style={styles.starButton}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={moderateScale(48)}
                  color={star <= rating ? '#FFD700' : colors.gray}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Campo de Comentário */}
        <Animated.View
          style={[
            styles.commentContainer,
            { opacity: inputOpacity }
          ]}
        >
          <Text style={styles.commentLabel}>
            Deixe um comentário (opcional)
          </Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Compartilhe sua experiência..."
            placeholderTextColor={colors.gray}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>
            {comment.length}/500 caracteres
          </Text>
        </Animated.View>

        {/* Botão de Envio */}
        <Animated.View
          style={[
            styles.buttonsContainer,
            { opacity: buttonOpacity }
          ]}
        >
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <Text style={styles.buttonText}>Enviando...</Text>
            ) : (
              <>
                <Ionicons name="send" size={20} color={colors.primary} />
                <Text style={styles.buttonText}>Enviar Feedback</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.requiredText}>
            * Feedback obrigatório para continuar
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(30),
    paddingVertical: moderateScale(40),
  },
  iconContainer: {
    marginBottom: moderateScale(30),
  },
  title: {
    fontSize: normalize(28),
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: moderateScale(12),
  },
  subtitle: {
    fontSize: normalize(16),
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: moderateScale(40),
    lineHeight: normalize(22),
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: moderateScale(40),
    width: '100%',
  },
  ratingLabel: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: moderateScale(20),
    minHeight: normalize(24),
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: moderateScale(8),
  },
  starButton: {
    padding: moderateScale(4),
  },
  commentContainer: {
    width: '100%',
    marginBottom: moderateScale(30),
  },
  commentLabel: {
    fontSize: normalize(14),
    color: colors.secondary,
    marginBottom: moderateScale(12),
    fontWeight: '600',
  },
  commentInput: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    fontSize: normalize(14),
    color: colors.primary,
    minHeight: moderateScale(120),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  characterCount: {
    fontSize: normalize(11),
    color: colors.secondary,
    textAlign: 'right',
    marginTop: moderateScale(6),
  },
  buttonsContainer: {
    width: '100%',
    gap: moderateScale(12),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(25),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    gap: moderateScale(8),
  },
  submitButton: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: colors.primary,
    fontSize: normalize(18),
    fontWeight: 'bold',
  },
  requiredText: {
    fontSize: normalize(12),
    color: colors.secondary,
    textAlign: 'center',
    marginTop: moderateScale(12),
    fontStyle: 'italic',
  },
});

export default FeedbackScreen;
