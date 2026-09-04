import { useState } from 'react';
import { Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import { createTask } from '../api/taskService';
import { isRequired } from '../utils/validators';
import { colors } from '../utils/colors';

export default function TaskCreateScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    const nextErrors = {};
    if (!isRequired(title)) nextErrors.title = 'Le titre est requis';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await createTask({ title: title.trim(), description: description.trim() });
      navigation.goBack();
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          (err.request ? 'Impossible de joindre le serveur.' : 'Une erreur est survenue.')
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <FormInput
          label="Titre"
          placeholder="Ex: Préparer la présentation"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />
        <FormInput
          label="Description (optionnel)"
          placeholder="Détails de la tâche"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.textarea}
        />

        {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}

        <PrimaryButton title="Créer la tâche" onPress={handleSubmit} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16 },
  textarea: { height: 100, textAlignVertical: 'top' },
  apiError: {
    color: colors.danger,
    backgroundColor: colors.dangerLight,
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
    fontSize: 13,
  },
});
