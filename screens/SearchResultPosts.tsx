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
  ScrollView,
  View,
  Button,
  
} from 'react-native';
import { createStackNavigator,HeaderBackButton,StackNavigationProp } from '@react-navigation/stack';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { GraphManager } from '../graph/GraphManager';
import { useNavigation } from '@react-navigation/native';
import  ProfileScreenUser from './ProfileUserScreen'
import { RouteProp } from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import moment from 'moment-timezone';
import { slice } from 'lodash';
const RootStack = createStackNavigator<RootStackParamList>();
const Stack = createStackNavigator();
const numColumns = 2;
const size = Dimensions.get('window').width/numColumns;
const heightSize = Dimensions.get('window').height/2.8;
const jobtitle:any='';
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
  const title='Posts ('+peopleState.peopleList.length+')';

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
      data={peopleState.peopleList.slice(0,20)}
          renderItem={({ item }:any) => (
            <TouchableOpacity activeOpacity={1}>
           
            <View style={styles.horizontalviewitem}>
              <Image source={require('../images/homepage.jpeg')}
                style={{ height: 50, width: 80,marginLeft:5}} />
              <View style={styles.peopleItem}>
                <Text style={styles.peopleName}>{item.name}</Text>
                <Text style={styles.username}>{item.lastModifiedBy?.user?.displayName}</Text>
                <View style={styles.horizontalviewdot}>
                <Text style={styles.peopleEmail}>Modified</Text>
                <Octicons name="primitive-dot" color='grey' size={10} style={{marginHorizontal:5,marginTop:3}}/>
                <Text style={styles.peopleEmail}>{convertDateTime(item.fileSystemInfo?.lastModifiedDateTime!)}</Text>
                </View>
              </View>
            </View>
            <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,marginVertical:10}}/>
            </TouchableOpacity>
          )}
/>

      </ScrollView>
      </View>
    );
        
}
const convertDateTime = (dateTime: string): string => {
  return moment(dateTime).format('DD/MM/yyyy');
};

const getdesignation= (id:string):any|undefined => {
  // designation
   console.log('entering1111')
   const designation1 = async () => {
     try{
     console.log('entering'+id)
          const designationval:any = await GraphManager.getUserDetailsAsync(id);
       console.log('vvvvvv '+designationval.jobTitle)
      // jobtitle=designationval.jobTitle;
       console.log('ppp '+jobtitle)
     }
     catch(error) {
      console.log('text', error);
      
    } 
   }
 //  console.log('jobbb', jobtitle);
 
  // return 'jobtitle';
   designation1();
   return "jobtitle"


 }
export default class PeopleScreen extends React.Component<Props>{
 
  state: PeopleScreenState = {
    loadingPeople: true,
    peopleList: [],
    team_name:''
  };

  async componentDidMount() {
    const{list}=this.props.route.params;
    const title='People ('+list.length+')';
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
             headerTitle:"Posts",
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
    fontSize:10,
    fontFamily:'Segoe UI',
   
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
 horizontalviewitem: {
  flexDirection: 'row',
  backgroundColor: '#ffffff',
  marginHorizontal: 10,
  marginTop:10
},
horizontalviewdot: {
  flexDirection: 'row',
  backgroundColor: '#ffffff', 
},
username: {
  fontWeight: '600',
  fontSize: 12,
  fontFamily:'Segoe UI',
  justifyContent:'center',
  alignContent:'center',
  alignItems:'center',
  paddingHorizontal:1
},
});
