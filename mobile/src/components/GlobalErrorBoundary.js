import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { RefreshCcw, AlertTriangle } from 'lucide-react-native';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error('Caught error in React tree:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRestart = () => {
    // Basic reload (can be improved with native-restart library)
    this.setState({ hasError: false, error: null, errorInfo: null });
    // In many cases, we might need a full native reload
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <AlertTriangle size={64} color="#FF6B6B" />
          <Text style={styles.title}>Oops! Something went wrong.</Text>
          
          <View style={styles.errorBox}>
            <ScrollView style={styles.scroll}>
              <Text style={styles.errorText}>
                {this.state.error?.toString()}
              </Text>
              {this.state.errorInfo && (
                <Text style={styles.stackText}>
                  {JSON.stringify(this.state.errorInfo.componentStack)}
                </Text>
              )}
            </ScrollView>
          </View>

          <TouchableOpacity style={styles.button} onPress={this.handleRestart}>
            <RefreshCcw size={20} color="white" />
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 24,
  },
  errorBox: {
    width: '100%',
    maxHeight: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 32,
  },
  scroll: {
    flexGrow: 0,
  },
  errorText: {
    color: '#DC2626',
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  stackText: {
    color: '#64748B',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 99,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GlobalErrorBoundary;
