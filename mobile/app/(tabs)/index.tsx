import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '@/lib/api';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 64) / 3;

interface QuickAction {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
  color: string;
  bg: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: 'hardware-chip-outline', label: 'Ask Gopu\nAI',    route: '/(tabs)/chat',          color: '#16a34a', bg: '#dcfce7' },
  { icon: 'calendar-outline',      label: 'Appointment',     route: '/appointments/book',     color: '#2563eb', bg: '#dbeafe' },
  { icon: 'car-outline',           label: 'Pet Cab',         route: '/pet-cabs/book',         color: '#7c3aed', bg: '#ede9fe' },
  { icon: 'warning-outline',       label: 'Emergency',       route: '/emergency/report',      color: '#dc2626', bg: '#fee2e2' },
  { icon: 'paw-outline',           label: 'My Pets',         route: '/pets/add',              color: '#d97706', bg: '#fef3c7' },
  { icon: 'storefront-outline',    label: 'Market',          route: '/(tabs)/marketplace',    color: '#0891b2', bg: '#cffafe' },
  { icon: 'newspaper-outline',     label: 'Blogs',           route: '/blogs',                 color: '#059669', bg: '#d1fae5' },
  { icon: 'medkit-outline',        label: 'Doctors',         route: '/doctors',               color: '#7c3aed', bg: '#ede9fe' },
  { icon: 'location-outline',      label: 'Tracking',        route: '/tracking/appointments', color: '#e11d48', bg: '#ffe4e6' },
];

export default function HomeScreen() {
  const { user } = useAuthStore();
  const [credits, setCredits] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const fetchCredits = useCallback(async () => {
    try {
      const res = await api.get('/api/credits/balance');
      setCredits(res.data);
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => { fetchCredits(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCredits();
    setRefreshing(false);
  };

  const firstName = user?.full_name?.split(' ')[0] ?? 'User';

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    if (h < 21) return 'Good Evening';
    return 'Good Night';
  };

  const getGreetingEmoji = () => {
    const h = new Date().getHours();
    if (h < 12) return '🌅';
    if (h < 17) return '☀️';
    if (h < 21) return '🌆';
    return '🌙';
  };

  const creditsLabel = credits?.has_subscription
    ? `Premium Member: ${credits?.days_remaining ?? '∞'} days left`
    : null;

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#1a3a2a" translucent={false} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting card */}
        <View style={styles.greetingCard}>
          <Text style={styles.greetingText}>
            {getGreetingEmoji()} {getGreeting()},{'\n'}{firstName}!
          </Text>
          <Text style={styles.greetingSub}>Welcome to PashuVaani — The Voice of Animal Health.</Text>
          {creditsLabel && (
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={12} color="#fbbf24" />
              <Text style={styles.premiumText}>{creditsLabel}</Text>
            </View>
          )}
          {!creditsLabel && credits && (
            <TouchableOpacity style={styles.premiumBadge} onPress={() => router.push('/credits/plans')}>
              <Ionicons name="star-outline" size={12} color="#bbf7d0" />
              <Text style={styles.premiumText}>{credits?.daily_remaining ?? '?'} chats left today</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Emergency Banner */}
        <TouchableOpacity
          style={styles.emergencyBanner}
          onPress={() => router.push('/emergency/report')}
        >
          <View style={styles.emergencyIcon}>
            <Text style={styles.emergencyAsterisk}>*</Text>
          </View>
          <Text style={styles.emergencyText}>Pet Emergency? Tap for{'\n'}immediate help</Text>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.sectionDot} />
        </View>
        <View style={styles.grid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.actionCard, { width: CARD_SIZE }]}
              onPress={() => router.push(action.route as any)}
            >
              <View style={[styles.actionIconBox, { backgroundColor: action.bg }]}>
                <Ionicons name={action.icon} size={22} color={action.color} />
              </View>
              <Text style={[styles.actionLabel, { color: action.color }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* PashuCare Suraksha CTA */}
        <TouchableOpacity
          style={styles.subscriptionCard}
          onPress={() => router.push('/credits/plans')}
        >
          <View style={styles.subscriptionIconBox}>
            <Ionicons name="shield-checkmark" size={22} color="#fff" />
          </View>
          <View style={styles.subscriptionInfo}>
            <Text style={styles.subscriptionTitle}>PashuCare Suraksha</Text>
            <Text style={styles.subscriptionSub}>Unlimited AI chats + priority support</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </TouchableOpacity>

        {/* Daily Health Tip */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Daily Health Tip</Text>
          <TouchableOpacity onPress={() => router.push('/blogs')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.tipCard} onPress={() => router.push('/blogs')}>
          <View style={styles.tipImageBox}>
            <Ionicons name="water-outline" size={28} color="#16a34a" />
          </View>
          <View style={styles.tipInfo}>
            <Text style={styles.tipTitle}>Hydration Check</Text>
            <Text style={styles.tipSub}>Ensure your livestock has access to clean water every 4 hours...</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0fdf4' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 16 },

  /* Greeting */
  greetingCard: {
    backgroundColor: '#1a3a2a',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    padding: 20,
  },
  greetingText: { fontSize: 24, fontWeight: '800', color: '#fff', lineHeight: 32 },
  greetingSub: { fontSize: 13, color: '#86efac', marginTop: 6, lineHeight: 18 },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 12,
    gap: 5,
  },
  premiumText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  /* Emergency */
  emergencyBanner: {
    backgroundColor: '#dc2626',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emergencyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyAsterisk: { color: '#fff', fontSize: 18, fontWeight: '900', lineHeight: 22 },
  emergencyText: { flex: 1, color: '#fff', fontWeight: '700', fontSize: 14, lineHeight: 20 },

  /* Section header */
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 22,
    marginBottom: 12,
    gap: 6,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  sectionDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#16a34a' },
  seeAll: { fontSize: 13, color: '#16a34a', fontWeight: '600', marginLeft: 'auto' },

  /* Quick Actions grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  actionCard: {
    alignItems: 'center',
    gap: 6,
  },
  actionIconBox: {
    width: CARD_SIZE,
    height: CARD_SIZE * 0.82,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 15,
  },

  /* Subscription */
  subscriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  subscriptionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionInfo: { flex: 1 },
  subscriptionTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  subscriptionSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },

  /* Daily tip */
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipImageBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipInfo: { flex: 1 },
  tipTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  tipSub: { fontSize: 12, color: '#6b7280', marginTop: 3, lineHeight: 17 },
});
