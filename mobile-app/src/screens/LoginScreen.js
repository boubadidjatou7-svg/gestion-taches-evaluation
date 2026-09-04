import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import { isValidEmail, isRequired } from '../utils/validators';
import { colors } from '../utils/colors';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    const nextErrors = {};
    if (!isRequired(email)) nextErrors.email = "L'email est requis";
    else if (!isValidEmail(email)) nextErrors.email = "Format d'email invalide";
    if (!isRequired(password)) nextErrors.password = 'Le mot de passe est requis';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email.trim(), password);
      // Pas de navigation manuelle ici : AppNavigator bascule automatiquement
      // vers la pile "TaskList" dès que le contexte détecte un token valide.
    } catch (err) {
      if (err.response) {
        // Le serveur a répondu avec un code d'erreur (ex: 401 identifiants invalides)
        setApiError(err.response.data?.message || 'Email ou mot de passe incorrect');
      } else if (err.request) {
        // La requête est partie mais aucune réponse n'est revenue (serveur injoignable)
        setApiError("Impossible de joindre le serveur. Vérifie ta connexion et l'URL de l'API.");
      } else {
        setApiError('Une erreur inattendue est survenue.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Gestion des Tâches</Text>
        <Text style={styles.subtitle}>Connecte-toi pour continuer</Text>

        <FormInput
          label="Email"
          placeholder="vous@exemple.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <FormInput
          label="Mot de passe"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />

        {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}

        <PrimaryButton title="Se connecter" onPress={handleSubmit} loading={loading} style={styles.button} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 6, marginBottom: 28 },
  apiError: {
    color: colors.danger,
    backgroundColor: colors.dangerLight,
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
    fontSize: 13,
  },
  button: { marginTop: 6 },
});
