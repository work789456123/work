# PashuVaani Mobile App

React Native + Expo app for the PashuVaani platform.

## Stack
- **Framework**: Expo SDK 51 + Expo Router (file-based routing)
- **Language**: TypeScript
- **State**: Zustand
- **HTTP**: Axios with JWT interceptor
- **Auth storage**: expo-secure-store
- **Voice**: expo-av (mic recording → STT via backend)
- **Images**: expo-image-picker
- **Push notifications**: expo-notifications
- **Build**: EAS Build

## Features (mirrors the website)
- ✅ Login / Register / Forgot Password (OTP flow)
- ✅ Gopu AI Chat (text + image + voice input, session history)
- ✅ Book Appointments → Slack notification to admin
- ✅ Pet Cab Booking → Slack notification to admin
- ✅ Medical Emergency Reporting → Slack notification to admin
- ✅ My Pets management
- ✅ Marketplace (browse products, contact seller)
- ✅ Doctors listing
- ✅ Blogs
- ✅ Appointment tracking (status: pending/confirmed/cancelled)
- ✅ Pet Cab tracking (status: Pending/Accepted/On the Way/Completed/Cancelled)
- ✅ Emergency history tracking
- ✅ Complaints (submit + track)
- ✅ PashuCare Suraksha subscription plans
- ✅ Contact Us
- ✅ Career applications (with resume upload)
- ❌ Admin panel (web-only by design)

## Setup

### 1. Install dependencies
```bash
cd mobile
npm install
```

### 2. Set your API URL
Edit `lib/api.ts` and update `BASE_URL` to your deployed backend:
```ts
export const BASE_URL = 'https://api.pashuvaani.com';
```

### 3. Run on Android
```bash
npx expo start --android
```

### 4. Build APK (for testing)
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

### 5. Build for Play Store
```bash
eas build --platform android --profile production
```

## Project Structure
```
mobile/
├── app/                    # Expo Router screens
│   ├── (auth)/             # Login, Register
│   ├── (tabs)/             # Bottom tab screens (Home, Chat, Marketplace, Services, Profile)
│   ├── chat/[sessionId]    # Chat conversation screen
│   ├── appointments/       # Book appointment
│   ├── pet-cabs/           # Book pet cab
│   ├── emergency/          # Report emergency
│   ├── pets/               # My pets
│   ├── tracking/           # Track appointments, cabs, emergencies
│   ├── marketplace/        # Product detail
│   ├── blogs/              # Blog list + detail
│   ├── doctors/            # Doctor listing
│   ├── complaints/         # Submit + list complaints
│   ├── credits/            # Subscription plans
│   ├── contact.tsx         # Contact form
│   ├── career.tsx          # Career application
│   └── forgot-password.tsx # OTP password reset
├── lib/
│   ├── api.ts              # Axios client + JWT interceptor
│   └── notifications.ts    # Push notification setup
├── store/
│   ├── authStore.ts        # Zustand auth state
│   └── chatStore.ts        # Zustand chat state
└── assets/                 # App icons, splash screen
```

## Backend Notes
- Same FastAPI backend as the website — no backend changes needed
- Slack notifications fire automatically when appointments/cabs/emergencies are created
- JWT tokens stored securely via expo-secure-store (not AsyncStorage)
