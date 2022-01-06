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
  TouchableOpacity,
  View,
} from 'react-native';
//import TextAvatar from 'react-native-text-avatar';
import { createStackNavigator,HeaderBackButton } from '@react-navigation/stack';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { GraphManager } from '../graph/GraphManager';
import { useNavigation } from '@react-navigation/native';
import TabGroupsScreen from '../screens/TeamsDetailsScreen';
import SearchTeamsName from '../screens/SearchTeamsNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer,ParamListBase } from '@react-navigation/native';
import TextAvatar from 'react-native-text-avatar';
import UserAvatar from 'react-native-user-avatar';
const RootStack = createStackNavigator<RootStackParamList>();


const Stack = createStackNavigator();


const PeopleState = React.createContext<PeopleScreenState>({
  loadingPeople: true,
  TeamList: []
});

type RootStackParamList = {
  GroupScreen: undefined;
  Search:undefined;
  GroupDetailScreen: { upn: string ,name:string,description:string};
};

type PeopleScreenState = {
  loadingPeople: boolean;
  TeamList: MicrosoftGraph.Team[];
}


const PeopleComponent = () => {
  const peopleState = React.useContext(PeopleState);
  const navigation = useNavigation();
  
    return(
      <View style={styles.container}>
        <Modal visible={peopleState.loadingPeople}>
          <View style={styles.loading}>
            <ActivityIndicator
              color={Platform.OS === 'android' ? '#276b80' : undefined}
              animating={peopleState.loadingPeople}
              size='large' />
          </View>
        </Modal>

        <FlatList data={peopleState.TeamList}
          renderItem={({item}) =>
          <TouchableOpacity activeOpacity={1} onPress={() => {console.log('dataaa')
             navigation.navigate('GroupDetailScreen',{upn: item.id ,name:item.displayName,description:item.description})} }>
          
            
            <View style={styles.horizontalview}>
            <View style={{width:50,height:50,alignSelf:'center',justifyContent:'center',alignContent:'center'}}>
<UserAvatar  borderRadius={50/2} size={50} name={item.displayName} bgColors={['#a52a2a', '#5f9ea0','#deb887', '#0000ff','#dc143c','#008b8b','#9932cc','#ff1493','#483d8b','#696969','#228b22']}/>
</View> 
              <View style={styles.peopleItem}>
                <Text style={styles.peopleName}>{item.displayName}</Text>
                <Text numberOfLines={1.5} style={styles.peopleEmail}>{item.description}</Text>
                <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 2,marginTop:15}}/>
              </View>
            </View>
            </TouchableOpacity>
          }
      />           
      </View>
    );
        
}

export default class PeopleScreen extends React.Component{
 
  state: PeopleScreenState = {
    loadingPeople: true,
    TeamList: []
  };

  async componentDidMount() {
    try {
      const teams = await GraphManager.getTeamsAsync();
      
      this.setState({
        loadingPeople: false,
        TeamList: teams.value
      });
    } catch(error) {
        Alert.alert(
        'Error getting people list',
        JSON.stringify(error),
        [
          {
            text: 'OK'
          }
        ],
        { cancelable: false }
      );
    }
  }

  render() {
    return (
      <PeopleState.Provider value={this.state}>

<RootStack.Navigator initialRouteName="GroupScreen">
  <RootStack.Screen name="GroupScreen" component={PeopleComponent}
  options={({navigation, route}) => ({
    headerStyle: {
      backgroundColor: '#fff'
   },
   headerTitle:'Teams',
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
    ), headerRight: () => <Ionicons  onPress={() => navigation.navigate('Search')} style={{marginRight:10,marginTop:5}} name="ios-search-outline" color={'black'} size={24} />               
  })}
  />
  <RootStack.Screen
    name="GroupDetailScreen"
    component={TabGroupsScreen}
    options={{
      headerShown: false}}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
  <RootStack.Screen
    name="Search"
    component={SearchTeamsName}
    options={{
      headerShown: false}}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
</RootStack.Navigator>



       
      </PeopleState.Provider>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#ffffff'
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  horizontalview: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingTop:10,
    paddingHorizontal:10,
    marginRight: 10,
  },
  peopleItem: {
    flexDirection: 'column',
    paddingRight:20,
    paddingLeft:10,
    width:'100%',
    alignContent:'center',
    justifyContent:'center',
  },
  peopleName: {
    fontWeight: '600',
    fontFamily: 'Segoe UI',
    fontSize: 16,
    paddingTop:10
  },
  peopleEmail: {
    fontWeight: '200',
    fontSize:12,
    marginRight:10,
    fontFamily: 'Segoe UI',
  }
  
});
