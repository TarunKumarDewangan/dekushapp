import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { Home, HeartPulse, ShoppingBag, Wrench } from 'lucide-react-native';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HospitalScreen from '../screens/HospitalScreen';
import ShopScreen from '../screens/ShopScreen';
import ServiceScreen from '../screens/ServiceScreen';
import AssistantScreen from '../screens/AssistantScreen';
import AmbulanceScreen from '../screens/AmbulanceScreen';
import ReportIssueScreen from '../screens/ReportIssueScreen';
import SearchScreen from '../screens/SearchScreen';
import ManageShopsScreen from '../screens/ManageShopsScreen';
import AddShopScreen from '../screens/AddShopScreen';
import AddProductScreen from '../screens/AddProductScreen';
import EditShopScreen from '../screens/EditShopScreen';
import EditProductScreen from '../screens/EditProductScreen';
import ManageAmbulanceScreen from '../screens/ManageAmbulanceScreen';
import AddEditAmbulanceScreen from '../screens/AddEditAmbulanceScreen';
import ShopDetailScreen from '../screens/ShopDetailScreen';
import HeaderMenu from '../components/HeaderMenu';
import EmergencyHub from '../screens/EmergencyServicesScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ManageServicesScreen from '../screens/ManageServicesScreen';
import AddEditServiceScreen from '../screens/AddEditServiceScreen';
import AdminHomeScreen from '../screens/AdminHomeScreen';
import UserApprovalScreen from '../screens/UserApprovalScreen';
import ResourceApprovalScreen from '../screens/ResourceApprovalScreen';
import ManageBloodBankScreen from '../screens/ManageBloodBankScreen';
import AddBloodBankScreen from '../screens/AddBloodBankScreen';
import ManageHospitalScreen from '../screens/ManageHospitalScreen';
import ManageDoctorsScreen from '../screens/ManageDoctorsScreen';
import AddEditDoctorScreen from '../screens/AddEditDoctorScreen';
import AddHospitalScreen from '../screens/AddHospitalScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: true,
      headerRight: () => <HeaderMenu />,
      tabBarIcon: ({ color, size }) => {
        if (route.name === 'Home') return <Home color={color} size={size} />;
        if (route.name === 'Health') return <HeartPulse color={color} size={size} />;
        if (route.name === 'Market') return <ShoppingBag color={color} size={size} />;
        if (route.name === 'Services') return <Wrench color={color} size={size} />;
        return null;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Health" component={HospitalScreen} />
    <Tab.Screen name="Market" component={ShopScreen} />
    <Tab.Screen name="Services" component={ServiceScreen} />
  </Tab.Navigator>
);

import { useTheme } from '../context/ThemeContext';

const AppNavigator = () => {
  const { loading } = useAuth();
  const { theme, isDark } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={{
      dark: isDark,
      colors: {
        primary: theme.primary,
        background: theme.background,
        card: theme.card,
        text: theme.text,
        border: theme.border,
        notification: theme.error,
      },
      fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: '700' },
        heavy: { fontFamily: 'System', fontWeight: '900' },
      }
    }}>
      <Stack.Navigator 
        initialRouteName="Main"
        screenOptions={{ 
          headerShown: false,
          headerRight: () => <HeaderMenu />,
          headerStyle: { backgroundColor: theme.card },
          headerTintColor: theme.text,
        }}
      >
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true, title: 'Login' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true, title: 'Join Smart City' }} />
        <Stack.Screen name="Ambulance" component={AmbulanceScreen} options={{ headerShown: true, title: 'Ambulances' }} />
        <Stack.Screen name="ReportIssue" component={ReportIssueScreen} options={{ headerShown: true, title: 'Report Issue' }} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: true, title: 'Global Search' }} />
        <Stack.Screen name="ManageShops" component={ManageShopsScreen} options={{ headerShown: true, title: 'Manage Shops' }} />
        <Stack.Screen name="AddShop" component={AddShopScreen} options={{ headerShown: true, title: 'Add New Shop' }} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ headerShown: true, title: 'Manage Products' }} />
        <Stack.Screen name="EditShop" component={EditShopScreen} options={{ headerShown: true, title: 'Edit Shop' }} />
        <Stack.Screen name="EditProduct" component={EditProductScreen} options={{ headerShown: true, title: 'Edit Product' }} />
        <Stack.Screen name="ManageAmbulances" component={ManageAmbulanceScreen} options={{ headerShown: true, title: 'Manage Ambulances' }} />
        <Stack.Screen name="AddEditAmbulance" component={AddEditAmbulanceScreen} options={{ headerShown: true, title: 'Ambulance Details' }} />
        <Stack.Screen name="ShopDetail" component={ShopDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmergencyServices" component={EmergencyHub} options={{ headerShown: true, title: 'Emergency Services' }} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ManageServices" component={ManageServicesScreen} options={{ headerShown: true, title: 'Service Management' }} />
        <Stack.Screen name="AddEditService" component={AddEditServiceScreen} options={{ headerShown: true, title: 'Service Details' }} />
        <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ headerShown: true, title: 'Admin Panel' }} />
        <Stack.Screen name="UserApproval" component={UserApprovalScreen} options={{ headerShown: true, title: 'User Approvals' }} />
        <Stack.Screen name="ResourceApproval" component={ResourceApprovalScreen} options={{ headerShown: true, title: 'Approvals' }} />
        <Stack.Screen name="ManageBloodBank" component={ManageBloodBankScreen} options={{ headerShown: true, title: 'Manage Blood Bank' }} />
        <Stack.Screen name="AddBloodBank" component={AddBloodBankScreen} options={{ headerShown: true, title: 'Add Blood Bank' }} />
        <Stack.Screen name="ManageHospital" component={ManageHospitalScreen} options={{ headerShown: true, title: 'Manage Hospital' }} />
        <Stack.Screen name="ManageDoctors" component={ManageDoctorsScreen} options={{ headerShown: true, title: 'Manage Doctors' }} />
        <Stack.Screen name="AddEditDoctor" component={AddEditDoctorScreen} options={{ headerShown: true, title: 'Doctor Details' }} />
        <Stack.Screen name="AddHospital" component={AddHospitalScreen} options={{ headerShown: true, title: 'Add Hospital Specialist' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
