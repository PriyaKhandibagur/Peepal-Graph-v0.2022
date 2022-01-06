// Copyright (c) Microsoft.
// Licensed under the MIT license.

import React, {useState} from 'react';
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
  Dimensions,Share,PermissionsAndroid,
  Clipboard, TouchableOpacity,
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import { createStackNavigator,StackNavigationProp,HeaderBackButton} from '@react-navigation/stack';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-simple-toast';
import { UserContext } from '../UserContext';
import { GraphManager } from '../graph/GraphManager';
import ThumbnailItems from '../screens/DriveItemNavigationScreen';
import SendFile from '../screens/SendFile';
import { RouteProp } from '@react-navigation/native';
import moment from 'moment-timezone';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const RootStack = createStackNavigator<RootStackParamList>();
type RootStackParamList = {
  GroupScreen: undefined;
  SendMail:{upn:string};
  GroupDetailScreen: { upn: string,channelid:string,name:string};
};
type GroupScreenRouteProp = RouteProp<RootStackParamList, 'GroupDetailScreen'>;

type GroupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GroupDetailScreen'
>;
type Props = {
  route: GroupScreenRouteProp;
  navigation: GroupScreenNavigationProp;
};

const { width, height } = Dimensions.get('window');

const Metrics = {
  section: 16,
  halfSection: 8,
};

const CARD_WIDTH = width;
const CARD_HEIGHT = height*0.6;
const IMAGE_HEIGHT = CARD_HEIGHT*0.73;
const NAME_SECTION_HEIGHT = CARD_HEIGHT*0.14;
const LIKE_SECTION_2 = CARD_HEIGHT*0.17;

const Stack = createStackNavigator();
const HomeScreenState = React.createContext<HomeScreenState>({
  loadingItems: true,
  recent_files:[],
  name:'',
  followlist:[],
  groupid:''
});

type HomeScreenState = {
  loadingItems: boolean;
  recent_files: MicrosoftGraph.DriveItem[];
  name:string;
  followlist:MicrosoftGraph.DriveItem[];
  groupid:string;


}

