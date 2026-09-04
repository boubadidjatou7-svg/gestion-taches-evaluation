import { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import TaskCard from '../components/TaskCard';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { getTasks, deleteTask } from '../api/taskService';
import { colors } from '../utils/colors';

export default function TaskListScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Recharge la liste chaque fois que l'écran redevient actif (retour depuis
  // création/édition), pas seulement au premier montage du composant.
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  async function fetchTasks() {
    setError('');
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError('Impossible de charger les tâches. Vérifie ta connexion.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function onRefresh() {
    setRefreshing(true);
    fetchTasks();
  }

  function confirmDelete(task) {
    Alert.alert(
      'Supprimer la tâche',
      `Supprimer "${task.title}" ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => handleDelete(task.id) },
      ]
    );
  }

  async function handleDelete(id) {
    const previousTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id)); // suppression optimiste
    try {
      await deleteTask(id);
    } catch (err) {
      setTasks(previousTasks); // rollback si l'API échoue
      Alert.alert('Erreur', 'La suppression a échoué. Réessaie.');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mes tâches</Text>
          {user ? <Text style={styles.subtitle}>{user.full_name}</Text> : null}
        </View>
        <TouchableOpacity onPress={logout} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="log-out-outline" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.empty}>Aucune tâche pour le moment.</Text>}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onPress={() => navigation.navigate('TaskEdit', { task: item })}
              onDelete={() => confirmDelete(item)}
            />
          )}
        />
      )}

      <PrimaryButton
        title="+ Nouvelle tâche"
        onPress={() => navigation.navigate('TaskCreate')}
        style={styles.newButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  title: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  errorBanner: {
    color: colors.danger,
    backgroundColor: colors.dangerLight,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 13,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { flexGrow: 1, paddingBottom: 80 },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },
  newButton: { position: 'absolute', left: 16, right: 16, bottom: 20 },
});
