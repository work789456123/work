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
import api from '@/lib/api';
import Toast from 'react-native-toast-message';

const PRIORITIES = ['low', 'medium', 'high'];

export default function NewComplaintScreen() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    symptoms: '',
    priority: 'low',
  });
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      Toast.show({ type: 'error', text1: 'Title and description are required' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/complaints', form);
      Toast.show({ type: 'success', text1: 'Complaint submitted!' });
      router.back();
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.detail || 'Submission failed' });
    } finally {
      setLoading(false);
    }
  };

  const PRIORITY_COLORS: Record<string, string> = {
    low: '#16a34a',
    medium: '#d97706',
    high: '#dc2626',
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.label}>Title *</Text>
        <TextInput style={styles.input} placeholder="Brief description of the issue"
          placeholderTextColor="#9ca3af" value={form.title} onChangeText={(v) => update('title', v)} />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Detailed description..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
          value={form.description}
          onChangeText={(v) => update('description', v)}
        />

        <Text style={styles.label}>Symptoms (optional)</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="List any symptoms observed..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={3}
          value={form.symptoms}
          onChangeText={(v) => update('symptoms', v)}
        />

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.priorityBtn,
                form.priority === p && { backgroundColor: PRIORITY_COLORS[p], borderColor: PRIORITY_COLORS[p] },
              ]}
              onPress={() => update('priority', p)}
            >
              <Text style={[styles.priorityText, form.priority === p && { color: '#fff' }]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit Complaint</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  card: {
    backgroundColor: '#fff',
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
  textarea: { height: 90, textAlignVertical: 'top' },
  priorityRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  priorityBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  priorityText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  submitBtn: {
    backgroundColor: '#0891b2',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
