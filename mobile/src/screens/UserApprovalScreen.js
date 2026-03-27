import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { UserCheck, User } from 'lucide-react-native';
import apiClient from '../api/client';
import { useTheme } from '../context/ThemeContext';

const UserApprovalScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme, isDark } = useTheme();

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await apiClient.get('/admin/pending-users');
      setUsers(response.data);
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await apiClient.post(`/admin/approve-user/${id}`);
      Alert.alert('Success', 'User approved successfully');
      fetchPendingUsers();
    } catch (e) {
      Alert.alert('Error', 'Failed to approve user');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
        activeOpacity={0.7}
        style={[styles.card, { backgroundColor: theme.card, shadowColor: isDark ? '#000' : '#000' }]}
    >
      <View style={[styles.iconCircle, { backgroundColor: isDark ? '#333' : '#f1f5f9' }]}>
        <User color={theme.secondaryText} size={24} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.role, { color: theme.primary }]}>{item.role}</Text>
        <Text style={[styles.info, { color: theme.secondaryText }]}>{item.email} | {item.phone}</Text>
      </View>
      <TouchableOpacity 
        style={[styles.approveButton, { backgroundColor: isDark ? '#166534' : '#22c55e' }]} 
        onPress={() => handleApprove(item.id)}
      >
        <UserCheck color="#fff" size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: 20 }}
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.secondaryText }]}>No pending user approvals.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  card: { padding: 15, borderRadius: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardContent: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  role: { fontSize: 13, fontWeight: '600', marginVertical: 2 },
  info: { fontSize: 12 },
  approveButton: { padding: 10, borderRadius: 12 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 15 }
});

export default UserApprovalScreen;
