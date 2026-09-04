import { useEffect, useState } from 'react';
import { LogOut, ListChecks } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

function extractErrorMessage(err, fallback) {
  if (err.response) return err.response.data?.message || fallback;
  if (err.request) return 'Impossible de joindre le serveur. Vérifie ta connexion.';
  return fallback;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [toast, setToast] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  function showToast(type, message) {
    setToast({ type, message });
  }

  async function fetchTasks() {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
      setLoadError('');
    } catch (err) {
      setLoadError('Impossible de charger les tâches. Vérifie ta connexion.');
    } finally {
      setLoading(false);
    }
  }

  // Chaque handler rethrow après avoir affiché le toast : le composant appelant
  // (TaskForm/TaskItem) intercepte cette erreur pour préserver son état local
  // (ne pas vider le formulaire, rester en mode édition) sans planter la promesse.
  async function handleAddTask(taskData) {
    try {
      const { data } = await api.post('/tasks', taskData);
      setTasks((prev) => [
        { ...taskData, id: data.taskId, status: 'En attente', created_at: new Date().toISOString() },
        ...prev,
      ]);
      showToast('success', 'Tâche créée avec succès.');
    } catch (err) {
      showToast('error', extractErrorMessage(err, 'La création de la tâche a échoué.'));
      throw err;
    }
  }

  async function handleUpdateTask(id, updatedData) {
    try {
      await api.put(`/tasks/${id}`, updatedData);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t)));
      showToast('success', 'Tâche mise à jour avec succès.');
    } catch (err) {
      showToast('error', extractErrorMessage(err, 'La mise à jour de la tâche a échoué.'));
      throw err;
    }
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      await api.delete(`/tasks/${taskToDelete.id}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      showToast('success', 'Tâche supprimée avec succès.');
      setTaskToDelete(null);
    } catch (err) {
      showToast('error', extractErrorMessage(err, 'La suppression a échoué.'));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-gradient-to-r from-cyan-600 to-blue-600 shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <ListChecks size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">Mes tâches</h1>
              {user && <p className="text-sm text-cyan-100">Connecté en tant que {user.full_name}</p>}
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg text-white/90 hover:bg-white/15 transition-colors"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <TaskForm onSubmit={handleAddTask} />

        {loadError && (
          <p className="text-sm text-red-400 bg-red-950/50 rounded-md px-3 py-2">{loadError}</p>
        )}

        {loading ? (
          <p className="text-center text-gray-400 py-8">Chargement...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Aucune tâche pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={handleUpdateTask}
                onRequestDelete={setTaskToDelete}
              />
            ))}
          </div>
        )}
      </main>

      <ConfirmDialog
        open={taskToDelete !== null}
        title="Supprimer la tâche"
        message={taskToDelete ? `Supprimer "${taskToDelete.title}" ? Cette action est irréversible.` : ''}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
