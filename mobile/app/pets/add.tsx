import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/api';
import Toast from 'react-native-toast-message';

const PET_TYPES = ['Dog', 'Cat', 'Cow', 'Buffalo', 'Goat', 'Sheep', 'Horse', 'Poultry', 'Other'];

export default function MyPetsScreen() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', pet_type: '', age: '', gender: '', weight: '' });

  const fetchPets = useCallback(async () => {
    try {
      const res = await api.get('/api/pets');
      setPets(res.data);
    } catch {
      // handle
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchPets(); }, []);

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleAdd = async () => {
    if (!form.name.trim() || !form.pet_type) {
      Toast.show({ type: 'error', text1: 'Pet name and type are required' });
      return;
    }
    setSaving(true);
    try {
      await api.post('/api/pets', form);
      Toast.show({ type: 'success', text1: 'Pet added!' });
      setForm({ name: '', pet_type: '', age: '', gender: '', weight: '' });
      setShowForm(false);
      fetchPets();
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.detail || 'Failed to add pet' });
    } finally {
      setSaving(false);
    }
  };

  const PET_EMOJIS: Record<string, string> = {
    Dog: '🐕', Cat: '🐈', Cow: '🐄', Buffalo: '🐃', Goat: '🐐',
    Sheep: '🐑', Horse: '🐎', Poultry: '🐔', Other: '🐾',
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPets(); }} tintColor="#d97706" />
        }
        ListHeaderComponent={
          <>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setShowForm(!showForm)}
            >
              <Ionicons name={showForm ? 'close' : 'add'} size={20} color="#fff" />
              <Text style={styles.addBtnText}>{showForm ? 'Cancel' : 'Add New Pet'}</Text>
            </TouchableOpacity>

            {showForm && (
              <View style={styles.form}>
                <Text style={styles.formTitle}>Add a Pet</Text>
                <Text style={styles.label}>Pet Name *</Text>
                <TextInput style={styles.input} placeholder="e.g. Tommy" placeholderTextColor="#9ca3af"
                  value={form.name} onChangeText={(v) => update('name', v)} />
                <Text style={styles.label}>Pet Type *</Text>
                <View style={styles.chipRow}>
                  {PET_TYPES.map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.chip, form.pet_type === t && styles.chipActive]}
                      onPress={() => update('pet_type', t)}
                    >
                      <Text style={[styles.chipText, form.pet_type === t && styles.chipTextActive]}>
                        {PET_EMOJIS[t]} {t}
                      </Text>
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
                    <Text style={styles.label}>Gender</Text>
                    <TextInput style={styles.input} placeholder="Male/Female" placeholderTextColor="#9ca3af"
                      value={form.gender} onChangeText={(v) => update('gender', v)} />
                  </View>
                </View>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput style={styles.input} placeholder="e.g. 15" placeholderTextColor="#9ca3af"
                  keyboardType="numeric" value={form.weight} onChangeText={(v) => update('weight', v)} />
                <TouchableOpacity
                  style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                  onPress={handleAdd}
                  disabled={saving}
                >
                  {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Pet</Text>}
                </TouchableOpacity>
              </View>
            )}

            {pets.length > 0 && <Text style={styles.sectionTitle}>My Pets ({pets.length})</Text>}
          </>
        }
        ListEmptyComponent={
          !showForm ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🐾</Text>
              <Text style={styles.emptyTitle}>No pets added yet</Text>
              <Text style={styles.emptySub}>Add your pets to get personalized care</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.petCard}>
            <Text style={styles.petEmoji}>{PET_EMOJIS[item.pet_type] || '🐾'}</Text>
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{item.name}</Text>
              <Text style={styles.petDetails}>
                {item.pet_type}
                {item.gender ? ` • ${item.gender}` : ''}
                {item.age ? ` • ${item.age}` : ''}
                {item.weight ? ` • ${item.weight}kg` : ''}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  list: { padding: 16 },
  addBtn: {
    backgroundColor: '#d97706',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 14 },
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
  row: { flexDirection: 'row', gap: 10 },
  halfField: { flex: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f9fafb',
  },
  chipActive: { backgroundColor: '#d97706', borderColor: '#d97706' },
  chipText: { fontSize: 12, color: '#374151' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  saveBtn: {
    backgroundColor: '#d97706',
    borderRadius: 8,
    padding: 13,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#6b7280', marginBottom: 10, textTransform: 'uppercase' },
  petCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  petEmoji: { fontSize: 32 },
  petInfo: { flex: 1 },
  petName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  petDetails: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#374151' },
  emptySub: { fontSize: 13, color: '#9ca3af', marginTop: 4 },
});
