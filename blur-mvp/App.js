import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import NoteEditorScreen from './screens/NoteEditorScreen';
import NoteReadingScreen from './screens/NoteReadingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#D4D7D7',
          headerTitleStyle: { fontWeight: 'bold' },
          cardStyle: { backgroundColor: '#121212' }, // Set default card background
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Blur',
            headerRight: () => (
              // Here you can later add more options on the header (like a more icon)
              <MoreIcon />
            ),
            cardStyleInterpolator: ({ current }) => ({
              cardStyle: {
                opacity: current.progress,
              },
            })
          }}
        />
        <Stack.Screen
          name="Editor"
          component={NoteEditorScreen}
          options={{
            cardStyleInterpolator: ({ current }) => ({
              cardStyle: {
                opacity: current.progress,
              },
            }),
            headerLeft: ({ onPress }) => (
              <HeaderBackButton onPress={onPress} tintColor="#D4D7D7" />
            ),
          }}
        />

        <Stack.Screen
          name="Reading"
          component={NoteReadingScreen}
          options={{
            cardStyleInterpolator: ({ current }) => ({
              cardStyle: {
                opacity: current.progress,
              },
            }),
            headerLeft: ({ onPress }) => (
              <HeaderBackButton onPress={onPress} tintColor="#D4D7D7" />
            ),
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Dummy MoreIcon and HeaderBackButton components for illustration.
import { TouchableOpacity, Text } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';

function MoreIcon() {
  return (
    <TouchableOpacity style={{ marginRight: 20 }}>
      <Text style={{ color: '#D4D7D7', fontSize:20 }}>⋮</Text>
    </TouchableOpacity>
  );
}
