import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { statusColors } from '../utils/colors';

export default function StatusBadge({ status }) {
  const style = statusColors[status] || statusColors['En attente'];

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Ionicons name={style.icon} size={13} color={style.text} />
      <Text style={[styles.text, { color: style.text }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12, fontWeight: '600' },
});
