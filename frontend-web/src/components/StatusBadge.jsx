import { Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

const STYLES = {
  'En attente': { classes: 'bg-yellow-100 text-yellow-800', Icon: Clock },
  'En cours': { classes: 'bg-blue-100 text-blue-800', Icon: RefreshCw },
  'Terminé': { classes: 'bg-green-100 text-green-800', Icon: CheckCircle2 },
};

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
