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

type Step = 'email' | 'otp' | 'password';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async () => {
    if (!email.trim()) {
      Toast.show({ type: 'error', text1: 'Please enter your email' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email: email.trim().toLowerCase() });
      Toast.show({ type: 'success', text1: 'OTP sent to your email' });
      setStep('otp');
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.detail || 'Failed to send OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Toast.show({ type: 'error', text1: 'Enter the 6-digit OTP' });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/api/auth/verify-otp', { email: email.trim().toLowerCase(), otp });
      setResetToken(res.data.reset_token);
      setStep('password');
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.detail || 'Invalid OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }
    if (newPassword.length < 8) {
      Toast.show({ type: 'error', text1: 'Password must be at least 8 characters' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/auth/reset-password', {
        reset_token: resetToken,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      Toast.show({ type: 'success', text1: 'Password reset successfully!' });
      router.replace('/(auth)/login');
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.detail || 'Reset failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Ionicons name="lock-closed" size={32} color="#16a34a" />
        <Text style={styles.title}>Reset Password</Text>
      </View>

      {/* Step indicators */}
      <View style={styles.steps}>
        {(['email', 'otp', 'password'] as Step[]).map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepDot, step === s && styles.stepDotActive,
              (step === 'otp' && i === 0) || (step === 'password' && i <= 1) ? styles.stepDotDone : null]}>
              <Text style={styles.stepNum}>{i + 1}</Text>
            </View>
            {i < 2 && <View style={styles.stepLine} />}
          </View>
        ))}
      </View>

      <View style={styles.card}>
        {step === 'email' && (
          <>
            <Text style={styles.stepTitle}>Enter your email</Text>
            <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor="#9ca3af"
              keyboardType="email-address" autoCapitalize="none"
              value={email} onChangeText={setEmail} />
            <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleRequestOTP} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Send OTP</Text>}
            </TouchableOpacity>
          </>
        )}

        {step === 'otp' && (
          <>
            <Text style={styles.stepTitle}>Enter the 6-digit OTP</Text>
            <Text style={styles.stepSub}>Sent to {email}</Text>
            <TextInput style={[styles.input, styles.otpInput]} placeholder="000000" placeholderTextColor="#9ca3af"
              keyboardType="number-pad" maxLength={6} value={otp} onChangeText={setOtp} />
            <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleVerifyOTP} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Verify OTP</Text>}
            </TouchableOpacity>
          </>
        )}

        {step === 'password' && (
          <>
            <Text style={styles.stepTitle}>Set new password</Text>
            <TextInput style={styles.input} placeholder="New password (min 8 chars)" placeholderTextColor="#9ca3af"
              secureTextEntry value={newPassword} onChangeText={setNewPassword} />
            <TextInput style={styles.input} placeholder="Confirm new password" placeholderTextColor="#9ca3af"
              secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
            <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleResetPassword} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Reset Password</Text>}
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { alignItems: 'center', padding: 32, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginTop: 10 },
  steps: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: '#16a34a' },
  stepDotDone: { backgroundColor: '#86efac' },
  stepNum: { fontSize: 12, fontWeight: '700', color: '#fff' },
  stepLine: { width: 40, height: 2, backgroundColor: '#e5e7eb' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stepTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 6 },
  stepSub: { fontSize: 13, color: '#6b7280', marginBottom: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#f9fafb',
    marginBottom: 14,
  },
  otpInput: { fontSize: 24, textAlign: 'center', letterSpacing: 8 },
  btn: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
