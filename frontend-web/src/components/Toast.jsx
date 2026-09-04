import { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

const STYLES = {
  success: { bg: 'bg-green-600', icon: CheckCircle2 },
  error: { bg: 'bg-red-600', icon: XCircle },
};

// Notification flottante auto-disparaissante, utilisée à la place des alert()
// pour confirmer le succès/échec des actions (création, modification, suppression).
export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { bg, icon: Icon } = STYLES[toast.type] || STYLES.success;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`${bg} text-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 max-w-sm`}>
        <Icon size={20} className="shrink-0" />
        <p className="text-sm font-medium">{toast.message}</p>
        <button onClick={onClose} className="shrink-0 opacity-80 hover:opacity-100">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
