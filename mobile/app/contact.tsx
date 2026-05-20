import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/api';
import Toast from 'react-native-toast-message';

export default function ContactScreen() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      Toast.show({ type: 'error', text1: 'Please fill all fields' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/contact', form);
      Toast.show({ type: 'success', text1: 'Message sent!', text2: 'We will get back to you soon.' });
      router.back();
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.detail || 'Failed to send message' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Ionicons name="mail" size={32} color="#16a34a" />
        <Text style={styles.title}>Get in Touch</Text>
        <Text style={styles.sub}>We'd love to hear from you</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Your Name</Text>
        <TextInput style={styles.input} placeholder="Full name" placeholderTextColor="#9ca3af"
          value={form.name} onChangeText={(v) => update('name', v)} />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor="#9ca3af"
          keyboardType="email-address" autoCapitalize="none"
          value={form.email} onChangeText={(v) => update('email', v)} />
        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="How can we help you?"
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={5}
          value={form.message}
          onChangeText={(v) => update('message', v)}
        />
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (
            <>
              <Ionicons name="send" size={16} color="#fff" />
              <Text style={styles.submitText}>Send Message</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { alignItems: 'center', padding: 32, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginTop: 10 },
  sub: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 11,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#f9fafb',
    marginBottom: 14,
  },
  textarea: { height: 110, textAlignVertical: 'top' },
  submitBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
