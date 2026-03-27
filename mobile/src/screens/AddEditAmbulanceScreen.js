import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import apiClient from '../api/client';

const AddEditAmbulanceScreen = ({ route, navigation }) => {
  const ambulance = route.params?.ambulance;
  const isEdit = !!ambulance;

  const [form, setForm] = useState({
    name: ambulance?.name || '',
    contact: ambulance?.contact || '',
    vehicle_number: ambulance?.vehicle_number || '',
    status: ambulance?.status || 'Available',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.contact) {
      Alert.alert('Error', 'Name and Contact are required.');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await apiClient.put(`/ambulances/${ambulance.id}`, form);
        Alert.alert('Success', 'Ambulance updated!');
      } else {
        await apiClient.post('/ambulances', form);
        Alert.alert('Success', 'Ambulance added!');
      }
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', e.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Service Name *</Text>
        <TextInput 
          style={styles.input} 
          value={form.name} 
          onChangeText={(v) => setForm({...form, name: v})} 
          placeholder="e.g. City Hospital Ambulance"
        />

        <Text style={styles.label}>Contact Phone *</Text>
        <TextInput 
          style={styles.input} 
          value={form.contact} 
          onChangeText={(v) => setForm({...form, contact: v})} 
          placeholder="+91..."
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Vehicle Number</Text>
        <TextInput 
          style={styles.input} 
          value={form.vehicle_number} 
          onChangeText={(v) => setForm({...form, vehicle_number: v})} 
          placeholder="e.g. AMB-001"
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusRow}>
          {['Available', 'Busy'].map((s) => (
            <TouchableOpacity 
              key={s} 
              style={[styles.statusBtn, form.status === s && styles.statusBtnActive]}
              onPress={() => setForm({...form, status: s})}
            >
              <Text style={[styles.statusText, form.status === s && styles.statusTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.saveBtn, loading && { opacity: 0.7 }]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.saveBtnText}>{loading ? 'Saving...' : 'Save Ambulance'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 2 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  input: { backgroundColor: '#f8f9fa', padding: 12, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#ddd' },
  statusRow: { flexDirection: 'row', marginBottom: 30 },
  statusBtn: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#007bff', borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  statusBtnActive: { backgroundColor: '#007bff' },
  statusText: { color: '#007bff', fontWeight: 'bold' },
  statusTextActive: { color: '#fff' },
  saveBtn: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default AddEditAmbulanceScreen;
