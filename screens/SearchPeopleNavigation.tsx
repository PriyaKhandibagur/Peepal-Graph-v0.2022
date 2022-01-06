import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from '../screens/SearchScreen';
import AuthScreen from '../screens/SearchResultPeople';
import PostScreen from '../screens/SearchResultPosts';
import TeamsScreen from '../screens/SearchResultTeams';
import EventScreen from '../screens/SearchResultsEvents';
import People2Screen from '../screens/SearchResultPeople2';
import {RootStackParamList} from '../screens/RootStackParams';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
   
      <Stack.Navigator>
        <Stack.Screen name="SearchFirst" component={MainScreen}  options={{headerShown: false}} />
        <Stack.Screen name="SearchPeople" component={AuthScreen} options={{headerShown: false}} />
        <Stack.Screen name="SearchPosts" component={PostScreen} options={{headerShown: false}} />
        <Stack.Screen name="SearchTeams" component={TeamsScreen} options={{headerShown: false}} />
        <Stack.Screen name="SearchEvents" component={EventScreen} options={{headerShown: false}} />
        <Stack.Screen name="SearchPeople2" component={People2Screen} options={{headerShown: false}} />

      </Stack.Navigator>
    
  );
}