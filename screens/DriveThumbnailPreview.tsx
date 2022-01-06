// Copyright (c) Microsoft.
// Licensed under the MIT license.

import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Modal,
  Platform,
  Share,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity, PermissionsAndroid,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { createStackNavigator,StackNavigationProp,HeaderBackButton } from '@react-navigation/stack';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import moment from 'moment-timezone';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SendFile from '../screens/SendFile';
import Feather from 'react-native-vector-icons/Feather';
import { UserContext } from '../UserContext';
import { GraphManager } from '../graph/GraphManager';
import { RouteProp } from '@react-navigation/native';
import RNFetchBlob from 'react-native-fetch-blob';
import { useNavigation } from '@react-navigation/native';

const RootStack = createStackNavigator<RootStackParamList>();

const { width, height } = Dimensions.get('window');

const Metrics = {
  section: 16,
  halfSection: 8,
};

const CARD_WIDTH = width;
const CARD_HEIGHT = height*0.68;
const IMAGE_HEIGHT = CARD_HEIGHT*0.75;
const NAME_SECTION_HEIGHT = CARD_HEIGHT*0.13;
const LIKE_SECTION_HEIGHT = CARD_HEIGHT*0.3;
const CARD_TITLE_HEIGHT=CARD_HEIGHT*0.1;
const LIKE_SECTION_2 = CARD_HEIGHT*0.06;

const Stack = createStackNavigator();
const DriveItemsState = React.createContext<HomeScreenState>({
  loadingItems: true,
  username:'',
  modifieddate:'',
  image:'',
  title:'',
  id:'',
  imgweburl:'',
  followlist:[],
  profileimg:''
});

type HomeScreenState = {
  loadingItems: boolean,
  username:string,
  modifieddate:string,
  image:string,
  title:string,
  id:string,
  imgweburl:string,
  followlist:[],
  profileimg:string
}
type RootStackParamList = {
  preview: undefined;
  drivepreview:{username:string,modifieddate:string,image:any,title:string,id:string,imgweburl:string,profileimg:string}
  SendMail:{upn:string}
 
};

type GroupScreenRouteProp = RouteProp<RootStackParamList, 'drivepreview'>;

type GroupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'drivepreview'
>;
type Props = {
  route: GroupScreenRouteProp;
  navigation: GroupScreenNavigationProp;
};
const follow = async (item_id:any) => {
  console.log('follow ',item_id)
  try {
   const follow =await GraphManager.followItem(item_id);
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

 const unfollow = async (item_id:any) => {
  console.log('Unfollow ',item_id)

  try {
   const follow =await GraphManager.unfollowItem(item_id);
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
 
//drivepreview:{username:string,modifieddate:string,image:string,title:string}

const HomeComponent = () => {
  const homeState = React.useContext(DriveItemsState);
  const navigation = useNavigation();
  console.log('image '+homeState.image)
  const [select, selectedstate] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState([] as any);

//   homeState.followlist.map((item1:any)=>{
//     if(item1.id==homeState.id){
//       selectedstate(true)
//     }else{
//       selectedstate(false)
//     } 
//   }
// );

  // const selectItem = (index:any) => {
  //   console.log('indexxxx ',selectedIndex)
  //   if(selectedIndex.indexOf(index)>-1){
  //      let newArray = selectedIndex.filter((indexObject:any)=>{
  //        console.log('indexobjj ',newArray)
  //        if(indexObject == index){
  //          console.log('falseee ',false)
  //            return false;
  //        }
  //        console.log('true ',true)

  //        return true;
  //    })
  //    setSelectedIndex(newArray);
  //   }else{
  //    setSelectedIndex([
  //        ...selectedIndex,index
  //      ]);
  //   }
  
  //  };

   const toggle = () => {
    
    let localLiked = select;
  
    // Toggle the state variable liked
    localLiked = !localLiked;
    selectedstate(localLiked)
  };
  let Image_Http_URL ={ uri: 'https://renewin-my.sharepoint.com/personal/keerthana_kp_renewin_com/Documents/Microsoft%20Teams%20Chat%20Files/Screenshot_2021-03-02-11-46-23-407_com.microsoft.teams.jpg'};
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

     
       
     
          <View style={ styles.cardaspects}>

            <View style={styles.horizontalview}>
            {homeState.profileimg==undefined?<Image source={require('../images/avatarmale.png')}
                     style={{ height: 30, width: 30}} />
               : <Image  source={{uri:homeState.profileimg!}}
               style={{ height: 35, width: 35,borderRadius:25}} />}
              <View style={styles.peopleItem}>
                <Text style={styles.peopleName}>{homeState.username}</Text>
                <Text style={styles.peopleEmail}>Modified {homeState.modifieddate}</Text>
              </View>
            </View>

            <View style={styles.imagecard}>
              <Image style={{height:IMAGE_HEIGHT,width:CARD_WIDTH,resizeMode:'contain',marginBottom:20}} source={{uri:homeState.image}}/>
            </View>
           
            <View style={styles.likesection2}>
            <TouchableOpacity  onPress={() => download(homeState.image)}>
              <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
              <AntDesign  name="download" color={'#4e4e4e'} size={24} />
            </View>
           </TouchableOpacity>
           <TouchableOpacity  onPress={() => copyToClipboard(homeState.image)}>
            <View  style={{flex:1.5, alignItems:'center',justifyContent:'center',marginHorizontal:15}}>
            <Feather  name="copy" color={'#4e4e4e'} size={24} />
             </View>
             </TouchableOpacity>
             <TouchableOpacity  onPress={() => navigation.navigate('SendMail',{upn:homeState.imgweburl})}>
            <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
            <FontAwesome  name="send-o" color={'#4e4e4e'} size={24} />
            </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:7, flexDirection:'row', justifyContent:'flex-end',alignContent:'flex-end',}} onPress={() => {toggle(),select===true? unfollow(homeState.id):follow(homeState.id)
           }}>
            <View style={{flex:7, flexDirection:'row', justifyContent:'flex-end',alignContent:'flex-end',}}>
            <Ionicons  name={select===true ?"md-bookmark":"md-bookmark-outline"} color={'#4e4e4e'} size={24} />
            </View>
            </TouchableOpacity>
            </View>
           

          </View>
         


    </View> 
  );
  
  
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
   config(options).fetch('GET', imagurl).then((res) => {
     // do some magic here
   })
  
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

const shareApp = (imagurl:any) =>{
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
      dialogTitle: 'Share TagWag App',
      // iOS only:
      excludedActivityTypes: []
  })
}
const copyToClipboard = (thumbnaa:any) => {
  Clipboard.setString(thumbnaa)
  Toast.show('Copied.', Toast.LONG);
}
export default class PeopleScreen extends React.Component<Props> {
  static contextType = UserContext;

  state: HomeScreenState = {
  loadingItems: true,
  username:'',
  modifieddate:'',
  image:'',
  title:'',
  id:'',
  imgweburl:'',
  followlist:[],
  profileimg:''

  };

  async componentDidMount() {
    const{username,modifieddate,image,title,id,imgweburl,profileimg}=this.props.route.params;
    console.log('iurrrr '+image)
   // image.map()
    try {
     // const recent_files = await GraphManager.getDriveSharedItemsAsync();
     const followItemList = await GraphManager.getfollowItemList();
      this.setState({
        loadingItems: false,
        username:username,
        modifieddate:modifieddate,
        image:image,
        title:title,
        id:id,
        imgweburl:imgweburl,
        followlist:followItemList.value,
        profileimg:profileimg
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
        <RootStack.Navigator initialRouteName="preview">
             <RootStack.Screen name="preview" component={HomeComponent}
                   options={({navigation, route}) => ({
                    headerStyle: {
                      backgroundColor: '#fff'
                   },
                   headerTitle:this.state.title,
                   headerTitleStyle: {
                    color:'black',
                    
                  },navigationOptions:  {
                    tabBarVisible: false,
                  },
                    headerLeft: (props) => (
                      <HeaderBackButton
                        {...props}
                        tintColor={'black'}
                        onPress={() => navigation.goBack(null)}
                      />
                    ),
                                   
    
                    })}/>
           
   <RootStack.Screen name="SendMail" component={SendFile}
                  options={{headerShown: false}}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
     </RootStack.Navigator>
      </DriveItemsState.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fafafa'
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
    alignItems:'center'
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
    fontSize: 12,
    fontFamily:'Segoe UI',

  },
  peopleEmail: {
    fontWeight: '600',
    fontSize:10,
    fontFamily:'Segoe UI',

    
  },
  cardtitle: {
    fontWeight: '600',
    fontSize:14,
    color:'black',
    paddingTop:10,
    alignContent:'center',
    paddingHorizontal:15,
    height:CARD_TITLE_HEIGHT,
    backgroundColor:'#fff',
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
    alignItems:'center',
    marginTop:1,
    justifyContent:'center'
  },
  
});
