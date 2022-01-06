// Copyright (c) Microsoft.
// Licensed under the MIT license.

import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity, TouchableHighlight,
} from 'react-native';
import { createStackNavigator,HeaderBackButton } from '@react-navigation/stack';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../UserContext';
import { GraphManager } from '../graph/GraphManager';
import ThumbnailItems from '../screens/DriveItemNavigationScreen';
import SearchDriveItems from '../screens/SearchDriveItems';
import BottomSheet from '../screens/BottomSheet';
import moment from 'moment-timezone';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';

const RootStack = createStackNavigator<RootStackParamList>();
type RootStackParamList = {
 
  Home:undefined;
 };


const Stack = createStackNavigator();
const DriveItemsState = React.createContext<HomeScreenState>({
  loadingItems: true,
 

});

type HomeScreenState = {
  loadingItems: boolean;

}


const HomeComponent = () => {
  const homeState = React.useContext(DriveItemsState);
  const navigation = useNavigation();
  console.log('list_response','')
  return (
   
    <View style={styles.container}>
    
      <WebView source={{ uri: 'https://www.peepalgraph.com/faq' }} />
      
    </View> 
  );
  
  
}


export default class PeopleScreen extends React.Component {
  static contextType = UserContext;

 

  render() {
    return (
        <RootStack.Navigator initialRouteName="Home">
             <RootStack.Screen name="Home" component={HomeComponent}
                   options={({navigation, route}) => ({
                    headerStyle: {
                      backgroundColor: '#fff'
                   },
                   headerTitle:'Help Centre',
                   headerTitleStyle: {
                    color:'black',
                    
                  },navigationOptions:  {
                    tabBarVisible: false,
                  },
                    headerLeft: (props) => (
                      <HeaderBackButton
                        {...props}
                        tintColor={'black'}
                        onPress={() => navigation.goBack()}
                      />
                    ),
    
                    })}/>
            
  
       </RootStack.Navigator>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#efefef'
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    flex:1
  },
  firstsection: {
    padding:10,
    marginTop:5,
  },
  
});
