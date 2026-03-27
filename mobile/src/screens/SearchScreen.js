import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Search, MapPin, Store, Wrench } from 'lucide-react-native';
import apiClient from '../api/client';
import { useTheme } from '../context/ThemeContext';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ hospitals: [], shops: [], services: [] });
  const [loading, setLoading] = useState(false);
  const { theme, isDark } = useTheme();

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.length < 2) {
      setResults({ hospitals: [], shops: [], services: [] });
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get(`/search?q=${text}`);
      setResults(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, type }) => {
    let icon = <MapPin size={20} color={theme.secondaryText} />;
    if (type === 'shop') icon = <Store size={20} color={theme.primary} />;
    if (type === 'service') icon = <Wrench size={20} color={isDark ? '#fbbf24' : '#f4a261'} />;

    return (
      <View style={[styles.resultItem, { borderBottomColor: theme.divider }]}>
        <View style={styles.iconBox}>{icon}</View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.resultName, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.resultSub, { color: theme.secondaryText }]}>{item.category || item.address}</Text>
        </View>
      </View>
    );
  };

  // Flatten results for FlatList
  const data = [
    ...results.hospitals.map(h => ({ ...h, type: 'hospital' })),
    ...results.shops.map(s => ({ ...s, type: 'shop' })),
    ...results.services.map(sv => ({ ...sv, type: 'service' })),
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.searchBar, { backgroundColor: theme.input }]}>
        <Search size={20} color={theme.placeholder} style={{ marginRight: 10 }} />
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Search hospitals, shops, services..."
          placeholderTextColor={theme.placeholder}
          value={query}
          onChangeText={handleSearch}
          autoFocus
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${item.type}-${item.id}`}
          renderItem={({ item }) => renderItem({ item, type: item.type })}
          ListEmptyComponent={
            query.length >= 2 ? <Text style={[styles.empty, { color: theme.secondaryText }]}>No results found for "{query}"</Text> : null
          }
          contentContainerStyle={{ padding: 15 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: { flexDirection: 'row', alignItems: 'center', margin: 15, paddingHorizontal: 15, borderRadius: 10, height: 50 },
  input: { flex: 1, fontSize: 16 },
  resultItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  iconBox: { width: 40, alignItems: 'center' },
  resultName: { fontSize: 16, fontWeight: 'bold' },
  resultSub: { fontSize: 12 },
  empty: { textAlign: 'center', marginTop: 50 }
});

export default SearchScreen;
