import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { normalize, moderateScale } from '../utils/responsive';

const InstructionsScreen = ({ navigation }) => {
  const instructions = [
    "Você receberá 10 questões sobre odontologia estética",
    "Para cada questão, escolha Verdadeiro ou Falso",
    "Após cada resposta, você verá uma explicação detalhada",
    "No final, você ganhará um brinde especial!"
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Como Funciona</Text>
          
          <View style={styles.instructionsList}>
            {instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.numberContainer}>
                  <Text style={styles.number}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Quiz')}
          >
            <Text style={styles.buttonText}>Começar Agora</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.white} style={styles.buttonIcon} />
          </TouchableOpacity>
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: normalize(28),
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: moderateScale(30),
  },
  instructionsList: {
    marginBottom: moderateScale(40),
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: moderateScale(20),
  },
  numberContainer: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(15),
  },
  number: {
    color: colors.white,
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: normalize(16),
    color: colors.gray,
    lineHeight: normalize(22),
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: moderateScale(30),
    paddingVertical: moderateScale(15),
    borderRadius: moderateScale(25),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  buttonIcon: {
    marginLeft: moderateScale(10),
  },
});

export default InstructionsScreen;