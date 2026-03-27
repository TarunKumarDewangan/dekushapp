import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import apiClient from '../api/client';
import { Building, MapPin, Info, Save, Users, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';

const InputField = ({ label, icon: Icon, value, onChangeText, placeholder, keyboardType, multiline, theme }) => (
    <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.secondaryText }]}>{label}</Text>
        <View style={[styles.inputWrapper, { backgroundColor: theme.input, borderColor: theme.border }, multiline && { alignItems: 'flex-start', paddingTop: 12 }]}>
            <Icon size={18} color={theme.iconDefault} style={multiline ? { marginTop: 2 } : {}} />
            <TextInput 
                style={[styles.input, { color: theme.text }, multiline && { height: 60 }]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.placeholder}
                keyboardType={keyboardType}
                multiline={multiline}
            />
        </View>
    </View>
);

const ManageHospitalScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { theme, isDark } = useTheme();
    const [hospital, setHospital] = useState(null);

    useFocusEffect(
        useCallback(() => {
            fetchMyHospital();
        }, [])
    );

    const fetchMyHospital = async () => {
        try {
            const response = await apiClient.get('/my-hospital');
            setHospital(response.data);
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to load hospital details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!hospital.name || !hospital.address) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        setSubmitting(true);
        try {
            await apiClient.put(`/hospitals/${hospital.id}`, {
                name: hospital.name,
                address: hospital.address,
                crowd_status: hospital.crowd_status
            });
            Alert.alert('Success', 'Hospital details updated successfully!');
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to update details');
        } finally {
            setSubmitting(false);
        }
    };

    const updateCrowdStatus = (status) => {
        setHospital({ ...hospital, crowd_status: status });
    };

    if (loading) return (
        <View style={[styles.center, { backgroundColor: theme.background }]}>
            <ActivityIndicator size="large" color={theme.primary} />
        </View>
    );

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.background }]}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
                
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
                        <Building size={30} color={theme.primary} />
                    </View>
                    <Text style={[styles.title, { color: theme.text }]}>Manage Hospital</Text>
                    <Text style={[styles.subtitle, { color: theme.secondaryText }]}>Update your facility details and live status</Text>
                </View>

                {/* Crowd Status Picker */}
                <View style={[styles.section, { marginBottom: 25 }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Real-time Crowd Status</Text>
                    <View style={styles.statusPicker}>
                        {['Low', 'Medium', 'High'].map((status) => (
                            <TouchableOpacity 
                                key={status}
                                style={[
                                    styles.statusButton, 
                                    { backgroundColor: theme.input, borderColor: theme.border },
                                    hospital.crowd_status === status && { 
                                        backgroundColor: status === 'Low' ? '#22c55e20' : status === 'Medium' ? '#f59e0b20' : '#ef444420',
                                        borderColor: status === 'Low' ? '#22c55e' : status === 'Medium' ? '#f59e0b' : '#ef4444'
                                    }
                                ]}
                                onPress={() => updateCrowdStatus(status)}
                            >
                                <View style={[
                                    styles.statusDot, 
                                    { backgroundColor: status === 'Low' ? '#22c55e' : status === 'Medium' ? '#f59e0b' : '#ef4444' }
                                ]} />
                                <Text style={[
                                    styles.statusText, 
                                    { color: theme.secondaryText },
                                    hospital.crowd_status === status && { color: status === 'Low' ? '#166534' : status === 'Medium' ? '#92400e' : '#991b1b', fontWeight: 'bold' }
                                ]}>{status}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Navigation to Doctors */}
                <TouchableOpacity 
                    style={[styles.menuItem, { backgroundColor: theme.card, shadowColor: isDark ? '#000' : '#000' }]}
                    onPress={() => navigation.navigate('ManageDoctors')}
                >
                    <View style={[styles.menuIcon, { backgroundColor: theme.primary + '15' }]}>
                        <Users size={20} color={theme.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.menuTitle, { color: theme.text }]}>Manage Doctors</Text>
                        <Text style={[styles.menuSub, { color: theme.secondaryText }]}>Add, edit or toggle availability</Text>
                    </View>
                    <ChevronRight size={20} color={theme.placeholder} />
                </TouchableOpacity>

                <View style={[styles.card, { backgroundColor: theme.card, shadowColor: isDark ? '#000' : '#d1d5db' }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 15 }]}>Basic Information</Text>
                    <InputField 
                        label="Hospital Name *" 
                        icon={Info} 
                        value={hospital.name}
                        onChangeText={(text) => setHospital({...hospital, name: text})}
                        placeholder="e.g. City General Hospital"
                        theme={theme}
                    />

                    <InputField 
                        label="Address *" 
                        icon={MapPin} 
                        value={hospital.address}
                        onChangeText={(text) => setHospital({...hospital, address: text})}
                        placeholder="Full address"
                        multiline
                        theme={theme}
                    />

                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: theme.primary }, submitting && styles.disabledButton]} 
                        onPress={handleUpdate}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Save size={20} color="#fff" />
                                <Text style={styles.buttonText}>Update Facility</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
                
                <View style={{ height: 40 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { alignItems: 'center', marginBottom: 25 },
    iconContainer: { 
        width: 60, 
        height: 60, 
        borderRadius: 30, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: 15
    },
    title: { fontSize: 24, fontWeight: 'bold' },
    subtitle: { fontSize: 14, marginTop: 5, textAlign: 'center' },
    section: { marginTop: 10 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    statusPicker: { flexDirection: 'row', justifyContent: 'space-between' },
    statusButton: { 
        flex: 1, 
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'center',
        paddingVertical: 12, 
        borderRadius: 12, 
        borderWidth: 1.5,
        marginHorizontal: 4
    },
    statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
    statusText: { fontSize: 14 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 25,
        elevation: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    menuIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    menuTitle: { fontSize: 16, fontWeight: 'bold' },
    menuSub: { fontSize: 12, marginTop: 2 },
    card: { borderRadius: 16, padding: 20, elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
    inputWrapper: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderRadius: 12, 
        paddingHorizontal: 15, 
        borderWidth: 1
    },
    input: { flex: 1, paddingVertical: 12, marginLeft: 10, fontSize: 15 },
    button: { 
        flexDirection: 'row', 
        borderRadius: 12, 
        height: 55, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 10
    },
    disabledButton: { opacity: 0.7 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }
});

export default ManageHospitalScreen;
