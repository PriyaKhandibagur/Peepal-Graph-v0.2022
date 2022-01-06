// Copyright (c) Microsoft.
// Licensed under the MIT license.

// Adapted from https://reactnavigation.org/docs/auth-flow
import React from 'react';
import {
  TouchableOpacity,
  Image,Text,
  StyleSheet,
  StatusBar,
  View,
} from 'react-native';
import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'
import { AuthManager } from '../auth/AuthManager';
import { AuthContext } from '../AuthContext';
import { GraphAuthProvider } from '../graph/GraphAuthProvider';
import BottomSheet from '../screens/BottomSheet';
import SignInScreen from '../screens/SignInScreen';
import { createStackNavigator,HeaderBackButton } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
const RootStack = createStackNavigator<RootStackParamList>();
type RootStackParamList = {
  GroupScreen: undefined;

  GroupDetailScreen: undefined;
  signin:undefined;
};

type SignInProps = {
  navigation: StackNavigationProp<ParamListBase>;
};
const PeopleComponent = () => {
  // const peopleState = React.useContext(PeopleState);
   const bootstrapAsync = async () => {
    const navigation = useNavigation();

    let userToken = null
    // TEMPORARY
    
      const token = await AuthManager.getAccessTokenAsync();
      console.log('splash '+token)

      if(token==null){
        console.log('tttttt '+token)
        navigation.navigate('signin')
      }else{
        console.log('bbbbb '+token)
        navigation.navigate('GroupDetailScreen')

      }

  };
  bootstrapAsync();

 //  const token = await AuthManager.getAccessTokenAsync();
   return( <View style={styles.container}>
    <StatusBar backgroundColor = '#5F259F' />
    <Image source={require('../images/peepalgraph_logo.png')}
style={{height:150,width:150,justifyContent:'center',alignSelf:'center',alignContent:'center',margin:-30}} />

<Text style={{fontSize:30,fontWeight:'200', color:'#fff',alignSelf:'center',fontFamily: 'Segoe UI',}}>Peepal Graph</Text>

  </View>);
         
 }
 
export default class SpalshScreen extends React.Component<SignInProps> {
  static contextType = AuthContext;

   
 
 
 
  render() {
    return (

<RootStack.Navigator initialRouteName="GroupScreen">
  <RootStack.Screen name="GroupScreen" component={PeopleComponent}
 options={{
  headerShown: false}}
  />
  <RootStack.Screen
    name="GroupDetailScreen"
    component={BottomSheet}
    options={{
      headerShown: false}}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
  <RootStack.Screen
    name="signin"
    component={SignInScreen}
    options={{
      headerShown: false}}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
</RootStack.Navigator>

     
    );
  }
}

const styles = StyleSheet.create({
  container: {
   
    flex: 1,
    backgroundColor:'#5F259F',
    justifyContent:'center',alignContent:'center'
  },
  signinimg: {
    height:50,
    width:250,
    alignSelf:'center'
   
  },
  
});
