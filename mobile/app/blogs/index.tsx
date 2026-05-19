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
import api, { BASE_URL } from '@/lib/api';
import { format } from 'date-fns';

export default function BlogsScreen() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await api.get('/api/blogs');
      setBlogs(res.data);
    } catch {
      // handle
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchBlogs(); }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} size="large" color="#059669" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={blogs}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchBlogs(); }} tintColor="#059669" />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📰</Text>
            <Text style={styles.emptyTitle}>No blogs yet</Text>
          </View>
        }
        renderItem={({ item }) => {
          const imgUrl = item.cover_image_url
            ? (item.cover_image_url.startsWith('http') ? item.cover_image_url : `${BASE_URL}/${item.cover_image_url}`)
            : null;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/blogs/${item.id}`)}
            >
              {imgUrl && (
                <Image source={{ uri: imgUrl }} style={styles.cardImage} resizeMode="cover" />
              )}
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                {item.description && (
                  <Text style={styles.cardDesc} numberOfLines={3}>{item.description}</Text>
                )}
                {item.created_at && (
                  <Text style={styles.cardDate}>
                    {format(new Date(item.created_at), 'dd MMM yyyy')}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: { width: '100%', height: 180 },
  cardBody: { padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: '#6b7280', lineHeight: 20, marginBottom: 8 },
  cardDate: { fontSize: 12, color: '#9ca3af' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, color: '#6b7280' },
});
