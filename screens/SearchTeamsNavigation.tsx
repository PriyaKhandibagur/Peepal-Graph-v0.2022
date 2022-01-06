import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from '../screens/SearchTeamsName';
import AuthScreen from '../screens/TeamsDetailsScreen';

import {RootStackParamList} from '../screens/RootStackParams';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
   
      <Stack.Navigator>
        <Stack.Screen name="SearchFirst" component={MainScreen}  options={{headerShown: false}} />
        <Stack.Screen name="TeamsItems" component={AuthScreen} options={{headerShown: false}} />
        
      </Stack.Navigator>
    
  );
}