// Adapted from https://reactnavigation.org/docs/auth-flow
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Text,StatusBar,Image,
  StyleSheet,
  View,
} from 'react-native';

export default class AuthLoadingScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
    <StatusBar backgroundColor = '#5F259F' />
    <Image source={require('../images/peepalgraph_logo.png')}
style={{height:150,width:150,justifyContent:'center',alignSelf:'center',alignContent:'center',margin:-30}} />

<Text style={{fontSize:30,fontWeight:'200', color:'#fff',alignSelf:'center',fontFamily: 'Segoe UI',}}>Peepal Graph</Text>

  </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#5F259F'
  },
  statusText: {
    marginTop: 10,
  },
});