import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SERVICES = [
  {
    section: 'Veterinary',
    items: [
      { icon: 'calendar' as const, label: 'Book Appointment', sub: 'Schedule a vet visit', route: '/appointments/book', color: '#2563eb', bg: '#dbeafe' },
      { icon: 'people' as const, label: 'Find Doctors', sub: 'Browse veterinarians', route: '/doctors', color: '#7c3aed', bg: '#ede9fe' },
      { icon: 'warning' as const, label: 'Medical Emergency', sub: 'Report urgent cases', route: '/emergency/report', color: '#dc2626', bg: '#fee2e2' },
    ],
  },
  {
    section: 'My Pets',
    items: [
      { icon: 'paw' as const, label: 'My Pets', sub: 'Manage your pets', route: '/pets/add', color: '#d97706', bg: '#fef3c7' },
      { icon: 'document-text' as const, label: 'Complaints', sub: 'Submit & track issues', route: '/complaints/list', color: '#0891b2', bg: '#cffafe' },
    ],
  },
  {
    section: 'Transport',
    items: [
      { icon: 'car' as const, label: 'Pet Cab', sub: 'Book pet transport', route: '/pet-cabs/book', color: '#7c3aed', bg: '#ede9fe' },
    ],
  },
  {
    section: 'Tracking',
    items: [
      { icon: 'calendar-outline' as const, label: 'Track Appointments', sub: 'View appointment status', route: '/tracking/appointments', color: '#2563eb', bg: '#dbeafe' },
      { icon: 'car-outline' as const, label: 'Track Pet Cabs', sub: 'View cab booking status', route: '/tracking/pet-cabs', color: '#7c3aed', bg: '#ede9fe' },
      { icon: 'medkit-outline' as const, label: 'My Emergencies', sub: 'View emergency history', route: '/tracking/emergencies', color: '#dc2626', bg: '#fee2e2' },
    ],
  },
  {
    section: 'Information',
    items: [
      { icon: 'newspaper' as const, label: 'Blogs', sub: 'Pet care articles', route: '/blogs', color: '#059669', bg: '#d1fae5' },
      { icon: 'mail' as const, label: 'Contact Us', sub: 'Get in touch', route: '/contact', color: '#6b7280', bg: '#f3f4f6' },
      { icon: 'briefcase' as const, label: 'Careers', sub: 'Join our team', route: '/career', color: '#d97706', bg: '#fef3c7' },
    ],
  },
  {
    section: 'Account',
    items: [
      { icon: 'star' as const, label: 'PashuCare Suraksha', sub: 'Upgrade your plan', route: '/credits/plans', color: '#f59e0b', bg: '#fef3c7' },
    ],
  },
];

export default function ServicesScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services</Text>
        <Text style={styles.headerSub}>Everything for your pet</Text>
      </View>

      {SERVICES.map((section) => (
        <View key={section.section} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.section}</Text>
          {section.items.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.serviceRow}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceLabel}>{item.label}</Text>
                <Text style={styles.serviceSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: '#16a34a', padding: 20 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 12, color: '#bbf7d0', marginTop: 2 },
  section: { marginTop: 16, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  serviceRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceInfo: { flex: 1 },
  serviceLabel: { fontSize: 15, fontWeight: '600', color: '#111827' },
  serviceSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
});