const follow = async (groupid:any,item_id:any) => {

  console.log('iiiiddd ',item_id)
  try {
   const follow =await GraphManager.followItemteams(groupid,item_id);
   Toast.show('bookmarked', Toast.LONG);

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

 const unfollow = async (groupid:any,item_id:any) => {
  console.log('unniiiiddd ',item_id)

  try {
   const follow =await GraphManager.unfollowItemteams(groupid,item_id);
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
  const homeState = React.useContext(HomeScreenState);
  const navigation = useNavigation();
  console.log('list_response',homeState.recent_files)
  const [selectedIndex, setSelectedIndex] = useState([] as any);

  const selectItem = (index:any) => {
    console.log('1111  ',selectedIndex.indexOf(index))

    if(selectedIndex.indexOf(index)>-1){
      console.log('12221  ',selectedIndex.indexOf(index))
       let newArray = selectedIndex.filter((indexObject:any)=>{
         if(indexObject == index){
             return false;
         }
         return true;
     })
     setSelectedIndex(newArray);
    }else{
      console.log('13331  ',selectedIndex.indexOf(index))
     setSelectedIndex([
         ...selectedIndex,index
       ]);
    }
  
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
          data={homeState.recent_files}
          ListEmptyComponent={EmptyListMessage}
          renderItem={({item,index}) =>
          <View style={styles.cardaspects}>

            <View style={styles.horizontalview}>
              <Image source={require('../images/avatarmale.png')}
                    style={{ height: 30, width: 30}} />
              <View style={styles.peopleItem}>
                <Text style={styles.peopleName}>{item.lastModifiedBy?.user?.displayName}</Text>
                <View style={styles.horizontalviewdot}>
                <Text style={styles.peopleEmail}>Modified</Text>
                <Octicons name="primitive-dot" color='grey' size={10} style={{marginHorizontal:5,marginTop:3}}/>
                <Text style={styles.peopleEmail}>{convertDateTime(item.fileSystemInfo?.lastModifiedDateTime!)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.imagecard}>
            {item.thumbnails?.map((item1:any)=>(
              <Image source={{uri:item1.large.url}}
              style={{height:IMAGE_HEIGHT,width:'100%',resizeMode:"stretch" }} /> 
          
))}
            </View>



            <View style={styles.likesection2}>
              <TouchableOpacity  onPress={() => download(item.thumbnails)}>
              <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
              <AntDesign  name="download" color={'#4e4e4e'} size={24} />
            </View>
           </TouchableOpacity >
           <TouchableOpacity  onPress={() => copyToClipboard(item.webUrl)}>
            <View  style={{flex:1, alignItems:'center',justifyContent:'center',marginHorizontal:15}}>
            <Feather  name="copy" color={'#4e4e4e'} size={24} />
             </View>
             </TouchableOpacity>
             <TouchableOpacity  onPress={() => navigation.navigate('SendMail',{upn:item.webUrl})}>
            <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
            <FontAwesome  name="send-o" color={'#4e4e4e'} size={24} />
            </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:7, flexDirection:'row', justifyContent:'flex-end',alignContent:'flex-end',}} onPress={() => {console.log('iiiii ',item.id), homeState.followlist.find(v => v === item.id)?selectedIndex.indexOf(index)>-1:selectItem(index),selectedIndex.indexOf(index)>-1  ? unfollow(homeState.groupid,item.id):follow(homeState.groupid,item.id)
           }}>
            <View style={{flex:7, flexDirection:'row', justifyContent:'flex-end',alignContent:'flex-end',}}>
            <Ionicons  name={selectedIndex.indexOf(index)>-1 ?"md-bookmark":"md-bookmark-outline"} color={'#4e4e4e'} size={24} />
            </View>
            </TouchableOpacity>
            </View>
           

          </View>
          }
      />


    </View> 
  );
  
  
}
const convertDateTime = (dateTime: string): string => {
  return moment(dateTime).format('DD/MM/yyyy h:mm a');
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
const shareApp = (imagurl:any) =>{
  console.log('msg ',imagurl)
  let  text = ''
  if(Platform.OS === 'android')
      text = text.concat(imagurl)
  else
      text = text.concat(imagurl)

  Share.share({
     // subject: 'Download TagWag App Now',
      title: 'Share Image',
      message: text,
      url: imagurl,

  }, {
      // Android only:
      dialogTitle: 'Share',
      // iOS only:
      excludedActivityTypes: []
  })

 

}
const download = (imagurl:any) =>{
  requestCameraPermission(imagurl);
}
const requestCameraPermission = async (imagurl:any) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const { config, fs } = RNFetchBlob
      const date=new Date();
      let PictureDir = fs.dirs.PictureDir // this is the pictures directory. You can check the available directories in the wiki.
      let options = {
        fileCache: true,
        addAndroidDownloads : {
          useDownloadManager : true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
          notification : false,
          path:  PictureDir + "/me_"+Math.floor(date.getTime() + date.getSeconds() / 2), // this is the path where your downloaded file will live in
          description : 'Downloading image.'
        }
      }
      config(options).fetch('GET', imagurl[0].large.url).then((res) => {
        // do some magic here
      })
      
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

const copyToClipboard = (thumbnaa:any) => {
  Clipboard.setString(thumbnaa)
  Toast.show('Copied.', Toast.LONG);
}



export default class PeopleScreen extends React.Component<Props>{
  static contextType = UserContext;

  state: HomeScreenState = {
    loadingItems: true,
    recent_files:[],
    name:'',
    followlist:[],
    groupid:''
  };

  async componentDidMount() {
    const{upn,channelid,name}=this.props.route.params;

    console.log(upn + channelid+name);
    try {
      const recent_files = await GraphManager.getTeamFilesAsync(upn,channelid);
      const followItemList = await GraphManager.getfollowItemList();

      this.setState({
        loadingItems: false,
        recent_files: recent_files.value,
        name:name,
        followlist:followItemList.value,
        groupid:upn
      });
     
      const recent_files1 = await GraphManager.getTeamFilesAsync(upn,channelid);

     // console.log(recent_files)
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
      <HomeScreenState.Provider value={this.state}>
        <RootStack.Navigator initialRouteName="GroupScreen">
             <RootStack.Screen name="GroupScreen" component={HomeComponent}
                   options={({navigation, route}) => ({
                    headerStyle: {
                      backgroundColor: '#fff'
                   },
                   headerTitle:this.state.name,
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
            <RootStack.Screen name="GroupDetailScreen" component={ThumbnailItems}
                  options={{headerShown: false}}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
  <RootStack.Screen name="SendMail" component={SendFile}
                  options={{headerShown: false}}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
       </RootStack.Navigator>

      </HomeScreenState.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#9e9e9e'
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
    backgroundColor: '#ffffff',
    justifyContent:'center',
    alignItems:'center',
  },
  horizontalview: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding:10,
    height:NAME_SECTION_HEIGHT,
    
  },
  itemImageview:{
    backgroundColor: '#ffffff',
    justifyContent:'center'
  },
  peopleItem: {
    flexDirection: 'column',
    paddingHorizontal:10
  },
  titlename: {
    fontWeight: '700',
    fontSize: 14,
    marginLeft:10,
    fontFamily:'Segoe UI',

  },
  peopleName: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily:'Segoe UI',

  },
  peopleEmail: {
    fontWeight: '600',
    fontSize:12,
    fontFamily:'Segoe UI',

    
  },
 
   cardaspects: {
    height: CARD_HEIGHT,
    backgroundColor: '#e0e0e0',
    

  },
 
  
  likesection2: {
    flexDirection: 'row',
    flexWrap:'nowrap',
    flex:10,
    paddingHorizontal:10,
    height:LIKE_SECTION_2,
    backgroundColor:'#ffffff',
    marginBottom:5,
    alignItems:'center',
    justifyContent:'center'
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