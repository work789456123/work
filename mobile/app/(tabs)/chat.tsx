import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore } from '@/store/chatStore';
import { format } from 'date-fns';

const FAQ_CARDS = [
  { emoji: '🤒', question: 'My dog is not eating since yesterday, what should I do?' },
  { emoji: '💉', question: 'What vaccinations does my puppy need?' },
  { emoji: '🐄', question: 'My cow has reduced milk production, why?' },
  { emoji: '🌡️', question: 'How do I check if my pet has fever?' },
  { emoji: '🐐', question: 'My goat is limping, what could be the reason?' },
  { emoji: '🧴', question: 'How often should I deworm my pet?' },
];

export default function ChatListScreen() {
  const { sessions, fetchSessions, createSession, deleteSession, isLoading } = useChatStore();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleNewChat = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const sessionId = await createSession();
      router.push(`/chat/${sessionId}`);
    } catch {
      Alert.alert('Error', 'Could not create a new chat. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleFAQ = async (question: string) => {
    if (creating) return;
    setCreating(true);
    try {
      const sessionId = await createSession();
      router.push(`/chat/${sessionId}?prefill=${encodeURIComponent(question)}`);
    } catch {
      Alert.alert('Error', 'Could not start chat. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteSession(sessionId) },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🐄 Gopu AI</Text>
          <Text style={styles.headerSub}>Your AI Veterinary Expert</Text>
        </View>
        <TouchableOpacity
          style={[styles.newBtn, creating && styles.newBtnDisabled]}
          onPress={handleNewChat}
          disabled={creating}
        >
          {creating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.newBtnText}>New Chat</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* FAQ Cards */}
            <Text style={styles.faqTitle}>Common Questions</Text>
            <View style={styles.faqGrid}>
              {FAQ_CARDS.map((faq) => (
                <TouchableOpacity
                  key={faq.question}
                  style={styles.faqCard}
                  onPress={() => handleFAQ(faq.question)}
                  disabled={creating}
                >
                  <Text style={styles.faqEmoji}>{faq.emoji}</Text>
                  <Text style={styles.faqText} numberOfLines={3}>{faq.question}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {sessions.length > 0 && (
              <Text style={styles.historyTitle}>Recent Chats</Text>
            )}
          </>
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={{ marginTop: 20 }} color="#16a34a" />
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptySub}>Tap a question above or start a new chat</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.sessionCard}
            onPress={() => router.push(`/chat/${item.id}`)}
            onLongPress={() => handleDeleteSession(item.id)}
          >
            <View style={styles.sessionIcon}>
              <Ionicons name="chatbubble-ellipses" size={18} color="#16a34a" />
            </View>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle} numberOfLines={1}>
                {item.title || 'New Conversation'}
              </Text>
              {item.summary && (
                <Text style={styles.sessionSummary} numberOfLines={1}>{item.summary}</Text>
              )}
              <Text style={styles.sessionDate}>
                {format(new Date(item.updated_at), 'dd MMM, hh:mm a')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: {
    backgroundColor: '#16a34a',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 12, color: '#bbf7d0', marginTop: 2 },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
    minWidth: 100,
    justifyContent: 'center',
  },
  newBtnDisabled: { opacity: 0.6 },
  newBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  listContent: { padding: 16, paddingBottom: 32 },
  faqTitle: { fontSize: 14, fontWeight: '700', color: '#6b7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  faqGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  faqCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  faqEmoji: { fontSize: 22 },
  faqText: { fontSize: 12, color: '#374151', lineHeight: 17 },
  historyTitle: { fontSize: 14, fontWeight: '700', color: '#6b7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  empty: { alignItems: 'center', paddingTop: 12 },
  emptySub: { fontSize: 13, color: '#9ca3af', textAlign: 'center' },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    gap: 10,
  },
  sessionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionInfo: { flex: 1 },
  sessionTitle: { fontSize: 14, fontWeight: '600', color: '#111827' },
  sessionSummary: { fontSize: 12, color: '#6b7280', marginTop: 1 },
  sessionDate: { fontSize: 11, color: '#9ca3af', marginTop: 3 },
});
