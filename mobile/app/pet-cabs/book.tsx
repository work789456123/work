import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/api';
import Toast from 'react-native-toast-message';

const PET_TYPES = ['Dog', 'Cat', 'Cow', 'Buffalo', 'Goat', 'Sheep', 'Other'];
const CAB_PREFS = ['AC', 'Non-AC', 'Any'];

const TRAVEL_CARDS = [
  { emoji: '🏥', title: 'Vet Visit', desc: 'Transport to veterinary clinic' },
  { emoji: '✈️', title: 'Airport Drop', desc: 'Pet-friendly airport transfer' },
  { emoji: '🏡', title: 'Home Relocation', desc: 'Moving with your pet' },
  { emoji: '🛁', title: 'Pet Grooming', desc: 'Drop to grooming center' },
];

const TRAVEL_PACKAGES = [
  { id: 1, title: 'Khatu Shyam Ji Darshan', subtitle: 'One day trip from Jaipur', duration: '1 day', price: 2199, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Khatu_Shyam_Temple.jpg/640px-Khatu_Shyam_Temple.jpg' },
  { id: 2, title: 'Salasar Balaji Darshan', subtitle: 'One day trip from Jaipur', duration: '1 day', price: 3999, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Salasar_Balaji_Temple.jpg/640px-Salasar_Balaji_Temple.jpg' },
  { id: 3, title: 'Khatu Shyam & Salasar Balaji', subtitle: 'Visit two divine temples', duration: '1 day', price: 4199, image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&q=80' },
  { id: 4, title: 'Triple Temple Tour', subtitle: 'Khatu Shyam, Jeen Mata & Salasar', duration: '1 day', price: 4699, image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=400&q=80' },
  { id: 5, title: 'Complete Religious Tour', subtitle: 'All major temples', duration: '1 day', price: 5799, image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=400&q=80' },
  { id: 6, title: 'Ranthambore', subtitle: 'Wildlife safari journey', duration: '1 day', price: 4499, image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&q=80' },
  { id: 7, title: 'Jaipur Darshan Special', subtitle: 'Best route - Full Mazaa', duration: '1 day', price: 2999, image: 'https://images.unsplash.com/photo-1477587458883-47145ed31459?w=400&q=80' },
  { id: 8, title: 'Udaipur', subtitle: 'City of Lakes journey', duration: '1 day', price: 8599, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80' },
  { id: 9, title: 'Jaipur to Delhi One Way', subtitle: 'One way journey', duration: '1 day', price: 3999, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80' },
  { id: 10, title: 'Jaipur to Gurgaon One Way', subtitle: 'One way journey', duration: '1 day', price: 3599, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80' },
];

interface QuickBookForm {
  owner_name: string;
  owner_number: string;
  pickup_location: string;
  pickup_date: string;
  pickup_time: string;
  pet_type: string;
}

export default function BookPetCabScreen() {
  const [form, setForm] = useState({
    owner_name: '',
    owner_number: '',
    pickup_location: '',
    drop_location: '',
    pickup_date: '',
    pickup_time: '',
    pet_type: '',
    pet_breed: '',
    number_of_pets: '1',
    cab_preference: 'Any',
    emergency_contact: '',
    additional_notes: '',
  });
  const [loading, setLoading] = useState(false);

  // Quick booking modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ title: string; subtitle?: string; price?: number } | null>(null);
  const [quickForm, setQuickForm] = useState<QuickBookForm>({
    owner_name: '',
    owner_number: '',
    pickup_location: '',
    pickup_date: '',
    pickup_time: '',
    pet_type: '',
  });
  const [quickLoading, setQuickLoading] = useState(false);

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateQuick = (key: keyof QuickBookForm, value: string) =>
    setQuickForm((prev) => ({ ...prev, [key]: value }));

  const openModal = (item: { title: string; subtitle?: string; price?: number }) => {
    setSelectedItem(item);
    setQuickForm({ owner_name: '', owner_number: '', pickup_location: '', pickup_date: '', pickup_time: '', pet_type: '' });
    setModalVisible(true);
  };

  const handleQuickSubmit = async () => {
    if (!quickForm.owner_name || !quickForm.owner_number || !quickForm.pickup_location || !quickForm.pickup_date || !quickForm.pickup_time || !quickForm.pet_type) {
      Toast.show({ type: 'error', text1: 'Please fill all required fields' });
      return;
    }
    setQuickLoading(true);
    try {
      await api.post('/api/pet-cabs', {
        owner_name: quickForm.owner_name,
        owner_number: quickForm.owner_number,
        pickup_location: quickForm.pickup_location,
        drop_location: selectedItem?.title || '',
        pickup_date: quickForm.pickup_date,
        pickup_time: quickForm.pickup_time,
        pet_type: quickForm.pet_type,
        number_of_pets: 1,
        cab_preference: 'Any',
        emergency_contact: quickForm.owner_number,
        additional_notes: selectedItem?.price ? `Package: ${selectedItem.title}. Price: ₹${selectedItem.price}` : `Trip type: ${selectedItem?.title}`,
      });
      setModalVisible(false);
      Toast.show({ type: 'success', text1: 'Cab booked!', text2: 'You will receive a confirmation shortly.' });
      router.back();
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.detail || 'Booking failed' });
    } finally {
      setQuickLoading(false);
    }
  };

  const handleSubmit = async () => {
    const required = ['owner_name', 'owner_number', 'pickup_location', 'drop_location', 'pickup_date', 'pickup_time', 'pet_type'];
    for (const field of required) {
      if (!form[field as keyof typeof form].trim()) {
        Toast.show({ type: 'error', text1: 'Please fill all required fields' });
        return;
      }
    }
    setLoading(true);
    try {
      await api.post('/api/pet-cabs', {
        ...form,
        number_of_pets: parseInt(form.number_of_pets) || 1,
      });
      Toast.show({ type: 'success', text1: 'Cab booked!', text2: 'You will receive a confirmation email.' });
      router.back();
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.detail || 'Booking failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.infoCard}>
          <Ionicons name="car" size={18} color="#7c3aed" />
          <Text style={styles.infoText}>
            Book a safe, comfortable cab for your pet. Admin will assign a driver and notify you.
          </Text>
        </View>

        {/* 4 Basic Trip Cards */}
        <Text style={styles.sectionHeading}>What's the trip for?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardScroll}>
          {TRAVEL_CARDS.map((card) => (
            <TouchableOpacity key={card.title} style={styles.travelCard} onPress={() => openModal({ title: card.title })}>
              <Text style={styles.travelEmoji}>{card.emoji}</Text>
              <Text style={styles.travelCardTitle}>{card.title}</Text>
              <Text style={styles.travelCardDesc}>{card.desc}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Travel Packages */}
        <Text style={styles.sectionHeading}>Popular Travel Packages</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardScroll}>
          {TRAVEL_PACKAGES.map((pkg) => (
            <TouchableOpacity key={pkg.id} style={styles.packageCard} onPress={() => openModal(pkg)}>
              <Image source={{ uri: pkg.image }} style={styles.packageImage} resizeMode="cover" />
              <View style={styles.packageBody}>
                <View style={styles.packageHeader}>
                  <Text style={styles.packageDuration}>{pkg.duration}</Text>
                  <Text style={styles.packagePrice}>₹{pkg.price.toLocaleString('en-IN')}</Text>
                </View>
                <Text style={styles.packageCardTitle}>{pkg.title}</Text>
                <Text style={styles.packageCardSubtitle}>{pkg.subtitle}</Text>
                <View style={styles.bookNowBtn}>
                  <Text style={styles.bookNowText}>Book Now</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or fill custom form</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Full Custom Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Owner Details</Text>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput style={styles.input} placeholder="Your name" placeholderTextColor="#9ca3af"
            value={form.owner_name} onChangeText={(v) => update('owner_name', v)} />
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput style={styles.input} placeholder="+91 9876543210" placeholderTextColor="#9ca3af"
            keyboardType="phone-pad" value={form.owner_number} onChangeText={(v) => update('owner_number', v)} />
          <Text style={styles.label}>Emergency Contact</Text>
          <TextInput style={styles.input} placeholder="Alternate number" placeholderTextColor="#9ca3af"
            keyboardType="phone-pad" value={form.emergency_contact} onChangeText={(v) => update('emergency_contact', v)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          <Text style={styles.label}>Pickup Location *</Text>
          <TextInput style={styles.input} placeholder="Full pickup address" placeholderTextColor="#9ca3af"
            value={form.pickup_location} onChangeText={(v) => update('pickup_location', v)} />
          <Text style={styles.label}>Drop Location *</Text>
          <TextInput style={styles.input} placeholder="Full drop address" placeholderTextColor="#9ca3af"
            value={form.drop_location} onChangeText={(v) => update('drop_location', v)} />
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Date *</Text>
              <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#9ca3af"
                value={form.pickup_date} onChangeText={(v) => update('pickup_date', v)} />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>Time *</Text>
              <TextInput style={styles.input} placeholder="HH:MM" placeholderTextColor="#9ca3af"
                value={form.pickup_time} onChangeText={(v) => update('pickup_time', v)} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pet Details</Text>
          <Text style={styles.label}>Pet Type *</Text>
          <View style={styles.chipRow}>
            {PET_TYPES.map((t) => (
              <TouchableOpacity key={t} style={[styles.chip, form.pet_type === t && styles.chipActive]} onPress={() => update('pet_type', t)}>
                <Text style={[styles.chipText, form.pet_type === t && styles.chipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Breed (optional)</Text>
          <TextInput style={styles.input} placeholder="e.g. Labrador" placeholderTextColor="#9ca3af"
            value={form.pet_breed} onChangeText={(v) => update('pet_breed', v)} />
          <Text style={styles.label}>Number of Pets</Text>
          <TextInput style={styles.input} placeholder="1" placeholderTextColor="#9ca3af"
            keyboardType="numeric" value={form.number_of_pets} onChangeText={(v) => update('number_of_pets', v)} />
          <Text style={styles.label}>Cab Preference</Text>
          <View style={styles.chipRow}>
            {CAB_PREFS.map((p) => (
              <TouchableOpacity key={p} style={[styles.chip, form.cab_preference === p && styles.chipActive]} onPress={() => update('cab_preference', p)}>
                <Text style={[styles.chipText, form.cab_preference === p && styles.chipTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Additional Notes</Text>
          <TextInput style={[styles.input, styles.textarea]} placeholder="Any special requirements..."
            placeholderTextColor="#9ca3af" multiline value={form.additional_notes} onChangeText={(v) => update('additional_notes', v)} />
        </View>

        <TouchableOpacity style={[styles.submitBtn, loading && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : (
            <>
              <Ionicons name="car" size={18} color="#fff" />
              <Text style={styles.submitText}>Book Pet Cab</Text>
            </>
          )}
        </TouchableOpacity>
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Quick Booking Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
              {selectedItem?.price && <Text style={styles.modalPrice}>₹{selectedItem.price.toLocaleString('en-IN')}</Text>}
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Your Name *</Text>
              <TextInput style={styles.input} placeholder="Full name" placeholderTextColor="#9ca3af"
                value={quickForm.owner_name} onChangeText={(v) => updateQuick('owner_name', v)} />

              <Text style={styles.label}>Phone Number *</Text>
              <TextInput style={styles.input} placeholder="+91 9876543210" placeholderTextColor="#9ca3af"
                keyboardType="phone-pad" value={quickForm.owner_number} onChangeText={(v) => updateQuick('owner_number', v)} />

              <Text style={styles.label}>Pickup Location *</Text>
              <TextInput style={styles.input} placeholder="Your pickup address" placeholderTextColor="#9ca3af"
                value={quickForm.pickup_location} onChangeText={(v) => updateQuick('pickup_location', v)} />

              <View style={styles.row}>
                <View style={styles.halfField}>
                  <Text style={styles.label}>Date *</Text>
                  <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#9ca3af"
                    value={quickForm.pickup_date} onChangeText={(v) => updateQuick('pickup_date', v)} />
                </View>
                <View style={styles.halfField}>
                  <Text style={styles.label}>Time *</Text>
                  <TextInput style={styles.input} placeholder="HH:MM" placeholderTextColor="#9ca3af"
                    value={quickForm.pickup_time} onChangeText={(v) => updateQuick('pickup_time', v)} />
                </View>
              </View>

              <Text style={styles.label}>Pet Type *</Text>
              <View style={styles.chipRow}>
                {PET_TYPES.map((t) => (
                  <TouchableOpacity key={t} style={[styles.chip, quickForm.pet_type === t && styles.chipActive]} onPress={() => updateQuick('pet_type', t)}>
                    <Text style={[styles.chipText, quickForm.pet_type === t && styles.chipTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={[styles.submitBtn, quickLoading && styles.submitBtnDisabled]} onPress={handleQuickSubmit} disabled={quickLoading}>
                {quickLoading ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Ionicons name="car" size={18} color="#fff" />
                    <Text style={styles.submitText}>Confirm Booking</Text>
                  </>
                )}
              </TouchableOpacity>
              <View style={{ height: 16 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  infoCard: { flexDirection: 'row', backgroundColor: '#ede9fe', margin: 16, borderRadius: 10, padding: 12, gap: 8, alignItems: 'flex-start' },
  infoText: { flex: 1, fontSize: 13, color: '#5b21b6' },
  sectionHeading: { fontSize: 14, fontWeight: '700', color: '#374151', marginHorizontal: 16, marginBottom: 10, marginTop: 4 },
  cardScroll: { paddingHorizontal: 16, gap: 10, paddingBottom: 16 },
  travelCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, width: 130, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', elevation: 1 },
  travelEmoji: { fontSize: 28, marginBottom: 6 },
  travelCardTitle: { fontSize: 13, fontWeight: '700', color: '#111827', textAlign: 'center' },
  travelCardDesc: { fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 3 },
  packageCard: { backgroundColor: '#fff', borderRadius: 12, width: 200, borderWidth: 1, borderColor: '#e5e7eb', elevation: 1, overflow: 'hidden' },
  packageImage: { width: '100%', height: 110 },
  packageBody: { padding: 12 },
  packageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  packageDuration: { fontSize: 11, color: '#6b7280', fontWeight: '600' },
  packagePrice: { fontSize: 15, fontWeight: '800', color: '#7c3aed' },
  packageCardTitle: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 3 },
  packageCardSubtitle: { fontSize: 11, color: '#6b7280', lineHeight: 16, marginBottom: 10 },
  bookNowBtn: { backgroundColor: '#7c3aed', borderRadius: 8, paddingVertical: 6, alignItems: 'center' },
  bookNowText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginVertical: 20, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  dividerText: { fontSize: 12, color: '#9ca3af', fontWeight: '600' },
  section: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16, marginBottom: 12, padding: 16, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 11, fontSize: 15, color: '#111827', backgroundColor: '#f9fafb', marginBottom: 12 },
  textarea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 10 },
  halfField: { flex: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#f9fafb' },
  chipActive: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  chipText: { fontSize: 13, color: '#374151' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  submitBtn: { backgroundColor: '#7c3aed', borderRadius: 12, marginHorizontal: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  submitBtnDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 8 },
  modalTitle: { flex: 1, fontSize: 17, fontWeight: '800', color: '#111827' },
  modalPrice: { fontSize: 16, fontWeight: '800', color: '#7c3aed' },
  closeBtn: { padding: 4 },
});
