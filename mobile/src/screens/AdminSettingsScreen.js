import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { updateAppSettings } from '../services/questionsService';

const AdminSettingsScreen = ({ navigation, route }) => {
  const { settings } = route.params || {};

  const [formData, setFormData] = useState({
    appTitle: settings?.appTitle || 'Odontologia Estética',
    appDescription: settings?.appDescription || 'Descubra os bastidores da saúde e estética bucal'
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    // Validações
    if (!formData.appTitle.trim()) {
      Alert.alert('Erro', 'O título do app é obrigatório');
      return;
    }

    if (!formData.appDescription.trim()) {
      Alert.alert('Erro', 'A descrição do app é obrigatória');
      return;
    }

    try {
      setSaving(true);

      const settingsData = {
        appTitle: formData.appTitle.trim(),
        appDescription: formData.appDescription.trim()
      };

      await updateAppSettings(settingsData);
      Alert.alert('Sucesso', 'Configurações atualizadas com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as configurações: ' + error.message);
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
        <Text style={styles.headerTitle}>Configurações do App</Text>
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Ionicons name="checkmark" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Título do App */}
        <View style={styles.field}>
          <Text style={styles.label}>Título do App *</Text>
          <TextInput
            style={styles.input}
            value={formData.appTitle}
            onChangeText={(text) => setFormData({...formData, appTitle: text})}
            placeholder="Ex: Odontologia Estética"
          />
        </View>

        {/* Descrição do App */}
        <View style={styles.field}>
          <Text style={styles.label}>Descrição do App *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.appDescription}
            onChangeText={(text) => setFormData({...formData, appDescription: text})}
            placeholder="Ex: Descubra os bastidores da saúde e estética bucal"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Preview */}
        <View style={styles.field}>
          <Text style={styles.label}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewIcon}>
              <Ionicons name="happy-outline" size={40} color={colors.secondary} />
            </View>
            <Text style={styles.previewTitle}>
              {formData.appTitle || 'Título do App'}
            </Text>
            <Text style={styles.previewDescription}>
              {formData.appDescription || 'Descrição do app'}
            </Text>
            <View style={styles.previewButton}>
              <Text style={styles.previewButtonText}>Entrar</Text>
            </View>
          </View>
        </View>

        {/* Informações */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Sobre as Configurações</Text>
            <Text style={styles.infoText}>
              • O título aparece na tela principal do app{'\n'}
              • A descrição é exibida abaixo do título{'\n'}
              • As alterações são aplicadas imediatamente{'\n'}
              • Todos os usuários verão as mudanças
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
    height: 80,
    textAlignVertical: 'top',
  },
  previewCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
  },
  previewIcon: {
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  previewDescription: {
    fontSize: 16,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  previewButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 20,
  },
  previewButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginTop: 20,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
});

export default AdminSettingsScreen;