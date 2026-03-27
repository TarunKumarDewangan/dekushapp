import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, StatusBar, Linking } from 'react-native';
import { MapPin, Phone, Building, Users, ChevronRight, Stethoscope, Calendar, Clock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const HospitalScreen = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme, isDark } = useTheme();

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            const response = await apiClient.get('/hospitals');
            setHospitals(response.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const renderDoctor = (doc, theme) => (
        <View key={doc.id} style={styles.doctorMiniCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[styles.docName, { color: theme.text }]}>{doc.name}</Text>
                <View style={[styles.statusDot, { backgroundColor: doc.is_available ? '#22c55e' : '#ef4444' }]} />
            </View>
            <Text style={[styles.docSpecialty, { color: theme.primary }]}>{doc.specialty}</Text>
            {doc.visiting_days && (
                <View style={styles.docInfoRow}>
                    <Calendar size={12} color={theme.placeholder} />
                    <Text style={[styles.docInfoText, { color: theme.secondaryText }]}>{doc.visiting_days}</Text>
                </View>
            )}
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.card, shadowColor: isDark ? '#000' : '#000' }]}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: theme.primary + '15' }]}>
                    <Building size={24} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
                    <View style={styles.infoRow}>
                        <MapPin size={14} color={theme.placeholder} />
                        <Text style={[styles.infoText, { color: theme.secondaryText }]} numberOfLines={1}>{item.address}</Text>
                    </View>
                </View>
                <Text style={[styles.rating, { color: isDark ? '#fbbf24' : '#f59e0b' }]}>⭐ {item.rating}</Text>
            </View>

            <View style={styles.badgeRow}>
                <View style={[
                  styles.badge, 
                  item.crowd_status === 'High' 
                    ? { backgroundColor: '#ef444420' } 
                    : item.crowd_status === 'Medium' ? { backgroundColor: '#f59e0b20' } : { backgroundColor: '#22c55e20' }
                ]}>
                  <View style={[styles.dot, { backgroundColor: item.crowd_status === 'High' ? '#ef4444' : item.crowd_status === 'Medium' ? '#f59e0b' : '#22c55e' }]} />
                  <Text style={[
                    styles.badgeText, 
                    { color: item.crowd_status === 'High' ? '#ef4444' : item.crowd_status === 'Medium' ? '#f59e0b' : '#22c55e' }
                  ]}>Crowd: {item.crowd_status}</Text>
                </View>

                <TouchableOpacity 
                    style={[styles.callBtn, { backgroundColor: theme.primary }]}
                    onPress={() => item.contact && Linking.openURL(`tel:${item.contact}`)}
                >
                    <Phone size={14} color="#fff" />
                    <Text style={styles.callBtnText}>Call</Text>
                </TouchableOpacity>
            </View>

            {item.doctors && item.doctors.length > 0 && (
                <View style={[styles.doctorsSection, { borderTopColor: theme.divider }]}>
                    <View style={styles.sectionHeader}>
                        <Stethoscope size={16} color={theme.secondaryText} />
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Available Doctors</Text>
                    </View>
                    <View style={styles.doctorsGrid}>
                        {item.doctors.slice(0, 3).map(doc => renderDoctor(doc, theme))}
                        {item.doctors.length > 3 && (
                            <TouchableOpacity style={styles.moreBtn}>
                                <Text style={[styles.moreText, { color: theme.primary }]}>+{item.doctors.length - 3} more specialists</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
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
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <View style={styles.headerArea}>
                <Text style={[styles.title, { color: theme.text }]}>Nearby Hospitals</Text>
                <Text style={[styles.subtitle, { color: theme.secondaryText }]}>Find care and check live crowd status</Text>
            </View>
            <FlatList
                data={hospitals}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={[styles.empty, { color: theme.secondaryText }]}>No hospitals found.</Text>}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerArea: { paddingHorizontal: 20, paddingTop: 10, marginBottom: 15 },
    title: { fontSize: 26, fontWeight: 'bold' },
    subtitle: { fontSize: 13, marginTop: 4 },
    list: { padding: 20, paddingTop: 0 },
    card: { 
        padding: 16, 
        borderRadius: 20, 
        marginBottom: 20, 
        elevation: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    name: { fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
    infoRow: { flexDirection: 'row', alignItems: 'center' },
    infoText: { fontSize: 12, marginLeft: 4 },
    rating: { fontSize: 14, fontWeight: 'bold' },
    badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    dot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
    badgeText: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
    callBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
    callBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 6 },
    doctorsSection: { borderTopWidth: 1, paddingTop: 15 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
    sectionTitle: { fontSize: 14, fontWeight: '700' },
    doctorsGrid: { gap: 10 },
    doctorMiniCard: { padding: 10, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.02)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
    docName: { fontSize: 13, fontWeight: 'bold' },
    docSpecialty: { fontSize: 11, marginVertical: 2 },
    docInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    docInfoText: { fontSize: 10 },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    moreBtn: { alignItems: 'center', paddingVertical: 5 },
    moreText: { fontSize: 12, fontWeight: 'bold' },
    empty: { textAlign: 'center', marginTop: 50 }
});

export default HospitalScreen;
