import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { useChatStore } from '@/store/chatStore';
import api from '@/lib/api';
import Toast from 'react-native-toast-message';
import Markdown from 'react-native-markdown-display';

export default function ChatScreen() {
  const { sessionId, prefill } = useLocalSearchParams<{ sessionId: string; prefill?: string }>();
  const { messages, loadSession, sendMessage, isSending, remaining, creditsWarning } = useChatStore();
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<'Hindi' | 'English'>('Hindi');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (sessionId) loadSession(sessionId);
  }, [sessionId]);

  // Auto-send prefilled FAQ question
  useEffect(() => {
    if (prefill && sessionId && messages.length === 0) {
      const decoded = decodeURIComponent(prefill);
      setInput(decoded);
      // small delay to let session load first
      setTimeout(() => {
        sendMessage(decoded, undefined, undefined, language).catch(() => {});
        setInput('');
      }, 500);
    }
  }, [prefill, sessionId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;
    setInput('');
    try {
      await sendMessage(text, undefined, undefined, language);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Failed to send message';
      Toast.show({ type: 'error', text1: msg });
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0].base64) {
      const base64 = result.assets[0].base64;
      try {
        await sendMessage('Please analyze this image of my pet.', base64, undefined, language);
      } catch (err: any) {
        Toast.show({ type: 'error', text1: 'Failed to send image' });
      }
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(rec);
    } catch {
      Toast.show({ type: 'error', text1: 'Could not start recording' });
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsTranscribing(true);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (uri) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const res = await api.post('/api/speech/transcribe', { audio_base64: base64 });
        if (res.data.text) {
          setInput(res.data.text);
        }
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Transcription failed' });
    } finally {
      setIsTranscribing(false);
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return '#fee2e2';
      case 'medium': return '#fef3c7';
      default: return '#f0fdf4';
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ImageBackground
        source={require('../../assets/gopu background.jpeg')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Credits warning */}
        {creditsWarning && (
          <TouchableOpacity
            style={styles.creditsWarning}
            onPress={() => router.push('/credits/plans')}
          >
            <Ionicons name="warning" size={14} color="#d97706" />
            <Text style={styles.creditsWarningText}>
              {remaining} messages left today. Upgrade for unlimited access.
            </Text>
          </TouchableOpacity>
        )}

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.role === 'user' ? styles.userBubble : styles.aiBubble,
                item.role === 'assistant' && { backgroundColor: getSeverityColor(item.severity) },
              ]}
            >
              {item.role === 'assistant' && (
                <Text style={styles.aiLabel}>🐄 Gopu AI</Text>
              )}
              {item.role === 'assistant' ? (
                <Markdown style={markdownStyles}>{item.content}</Markdown>
              ) : (
                <Text style={styles.userText}>{item.content}</Text>
              )}
              {item.severity && item.severity !== 'low' && (
                <View style={[styles.severityBadge, { backgroundColor: item.severity === 'high' ? '#dc2626' : '#d97706' }]}>
                  <Text style={styles.severityText}>
                    {item.severity === 'high' ? '🚨 Urgent' : '⚠️ Moderate'}
                  </Text>
                </View>
              )}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Text style={styles.emptyChatEmoji}>🐾</Text>
              <Text style={styles.emptyChatText}>Ask Gopu AI anything about your pet's health</Text>
            </View>
          }
        />

        {isSending && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color="#16a34a" />
            <Text style={styles.typingText}>Gopu is thinking...</Text>
          </View>
        )}

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity onPress={handleImagePick} style={styles.iconBtn}>
            <Ionicons name="image-outline" size={22} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={recording ? stopRecording : startRecording}
            style={[styles.iconBtn, recording && styles.recordingBtn]}
          >
            {isTranscribing ? (
              <ActivityIndicator size="small" color="#16a34a" />
            ) : (
              <Ionicons
                name={recording ? 'stop-circle' : 'mic-outline'}
                size={22}
                color={recording ? '#dc2626' : '#6b7280'}
              />
            )}
          </TouchableOpacity>

          {/* Language Toggle */}
          <TouchableOpacity
            style={styles.langToggle}
            onPress={() => setLanguage(language === 'Hindi' ? 'English' : 'Hindi')}
          >
            <Text style={styles.langToggleText}>
              {language === 'Hindi' ? 'हि' : 'EN'}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Ask about your pet..."
            placeholderTextColor="#9ca3af"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={1000}
          />

          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || isSending) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || isSending}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  background: { flex: 1 },
  creditsWarning: {
    backgroundColor: '#fef3c7',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#fde68a',
  },
  creditsWarningText: { fontSize: 12, color: '#92400e', flex: 1 },
  messageList: { padding: 16, paddingBottom: 8 },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    maxWidth: '90%',
  },
  userBubble: {
    backgroundColor: '#16a34a',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  aiLabel: { fontSize: 11, fontWeight: '700', color: '#16a34a', marginBottom: 4 },
  userText: { color: '#fff', fontSize: 15, lineHeight: 22 },
  severityBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  severityText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  emptyChat: { alignItems: 'center', marginTop: 80, padding: 24 },
  emptyChatEmoji: { fontSize: 48, marginBottom: 12 },
  emptyChatText: { fontSize: 15, color: '#6b7280', textAlign: 'center' },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  typingText: { fontSize: 13, color: '#6b7280' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 10,
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingBtn: { backgroundColor: '#fee2e2' },
  textInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 15,
    color: '#111827',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#d1d5db' },
  langToggle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langToggleText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
});

const markdownStyles = {
  body: { fontSize: 15, color: '#111827', lineHeight: 22 },
  strong: { fontWeight: '700' as const },
  bullet_list: { marginLeft: 8 },
};
