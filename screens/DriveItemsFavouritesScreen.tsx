// Copyright (c) Microsoft.
// Licensed under the MIT license.

import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  TouchableHighlight,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity, SectionList,
} from 'react-native';
import { Card } from 'react-native-elements';
import { createStackNavigator,HeaderBackButton } from '@react-navigation/stack';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { UserContext } from '../UserContext';
import { GraphManager } from '../graph/GraphManager';
import moment from 'moment-timezone';
import Octicons from 'react-native-vector-icons/Octicons';
import BookmarkPreview from '../screens/BookmarkPreview';
import BottomSheet from '../screens/DrawerMenuScreen';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';


const { width, height } = Dimensions.get('window');
const RootStack = createStackNavigator<RootStackParamList>();
type RootStackParamList = {
  back:undefined;
  Home:undefined;
  DriveItems: {driveid: string,itemid:string,username:string,modifieddate:string,title:string,imgweburl:string,upn:string};

};
const Metrics = {
  section: 16,
  halfSection: 8,
};
const CARD_WIDTH = width;

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
  followlist:[]
});

type HomeScreenState = {
  loadingItems: boolean;
  recent_files: MicrosoftGraph.DriveItem[];
  followlist:MicrosoftGraph.DriveItem[];
}

const follow = async (driveid:any,item_id:any) => {
  
  try {
   const follow =await GraphManager.drivefollowItem(driveid,item_id);
   Toast.show('bookmarked.', Toast.LONG);

  }catch(error) {
   Alert.alert(
     'Error getting messages list',
     JSON.stringify(error),
     [
       {
         text: 'OK'
       }
     ],
     { cancelable: false }
   );
  }
 
  
 };

 const unfollow = async (driveid:any,item_id:any) => {
  console.log('idddddd '+item_id+' '+driveid)

  try {
   const follow =await GraphManager.driveunfollowItem(driveid,item_id);
   Toast.show('bookmark cancelled.', Toast.LONG);

  
 
  }catch(error) {
   Alert.alert(
     'Error getting messages list',
     JSON.stringify(error),
     [
       {
         text: 'OK'
       }
     ],
     { cancelable: false }
   );
  }
 
  
 };
 

const HomeComponent = () => {
  const homeState = React.useContext(DriveItemsState);
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState([] as any);

  

  const selectItem = (index:any) => {
    if(selectedIndex.indexOf(index)>-1){
       let newArray = selectedIndex.filter((indexObject:any)=>{
         if(indexObject == index){
             return false;
         }
         return true;
     })
     setSelectedIndex(newArray);
    }else{
     setSelectedIndex([
         ...selectedIndex,index
       ]);
    }
  
   };
   const EmptyListMessage = ({item}:any) => {
    return (
      // Flat List Item
      <View style={{flexDirection:'column',justifyContent:'center',alignContent:'center',alignItems:'center', height:'100%', backgroundColor:'#ffffff'}}>
      <Text
        style={styles.emptyListStyle}
        >
        No Data Found
      </Text>
      </View>
    );
  };
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
          data={homeState.followlist}
          keyExtractor={(item) => `row-${item.id}`}
          ListEmptyComponent={EmptyListMessage}
          renderItem={({item,index}) =>
         <View>
           <TouchableOpacity activeOpacity = { 1 }onPress={() => navigation.navigate('DriveItems',{driveid:item.parentReference?.driveId,itemid:item.id,username:item.lastModifiedBy?.user?.displayName,modifieddate:convertDateTime(item.lastModifiedDateTime!),title:item.name,imgweburl:item.webUrl,upn:item.lastModifiedBy?.user?.id})} >
          <View style={styles.horizontalview}>
          {/* <Image source={require('../images/homepage.jpeg')}
                style={{ height: 40, width: 60,marginLeft:5}} /> */}
              <View style={styles.peopleItem}>
              <Text style={styles.peopleName}>{item.name}</Text>
              <View style={styles.horizontalviewdot}>
                <Text style={styles.peopleEmail}>Modified</Text>
                <Octicons name="primitive-dot" color='grey' size={10} style={{marginHorizontal:5,marginTop:8}}/>
                <Text style={styles.peopleEmail}>{convertDateTime(item.lastModifiedDateTime!)}</Text>
                </View>
              </View>
              <TouchableOpacity style={{justifyContent:'center',alignContent:'center',alignItems:'center'}} onPress={() => {homeState.followlist.find(v => v === item.id)?selectedIndex.indexOf(index)>-1:selectItem(index),selectedIndex.indexOf(index)>-1  ? follow(item.parentReference?.driveId, item.id):unfollow(item.parentReference?.driveId,item.id)
           }}>
              <View style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
              <Image source={selectedIndex.indexOf(index)>-1 ?require('../images/bookmark.png'):require('../images/bookmark-filled.png')}
                style={{ height: 20, width: 20}} />
             </View>
             </TouchableOpacity>
             </View>
             </TouchableOpacity>
              <View style={(index===homeState.followlist.length-1?{display:'none'}:{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,marginHorizontal:10})}
              />
             </View>

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
    followlist:[]
  };

  async componentDidMount() {
    try {
      const followItemList = await GraphManager.getfollowItemList();
      const thumbnailitems = await GraphManager.getDriveThumbnailFilesAsync('01FYPXDEPAMQFM2II6EBHLMQK7QWK3SEWI');
    //  const followItemList = await GraphManager.getfollowItemList();

      this.setState({
        loadingItems: false,
        recent_files: thumbnailitems.value,
        followlist:followItemList.value
      });
      console.log('followlistitems ',followItemList.value)
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
        <Stack.Navigator>
          <Stack.Screen name='Home'
            component={ HomeComponent }
            options={({navigation, route}) => ({
              headerStyle: {
                backgroundColor: '#fff'
             },
             headerTitle:'Bookmarks',
             headerTitleStyle: {
              color:'black',
              
            },navigationOptions:  {
              tabBarVisible: false,
            },
              headerLeft: (props) => (
                <HeaderBackButton
                  {...props}
                  tintColor={'black'}
                  onPress={() => navigation.navigate('back')}
                />
              ),})} />
 <Stack.Screen name='DriveItems'
            component={ BookmarkPreview }
            options={({navigation, route}) => ({
              headerShown:false})} />
              <Stack.Screen name='back'
            component={ BottomSheet }
            options={({navigation, route}) => ({
              headerShown:false})} />
        </Stack.Navigator>
      </DriveItemsState.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#ffffff'
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
    paddingVertical:10
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
    marginHorizontal: 5,
    width:'90%',

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
    marginTop:5,
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
  emptyListStyle: {
    padding: 10,
    fontSize: 18,
   
  }, 
  
});
function index(index: any) {
  throw new Error('Function not implemented.');
}

