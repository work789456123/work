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
  useWindowDimensions,
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
  const [keyboardVisible, setKeyboardVisible] = useState(false);
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
      const msg =
        err?.response?.data?.detail || 'Login failed. Please try again.';
      Toast.show({ type: 'error', text1: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => setKeyboardVisible(false)}
      >
        {/* Header — hide when keyboard is open to prevent merging */}
        {!keyboardVisible && (
          <View style={styles.header}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logoImage}
              resizeMode="cover"
            />
            <Text style={styles.logo}>PashuVaani</Text>
            <Text style={styles.tagline}>The Voice of Animal Health</Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setKeyboardVisible(true)}
            onBlur={() => setKeyboardVisible(false)}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setKeyboardVisible(true)}
              onBlur={() => setKeyboardVisible(false)}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#9ca3af"
              />
            </TouchableOpacity>
          </View>

          <Link href="/forgot-password" asChild>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Register</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0fdf4' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  logoImage: { width: 90, height: 90, marginBottom: 8, borderRadius: 45, overflow: 'hidden' },
  logo: { fontSize: 28, fontWeight: '800', color: '#16a34a' },
  tagline: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#d1fae5',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#f9fafb',
    marginBottom: 14,
  },
  forgotText: { color: '#16a34a', fontSize: 13, textAlign: 'right', marginBottom: 20 },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1fae5',
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    marginBottom: 14,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 15,
    color: '#111827',
  },
  eyeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#6b7280', fontSize: 14 },
  linkText: { color: '#16a34a', fontSize: 14, fontWeight: '600' },
});
