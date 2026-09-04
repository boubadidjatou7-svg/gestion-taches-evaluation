// Palette de couleurs centralisée pour une UI cohérente sur tous les écrans.
export const colors = {
  primary: '#2563eb',
  danger: '#dc2626',
  dangerLight: '#fee2e2',
  success: '#16a34a',
  successLight: '#dcfce7',
  warning: '#ca8a04',
  warningLight: '#fef9c3',
  info: '#2563eb',
  infoLight: '#dbeafe',
  background: '#f3f4f6',
  surface: '#ffffff',
  border: '#d1d5db',
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  textOnPrimary: '#ffffff',
};

// Couleur + icône associées à chaque statut de tâche (utilisé par StatusBadge et TaskEditScreen).
export const statusColors = {
  'En attente': { bg: colors.warningLight, text: colors.warning, icon: 'time-outline' },
  'En cours': { bg: colors.infoLight, text: colors.info, icon: 'sync-outline' },
  'Terminé': { bg: colors.successLight, text: colors.success, icon: 'checkmark-circle-outline' },
};
