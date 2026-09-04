import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge, { getStatusAccent } from './StatusBadge';

const STATUSES = ['En attente', 'En cours', 'Terminé'];

export default function TaskItem({ task, onUpdate, onRequestDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onUpdate(task.id, { title, description, status });
      setEditing(false);
    } catch {
      // L'erreur est déjà affichée via le toast du Dashboard ; on reste en édition.
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status);
    setEditing(false);
  }

  const formattedDate = new Date(task.created_at).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  if (editing) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 text-white font-semibold shadow-sm transition-all"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 border-l-4 ${getStatusAccent(task.status)} p-5 flex items-start justify-between gap-3 transition-shadow`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-gray-900 break-words">{task.title}</h3>
          <StatusBadge status={task.status} />
        </div>
        {task.description && (
          <p className="text-sm text-gray-500 mt-1.5 break-words">{task.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-2">Créée le {formattedDate}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setEditing(true)}
          aria-label="Modifier la tâche"
          title="Modifier"
          className="p-2 rounded-lg text-cyan-600 hover:bg-cyan-50 transition-colors"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => onRequestDelete(task)}
          aria-label="Supprimer la tâche"
          title="Supprimer"
          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
