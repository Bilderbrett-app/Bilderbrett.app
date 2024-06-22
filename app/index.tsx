import "@/global.shims"

import * as React from 'react';
import { View } from 'react-native';

import HomeScreen from './screens/home';

export default function Screen() {
  return (
   <NavigationContainer>
     <Tab.Navigator>
       <Tab.Screen name="Home" component={HomeScreen} />
       <Tab.Screen name="Settings" component={HomeScreen} />
     </Tab.Navigator>
   </NavigationContainer>
  );
}