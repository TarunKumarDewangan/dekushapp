import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar, Platform } from 'react-native';
import { Users, ShoppingBag, Wrench, Truck, ChevronRight, Droplet, Building } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../api/client';
import { useTheme } from '../context/ThemeContext';

const AdminCard = ({ title, count, icon: Icon, onPress, color, theme, isDark }) => (
  <TouchableOpacity style={[styles.card, { backgroundColor: theme.card, shadowColor: isDark ? '#000' : '#d1d5db' }]} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
      <Icon color={color} size={28} />
    </View>
    <View style={styles.cardContent}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: theme.error }]}>
          <Text style={styles.badgeText}>{count} Pending</Text>
        </View>
      )}
    </View>
    <ChevronRight color={theme.placeholder} size={20} />
  </TouchableOpacity>
);

const AdminHomeScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme, isDark } = useTheme();

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      setStats(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <View style={[styles.centered, { backgroundColor: theme.background }]}>
            <ActivityIndicator size="large" color={theme.primary} />
        </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Admin Dashboard</Text>
      
      <View style={styles.statsOverview}>
        <View style={[styles.statBox, { backgroundColor: theme.card, shadowColor: isDark ? '#000' : '#d1d5db' }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>{stats?.total_users || 0}</Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Total Users</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card, shadowColor: isDark ? '#000' : '#d1d5db' }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>{stats?.total_shops || 0}</Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Shops</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card, shadowColor: isDark ? '#000' : '#d1d5db' }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>{stats?.total_services || 0}</Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Services</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Management</Text>
      
      <AdminCard 
        title="User Approvals" 
        count={stats?.users_pending} 
        icon={Users} 
        color="#3b82f6"
        theme={theme}
        isDark={isDark}
        onPress={() => navigation.navigate('UserApproval')}
      />
      <AdminCard 
        title="Shop Approvals" 
        count={stats?.shops_pending} 
        icon={ShoppingBag} 
        color="#22c55e"
        theme={theme}
        isDark={isDark}
        onPress={() => navigation.navigate('ResourceApproval', { type: 'shop' })}
      />
      <AdminCard 
        title="Service Approvals" 
        count={stats?.services_pending} 
        icon={Wrench} 
        color="#f59e0b"
        theme={theme}
        isDark={isDark}
        onPress={() => navigation.navigate('ResourceApproval', { type: 'service' })}
      />
      <AdminCard 
        title="Manage Ambulances" 
        icon={Truck} 
        color="#ef4444"
        theme={theme}
        isDark={isDark}
        onPress={() => navigation.navigate('ManageAmbulances')}
      />
      <AdminCard 
        title="Manage Blood Banks" 
        icon={Droplet} 
        color="#e11d48"
        theme={theme}
        isDark={isDark}
        onPress={() => navigation.navigate('AddBloodBank')}
      />
      
      <AdminCard 
        title="Manage Hospitals" 
        icon={Building} 
        color="#0ea5e9"
        theme={theme}
        isDark={isDark}
        onPress={() => navigation.navigate('AddHospital')}
      />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 25 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statsOverview: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statBox: { padding: 15, borderRadius: 16, flex: 1, marginHorizontal: 5, alignItems: 'center', elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10 },
  statNumber: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 5, textTransform: 'uppercase' },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 15, elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  iconContainer: { padding: 10, borderRadius: 14, marginRight: 15 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginTop: 4 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' }
});

export default AdminHomeScreen;
