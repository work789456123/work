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

export default function ReportEmergencyScreen() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!mobileNumber.trim() || !description.trim()) {
      Toast.show({ type: 'error', text1: 'Please fill all fields' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/medical-emergency', {
        mobile_number: mobileNumber.trim(),
        description: description.trim(),
      });
      Toast.show({
        type: 'success',
        text1: 'Emergency reported!',
        text2: 'Our team has been notified and will contact you shortly.',
      });
      router.back();
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.detail || 'Failed to report emergency' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Alert Banner */}
      <View style={styles.alertBanner}>
        <Ionicons name="warning" size={24} color="#fff" />
        <View style={{ flex: 1 }}>
          <Text style={styles.alertTitle}>Medical Emergency</Text>
          <Text style={styles.alertSub}>
            Our team will be notified immediately via Slack and will contact you ASAP.
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Your Mobile Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="+91 9876543210"
          placeholderTextColor="#9ca3af"
          keyboardType="phone-pad"
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />

        <Text style={styles.label}>Describe the Emergency *</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Describe your pet's symptoms, condition, and any relevant details..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={6}
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="warning" size={18} color="#fff" />
              <Text style={styles.submitText}>Report Emergency Now</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>While you wait:</Text>
        {[
          'Keep your pet calm and comfortable',
          'Do not give any medication without vet advice',
          'Note down symptoms and when they started',
          'Have your pet\'s vaccination records ready',
        ].map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  alertBanner: {
    backgroundColor: '#dc2626',
    padding: 20,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  alertTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  alertSub: { fontSize: 13, color: '#fecaca', marginTop: 4 },
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
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#f9fafb',
    marginBottom: 16,
  },
  textarea: { height: 120, textAlignVertical: 'top' },
  submitBtn: {
    backgroundColor: '#dc2626',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  tipsCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 32,
  },
  tipsTitle: { fontSize: 14, fontWeight: '700', color: '#92400e', marginBottom: 10 },
  tipRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  tipBullet: { color: '#d97706', fontWeight: '700' },
  tipText: { flex: 1, fontSize: 13, color: '#78350f' },
});
