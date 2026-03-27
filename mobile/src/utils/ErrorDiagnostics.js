import { Alert, BackHandler } from 'react-native';

const setGlobalErrorHandler = () => {
  // Catch JS errors that aren't caught by React Error Boundary
  const defaultHandler = ErrorUtils.getGlobalHandler();
  
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    if (isFatal) {
      Alert.alert(
        'Unexpected Error',
        `The app encountered a fatal error and needs to restart.\n\nError: ${error.message}`,
        [
          {
            text: 'Close App',
            onPress: () => BackHandler.exitApp(),
          },
        ],
        { cancelable: false }
      );
    } else {
      // Log non-fatal errors but don't crash
      console.warn('Non-fatal error caught:', error.message);
      if (defaultHandler) {
        defaultHandler(error, isFatal);
      }
    }
  });

  // Polyfill for unhandled promise rejections (RN doesn't have a direct global listener for this without library)
  // But we can at least log them.
};

export default {
  setGlobalErrorHandler,
};
