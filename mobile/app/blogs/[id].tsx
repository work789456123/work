import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import api, { BASE_URL } from '@/lib/api';
import Markdown from 'react-native-markdown-display';
import { format } from 'date-fns';

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/blogs/${id}`)
      .then((res) => setBlog(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} size="large" color="#059669" />;
  if (!blog) return <View style={styles.centered}><Text>Blog not found</Text></View>;

  const imgUrl = blog.cover_image_url
    ? (blog.cover_image_url.startsWith('http') ? blog.cover_image_url : `${BASE_URL}/${blog.cover_image_url}`)
    : null;

  return (
    <ScrollView style={styles.container}>
      {imgUrl && <Image source={{ uri: imgUrl }} style={styles.coverImage} resizeMode="cover" />}
      <View style={styles.content}>
        <Text style={styles.title}>{blog.title}</Text>
        {blog.created_at && (
          <Text style={styles.date}>{format(new Date(blog.created_at), 'dd MMMM yyyy')}</Text>
        )}
        {blog.description && <Text style={styles.description}>{blog.description}</Text>}
        <View style={styles.divider} />
        <Markdown style={markdownStyles}>{blog.content || ''}</Markdown>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  coverImage: { width: '100%', height: 220 },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', lineHeight: 30, marginBottom: 8 },
  date: { fontSize: 13, color: '#9ca3af', marginBottom: 10 },
  description: { fontSize: 15, color: '#6b7280', lineHeight: 22, marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginBottom: 16 },
});

const markdownStyles = {
  body: { fontSize: 15, color: '#374151', lineHeight: 24 },
  heading1: { fontSize: 20, fontWeight: '700' as const, color: '#111827', marginTop: 16 },
  heading2: { fontSize: 18, fontWeight: '700' as const, color: '#111827', marginTop: 14 },
  strong: { fontWeight: '700' as const },
  bullet_list: { marginLeft: 8 },
};
