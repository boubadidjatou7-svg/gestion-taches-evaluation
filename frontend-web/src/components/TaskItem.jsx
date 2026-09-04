import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium transition-colors"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-gray-800 break-words">{task.title}</h3>
          <StatusBadge status={task.status} />
        </div>
        {task.description && (
          <p className="text-sm text-gray-500 mt-1 break-words">{task.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">Créée le {formattedDate}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setEditing(true)}
          aria-label="Modifier la tâche"
          title="Modifier"
          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
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
