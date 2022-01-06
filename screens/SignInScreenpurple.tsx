// Copyright (c) Microsoft.
// Licensed under the MIT license.

// Adapted from https://reactnavigation.org/docs/auth-flow
import React, {useState, useEffect} from 'react';
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
import { AuthManager } from '../auth/AuthManager';

type SignInProps = {
  navigation: StackNavigationProp<ParamListBase>;
};
//const [signinbtn, setsigninbtn] = useState(false);

export default class SignInScreen extends React.Component<SignInProps> {
  static contextType = AuthContext;
  
  //  navhome = async () => {
  //   let userToken = null
  //   // TEMPORARY
    
  //     const token = await AuthManager.getAccessTokenAsync();
  //     console.log('splash '+token)

  //     if(token==null){
  //       console.log('tttttt '+token)
  //       setsigninbtn(false)
  //     }else{
  //       console.log('bbbbb '+token)
  //      setsigninbtn(true)

  //     }

  // }; // console.log('splash '+token);
 
  _signInAsync = async () => {
    await this.context.signIn();
  };

  componentDidMount() {
  //  const navhome = async () => {
  //     let userToken = null
  //     // TEMPORARY
      
  //       const token = await AuthManager.getAccessTokenAsync();
  //       console.log('splash '+token)
  
  //       if(token==null){
  //         console.log('tttttt '+token)
  //         setsigninbtn(false)
  //       }else{
  //         console.log('bbbbb '+token)
  //        setsigninbtn(true)
  
  //       }
  
  //   }; // console.log('splash '+token);
    // this.props.navigation.setOptions({
    //   title: 'Please sign in',
    //   headerShown: false
    // });
  }

  render() {
   
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor = '#5F259F' />
        <Image source={require('../images/peepalgraph_logo.png')}
style={{height:150,width:150,justifyContent:'center',alignSelf:'center',alignContent:'center',margin:-30}} />

<Text style={{fontSize:30,fontWeight:'200', color:'#fff',alignSelf:'center',fontFamily: 'Segoe UI',}}>Peepal Graph</Text>

        <TouchableOpacity  style= { {   top:160,}} onPress={this._signInAsync} >
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
    backgroundColor:'#5F259F',
    justifyContent:'center',alignContent:'center'
  },
  signinimg: {
    
    height:50,
    width:250,
    alignSelf:'center'
   
  },
  
});
