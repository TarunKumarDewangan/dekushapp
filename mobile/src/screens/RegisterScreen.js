import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import apiClient from '../api/client';
import PhoneInput from '../components/PhoneInput';
import { useTheme } from '../context/ThemeContext';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const { theme } = useTheme();

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) {
        Alert.alert('Error', 'Please fill all fields');
        return;
    }

    if (phone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      const response = await apiClient.post('/register', {
        name, 
        email, 
        phone: '+91' + phone, 
        password, 
        role
      });
      Alert.alert('Success', 'Account created! Please login.');
      navigation.navigate('Login');
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: theme.primary }]}>Register</Text>
        
        <TextInput 
          style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]} 
          placeholder="Full Name" 
          placeholderTextColor={theme.placeholder}
          value={name} 
          onChangeText={setName} 
        />
        <TextInput 
          style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]} 
          placeholder="Email" 
          placeholderTextColor={theme.placeholder}
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
        />
        
        <PhoneInput 
          value={phone}
          onChangeText={setPhone}
          label="Phone Number *"
        />

        <TextInput 
          style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]} 
          placeholder="Password" 
          placeholderTextColor={theme.placeholder}
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
        />

        <Text style={[styles.label, { color: theme.text }]}>Register as:</Text>
        <View style={styles.roleContainer}>
          {['User', 'ShopOwner', 'ServiceProvider'].map((r) => (
            <TouchableOpacity 
              key={r} 
              style={[
                styles.roleButton, 
                { borderColor: theme.primary },
                role === r && { backgroundColor: theme.primary }
              ]} 
              onPress={() => setRole(r)}
            >
              <Text style={[
                styles.roleText, 
                { color: theme.primary },
                role === r && { color: '#fff' }
              ]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.link, { color: theme.primary }]}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1 },
  button: { padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 10, fontWeight: 'bold' },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  roleButton: { padding: 10, borderRadius: 5, borderWidth: 1, flex: 1, marginHorizontal: 2, alignItems: 'center' },
  roleText: { fontSize: 12 }
});

export default RegisterScreen;
