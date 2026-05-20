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

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pending: { bg: '#fef3c7', text: '#92400e' },
  Accepted: { bg: '#dbeafe', text: '#1e40af' },
  'On the Way': { bg: '#ede9fe', text: '#5b21b6' },
  Completed: { bg: '#dcfce7', text: '#166534' },
  Cancelled: { bg: '#fee2e2', text: '#991b1b' },
};

export default function TrackPetCabsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await api.get('/api/pet-cabs');
      setBookings(res.data);
    } catch {
      // handle
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} size="large" color="#7c3aed" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchBookings(); }} tintColor="#7c3aed" />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🚕</Text>
            <Text style={styles.emptyTitle}>No cab bookings yet</Text>
            <TouchableOpacity style={styles.bookBtn} onPress={() => router.push('/pet-cabs/book')}>
              <Text style={styles.bookBtnText}>Book a Cab</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          const status = STATUS_COLORS[item.status] || STATUS_COLORS.Pending;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.bookingId}>{item.id}</Text>
                  <Text style={styles.petInfo}>{item.number_of_pets}x {item.pet_type}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                  <Text style={[styles.statusText, { color: status.text }]}>{item.status}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.routeRow}>
                <View style={styles.routePoint}>
                  <View style={[styles.dot, { backgroundColor: '#16a34a' }]} />
                  <Text style={styles.routeText} numberOfLines={2}>{item.pickup_location}</Text>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routePoint}>
                  <View style={[styles.dot, { backgroundColor: '#dc2626' }]} />
                  <Text style={styles.routeText} numberOfLines={2}>{item.drop_location}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={14} color="#6b7280" />
                <Text style={styles.detailText}>{item.pickup_date} at {item.pickup_time}</Text>
              </View>
              {item.driver_details && (
                <View style={styles.driverCard}>
                  <Ionicons name="person-circle" size={16} color="#7c3aed" />
                  <Text style={styles.driverText}>{item.driver_details}</Text>
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
  bookingId: { fontSize: 13, fontWeight: '700', color: '#7c3aed' },
  petInfo: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 10 },
  routeRow: { marginBottom: 10 },
  routePoint: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 3 },
  routeText: { flex: 1, fontSize: 13, color: '#374151' },
  routeLine: { width: 2, height: 16, backgroundColor: '#e5e7eb', marginLeft: 4, marginVertical: 2 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  detailText: { fontSize: 13, color: '#374151' },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ede9fe',
    borderRadius: 8,
    padding: 10,
    gap: 6,
    marginTop: 8,
  },
  driverText: { flex: 1, fontSize: 13, color: '#5b21b6' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, color: '#6b7280', marginBottom: 16 },
  bookBtn: { backgroundColor: '#7c3aed', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 },
  bookBtnText: { color: '#fff', fontWeight: '700' },
});
