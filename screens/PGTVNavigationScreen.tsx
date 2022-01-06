import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from '../screens/PGTVVideos';
import AuthScreen from '../screens/VideoPlayerScreen';
import {RootStackParamList} from '../screens/RootStackParams';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
   
      <Stack.Navigator>
        <Stack.Screen name="PGTV" component={MainScreen}  options={{headerShown: false}} />
        <Stack.Screen name="PGTVPreview" component={AuthScreen} options={{headerShown: false}} />
        
      </Stack.Navigator>
    
  );
}