import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ShoppingBag, Wrench, CheckCircle } from 'lucide-react-native';
import apiClient from '../api/client';
import { useTheme } from '../context/ThemeContext';

const ResourceApprovalScreen = ({ route }) => {
  const { type } = route.params; // 'shop' or 'service'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme, isDark } = useTheme();

  useEffect(() => {
    fetchPendingResources();
  }, [type]);

  const fetchPendingResources = async () => {
    setLoading(true);
    try {
      const endpoint = type === 'shop' ? '/admin/pending-shops' : '/admin/pending-services';
      const response = await apiClient.get(endpoint);
      setData(response.data);
    } catch (e) {
      Alert.alert('Error', `Failed to fetch pending ${type}s`);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const endpoint = type === 'shop' ? `/admin/approve-shop/${id}` : `/admin/approve-service/${id}`;
      await apiClient.post(endpoint);
      Alert.alert('Success', `${type === 'shop' ? 'Shop' : 'Service'} approved successfully`);
      fetchPendingResources();
    } catch (e) {
      Alert.alert('Error', 'Failed to approve');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={[styles.iconCircle, { backgroundColor: theme.divider }]}>
        {type === 'shop' ? <ShoppingBag color={theme.iconDefault} size={24} /> : <Wrench color={theme.iconDefault} size={24} />}
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.owner, { color: theme.secondaryText }]}>
          Owner: {item.owner?.name || item.provider?.name || 'N/A'}
        </Text>
        <Text style={[styles.info, { color: theme.placeholder }]}>{item.category} | {item.address || item.area}</Text>
      </View>
      <TouchableOpacity 
        style={[styles.approveButton, { backgroundColor: theme.success }]} 
        onPress={() => handleApprove(item.id)}
      >
        <CheckCircle color="#fff" size={20} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.secondaryText }]}>No pending {type} approvals.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  card: { padding: 15, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 1 },
  iconCircle: { width: 45, height: 45, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardContent: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  owner: { fontSize: 14, marginVertical: 2 },
  info: { fontSize: 12 },
  approveButton: { padding: 10, borderRadius: 8 },
  emptyText: { textAlign: 'center', marginTop: 50 }
});

export default ResourceApprovalScreen;
