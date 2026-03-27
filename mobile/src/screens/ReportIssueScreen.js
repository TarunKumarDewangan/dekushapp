import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import apiClient from '../api/client';
import { AlertTriangle } from 'lucide-react-native';

const ReportIssueScreen = ({ navigation }) => {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!type || !description) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/city-issues', { type, description });
      Alert.alert('Success', 'Issue reported successfully! City officials will review it.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to report issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <AlertTriangle color="#f4a261" size={48} />
        <Text style={styles.title}>Report a City Issue</Text>
        <Text style={styles.subtitle}>Help us make the city better by reporting infrastructure or safety concerns.</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Issue Type</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Pothole, Street Light, Sanitation"
          value={type}
          onChangeText={setType}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the issue and its location..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit Report'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { alignItems: 'center', padding: 40, backgroundColor: '#fdf2e9' },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  subtitle: { textAlign: 'center', color: '#666', marginTop: 10 },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  input: { backgroundColor: '#f8f9fa', padding: 15, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#ddd' },
  textArea: { height: 120, textAlignVertical: 'top' },
  button: { backgroundColor: '#e76f51', padding: 18, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default ReportIssueScreen;
