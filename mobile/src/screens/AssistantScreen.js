import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import apiClient from '../api/client';
import { Send } from 'lucide-react-native';

const AssistantScreen = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your Smart City AI Guide. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query) return;

    const userMsg = { role: 'user', text: query };
    setMessages([...messages, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const response = await apiClient.post('/assistant', { query });
      setMessages(prev => [...prev, { role: 'assistant', text: response.data.answer }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.chatContainer}>
        {messages.map((m, i) => (
          <View key={i} style={[styles.msgBox, m.role === 'user' ? styles.userMsg : styles.assistantMsg]}>
            <Text style={m.role === 'user' ? styles.userText : styles.assistantText}>{m.text}</Text>
          </View>
        ))}
        {loading && <ActivityIndicator size="small" color="#007bff" style={{ alignSelf: 'flex-start', marginLeft: 20 }} />}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask me anything about the city..."
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Send color="#fff" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  chatContainer: { padding: 20 },
  msgBox: { padding: 15, borderRadius: 15, marginBottom: 15, maxWidth: '80%' },
  userMsg: { backgroundColor: '#007bff', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  assistantMsg: { backgroundColor: '#fff', alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
  userText: { color: '#fff' },
  assistantText: { color: '#333' },
  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f1f3f4', padding: 12, borderRadius: 25, marginRight: 10 },
  sendButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 25 }
});

export default AssistantScreen;
