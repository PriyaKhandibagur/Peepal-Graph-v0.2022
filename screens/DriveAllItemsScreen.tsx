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
import { Card } from 'react-native-elements';
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

const RootStack = createStackNavigator<RootStackParamList>();
type RootStackParamList = {
  GroupScreen: undefined;
  Home:undefined;
  Search:undefined;
  DriveItems: {upn: string,name:string};
};

const { width, height } = Dimensions.get('window');

const Metrics = {
  section: 16,
  halfSection: 8,
};

const CARD_WIDTH = width * 0.64;
const CARD_HEIGHT = height*0.54;
const IMAGE_HEIGHT = CARD_HEIGHT*0.45;
const NAME_SECTION_HEIGHT = CARD_HEIGHT*0.2;
const LIKE_SECTION_HEIGHT = CARD_HEIGHT*0.2;
const CARD_TITLE_HEIGHT=CARD_HEIGHT*0.1;
const LIKE_SECTION_1 = CARD_HEIGHT*0.075;
const LIKE_SECTION_2 = CARD_HEIGHT*0.1;

const Stack = createStackNavigator();
const DriveItemsState = React.createContext<HomeScreenState>({
  loadingItems: true,
  recent_files:[],

});

type HomeScreenState = {
  loadingItems: boolean;
  recent_files: MicrosoftGraph.DriveItem[];

}


const HomeComponent = () => {
  const homeState = React.useContext(DriveItemsState);
  const navigation = useNavigation();
  console.log('list_response','')
  return (
   
    <View style={styles.container}>
    

      <Modal visible={homeState.loadingItems}>
        <View style={styles.loading}>
          <ActivityIndicator
            color={Platform.OS === 'android' ? '#276b80' : undefined}
            animating={homeState.loadingItems}
            size='large' />
        </View>
      </Modal>

      <FlatList
          data={homeState.recent_files}
          renderItem={({item}) =>
          <TouchableOpacity activeOpacity = { 1 } onPress={() => {
            navigation.navigate('DriveItems',{upn:item.id,name:item.name});
          }}>
          <View style={styles.horizontalview}>
              <Image source={require('../images/drive_folder.png')}
                style={{ height: 40, width: 40}} />
              <View style={styles.peopleItem}>
              <Text style={styles.peopleName}>{item.name}</Text>
              <View style={styles.horizontalviewdot}>
                <Text style={styles.peopleEmail}>Modified</Text>
                <Octicons name="primitive-dot" color='grey' size={10} style={{marginHorizontal:5,marginTop:7}}/>
                <Text style={styles.peopleEmail}>{convertDateTime(item.fileSystemInfo?.lastModifiedDateTime!)}</Text>
                </View>
              <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,marginTop:10}}/>
              </View>
             </View>

          </TouchableOpacity>

          }
      />


    </View> 
  );
  
  
}
const convertDateTime = (dateTime: string): string => {
  return moment(dateTime).format('DD/MM/yyyy h:mm a');
};



export default class PeopleScreen extends React.Component {
  static contextType = UserContext;

  state: HomeScreenState = {
    loadingItems: true,
    recent_files:[],
  };

  async componentDidMount() {
    try {
      const recent_files = await GraphManager.getDriveItemsAsync();
      const result=(recent_files.value).filter((user:any)=>(!user.name.includes(".")))


      this.setState({
        loadingItems: false,
        recent_files: result,

      });
    } catch(error) {
      Alert.alert(
        'Error getting events',
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
      <DriveItemsState.Provider value={this.state}>
        <RootStack.Navigator initialRouteName="GroupScreen">
             <RootStack.Screen name="GroupScreen" component={HomeComponent}
                   options={({navigation, route}) => ({
                    headerStyle: {
                      backgroundColor: '#fff'
                   },
                   headerTitle:'Library',
                   headerTitleStyle: {
                    color:'black',
                    
                  },navigationOptions:  {
                    tabBarVisible: false,
                  },
                    headerLeft: (props) => (
                      <HeaderBackButton
                        {...props}
                        tintColor={'black'}
                        onPress={() => navigation.navigate('Home')}
                      />
                    ),
                    headerRight: () => <Ionicons  onPress={() => navigation.navigate('Search')} style={{marginRight:10,marginTop:5}} name="ios-search-outline" color={'black'} size={24} />               
    
                    })}/>
            <RootStack.Screen name="DriveItems" component={ThumbnailItems}
                  options={{headerShown: false}}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
  <RootStack.Screen
    name="Home"
    component={BottomSheet}
    options={{
      headerShown: false,
     
    }}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
  <RootStack.Screen
    name="Search"
    component={SearchDriveItems}
    options={{
      headerShown: false,
     
    }}/>
       </RootStack.Navigator>

      </DriveItemsState.Provider>
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
  imagecard: {
    height:IMAGE_HEIGHT,
    backgroundColor: '#00377B',
    marginHorizontal:5,
    justifyContent:'center',
    alignItems:'center'
  },
  horizontalview: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal:10,
    marginRight:10,
    paddingVertical:5
  },
  itemImageview:{
    backgroundColor: '#ffffff',
    justifyContent:'center'
  },
  peopleItem: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingHorizontal:10,
    paddingTop:2,
    marginVertical: 1,
    marginLeft: 5,
    marginRight:10,
    width:'100%',

  },
  titlename: {
    fontWeight: '700',
    fontSize: 14,
    marginLeft:10
  },
  peopleName: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Segoe UI',
  },
  peopleEmail: {
    fontWeight: '400',
    fontSize:12,
    color:'black',
    marginTop:3,
    fontFamily: 'Segoe UI',

  },
  cardtitle: {
    fontWeight: '700',
    fontSize:14,
    color:'grey',
    paddingVertical:10,
    paddingHorizontal:15,
    height:CARD_TITLE_HEIGHT,
    backgroundColor:'#efefef'
   },
   cardaspects: {
    height: CARD_HEIGHT,
    backgroundColor: '#ffffff',
    marginVertical:4,

  },
  likesectioncontainer: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding:10,
    height:LIKE_SECTION_HEIGHT,
    
  },
  likesection1: {
    flexDirection: 'row',
    height:LIKE_SECTION_1,
    paddingHorizontal:5
  },
  likesection2: {
    flexDirection: 'row',
    height:LIKE_SECTION_2,
    flex:4,
    marginTop:10
  },
  horizontalviewdot: {
    flexDirection: 'row',
    backgroundColor: '#ffffff', 
  },
  cardaspectsnone: {
    display:'none'
  },
  
});
