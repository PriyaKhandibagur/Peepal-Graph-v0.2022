import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from '../screens/HomeComponent';
import AuthScreen from '../screens/HomePreviewScreen';
import {RootStackParamList} from '../screens/RootStackParams';
import SearchNavigationPhotosScreen from '../screens/SearchPeopleNavigation';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
   
      <Stack.Navigator>
        <Stack.Screen name="Home" component={MainScreen}  options={{headerShown: false}} />
        <Stack.Screen name="HomePreview" component={AuthScreen} options={{headerShown: false}} />
        <Stack.Screen name="HomeSearch" component={SearchNavigationPhotosScreen} options={{headerShown: false}} />

      </Stack.Navigator>
    
  );
}