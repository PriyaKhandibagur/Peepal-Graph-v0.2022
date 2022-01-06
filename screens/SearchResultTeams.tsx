// Copyright (c) Microsoft.
// Licensed under the MIT license.

import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import { createStackNavigator,HeaderBackButton,StackNavigationProp } from '@react-navigation/stack';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { GraphManager } from '../graph/GraphManager';
import { useNavigation } from '@react-navigation/native';
import TabGroupsScreen from '../screens/TeamsDetailsScreen';
import { RouteProp } from '@react-navigation/native';
import { NavigationContainer,ParamListBase } from '@react-navigation/native';

const RootStack = createStackNavigator<RootStackParamList>();

const Stack = createStackNavigator();


const PeopleState = React.createContext<PeopleScreenState>({
  loadingPeople: true,
  TeamList: [],
  title:''
});
type PeopleScreenState = {
  loadingPeople: boolean;
  TeamList: MicrosoftGraph.Team[];
  title:string;
}
type RootStackParamList = {
  GroupScreen: undefined;
  GroupDetailScreen: { upn: string ,name:string,description:string};
  Groups:{ list: []};

};

type GroupScreenRouteProp = RouteProp<RootStackParamList, 'Groups'>;

type GroupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Groups'
>;
type Props = {
  route: GroupScreenRouteProp;
  navigation: GroupScreenNavigationProp;
};


const PeopleComponent = () => {
  const peopleState = React.useContext(PeopleState);
  const navigation = useNavigation();
  const titlename='Groups ('+peopleState.TeamList.length+')';

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
        <Text style={styles.title}>{titlename}</Text>
        <FlatList data={peopleState.TeamList}
          renderItem={({item}) =>
          <TouchableOpacity activeOpacity={1} onPress={() => {console.log('dataaa')
             navigation.navigate('GroupDetailScreen',{upn: item.id ,name:item.displayName,description:item.description})} }>
          
            
            <View style={styles.horizontalview}>
              <Image source={require('../images/avatarmale.png')}
                style={{ height: 40, width: 40}} />
              <View style={styles.peopleItem}>
                <Text style={styles.peopleName}>{item.displayName}</Text>
                <Text numberOfLines={1.5}  style={styles.peopleEmail}>{item.description}</Text>
                <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 2,marginTop:10}}/>
              </View>
            </View>
            </TouchableOpacity>
          }
      />  
      </ScrollView>         
      </View>
    );
        
}

export default class PeopleScreen extends React.Component<Props>{
 
  state: PeopleScreenState = {
    loadingPeople: true,
    TeamList: [],
    title:''
  };

  async componentDidMount() {
    const{list}=this.props.route.params;
    const titlename='Groups ('+list.length+')';

    try {
      const teams = await GraphManager.getTeamsAsync();
      
      this.setState({
        loadingPeople: false,
        TeamList: list,
        title:titlename
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
   headerTitle:"Groups",
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
    ), })}
  />
  <RootStack.Screen
    name="GroupDetailScreen"
    component={TabGroupsScreen}
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
    backgroundColor:'#fff'
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#fff'

  },
  horizontalview: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingTop:10,
    paddingHorizontal:10,
    marginHorizontal: 5,
  },
  peopleItem: {
    flexDirection: 'column',
    paddingHorizontal:20,
    width:'100%',
    alignContent:'center',
    justifyContent:'center',
  },
  peopleName: {
    fontWeight: '600',
    fontFamily: 'Segoe UI',
    fontSize: 16
  },
  peopleEmail: {
    fontWeight: '200',
    fontSize:12,
    marginRight:10,
    fontFamily: 'Segoe UI',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    fontFamily:'Segoe UI',
    marginHorizontal:10,
    marginVertical:10
  },
  
});
