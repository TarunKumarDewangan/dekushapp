import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import apiClient from '../api/client';
import { User, Stethoscope, Clock, Calendar, Save, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const InputField = ({ label, icon: Icon, value, onChangeText, placeholder, keyboardType, multiline, theme, hint }) => (
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
        {hint && <Text style={[styles.hint, { color: theme.placeholder }]}>{hint}</Text>}
    </View>
);

const AddEditDoctorScreen = ({ route, navigation }) => {
    const { doctor } = route.params || {};
    const isEdit = !!doctor;
    const { theme, isDark } = useTheme();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: doctor?.name || '',
        specialty: doctor?.specialty || '',
        type: doctor?.type || 'Staff',
        is_available: doctor?.is_available ?? true,
        visiting_days: doctor?.visiting_days || '',
        visiting_hours: doctor?.visiting_hours || ''
    });

    const handleSave = async () => {
        if (!formData.name || !formData.specialty || !formData.type) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            if (isEdit) {
                await apiClient.put(`/hospital-doctors/${doctor.id}`, formData);
                Alert.alert('Success', 'Doctor updated successfully');
            } else {
                await apiClient.post('/hospital-doctors', formData);
                Alert.alert('Success', 'Doctor added successfully');
            }
            navigation.goBack();
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to save doctor details');
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
                    <Text style={[styles.title, { color: theme.text }]}>{isEdit ? 'Edit Doctor' : 'Add New Doctor'}</Text>
                    <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
                        {isEdit ? 'Update profile and schedule' : 'Register a new doctor to your facility'}
                    </Text>
                </View>

                <View style={[styles.card, { backgroundColor: theme.card, shadowColor: isDark ? '#000' : '#d1d5db' }]}>
                    <InputField 
                        label="Doctor Name *" 
                        icon={User} 
                        value={formData.name}
                        onChangeText={(text) => setFormData({...formData, name: text})}
                        placeholder="Dr. Full Name"
                        theme={theme}
                    />

                    <InputField 
                        label="Specialty *" 
                        icon={Stethoscope} 
                        value={formData.specialty}
                        onChangeText={(text) => setFormData({...formData, specialty: text})}
                        placeholder="e.g. Cardiologist, General Physician"
                        theme={theme}
                    />

                    <Text style={[styles.label, { color: theme.secondaryText, marginTop: 10 }]}>Doctor Type *</Text>
                    <View style={styles.typeSelector}>
                        {['Staff', 'Consultant', 'Outside'].map((type) => (
                            <TouchableOpacity 
                                key={type}
                                style={[
                                    styles.typeBtn, 
                                    { backgroundColor: theme.input, borderColor: theme.border },
                                    formData.type === type && { backgroundColor: theme.primary, borderColor: theme.primary }
                                ]}
                                onPress={() => setFormData({...formData, type})}
                            >
                                <Text style={[
                                    styles.typeText, 
                                    { color: theme.secondaryText },
                                    formData.type === type && { color: '#fff', fontWeight: 'bold' }
                                ]}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={[styles.switchRow, { backgroundColor: theme.input }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.switchLabel, { color: theme.text }]}>Currently Available</Text>
                            <Text style={[styles.switchSub, { color: theme.secondaryText }]}>Toggle if doctor is on duty now</Text>
                        </View>
                        <Switch 
                            value={formData.is_available}
                            onValueChange={(val) => setFormData({...formData, is_available: val})}
                            trackColor={{ false: theme.border, true: theme.primary + '80' }}
                            thumbColor={formData.is_available ? theme.primary : theme.placeholder}
                        />
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.divider }]} />

                    <InputField 
                        label="Visiting Days" 
                        icon={Calendar} 
                        value={formData.visiting_days}
                        onChangeText={(text) => setFormData({...formData, visiting_days: text})}
                        placeholder="e.g. Mon, Wed, Fri"
                        hint="Leave blank for regular staff"
                        theme={theme}
                    />

                    <InputField 
                        label="Visiting Hours" 
                        icon={Clock} 
                        value={formData.visiting_hours}
                        onChangeText={(text) => setFormData({...formData, visiting_hours: text})}
                        placeholder="e.g. 10:00 AM - 02:00 PM"
                        theme={theme}
                    />

                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: theme.primary }, loading && styles.disabledButton]} 
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <CheckCircle2 size={20} color="#fff" />
                                <Text style={styles.buttonText}>{isEdit ? 'Update Doctor' : 'Save Doctor'}</Text>
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
    header: { marginBottom: 25 },
    title: { fontSize: 24, fontWeight: 'bold' },
    subtitle: { fontSize: 14, marginTop: 5 },
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
    hint: { fontSize: 11, marginTop: 4, marginLeft: 4 },
    typeSelector: { flexDirection: 'row', gap: 10, marginBottom: 20, marginTop: 8 },
    typeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
    typeText: { fontSize: 13 },
    switchRow: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, marginBottom: 20 },
    switchLabel: { fontSize: 15, fontWeight: 'bold' },
    switchSub: { fontSize: 11, marginTop: 2 },
    divider: { height: 1, marginVertical: 10, marginBottom: 20 },
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

export default AddEditDoctorScreen;
