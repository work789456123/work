import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Image, Text, ImageBackground, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '@/store/authStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { loadFromStorage, isLoading } = useAuthStore();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    loadFromStorage()
      .catch(() => {})
      .finally(async () => {
        // Keep custom splash visible for at least 2s so logo is seen
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await SplashScreen.hideAsync();
        setAppReady(true);
      });

    import('@/lib/notifications')
      .then(({ registerForPushNotificationsAsync }) => {
        registerForPushNotificationsAsync().catch(() => {});
      })
      .catch(() => {});
  }, []);

  if (!appReady || isLoading) {
    return (
      <ImageBackground
        source={require('../assets/background.jpeg')}
        style={styles.splash}
        resizeMode="cover"
      >
        <View style={styles.logoCard}>
          <Image
            source={require('../assets/logo.jpeg')}
            style={styles.splashLogo}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.background}>
        <StatusBar style="dark" backgroundColor="#16a34a" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="chat/[sessionId]" options={{ headerShown: true, title: 'Chat with Gopu', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="appointments/book" options={{ headerShown: true, title: 'Book Appointment', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="pet-cabs/book" options={{ headerShown: true, title: 'Book Pet Cab', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="emergency/report" options={{ headerShown: true, title: 'Medical Emergency', headerStyle: { backgroundColor: '#dc2626' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="pets/add" options={{ headerShown: true, title: 'My Pets', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="marketplace/[id]" options={{ headerShown: true, title: 'Product', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="blogs/[id]" options={{ headerShown: true, title: 'Blog', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="doctors/[id]" options={{ headerShown: true, title: 'Doctor Profile', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="tracking/appointments" options={{ headerShown: true, title: 'Track Appointments', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="tracking/pet-cabs" options={{ headerShown: true, title: 'Track Pet Cabs', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="tracking/emergencies" options={{ headerShown: true, title: 'My Emergencies', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="complaints/new" options={{ headerShown: true, title: 'Submit Complaint', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="complaints/list" options={{ headerShown: true, title: 'My Complaints', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="credits/plans" options={{ headerShown: true, title: 'PashuCare Suraksha', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="contact" options={{ headerShown: true, title: 'Contact Us', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="career" options={{ headerShown: true, title: 'Careers', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="forgot-password" options={{ headerShown: true, title: 'Reset Password', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="blogs/index" options={{ headerShown: true, title: 'Blogs', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="doctors/index" options={{ headerShown: true, title: 'Doctors', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
        </Stack>
        <Toast />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCard: {
    width: 260,
    height: 260,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  splashLogo: {
    width: 260,
    height: 260,
  },
  background: { flex: 1, backgroundColor: '#fff' },
});
