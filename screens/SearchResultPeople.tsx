// Copyright (c) Microsoft.
// Licensed under the MIT license.

import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Dimensions,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Button,
  
} from 'react-native';
import { createStackNavigator,HeaderBackButton,StackNavigationProp } from '@react-navigation/stack';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { GraphManager } from '../graph/GraphManager';
import { useNavigation } from '@react-navigation/native';
import  ProfileScreenUser from './ProfileUserScreen'
import { RouteProp } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

const RootStack = createStackNavigator<RootStackParamList>();
const Stack = createStackNavigator();
const numColumns = 2;
const size = Dimensions.get('window').width/numColumns;
const heightSize = Dimensions.get('window').height/2.8;
const PeopleState = React.createContext<PeopleScreenState>({
  loadingPeople: true,
  peopleList: [],
  team_name:''
});

type PeopleScreenState = {
  loadingPeople: boolean;
  peopleList: MicrosoftGraph.User[];
  team_name:string;
}
type RootStackParamList = {
  People: undefined;
  Profile: { upn: string };
  Members:{ list: []};
 
};

type GroupScreenRouteProp = RouteProp<RootStackParamList, 'Members'>;

type GroupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Members'
>;
type Props = {
  route: GroupScreenRouteProp;
  navigation: GroupScreenNavigationProp;
};


const PeopleComponent = () => {
  const peopleState = React.useContext(PeopleState);
  const navigation = useNavigation();
  const title='People ('+peopleState.peopleList.length+')';
  
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
        <ScrollView>
        <Text style={styles.title}>{title}</Text>
        <FlatList
      data={peopleState.peopleList}
      numColumns={2}
      renderItem={({ item }) => {
            return (
                 <TouchableOpacity activeOpacity = { 1 } onPress={() => {console.log('upnnnnnnn',item.userPrincipalName)
                  navigation.navigate('Profile',{upn:item.userPrincipalName});
                }}>
               <View style={styles.itemContainer}>
               <View style={styles.item1}>
               <View style={styles.cardfirstpart}>
               <View style={{justifyContent:'center',alignItems:'center',marginTop:35}}>
                <Image source={require('../images/avatarmale.png')}
                style={{ height: 80, width: 80,justifyContent: 'center',}} />
                </View>
              <View style={styles.peopletextitem}>
                <Text style={styles.peopleName}>{item.displayName}</Text>
                <Text style={styles.peopleEmail}>{item.jobTitle}</Text>
                <TouchableOpacity 
          style={styles.SubmitButtonStyle}
          activeOpacity = { .5 } >
                <Text style={styles.TextStyle}> View </Text>
                </TouchableOpacity>
              </View>
            
              </View>
             </View>
            </View>
               </TouchableOpacity>
              );
          }}
/>

</ScrollView>
      </View>
    );
        
}

export default class PeopleScreen extends React.Component<Props>{
 
  state: PeopleScreenState = {
    loadingPeople: true,
    peopleList: [],
    team_name:''
  };

  async componentDidMount() {
    const{list}=this.props.route.params;
    const title='All users in the organiztion ('+list.length+')';
    try {
     // const people = await GraphManager.getUserPeopleAsync(upn);
      this.setState({
        loadingPeople: false,
        peopleList: list,
        team_name:title
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
 <Stack.Navigator initialRouteName="People">
          <Stack.Screen name='People'
            component={ PeopleComponent }
            options={({navigation, route}) => ({
              headerStyle: {
                backgroundColor: '#fff'
             },
             headerTitle:"People",
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
              ),})}/>

<Stack.Screen name='Profile'
            component={ ProfileScreenUser }
            options={{
              headerShown: false
            }} />

        </Stack.Navigator>
    
       
      </PeopleState.Provider>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff'
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  horizontalview: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal:10,
    marginVertical: 1,
    marginHorizontal: 5,
  },
  peopleItem: {
    flexDirection: 'column',
    paddingHorizontal:10
  },
  peopleName: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily:'Segoe UI',
    alignSelf:'center',
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
    paddingHorizontal:1
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    fontFamily:'Segoe UI',
    marginHorizontal:10,
    marginVertical:10
  },
  peopleEmail: {
    fontWeight: '600',
    fontSize:12,
    fontFamily:'Segoe UI',
    marginTop:5    
  },
  peoplecardview: {
    aspectRatio: 1, flex: 1 ,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    marginVertical:12,
    marginRight:15,
    justifyContent:'center',
    alignItems:'center',
    borderColor:'#dcdcdc',
    borderRadius: 5,
    paddingVertical:20
  },
 
  peopletextitem: {
    flexDirection: 'column',
    alignItems: 'center',
 justifyContent: 'center',
 alignContent:'center',
 alignSelf:'center',
 marginTop:40,
  },
  
itemContainer: {
  width: size,
  height:heightSize
},
item1: {
  flex: 1,
  margin: 6,
  borderRadius:10,
  backgroundColor: 'white',
  borderWidth: 2,
  borderColor:'#dcdcdc', 
 
  
},
cardfirstpart: {
  backgroundColor:'#9DB88F',
  height:60,
  borderTopLeftRadius:10,
  borderTopRightRadius:10
 },
 SubmitButtonStyle: {
   paddingHorizontal:20,
   paddingVertical:5,
   backgroundColor:'#ffffff',
   borderRadius:30,
   borderWidth: 1,
   marginTop:20,
   height:30,
   borderColor: '#5F259F'
 },
 TextStyle:{
     color:'#5F259F',
     textAlign:'center',
     fontFamily:'Segoe UI'
 },
});
