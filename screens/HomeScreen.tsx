// Copyright (c) Microsoft.
// Licensed under the MIT license.

// <HomeScreenSnippet>
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,TouchableOpacity,
  View,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeComponent1 from '../screens/HomeComponent';
import { UserContext } from '../UserContext';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();

const HomeComponent = () => {
  const userContext = React.useContext(UserContext);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ActivityIndicator
        color={Platform.OS === 'android' ? '#276b80' : undefined}
        animating={userContext.userLoading}
        size='large' />
        <TouchableOpacity activeOpacity={1} onPress={() =>
             navigation.navigate('HomePage')
                  }>
      {userContext.userLoading ? null: <Text>Hello {userContext.userFirstName}!</Text>}
      </TouchableOpacity>
    </View>
  );
}

export default class HomeScreen extends React.Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name='Home'
          component={HomeComponent}
          options={{
            headerShown: false
          }} />
          <Stack.Screen name='HomePage'
          component={HomeComponent1}
          options={{
            headerShown: false
          }} />
      </Stack.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
// </HomeScreenSnippet>
