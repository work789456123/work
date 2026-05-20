import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import api, { BASE_URL } from '@/lib/api';

export default function DoctorsScreen() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDoctors = useCallback(async () => {
    try {
      const res = await api.get('/api/doctors');
      setDoctors(res.data);
    } catch {
      // handle
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchDoctors(); }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} size="large" color="#7c3aed" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={doctors}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchDoctors(); }} tintColor="#7c3aed" />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>👨‍⚕️</Text>
            <Text style={styles.emptyTitle}>No doctors listed yet</Text>
          </View>
        }
        renderItem={({ item }) => {
          const imgUrl = item.image
            ? (item.image.startsWith('http') ? item.image : `${BASE_URL}/${item.image}`)
            : null;
          return (
            <View style={styles.card}>
              <View style={styles.cardLeft}>
                {imgUrl ? (
                  <Image source={{ uri: imgUrl }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={28} color="#9ca3af" />
                  </View>
                )}
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.specialty}>{item.specialty}</Text>
                {item.experience && (
                  <Text style={styles.detail}>{item.experience} experience</Text>
                )}
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Text style={styles.rating}>{item.rating || 'N/A'}</Text>
                  {item.reviews && <Text style={styles.reviews}>({item.reviews} reviews)</Text>}
                </View>
                {item.consultation_fee && (
                  <Text style={styles.fee}>₹{item.consultation_fee} / consultation</Text>
                )}
                {item.languages && (
                  <Text style={styles.languages}>🗣 {item.languages}</Text>
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
  card: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: {},
  avatar: { width: 64, height: 64, borderRadius: 32 },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#111827' },
  specialty: { fontSize: 13, color: '#7c3aed', fontWeight: '600', marginTop: 2 },
  detail: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  rating: { fontSize: 13, fontWeight: '600', color: '#111827' },
  reviews: { fontSize: 12, color: '#9ca3af' },
  fee: { fontSize: 13, color: '#16a34a', fontWeight: '600', marginTop: 4 },
  languages: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, color: '#6b7280' },
});
