// Copyright (c) Microsoft.
// Licensed under the MIT license.

import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  PermissionsAndroid,Share,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity, Clipboard,
} from 'react-native';
import { Card } from 'react-native-elements';
import { createStackNavigator,HeaderBackButton } from '@react-navigation/stack';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import moment from 'moment-timezone';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { UserContext } from '../UserContext';
import { GraphManager } from '../graph/GraphManager';
import { useNavigation } from '@react-navigation/native';
import DriveThumbnailPreview from '../screens/DriveThumbnailPreview';
import Toast from 'react-native-simple-toast';
import RNFetchBlob from 'react-native-fetch-blob';
const { width, height } = Dimensions.get('window');

const Metrics = {
  section: 16,
  halfSection: 8,
};

const CARD_WIDTH = width;
const CARD_HEIGHT = height*0.51;
const IMAGE_HEIGHT = CARD_HEIGHT*0.54;
const NAME_SECTION_HEIGHT = CARD_HEIGHT*0.16;
const LIKE_SECTION_HEIGHT = CARD_HEIGHT*0.3;
const CARD_TITLE_HEIGHT=CARD_HEIGHT*0.135;
const LIKE_SECTION_2 = CARD_HEIGHT*0.15;

const RootStack = createStackNavigator<RootStackParamList>();
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
type RootStackParamList = {
  thumb: undefined;
  drivepreview:{username:string,modifieddate:string,image:any,title:string,id:string,imgweburl:string}
 
};
const follow = async (item_id:any) => {
  console.log('iiidsssss ',item_id)
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
  console.log('iiiduuuuu ',item_id)

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
const HomeComponent = () => {
  const homeState = React.useContext(DriveItemsState);
  const navigation = useNavigation();
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
          renderItem={({item,index}) =>
          <View style={(!item.file?.mimeType?.includes('application')) &&(!item.file?.mimeType?.includes('text/plain'))&& (!item.file?.mimeType?.includes('video'))? 
          styles.cardaspects : styles.cardaspectsnone}>

            <View style={styles.horizontalview}>
              <Image source={require('../images/avatarmale.png')}
                    style={{ height: 30, width: 30}} />
              <View style={styles.peopleItem}>
                <Text style={styles.peopleName}>{item.lastModifiedBy?.user?.displayName}</Text>
                <View style={styles.horizontalviewdot}>
                <Text style={styles.peopleEmail}>Modified</Text>
                <Octicons name="primitive-dot" color='grey' size={10} style={{marginHorizontal:5,marginTop:3}}/>
                <Text style={styles.peopleEmail}>{convertDateTime(item.lastModifiedDateTime!)}</Text>
                </View>             
                 </View>
            </View>
            <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('drivepreview',{username:item.lastModifiedBy?.user?.displayName,modifieddate:convertDateTime(item.fileSystemInfo?.lastModifiedDateTime!),image:item.thumbnails![0].large?.url,title:item.name,id:item.id,imgweburl:item.webUrl})}>
            <View style={styles.imagecard}>
            {item.thumbnails?.map((item1:any)=>(
              <Image source={{uri:item1.large.url}}
              style={{height:IMAGE_HEIGHT,width:CARD_WIDTH,resizeMode: 'contain'}} /> 
          
))}
            </View>
</TouchableOpacity>
            <Text style={styles.cardtitle}>{item.name}</Text>


           
            <View style={styles.likesection2}>
              <TouchableOpacity  onPress={() => download(item.thumbnails)}>
              <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
              <AntDesign  name="download" color={'#4e4e4e'} size={20} />
            </View>
           </TouchableOpacity >
           <TouchableOpacity  onPress={() => copyToClipboard(item.webUrl)}>
            <View  style={{flex:1, alignItems:'center',justifyContent:'center',marginHorizontal:5}}>
            <Feather  name="copy" color={'#4e4e4e'} size={18} />
             </View>
             </TouchableOpacity>
             <TouchableOpacity  onPress={() => shareApp(item.webUrl)}>
            <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
            <Ionicons  name="md-share-social-outline" color={'#4e4e4e'} size={22} />
            </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:7, flexDirection:'row', justifyContent:'flex-end',alignContent:'flex-end',}} onPress={() => {homeState.followlist.find(v => v === item.id)?selectedIndex.indexOf(index)>-1:selectItem(index),selectedIndex.indexOf(index)>-1  ? unfollow(item.id):follow(item.id)
           }}>
            <View style={{flex:7, flexDirection:'row', justifyContent:'flex-end',alignContent:'flex-end',}}>
            <Ionicons  name={selectedIndex.indexOf(index)>-1 ?"md-bookmark":"md-bookmark-outline"} color={'#4e4e4e'} size={22} />
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
      const recent_files = await GraphManager.getDriveItemsAsync();
      let new_post:any = [];
      let posts =  recent_files.value ;
      Promise.all(
          posts.map(async (item:any )=>{
          //  console.log('itemiddddd '+item.remoteItem.parentReference.driveId)
              const driveidd=item.id;
            const thumbnailitems = await GraphManager.getDriveThumbnailFilesAsync(item.id);
           // console.log('second item list'+thumbnailitems.value)
           const photos1=(thumbnailitems.value).filter((user:any)=>user.thumbnails&&user.thumbnails.length>0&&thumbnailitems.value&&thumbnailitems.value.length>0&&user.file?.mimeType.includes("image/jpeg"))

            let posts2=photos1;
            
            posts2.map((item:any)=>{
             new_post.push(item)
            });
             
           console.log('newpostlist '+new_post)
           this.setState({
            loadingItems: false,
            recent_files: new_post,
            followlist:followItemList.value,

          });
             
          })
          
      )

     
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
        <RootStack.Navigator initialRouteName="thumb">
             <RootStack.Screen name="thumb" component={HomeComponent}
                   options={({navigation, route}) => ({
                    headerStyle: {
                      backgroundColor: '#fff'
                   },
                   headerTitle:'Photos',
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
            <RootStack.Screen name="drivepreview" component={DriveThumbnailPreview}
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
    backgroundColor: '#FFFFFF',
    marginHorizontal:5,
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
    backgroundColor:'#fafafa',
    fontFamily:'Segoe UI',

   },
   cardaspects: {
    height: CARD_HEIGHT,
    backgroundColor: '#e0e0e0',
    

  },
  cardaspectsnone: {
    display:'none'

  },
  
  likesection2: {
    flexDirection: 'row',
    flexWrap:'nowrap',
    flex:10,
    paddingHorizontal:10,
    height:LIKE_SECTION_2,
    backgroundColor:'#ffffff',
    marginBottom:6,
    alignItems:'center',
    justifyContent:'center'
  },
  horizontalviewdot: {
    flexDirection: 'row',
    backgroundColor: '#ffffff', 
  },
});
