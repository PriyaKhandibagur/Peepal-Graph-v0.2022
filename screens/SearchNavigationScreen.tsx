import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from '../screens/SearchListScreen';
import SearchNavigationPhotosScreen from '../screens/SearchPeopleNavigation';
import AuthScreen from '../screens/ProfileUserScreen';
import {RootStackParamList} from '../screens/RootStackParams';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
   
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainScreen}  options={{headerShown: false}} />
        <Stack.Screen name="Auth" component={AuthScreen} options={{headerShown: false}} />
        <Stack.Screen name="HomeSearch" component={SearchNavigationPhotosScreen} options={{headerShown: false}} />

      </Stack.Navigator>
    
  );
}