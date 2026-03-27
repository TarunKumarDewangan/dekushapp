import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const PhoneInput = ({ value, onChangeText, label = "Phone Number *" }) => {
  const { theme } = useTheme();

  const handleChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 10) {
      onChangeText(numericText);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <View style={[styles.inputContainer, { backgroundColor: theme.input, borderColor: theme.border }]}>
        <View style={[styles.prefixBox, { backgroundColor: theme.divider, borderRightColor: theme.border }]}>
          <Text style={[styles.prefixText, { color: theme.text }]}>+91</Text>
        </View>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="10 digit number"
          placeholderTextColor={theme.placeholder}
          keyboardType="phone-pad"
          maxLength={10}
          value={value}
          onChangeText={handleChange}
        />
      </View>
      {value.length > 0 && value.length < 10 && (
        <Text style={[styles.error, { color: theme.error }]}>Enter exactly 10 digits</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, overflow: 'hidden' },
  prefixBox: { paddingHorizontal: 15, height: 50, justifyContent: 'center', borderRightWidth: 1 },
  prefixText: { fontSize: 16, fontWeight: 'bold' },
  input: { flex: 1, height: 50, paddingHorizontal: 15, fontSize: 16 },
  error: { fontSize: 12, marginTop: 5 }
});

export default PhoneInput;
