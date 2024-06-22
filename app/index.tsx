import "@/global.shims"

import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '@/app/home';
import IpfsScreen from '@/app/ipfs';

const Tab = createBottomTabNavigator();

export default function Screen() {
  return (
     <Tab.Navigator>
       <Tab.Screen name="Home" component={HomeScreen} />
       <Tab.Screen name="Ipfs" component={IpfsScreen} />
     </Tab.Navigator>
  );
}