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
const CARD_HEIGHT = height*0.99;
const IMAGE_HEIGHT = CARD_HEIGHT*0.99;
const NAME_SECTION_HEIGHT = CARD_HEIGHT*0.05;
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
  profileimg:'',
  driveid:'',
  followlist:[],
  followstate:false


});

type HomeScreenState = {
  loadingItems: boolean,
  username:string,
  modifieddate:string,
  image:string,
  title:string,
  id:string,
  imgweburl:string,
  profileimg:string,
  driveid:string,
  followlist:[]
  followstate:boolean

}
type RootStackParamList = {
  preview: undefined;
  HomePreview:{username:string,modifieddate:string,image:any,title:string,id:string,imgweburl:string,profileimg:string,driveid:string,followstate:boolean}
  SendMail:{upn:string}
 
};

type GroupScreenRouteProp = RouteProp<RootStackParamList, 'HomePreview'>;

type GroupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HomePreview'
>;
type Props = {
  route: GroupScreenRouteProp;
  navigation: GroupScreenNavigationProp;
};
const follow = async (driveid:any,item_id:any) => {
  console.log('follow ',item_id)
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
  console.log('Unfollow ',item_id)

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
 
//drivepreview:{username:string,modifieddate:string,image:string,title:string}

const HomeComponent = () => {
  const homeState = React.useContext(DriveItemsState);
  const navigation = useNavigation();
 // console.log('image '+homeState.image)
  const [select, selectedstate] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState([] as any);
  console.log('stateeee '+homeState.followstate)

  // if(homeState.followstate==true)
  // selectedstate(true);
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
      <Modal>
      {/* <View style={styles.searchbar}>
        <View style={styles.leftsection}>
        <TouchableOpacity onPress={() => {console.log('dataaa')
          navigation.goBack() } }>
        <View style={styles.leftsectionimg}>
        <AntDesign  name="arrowleft" color={'#000'} size={24} />
                </View>
                </TouchableOpacity>
                <Text style={{fontFamily:'Segoe UI',flex:1,marginTop:2, padding: 10,color:'#000',fontSize:22,justifyContent:'flex-start',fontWeight:'600'}}>{homeState.title}</Text>
                </View>
                </View>
                <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,}}/> */}
          <View style={ styles.cardaspects}>
            <View style={{height:IMAGE_HEIGHT}}>
            
            <View style={styles.imagecard}>
              <Image style={{height:IMAGE_HEIGHT,width:CARD_WIDTH,resizeMode:'stretch'}} source={{uri:homeState.image}}/>
            </View>
            
            <View style={styles.leftsectionimg}>
            <TouchableOpacity onPress={() => {
          navigation.goBack() } }>
           <AntDesign  name="arrowleft" color={'#000'} size={24} />
           </TouchableOpacity>

                </View>



                <View style={[styles.overlay, { height: 150}]} >


<View style={styles.horizontalview}>
  <Image  source={{uri:homeState.profileimg}}
        style={{ height: 35, width: 35,borderRadius:20}} />
  <View style={styles.peopleItem}>
    <Text style={styles.peopleName}>{homeState.username}</Text>
    <Text style={styles.peopleEmail}>Modified {homeState.modifieddate}</Text>
  </View>
</View>
<Text style={{margin:10, fontFamily:'Segoe UI',paddingTop:10,color:'#fff',fontSize:16,justifyContent:'flex-start',fontWeight:'600'}}>{homeState.title}</Text>

<View style={styles.likesection2}>
<TouchableOpacity  onPress={() => download(homeState.image)}>
  <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
  <AntDesign  name="download" color={'#fff'} size={24} />
</View>
</TouchableOpacity>
<TouchableOpacity  onPress={() => copyToClipboard(homeState.image)}>
<View  style={{flex:1.5, alignItems:'center',justifyContent:'center',marginHorizontal:15}}>
<Feather  name="copy" color={'#fff'} size={24} />
 </View>
 </TouchableOpacity>
 <TouchableOpacity  onPress={() => navigation.navigate('SendMail',{upn:homeState.imgweburl})}>
<View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
<FontAwesome  name="send-o" color={'#fff'} size={24} />
</View>
</TouchableOpacity>
<TouchableOpacity style={{flex:7, flexDirection:'row', justifyContent:'flex-end',alignContent:'flex-end',}} onPress={() => {toggle(),select===true? unfollow(homeState.driveid,homeState.id):follow(homeState.driveid,homeState.id)
}}>
<View style={{flex:7, flexDirection:'row', justifyContent:'flex-end',alignContent:'flex-end',}}>
<Ionicons  name={select===true ?"md-bookmark":"md-bookmark-outline"} color={'#fff'} size={24} />
</View>
</TouchableOpacity>
</View>

</View>

            </View>

         
           

          </View>
         
          </Modal>


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
  profileimg:'',
  driveid:'',
  followlist:[],
  followstate:false

  };

  async componentDidMount() {
    const{username,modifieddate,image,title,id,imgweburl,profileimg,driveid,followstate}=this.props.route.params;
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
        profileimg:profileimg,
        driveid:driveid,
        followlist:followItemList.value,
        followstate:followstate
      
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
                    // headerLeft: (props) => (
                    //   <HeaderBackButton
                    //     {...props}
                    //     tintColor={'black'}
                    //     onPress={() => navigation.goBack(null)}
                    //   />
                    // ),
                                   
    
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
    padding:10,
    height:NAME_SECTION_HEIGHT,
    marginTop:5
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
    color:'#fff'
  },
  peopleEmail: {
    fontWeight: '600',
    fontSize:10,
    fontFamily:'Segoe UI',
    color:'#fff'
    
  },
  cardtitle: {
    fontWeight: '600',
    fontSize:14,
    color:'black',
    paddingTop:10,
    alignContent:'center',
    paddingHorizontal:15,
   // height:CARD_TITLE_HEIGHT,
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
    alignItems:'center',
    justifyContent:'center',
    marginTop:-5
  },
  searchbar: {
    backgroundColor: '#fff',
    height:55,
    flexDirection:'row'
    
  },
  leftsection: {
    flexDirection:'row',
    flex:6
  },
  leftsectionimg: {
    position: 'absolute',
    padding:10
  },
  overlay: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    opacity: 0.7,
    backgroundColor: 'black',
    width: width
  }  
});
