import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import { updateTask } from '../api/taskService';
import { isRequired } from '../utils/validators';
import { colors, statusColors } from '../utils/colors';

const STATUSES = ['En attente', 'En cours', 'Terminé'];

export default function TaskEditScreen({ route, navigation }) {
  const { task } = route.params;
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
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
      await updateTask(task.id, { title: title.trim(), description: description.trim(), status });
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
        <FormInput label="Titre" value={title} onChangeText={setTitle} error={errors.title} />
        <FormInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.textarea}
        />

        <Text style={styles.label}>Statut</Text>
        <View style={styles.statusRow}>
          {STATUSES.map((s) => {
            const active = s === status;
            const sc = statusColors[s];
            return (
              <TouchableOpacity
                key={s}
                onPress={() => setStatus(s)}
                style={[styles.statusChip, { borderColor: sc.text }, active && { backgroundColor: sc.bg }]}
              >
                <Text style={[styles.statusChipText, { color: sc.text }]}>{s}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}

        <PrimaryButton title="Enregistrer" onPress={handleSubmit} loading={loading} style={styles.saveButton} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16 },
  textarea: { height: 100, textAlignVertical: 'top' },
  label: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  statusChip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  statusChipText: { fontSize: 13, fontWeight: '600' },
  apiError: {
    color: colors.danger,
    backgroundColor: colors.dangerLight,
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
    fontSize: 13,
  },
  saveButton: { marginTop: 6 },
});
