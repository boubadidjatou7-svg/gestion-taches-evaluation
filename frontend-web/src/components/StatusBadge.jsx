import { Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

const STYLES = {
  'En attente': { classes: 'bg-gray-100 text-gray-700', border: 'border-gray-400', Icon: Clock },
  'En cours': { classes: 'bg-amber-100 text-amber-800', border: 'border-amber-400', Icon: RefreshCw },
  'Terminé': { classes: 'bg-emerald-100 text-emerald-800', border: 'border-emerald-400', Icon: CheckCircle2 },
};

// Couleur de bordure accentuée par statut, réutilisée par TaskItem pour un liseré coloré sur chaque carte.
export function getStatusAccent(status) {
  return (STYLES[status] || STYLES['En attente']).border;
}

export default function StatusBadge({ status }) {
  const { classes, Icon } = STYLES[status] || { classes: 'bg-gray-100 text-gray-800', Icon: Clock };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${classes}`}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}
