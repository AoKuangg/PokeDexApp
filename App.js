import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import PokemonDetailScreen from './src/screens/PokemonDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen}
        options={{
          title: 'Pokédex',
          headerStyle: {
            backgroundColor: '#FFF',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24,
          },
          headerTintColor: '#333',
        }}
      />
      <Stack.Screen 
        name="PokemonDetail" 
        component={PokemonDetailScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTintColor: '#333',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

const FavoritesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="FavoritesMain" 
        component={FavoritesScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="PokemonDetail" 
        component={PokemonDetailScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTintColor: '#333',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{
          title: 'Pokédex',
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesStack}
        options={{
          title: 'Favoritos',
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <MainTabs />
    </NavigationContainer>
  );
}