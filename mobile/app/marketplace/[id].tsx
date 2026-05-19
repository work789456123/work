import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import api, { BASE_URL } from '@/lib/api';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} size="large" color="#0891b2" />;
  if (!product) return <View style={styles.centered}><Text>Product not found</Text></View>;

  const getUrl = (path: string | null) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `${BASE_URL}/${path}`;
  };

  const img1 = getUrl(product.image1);
  const img2 = getUrl(product.image2);

  return (
    <ScrollView style={styles.container}>
      {img1 && <Image source={{ uri: img1 }} style={styles.mainImage} resizeMode="cover" />}
      {img2 && <Image source={{ uri: img2 }} style={styles.mainImage} resizeMode="cover" />}

      <View style={styles.content}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{product.category}</Text>
        </View>
        <Text style={styles.name}>{product.name}</Text>
        {product.description && (
          <Text style={styles.description}>{product.description}</Text>
        )}

        <View style={styles.divider} />

        <Text style={styles.contactLabel}>Contact Seller</Text>
        <TouchableOpacity
          style={styles.contactBtn}
          onPress={() => Linking.openURL(`tel:${product.contact}`)}
        >
          <Ionicons name="call" size={18} color="#fff" />
          <Text style={styles.contactBtnText}>{product.contact}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mainImage: { width: '100%', height: 250 },
  content: { padding: 20 },
  categoryBadge: {
    backgroundColor: '#cffafe',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoryText: { fontSize: 12, fontWeight: '600', color: '#0891b2', textTransform: 'uppercase' },
  name: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 10 },
  description: { fontSize: 15, color: '#6b7280', lineHeight: 22 },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 20 },
  contactLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 10 },
  contactBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  contactBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
