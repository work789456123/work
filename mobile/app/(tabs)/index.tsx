import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '@/lib/api';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 52) / 3; // 3 columns

interface QuickAction {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
  color: string;
  bg: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: 'chatbubble-ellipses', label: 'Ask Gopu AI', route: '/(tabs)/chat', color: '#16a34a', bg: '#dcfce7' },
  { icon: 'calendar', label: 'Appointment', route: '/appointments/book', color: '#2563eb', bg: '#dbeafe' },
  { icon: 'car', label: 'Pet Cab', route: '/pet-cabs/book', color: '#7c3aed', bg: '#ede9fe' },
  { icon: 'warning', label: 'Emergency', route: '/emergency/report', color: '#dc2626', bg: '#fee2e2' },
  { icon: 'paw', label: 'My Pets', route: '/pets/add', color: '#d97706', bg: '#fef3c7' },
  { icon: 'storefront', label: 'Marketplace', route: '/(tabs)/marketplace', color: '#0891b2', bg: '#cffafe' },
  { icon: 'newspaper', label: 'Blogs', route: '/blogs', color: '#059669', bg: '#d1fae5' },
  { icon: 'people', label: 'Doctors', route: '/doctors', color: '#7c3aed', bg: '#ede9fe' },
  { icon: 'medkit', label: 'Tracking', route: '/tracking/appointments', color: '#e11d48', bg: '#ffe4e6' },
];

export default function HomeScreen() {
  const { user } = useAuthStore();
  const [credits, setCredits] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCredits = useCallback(async () => {
    try {
      const res = await api.get('/api/credits/balance');
      setCredits(res.data);
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => {
    fetchCredits();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCredits();
    setRefreshing(false);
  };

  const firstName = user?.full_name?.split(' ')[0] ?? 'User';
  const insets = useSafeAreaInsets();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const getGreetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅';
    if (hour < 17) return '☀️';
    if (hour < 21) return '🌆';
    return '🌙';
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" translucent={false} />
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#16a34a" />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.naaste}>{getGreetingEmoji()} {getGreeting()}, {firstName}!</Text>
            <Text style={styles.welcome}>Welcome to PashuVaani</Text>
            <Text style={styles.subtitle}>The Voice of Animal Health</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/credits/plans')} style={styles.creditsBadge}>
            <Ionicons name="star" size={13} color="#fbbf24" />
            <Text style={styles.creditsText}>
              {credits?.has_subscription ? '✨ Pro' : `${credits?.daily_remaining ?? '?'} left`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Banner */}
        <TouchableOpacity
          style={styles.emergencyBanner}
          onPress={() => router.push('/emergency/report')}
        >
          <Ionicons name="warning" size={16} color="#fff" />
          <Text style={styles.emergencyText}>Pet Emergency? Tap for immediate help</Text>
          <Ionicons name="chevron-forward" size={14} color="#fff" />
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.actionCard, { backgroundColor: action.bg, width: CARD_SIZE, height: CARD_SIZE * 0.9 }]}
              onPress={() => router.push(action.route as any)}
            >
              <Ionicons name={action.icon} size={24} color={action.color} />
              <Text style={[styles.actionLabel, { color: action.color }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Subscription CTA */}
        {credits && !credits.has_subscription && (
          <TouchableOpacity
            style={styles.subscriptionCard}
            onPress={() => router.push('/credits/plans')}
          >
            <View>
              <Text style={styles.subscriptionTitle}>🌟 PashuCare Suraksha</Text>
              <Text style={styles.subscriptionSub}>Unlimited AI chats + priority support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#16a34a" />
          </TouchableOpacity>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#16a34a' },
  container: { flex: 1, backgroundColor: 'transparent' },
  header: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  naaste: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 2 },
  welcome: { fontSize: 14, fontWeight: '600', color: '#bbf7d0' },
  subtitle: { fontSize: 11, color: '#86efac', marginTop: 2 },
  creditsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
    marginTop: 4,
  },
  creditsText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  emergencyBanner: {
    backgroundColor: '#dc2626',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  emergencyText: { flex: 1, color: '#fff', fontWeight: '600', fontSize: 12 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  actionCard: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  subscriptionCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subscriptionTitle: { fontSize: 14, fontWeight: '700', color: '#15803d' },
  subscriptionSub: { fontSize: 11, color: '#6b7280', marginTop: 2 },
});
