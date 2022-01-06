import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from '../screens/SearchDriveItems';
import AuthScreen from '../screens/DriveItemNavigationScreen';

import {RootStackParamList} from '../screens/RootStackParams';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
   
      <Stack.Navigator>
        <Stack.Screen name="SearchFirst" component={MainScreen}  options={{headerShown: false}} />
        <Stack.Screen name="DriveItems" component={AuthScreen} options={{headerShown: false}} />
        
      </Stack.Navigator>
    
  );
}