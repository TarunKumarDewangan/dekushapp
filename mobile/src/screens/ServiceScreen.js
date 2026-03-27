import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ServiceScreen = () => {
  const [services, setServices] = useState([]);
  const { user } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { theme, isDark } = useTheme();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await apiClient.get('/services');
      setServices(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (serviceId) => {
    if (!user) {
        Alert.alert('Session Required', 'Please log in to book city services and track your requests.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log In', onPress: () => navigation.navigate('Login') }
        ]);
        return;
    }
    try {
      await apiClient.post('/service-requests', { service_id: serviceId });
      Alert.alert('Success', 'Service request sent! The provider will contact you.');
    } catch (e) {
      Alert.alert('Error', 'Failed to send request.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.category, { color: theme.secondaryText }]}>{item.category} • {item.area}</Text>
        <Text style={[styles.rating, { color: isDark ? '#fbbf24' : '#ffc107' }]}>⭐ {item.rating}</Text>
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => handleRequest(item.id)}>
        <Text style={styles.buttonText}>Request</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>City Services</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={[styles.empty, { color: theme.secondaryText }]}>No services available.</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2, flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 18, fontWeight: 'bold' },
  category: { fontSize: 14 },
  rating: { fontWeight: 'bold', marginTop: 5 },
  button: { padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50 }
});

export default ServiceScreen;
