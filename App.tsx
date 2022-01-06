// Copyright (c) Microsoft.
// Licensed under the MIT license.

// Adapted from https://reactnavigation.org/docs/auth-flow
import * as React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'

import { AuthContext } from './AuthContext';
import { AuthManager } from './auth/AuthManager';
import SignInScreen from './screens/SignInScreenpurple';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import BottomSheet from './screens/BottomSheet';

const Stack = createStackNavigator();

type Props = {
  navigation: StackNavigationProp<ParamListBase>;
};

export default function App({ navigation }: Props) {
  const [state, dispatch] = React.useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          console.log('tokennn '+action.token)
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false
          };
        case 'SIGN_IN':
          console.log('222tokennn '+action.token)

          return {
            ...prevState,
            isSignOut: false,
            userToken: action.token
          }
        case 'SIGN_OUT':
          console.log('333tokennn '+action.token)
          return {
            ...prevState,
            isSignOut: true,
            userToken: null
          }
      }
    },
    {
      isLoading: true,
      isSignOut: false,
      userToken: null
    }
  );
  console.log(state.userToken)

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken = null
      // TEMPORARY
      
        const token = await AuthManager.getAccessTokenAsync();
       
      
      dispatch({ type: 'RESTORE_TOKEN', token: token });
    };

    bootstrapAsync();
  }, []);

  // <AuthContextSnippet>
  const authContext = React.useMemo(
    () => ({
      signIn: async () => {
        await AuthManager.signInAsync();
        const token = await AuthManager.getAccessTokenAsync();
        dispatch({ type: 'SIGN_IN', token: token });
      },
      signOut: async () => {
        await AuthManager.signOutAsync();
        dispatch({ type: 'SIGN_OUT' });
      }
    }),
    []
  );
  // </AuthContextSnippet>

  return (
    <AuthContext.Provider value={authContext}>
    <NavigationContainer>
      <Stack.Navigator>
        {state.isLoading ? (
            <Stack.Screen options={{headerShown: false}} name="Loading" component={AuthLoadingScreen} />
          ) : state.userToken == null ? (
          <Stack.Screen options={{headerShown: false}}name="SignIn" component={SignInScreen} />
        ) : (
          <Stack.Screen options={{headerShown: false}} name="Main" component={BottomSheet} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  </AuthContext.Provider>
  );
}
