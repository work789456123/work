import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/api';
import Toast from 'react-native-toast-message';

export default function PlansScreen() {
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    api.get('/api/credits/balance')
      .then((res) => setBalance(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handlePurchase = async (plan: string) => {
    setPurchasing(true);
    try {
      await api.post('/api/credits/purchase', { plan });
      const res = await api.get('/api/credits/balance');
      setBalance(res.data);
      Toast.show({ type: 'success', text1: 'Plan activated!', text2: 'Enjoy unlimited access.' });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.detail || 'Purchase failed' });
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} size="large" color="#f59e0b" />;

  return (
    <ScrollView style={styles.container}>
      {/* Current Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <Ionicons name="star" size={20} color="#f59e0b" />
          <Text style={styles.statusTitle}>
            {balance?.has_subscription ? 'PashuCare Suraksha Active' : 'Free Plan'}
          </Text>
        </View>
        <Text style={styles.statusSub}>
          {balance?.has_subscription
            ? 'You have unlimited AI chat access'
            : `${balance?.daily_remaining ?? 0} free messages remaining today`}
        </Text>
        {!balance?.has_subscription && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.max(0, ((balance?.daily_remaining ?? 0) / 10) * 100)}%` },
              ]}
            />
          </View>
        )}
      </View>

      {/* Plans */}
      <Text style={styles.sectionTitle}>Choose a Plan</Text>

      {[
        {
          id: 'monthly',
          name: 'Monthly',
          price: '₹199',
          period: '/month',
          features: [
            'Unlimited AI chat with Gopu',
            'Priority vet appointment booking',
            'Pet health tracking',
            'Email support',
          ],
          color: '#16a34a',
          popular: false,
        },
        {
          id: 'yearly',
          name: 'Annual',
          price: '₹1,499',
          period: '/year',
          features: [
            'Everything in Monthly',
            'Save 37% vs monthly',
            'Priority emergency response',
            'Dedicated support',
            'Early access to new features',
          ],
          color: '#7c3aed',
          popular: true,
        },
      ].map((plan) => (
        <View key={plan.id} style={[styles.planCard, plan.popular && styles.planCardPopular]}>
          {plan.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>BEST VALUE</Text>
            </View>
          )}
          <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{plan.price}</Text>
            <Text style={styles.period}>{plan.period}</Text>
          </View>
          {plan.features.map((f) => (
            <View key={f} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color={plan.color} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.planBtn, { backgroundColor: plan.color }, purchasing && styles.planBtnDisabled]}
            onPress={() => handlePurchase(plan.id)}
            disabled={purchasing || balance?.has_subscription}
          >
            {purchasing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.planBtnText}>
                {balance?.has_subscription ? 'Already Active' : `Get ${plan.name}`}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.freeCard}>
        <Text style={styles.freeTitle}>Free Plan</Text>
        <Text style={styles.freeSub}>10 AI messages per day, basic features</Text>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  statusCard: {
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
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  statusTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  statusSub: { fontSize: 13, color: '#6b7280' },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#16a34a', borderRadius: 3 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  planCard: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  planCardPopular: {
    borderWidth: 2,
    borderColor: '#7c3aed',
  },
  popularBadge: {
    backgroundColor: '#7c3aed',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  popularText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  planName: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 16 },
  price: { fontSize: 32, fontWeight: '800', color: '#111827' },
  period: { fontSize: 14, color: '#6b7280' },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  featureText: { fontSize: 14, color: '#374151' },
  planBtn: {
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  planBtnDisabled: { opacity: 0.6 },
  planBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  freeCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 14,
    alignItems: 'center',
  },
  freeTitle: { fontSize: 14, fontWeight: '600', color: '#374151' },
  freeSub: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
});
