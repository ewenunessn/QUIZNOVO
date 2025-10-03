import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  Switch 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { addQuestion, updateQuestion } from '../services/questionsService';

const AdminEditScreen = ({ navigation, route }) => {
  const { mode, question } = route.params || {};
  const isEditing = mode === 'edit';

  const [formData, setFormData] = useState({
    id: '',
    pergunta: '',
    resposta: true,
    explicacao: '',
    icon: 'help-circle-outline'
  });

  const [saving, setSaving] = useState(false);

  // Ícones disponíveis
  const availableIcons = [
    'help-circle-outline',
    'warning-outline',
    'happy-outline',
    'color-palette-outline',
    'medical-outline',
    'leaf-outline',
    'construct-outline',
    'scale-outline',
    'ban-outline',
    'chatbubble-outline',
    'shield-checkmark-outline',
    'information-circle-outline',
    'checkmark-circle-outline',
    'close-circle-outline'
  ];

  useEffect(() => {
    if (isEditing && question) {
      setFormData({
        id: question.id?.toString() || '',
        pergunta: question.pergunta || '',
        resposta: question.resposta || true,
        explicacao: question.explicacao || '',
        icon: question.icon || 'help-circle-outline'
      });
    }
  }, [isEditing, question]);

  const handleSave = async () => {
    // Validações
    if (!formData.pergunta.trim()) {
      Alert.alert('Erro', 'A pergunta é obrigatória');
      return;
    }

    if (!formData.explicacao.trim()) {
      Alert.alert('Erro', 'A explicação é obrigatória');
      return;
    }

    if (!formData.id.trim()) {
      Alert.alert('Erro', 'O ID da pergunta é obrigatório');
      return;
    }

    try {
      setSaving(true);

      const questionData = {
        id: parseInt(formData.id),
        pergunta: formData.pergunta.trim(),
        resposta: formData.resposta,
        explicacao: formData.explicacao.trim(),
        icon: formData.icon
      };

      if (isEditing) {
        await updateQuestion(question.firebaseId, questionData);
        Alert.alert('Sucesso', 'Pergunta atualizada com sucesso!');
      } else {
        await addQuestion(questionData);
        Alert.alert('Sucesso', 'Pergunta adicionada com sucesso!');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a pergunta: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Pergunta' : 'Nova Pergunta'}
        </Text>
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Ionicons name="checkmark" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* ID da Pergunta */}
        <View style={styles.field}>
          <Text style={styles.label}>ID da Pergunta *</Text>
          <TextInput
            style={styles.input}
            value={formData.id}
            onChangeText={(text) => setFormData({...formData, id: text})}
            placeholder="Ex: 1, 2, 3..."
            keyboardType="numeric"
          />
        </View>

        {/* Pergunta */}
        <View style={styles.field}>
          <Text style={styles.label}>Pergunta *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.pergunta}
            onChangeText={(text) => setFormData({...formData, pergunta: text})}
            placeholder="Digite a pergunta aqui..."
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Resposta */}
        <View style={styles.field}>
          <Text style={styles.label}>Resposta Correta</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Falso</Text>
            <Switch
              value={formData.resposta}
              onValueChange={(value) => setFormData({...formData, resposta: value})}
              trackColor={{ false: colors.error, true: colors.success }}
              thumbColor={colors.white}
            />
            <Text style={styles.switchLabel}>Verdadeiro</Text>
          </View>
        </View>

        {/* Explicação */}
        <View style={styles.field}>
          <Text style={styles.label}>Explicação *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.explicacao}
            onChangeText={(text) => setFormData({...formData, explicacao: text})}
            placeholder="Digite a explicação da resposta..."
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Ícone */}
        <View style={styles.field}>
          <Text style={styles.label}>Ícone</Text>
          <View style={styles.iconGrid}>
            {availableIcons.map((iconName) => (
              <TouchableOpacity
                key={iconName}
                style={[
                  styles.iconOption,
                  formData.icon === iconName && styles.iconOptionSelected
                ]}
                onPress={() => setFormData({...formData, icon: iconName})}
              >
                <Ionicons 
                  name={iconName} 
                  size={24} 
                  color={formData.icon === iconName ? colors.white : colors.primary} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preview */}
        <View style={styles.field}>
          <Text style={styles.label}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <View style={styles.previewIcon}>
                <Ionicons name={formData.icon} size={20} color={colors.white} />
              </View>
              <Text style={styles.previewId}>#{formData.id}</Text>
            </View>
            <Text style={styles.previewQuestion}>
              {formData.pergunta || 'Digite a pergunta...'}
            </Text>
            <View style={styles.previewAnswer}>
              <Text style={styles.previewAnswerText}>
                Resposta: {formData.resposta ? 'Verdadeiro' : 'Falso'}
              </Text>
            </View>
            <Text style={styles.previewExplanation}>
              {formData.explicacao || 'Digite a explicação...'}
            </Text>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.gray,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: colors.primary,
    marginHorizontal: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  iconOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  previewCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  previewQuestion: {
    fontSize: 16,
    color: colors.primary,
    lineHeight: 24,
    marginBottom: 12,
  },
  previewAnswer: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  previewAnswerText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  previewExplanation: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default AdminEditScreen;