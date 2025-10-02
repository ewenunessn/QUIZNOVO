import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../shared/constants/colors';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Animatable.View 
        animation="bounceIn" 
        duration={2000}
        style={styles.iconContainer}
      >
        <Ionicons name="happy-outline" size={120} color={colors.secondary} />
      </Animatable.View>
      
      <Animatable.Text 
        animation="fadeInUp" 
        delay={500}
        style={styles.title}
      >
        Odontologia Estética
      </Animatable.Text>
      
      <Animatable.Text 
        animation="fadeInUp" 
        delay={800}
        style={styles.subtitle}
      >
        Descubra os bastidores da saúde e estética bucal
      </Animatable.Text>
      
      <Animatable.View animation="fadeInUp" delay={1200}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Entrar</Text>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 50,
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
    textAlign: 'center',
  },
});

export default WelcomeScreen;