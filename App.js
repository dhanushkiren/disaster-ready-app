import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Home from "./src/pages/Home";
import Emergency from "./src/pages/Emergency";
import EmergencyDetail from "./src/pages/EmergencyDetails";
import Agencies from "./src/pages/Agencies";
import SosPage from "./src/pages/SosPage";
import RequestForm from "./src/pages/RequestForm";
import NotFound from "./src/pages/NotFound";
import Toast from "react-native-toast-message";

// Placeholder for missing screens
const PlaceholderScreen = ({ title }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ fontSize: 20 }}>{title} Page Coming Soon</Text>
  </View>
);

// Stack Navigator for Emergency, Agencies, SOS, Request Form
const Stack = createStackNavigator();
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={Home} />
    <Stack.Screen name="Emergency" component={Emergency} />
    <Stack.Screen name="EmergencyDetail" component={EmergencyDetail} />
    <Stack.Screen name="Agencies" component={Agencies} />
    <Stack.Screen name="SOS" component={SosPage} />
    <Stack.Screen name="RequestForm" component={RequestForm} />
    <Stack.Screen name="NotFound" component={NotFound} />
  </Stack.Navigator>
);

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Home") iconName = "home";
            else if (route.name === "Emergency") iconName = "alert-circle";
            else if (route.name === "Agencies") iconName = "business";
            else if (route.name === "SOS") iconName = "warning";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "blue",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Emergency" component={Emergency} />
        <Tab.Screen name="Agencies" component={Agencies} />
        <Tab.Screen name="SOS" component={SosPage} />
      </Tab.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default App;
