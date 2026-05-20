import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/api';
import { format } from 'date-fns';

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  pending: { bg: '#fef3c7', text: '#92400e', icon: '⏳' },
  confirmed: { bg: '#dcfce7', text: '#166534', icon: '✅' },
  cancelled: { bg: '#fee2e2', text: '#991b1b', icon: '❌' },
};

export default function TrackAppointmentsScreen() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await api.get('/api/appointments');
      setAppointments(res.data);
    } catch {
      // handle
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} size="large" color="#16a34a" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAppointments(); }} tintColor="#16a34a" />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyTitle}>No appointments yet</Text>
            <TouchableOpacity style={styles.bookBtn} onPress={() => router.push('/appointments/book')}>
              <Text style={styles.bookBtnText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          const status = STATUS_COLORS[item.status] || STATUS_COLORS.pending;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.petName}>{item.pet_name}</Text>
                  <Text style={styles.petType}>{item.pet_type} • {item.gender}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                  <Text style={[styles.statusText, { color: status.text }]}>
                    {status.icon} {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={14} color="#6b7280" />
                <Text style={styles.detailText}>{item.time_slot}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={14} color="#6b7280" />
                <Text style={styles.detailText}>{item.owner_name} • {item.owner_number}</Text>
              </View>
              {item.created_at && (
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                  <Text style={styles.detailText}>
                    Booked on {format(new Date(item.created_at), 'dd MMM yyyy')}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  petName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  petType: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  detailText: { fontSize: 13, color: '#374151' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, color: '#6b7280', marginBottom: 16 },
  bookBtn: { backgroundColor: '#16a34a', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 },
  bookBtnText: { color: '#fff', fontWeight: '700' },
});
