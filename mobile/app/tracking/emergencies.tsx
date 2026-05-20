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

export default function TrackEmergenciesScreen() {
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEmergencies = useCallback(async () => {
    try {
      const res = await api.get('/api/medical-emergency/me');
      setEmergencies(res.data);
    } catch {
      // handle
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchEmergencies(); }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} size="large" color="#dc2626" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={emergencies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchEmergencies(); }} tintColor="#dc2626" />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🏥</Text>
            <Text style={styles.emptyTitle}>No emergencies reported</Text>
            <TouchableOpacity style={styles.reportBtn} onPress={() => router.push('/emergency/report')}>
              <Text style={styles.reportBtnText}>Report Emergency</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <Ionicons name="warning" size={20} color="#dc2626" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.phone}>{item.mobile_number}</Text>
                <Text style={styles.date}>
                  {item.created_at ? format(new Date(item.created_at), 'dd MMM yyyy, hh:mm a') : ''}
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: item.status === 'resolved' ? '#dcfce7' : '#fee2e2' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: item.status === 'resolved' ? '#166534' : '#991b1b' }
                ]}>
                  {item.status === 'resolved' ? '✅ Resolved' : '⏳ Pending'}
                </Text>
              </View>
            </View>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  list: { padding: 16 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone: { fontSize: 15, fontWeight: '600', color: '#111827' },
  date: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  description: { fontSize: 14, color: '#374151', lineHeight: 20 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, color: '#6b7280', marginBottom: 16 },
  reportBtn: { backgroundColor: '#dc2626', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 },
  reportBtnText: { color: '#fff', fontWeight: '700' },
});
