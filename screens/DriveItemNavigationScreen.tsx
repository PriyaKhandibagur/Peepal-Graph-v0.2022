import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import DriveScreen from '../screens/DriveThumbnailItems';
import DrivePreviewScreen from '../screens/DriveThumbnailPreview';
import SendFile from '../screens/SendFile';

import {RootStackParamList} from '../screens/RootStackParams';

const Stack = createStackNavigator<RootStackParamList>();

export default function App({route}) {
  return (
   
      <Stack.Navigator>
        <Stack.Screen name="Drive" component={DriveScreen}  options={{headerShown: false}} initialParams={{ upn: route.params.upn,name:route.params.name}}/>
        <Stack.Screen name="drivepreview" component={DrivePreviewScreen} options={{headerShown: false}} />
        <Stack.Screen name="SendMail" component={SendFile} options={{headerShown: false}} />

      </Stack.Navigator>
    
  );
}