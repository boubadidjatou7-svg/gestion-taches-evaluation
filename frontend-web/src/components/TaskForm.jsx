import { useState } from 'react';

export default function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({ title, description });
      setTitle('');
      setDescription('');
    } catch {
      // Échec affiché via le toast du Dashboard ; on garde le contenu du formulaire.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-3"
    >
      <input
        type="text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre de la tâche"
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optionnel)"
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg px-5 py-2 whitespace-nowrap transition-colors"
      >
        + Ajouter
      </button>
    </form>
  );
}
