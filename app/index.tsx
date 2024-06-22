import "@/global.shims"

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import HomeScreen from '@/screens/home';

export default function App() {
  return (
   <NavigationContainer>
     <Tab.Navigator>
       <Tab.Screen name="Home" component={HomeScreen} />
       <Tab.Screen name="Settings" component={HomeScreen} />
     </Tab.Navigator>
   </NavigationContainer>
  );
}