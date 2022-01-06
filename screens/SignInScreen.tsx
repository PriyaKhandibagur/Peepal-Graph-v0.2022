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
import { AuthContext } from '../AuthContext';
import { GraphAuthProvider } from '../graph/GraphAuthProvider';

type SignInProps = {
  navigation: StackNavigationProp<ParamListBase>;
};

export default class SignInScreen extends React.Component<SignInProps> {
  static contextType = AuthContext;

   
  _signInAsync = async () => {
    await this.context.signIn();
   // this.props.navigation.navigate('Main')
  };

  componentDidMount() {
    const clientOptions = {
  authProvider: new GraphAuthProvider()
};
    // this.props.navigation.setOptions({
    //  // title: 'Please sign in',
    // //  headerShown: false
    // });
  }
 
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor = '#fff' />
        <Text style={{fontSize:30,fontWeight:'200', color:'#5F259F',alignSelf:'center',fontFamily: 'Segoe UI',}}>Welcome to Peepal Graph</Text>

        <TouchableOpacity style={{    top:20,}} onPress={this._signInAsync} >
<Image  source={require('../images/ms-symbollockup_signin_light.png')}
         style={styles.signinimg} />
         </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   
    flex: 1,
    backgroundColor:'#fff',
    justifyContent:'center',alignContent:'center'
  },
  signinimg: {
    flexDirection:'row',
    height:50,
    width:250,
    alignSelf:'center',
    resizeMode:'contain'
   
  },
  
});
