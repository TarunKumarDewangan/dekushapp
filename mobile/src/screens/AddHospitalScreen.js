import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import apiClient from '../api/client';
import { User, Mail, Lock, PlusCircle, MapPin, Building } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const InputField = ({ label, icon: Icon, value, onChangeText, placeholder, secureTextEntry, keyboardType, multiline, theme }) => (
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
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                multiline={multiline}
            />
        </View>
    </View>
);

const AddHospitalScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const { theme, isDark } = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        hospital_name: '',
        address: ''
    });

    const handleCreate = async () => {
        const { name, email, password, hospital_name, address } = formData;
        if (!name || !email || !password || !hospital_name || !address) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await apiClient.post('/admin/create-hospital', formData);
            Alert.alert('Success', 'Hospital provider created successfully!');
            navigation.goBack();
        } catch (e) {
            console.error(e);
            Alert.alert('Error', e.response?.data?.message || 'Failed to create provider');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.background }]}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
                
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text }]}>New Hospital</Text>
                    <Text style={[styles.subtitle, { color: theme.secondaryText }]}>Create a new provider account and hospital record</Text>
                </View>

                <View style={[styles.card, { backgroundColor: theme.card, shadowColor: isDark ? '#000' : '#d1d5db' }]}>
                    <Text style={[styles.sectionHeader, { color: theme.text }]}>Staff Account Details</Text>
                    <InputField 
                        label="Representative Name" 
                        icon={User} 
                        value={formData.name}
                        onChangeText={(text) => setFormData({...formData, name: text})}
                        placeholder="Full Name"
                        theme={theme}
                    />
                    <InputField 
                        label="Email Address" 
                        icon={Mail} 
                        value={formData.email}
                        onChangeText={(text) => setFormData({...formData, email: text})}
                        placeholder="Email for login"
                        keyboardType="email-address"
                        theme={theme}
                    />
                    <InputField 
                        label="Login Password" 
                        icon={Lock} 
                        value={formData.password}
                        onChangeText={(text) => setFormData({...formData, password: text})}
                        placeholder="Minimum 6 characters"
                        secureTextEntry
                        theme={theme}
                    />

                    <View style={[styles.divider, { backgroundColor: theme.divider }]} />
                    <Text style={[styles.sectionHeader, { color: theme.text }]}>Hospital Information</Text>
                    
                    <InputField 
                        label="Hospital Name" 
                        icon={Building} 
                        value={formData.hospital_name}
                        onChangeText={(text) => setFormData({...formData, hospital_name: text})}
                        placeholder="Official Hospital Name"
                        theme={theme}
                    />
                    <InputField 
                        label="Physical Address" 
                        icon={MapPin} 
                        value={formData.address}
                        onChangeText={(text) => setFormData({...formData, address: text})}
                        placeholder="Full address"
                        multiline
                        theme={theme}
                    />

                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: theme.primary }, loading && styles.disabledButton]} 
                        onPress={handleCreate}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <PlusCircle size={20} color="#fff" />
                                <Text style={styles.buttonText}>Create Hospital</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20 },
    header: { marginBottom: 25 },
    title: { fontSize: 24, fontWeight: 'bold' },
    subtitle: { fontSize: 14, marginTop: 5 },
    card: { borderRadius: 16, padding: 20, elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
    sectionHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, marginTop: 5 },
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
    divider: { height: 1, marginVertical: 10 },
    button: { 
        flexDirection: 'row', 
        borderRadius: 12, 
        height: 55, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 20
    },
    disabledButton: { opacity: 0.7 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }
});

export default AddHospitalScreen;
