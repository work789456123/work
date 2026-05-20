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

const PET_TYPES = ['Dog', 'Cat', 'Cow', 'Buffalo', 'Goat', 'Sheep', 'Horse', 'Poultry', 'Other'];
const GENDERS = ['Male', 'Female'];
const TIME_SLOTS = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
];

export default function BookAppointmentScreen() {
  const [form, setForm] = useState({
    pet_name: '',
    pet_type: '',
    gender: '',
    age: '',
    weight: '',
    owner_name: '',
    owner_number: '',
    time_slot: '',
    medical_history: '',
    vaccination_status: 'Unknown',
  });
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.pet_name || !form.pet_type || !form.owner_name || !form.owner_number || !form.time_slot) {
      Toast.show({ type: 'error', text1: 'Please fill all required fields' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/appointments', form);
      Toast.show({ type: 'success', text1: 'Appointment booked!', text2: 'You will receive a confirmation email.' });
      router.back();
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.detail || 'Booking failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={18} color="#2563eb" />
        <Text style={styles.infoText}>
          After booking, our team will confirm via email. Slack notification sent to admin.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pet Details</Text>

        <Text style={styles.label}>Pet Name *</Text>
        <TextInput style={styles.input} placeholder="e.g. Tommy" placeholderTextColor="#9ca3af"
          value={form.pet_name} onChangeText={(v) => update('pet_name', v)} />

        <Text style={styles.label}>Pet Type *</Text>
        <View style={styles.chipRow}>
          {PET_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.chip, form.pet_type === t && styles.chipActive]}
              onPress={() => update('pet_type', t)}
            >
              <Text style={[styles.chipText, form.pet_type === t && styles.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Gender *</Text>
        <View style={styles.chipRow}>
          {GENDERS.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.chip, form.gender === g && styles.chipActive]}
              onPress={() => update('gender', g)}
            >
              <Text style={[styles.chipText, form.gender === g && styles.chipTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Age</Text>
            <TextInput style={styles.input} placeholder="e.g. 2 years" placeholderTextColor="#9ca3af"
              value={form.age} onChangeText={(v) => update('age', v)} />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput style={styles.input} placeholder="e.g. 15" placeholderTextColor="#9ca3af"
              keyboardType="numeric" value={form.weight} onChangeText={(v) => update('weight', v)} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Owner Details</Text>

        <Text style={styles.label}>Owner Name *</Text>
        <TextInput style={styles.input} placeholder="Your full name" placeholderTextColor="#9ca3af"
          value={form.owner_name} onChangeText={(v) => update('owner_name', v)} />

        <Text style={styles.label}>Phone Number *</Text>
        <TextInput style={styles.input} placeholder="+91 9876543210" placeholderTextColor="#9ca3af"
          keyboardType="phone-pad" value={form.owner_number} onChangeText={(v) => update('owner_number', v)} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appointment Details</Text>

        <Text style={styles.label}>Preferred Time Slot *</Text>
        {TIME_SLOTS.map((slot) => (
          <TouchableOpacity
            key={slot}
            style={[styles.slotRow, form.time_slot === slot && styles.slotRowActive]}
            onPress={() => update('time_slot', slot)}
          >
            <Ionicons
              name={form.time_slot === slot ? 'radio-button-on' : 'radio-button-off'}
              size={18}
              color={form.time_slot === slot ? '#16a34a' : '#9ca3af'}
            />
            <Text style={[styles.slotText, form.time_slot === slot && styles.slotTextActive]}>{slot}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Medical History (optional)</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Any previous conditions, medications..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={3}
          value={form.medical_history}
          onChangeText={(v) => update('medical_history', v)}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="calendar-check" size={18} color="#fff" />
            <Text style={styles.submitText}>Book Appointment</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#dbeafe',
    margin: 16,
    borderRadius: 10,
    padding: 12,
    gap: 8,
    alignItems: 'flex-start',
  },
  infoText: { flex: 1, fontSize: 13, color: '#1e40af' },
  section: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 11,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#f9fafb',
    marginBottom: 12,
  },
  textarea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 10 },
  halfField: { flex: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f9fafb',
  },
  chipActive: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  chipText: { fontSize: 13, color: '#374151' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
    gap: 10,
    backgroundColor: '#f9fafb',
  },
  slotRowActive: { borderColor: '#16a34a', backgroundColor: '#f0fdf4' },
  slotText: { fontSize: 14, color: '#374151' },
  slotTextActive: { color: '#16a34a', fontWeight: '600' },
  submitBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
