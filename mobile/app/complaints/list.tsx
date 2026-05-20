import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/api';
import { format } from 'date-fns';

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  low: { bg: '#dcfce7', text: '#166534' },
  medium: { bg: '#fef3c7', text: '#92400e' },
  high: { bg: '#fee2e2', text: '#991b1b' },
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  OPEN: { bg: '#dbeafe', text: '#1e40af' },
  ASSIGNED: { bg: '#ede9fe', text: '#5b21b6' },
  IN_PROGRESS: { bg: '#fef3c7', text: '#92400e' },
  RESOLVED: { bg: '#dcfce7', text: '#166534' },
  CLOSED: { bg: '#f3f4f6', text: '#374151' },
};

export default function ComplaintsListScreen() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchComplaints = useCallback(async () => {
    try {
      const res = await api.get('/api/complaints');
      setComplaints(res.data);
    } catch {
      // handle
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchComplaints(); }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} size="large" color="#0891b2" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchComplaints(); }} tintColor="#0891b2" />
        }
        ListHeaderComponent={
          <TouchableOpacity style={styles.newBtn} onPress={() => router.push('/complaints/new')}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.newBtnText}>New Complaint</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No complaints submitted</Text>
          </View>
        }
        renderItem={({ item }) => {
          const priority = PRIORITY_COLORS[item.priority] || PRIORITY_COLORS.low;
          const status = STATUS_COLORS[item.status] || STATUS_COLORS.OPEN;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.ticketId}>{item.id}</Text>
                <View style={[styles.badge, { backgroundColor: status.bg }]}>
                  <Text style={[styles.badgeText, { color: status.text }]}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              {item.description && (
                <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
              )}
              <View style={styles.footer}>
                <View style={[styles.badge, { backgroundColor: priority.bg }]}>
                  <Text style={[styles.badgeText, { color: priority.text }]}>
                    {item.priority?.toUpperCase()} PRIORITY
                  </Text>
                </View>
                {item.created_at && (
                  <Text style={styles.date}>{format(new Date(item.created_at), 'dd MMM yyyy')}</Text>
                )}
              </View>
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
  newBtn: {
    backgroundColor: '#0891b2',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  newBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  ticketId: { fontSize: 12, fontWeight: '700', color: '#0891b2' },
  title: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 4 },
  desc: { fontSize: 13, color: '#6b7280', marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  date: { fontSize: 12, color: '#9ca3af' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, color: '#6b7280' },
});
