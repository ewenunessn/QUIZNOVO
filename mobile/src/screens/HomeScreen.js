import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Animated, Easing } from 'react-native';
import { colors } from '../constants/colors';
import { getAppSettings } from '../services/questionsService';
import { normalize, moderateScale } from '../utils/responsive';

const HomeScreen = ({ navigation }) => {
  const [appSettings, setAppSettings] = useState({
    appTitle: 'Quiz Odontologia Estética',
    appLongDescription: 'Teste seus conhecimentos sobre odontologia estética e descubra os bastidores da saúde e estética bucal.'
  });

  // Animações
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const descriptionOpacity = useRef(new Animated.Value(0)).current;
  const descriptionTranslateY = useRef(new Animated.Value(20)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    loadAppSettings();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.sequence([
      // Logo com bounce
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        })
      ]),
      // Título
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(titleTranslateY, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        })
      ]),
      // Descrição (mais suave e lenta)
      Animated.parallel([
        Animated.timing(descriptionOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(descriptionTranslateY, {
          toValue: 0,
          tension: 60,
          friction: 10,
          useNativeDriver: true,
        })
      ]),
      // Botão
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        })
      ])
    ]).start();
  };

  const loadAppSettings = async () => {
    try {
      const settings = await getAppSettings();
      if (settings) {
        setAppSettings(settings);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      // Mantém os valores padrão se houver erro
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Animated.View 
            style={[
              styles.iconContainer,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }]
              }
            ]}
          >
            <Image 
              source={require('../data/logo/logo-dente.png')} 
              style={styles.logo}
              resizeMode="contain"
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
            {appSettings.appTitle}
          </Animated.Text>
          
          <Animated.Text 
            style={[
              styles.description,
              {
                opacity: descriptionOpacity,
                transform: [{ translateY: descriptionTranslateY }]
              }
            ]}
          >
            {appSettings.appLongDescription}
          </Animated.Text>
          
          <Animated.View
            style={{
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }]
            }}
          >
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('Instructions')}
            >
              <Text style={styles.buttonText}>Iniciar Quiz</Text>
            </TouchableOpacity>
          </Animated.View>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    padding: moderateScale(30),
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    marginBottom: moderateScale(20),
  },
  logo: {
    width: moderateScale(100),
    height: moderateScale(100),
  },
  title: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: moderateScale(20),
  },
  description: {
    fontSize: normalize(16),
    color: colors.gray,
    textAlign: 'justify',
    lineHeight: normalize(22),
    marginBottom: moderateScale(30),
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: moderateScale(40),
    paddingVertical: moderateScale(15),
    borderRadius: moderateScale(25),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: colors.white,
    fontSize: normalize(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;