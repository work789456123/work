import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({ type: 'error', text1: 'Please fill in all fields' });
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Login failed. Please try again.';
      Toast.show({ type: 'error', text1: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>PashuVaani</Text>
          <Text style={styles.tagline}>The Voice of Animal Health</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSub}>Access your animal's health records.</Text>

          {/* Email */}
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputField}
              placeholder="you@example.com"
              placeholderTextColor="#adb5bd"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <Ionicons name="mail-outline" size={18} color="#adb5bd" style={styles.inputIcon} />
          </View>

          {/* Password */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>Password</Text>
            <Link href="/forgot-password" asChild>
              <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputField}
              placeholder="••••••••"
              placeholderTextColor="#adb5bd"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.inputIcon}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#adb5bd" />
            </TouchableOpacity>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonInner}>
                <Text style={styles.buttonText}>Login</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Register</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Trust badges */}
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark-outline" size={13} color="#6b7280" />
            <Text style={styles.badgeText}>Secure Access</Text>
          </View>
          <Text style={styles.badgeDot}>•</Text>
          <View style={styles.badge}>
            <Ionicons name="time-outline" size={13} color="#6b7280" />
            <Text style={styles.badgeText}>24/7 Support</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0fdf4' },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32 },

  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: '#1a3a2a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  logoImage: { width: '100%', height: '100%' },
  appName: { fontSize: 30, fontWeight: '800', color: '#1a3a2a', letterSpacing: -0.5 },
  tagline: { fontSize: 13, color: '#6b7280', marginTop: 4 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#6b7280', marginBottom: 24 },

  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  forgotText: { fontSize: 13, color: '#16a34a', fontWeight: '600' },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1fae5',
    marginBottom: 16,
    paddingHorizontal: 14,
  },
  inputField: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: '#111827',
  },
  inputIcon: { marginLeft: 8 },

  button: {
    backgroundColor: '#1a3a2a',
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#6b7280', fontSize: 14 },
  linkText: { color: '#16a34a', fontSize: 14, fontWeight: '700' },

  badges: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, gap: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  badgeText: { fontSize: 12, color: '#6b7280' },
  badgeDot: { color: '#9ca3af', fontSize: 12 },
});
