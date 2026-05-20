import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* ─── Data ─────────────────────────────────────────────────────────────── */
const SECTIONS = [
  {
    title: 'VETERINARY',
    items: [
      {
        icon: 'calendar-outline' as const,
        label: 'Book Appointment',
        sub: 'Schedule a vet visit',
        route: '/appointments/book',
        color: '#2563eb',
        bg: '#dbeafe',
        emergency: false,
      },
      {
        icon: 'medkit-outline' as const,
        label: 'Find Doctors',
        sub: 'Browse expert veterinarians',
        route: '/doctors',
        color: '#374151',
        bg: '#f3f4f6',
        emergency: false,
      },
      {
        icon: 'add-circle' as const,
        label: 'Medical Emergency',
        sub: 'Report urgent cases now',
        route: '/emergency/report',
        color: '#dc2626',
        bg: '#fee2e2',
        emergency: true,
      },
    ],
  },
  {
    title: 'MY PETS',
    items: [
      {
        icon: 'paw-outline' as const,
        label: 'My Pets',
        sub: 'Manage records',
        route: '/pets/add',
        color: '#16a34a',
        bg: '#dcfce7',
        emergency: false,
        grid: true,
      },
      {
        icon: 'document-text-outline' as const,
        label: 'Complaints',
        sub: 'Submit & track',
        route: '/complaints/list',
        color: '#374151',
        bg: '#f3f4f6',
        emergency: false,
        grid: true,
      },
    ],
  },
  {
    title: 'MORE SERVICES',
    items: [
      {
        icon: 'car-outline' as const,
        label: 'Pet Cab',
        sub: 'Book secure pet transport',
        route: '/pet-cabs/book',
        color: '#7c3aed',
        bg: '#ede9fe',
        emergency: false,
      },
      {
        icon: 'location-outline' as const,
        label: 'Tracking',
        sub: 'Live location of your pets',
        route: '/tracking/appointments',
        color: '#374151',
        bg: '#f3f4f6',
        emergency: false,
      },
    ],
  },
];

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function ServicesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.avatarSmall}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.avatarLogo}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.brandName}>PashuVaani</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <Ionicons name="notifications-outline" size={22} color="#1a3a2a" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Page heading */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Services</Text>
          <Text style={styles.pageSub}>Everything you need for your pet's well-being</Text>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.title}</Text>

            {/* "MY PETS" section uses a 2-column grid */}
            {section.title === 'MY PETS' ? (
              <View style={styles.gridRow}>
                {section.items.map((item) => (
                  <TouchableOpacity
                    key={item.label}
                    style={styles.gridCard}
                    onPress={() => router.push(item.route as any)}
                  >
                    <View style={[styles.gridIconBox, { backgroundColor: item.bg }]}>
                      <Ionicons name={item.icon} size={26} color={item.color} />
                    </View>
                    <Text style={styles.gridLabel}>{item.label}</Text>
                    <Text style={styles.gridSub}>{item.sub}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              section.items.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.row, item.emergency && styles.rowEmergency]}
                  onPress={() => router.push(item.route as any)}
                >
                  <View style={[styles.rowIconBox, { backgroundColor: item.bg }]}>
                    <Ionicons name={item.icon} size={22} color={item.color} />
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={[styles.rowLabel, item.emergency && styles.rowLabelEmergency]}>
                      {item.label}
                    </Text>
                    <Text style={[styles.rowSub, item.emergency && styles.rowSubEmergency]}>
                      {item.sub}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={item.emergency ? '#dc2626' : '#9ca3af'}
                  />
                </TouchableOpacity>
              ))
            )}
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Floating call button */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 80 }]}
        onPress={() => router.push('/contact')}
      >
        <Ionicons name="call" size={22} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0fdf4' },
  scroll: { flex: 1 },

  /* Top bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#dcfce7',
  },
  avatarLogo: { width: '100%', height: '100%' },
  brandName: { fontSize: 17, fontWeight: '800', color: '#1a3a2a' },
  bellBtn: { padding: 4 },

  /* Page header */
  pageHeader: { paddingHorizontal: 16, paddingBottom: 8 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#111827' },
  pageSub: { fontSize: 13, color: '#6b7280', marginTop: 2 },

  /* Section */
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1,
    marginBottom: 10,
  },

  /* List row */
  row: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  rowEmergency: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  rowIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: '700', color: '#111827' },
  rowLabelEmergency: { color: '#dc2626' },
  rowSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  rowSubEmergency: { color: '#f87171' },

  /* 2-col grid (My Pets) */
  gridRow: { flexDirection: 'row', gap: 10 },
  gridCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  gridIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  gridLabel: { fontSize: 15, fontWeight: '700', color: '#111827' },
  gridSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },

  /* FAB */
  fab: {
    position: 'absolute',
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
