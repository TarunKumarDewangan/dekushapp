import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import apiClient from '../api/client';
import { Building, MapPin, Info, Save, Star } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const InputField = ({ label, icon: Icon, value, onChangeText, placeholder, keyboardType, multiline, theme }) => (
    <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.secondaryText }]}>{label}</Text>
        <View style={[styles.inputWrapper, { backgroundColor: theme.input, borderColor: theme.border }, multiline && { alignItems: 'flex-start', paddingTop: 12 }]}>
            <Icon size={18} color={theme.iconDefault} style={multiline ? { marginTop: 2 } : {}} />
            <TextInput 
                style={[styles.input, { color: theme.text }, multiline && { height: 60 }]}
                value={value?.toString() || ''}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.placeholder}
                keyboardType={keyboardType}
                multiline={multiline}
            />
        </View>
    </View>
);

const EditHospitalScreen = ({ route, navigation }) => {
    const { hospital: initialHospital } = route.params;
    const [hospital, setHospital] = useState(initialHospital);
    const [submitting, setSubmitting] = useState(false);
    const { theme, isDark } = useTheme();

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
                crowd_status: hospital.crowd_status,
                rating: hospital.rating
            });
            Alert.alert('Success', 'Hospital details updated successfully!');
            navigation.goBack();
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
                    <Text style={[styles.title, { color: theme.text }]}>Edit Hospital</Text>
                    <Text style={[styles.subtitle, { color: theme.secondaryText }]}>Update facility information and rating</Text>
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

                <View style={[styles.card, { backgroundColor: theme.card, shadowColor: isDark ? '#000' : '#d1d5db' }]}>
                    <InputField 
                        label="Hospital Name *" 
                        icon={Building} 
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

                    <InputField 
                        label="Rating (0-5)" 
                        icon={Star} 
                        value={hospital.rating}
                        onChangeText={(text) => setHospital({...hospital, rating: text})}
                        placeholder="4.5"
                        keyboardType="numeric"
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
                                <Text style={styles.buttonText}>Save Changes</Text>
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
    sectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 15 },
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
    statusText: { fontSize: 13 },
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
        marginTop: 15
    },
    disabledButton: { opacity: 0.7 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }
});

export default EditHospitalScreen;
