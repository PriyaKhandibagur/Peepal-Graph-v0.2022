import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {
  ActivityIndicator,
  PermissionsAndroid,
  Clipboard,
  Modal,
  Platform,
  TouchableOpacity,
  StyleSheet,Share,
  Text,
  Image,Alert,
  View,ScrollView,
  Dimensions,RefreshControl,
} from 'react-native';
import { GraphManager } from '../graph/GraphManager';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { createStackNavigator,StackNavigationProp } from '@react-navigation/stack';
import {RootStackParamList} from './RootStackParams';
import { useNavigation } from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { AuthManager } from '../auth/AuthManager';
import UserAvatar from 'react-native-user-avatar';
import Toast from 'react-native-simple-toast';
import moment from 'moment-timezone';
import RNFetchBlob from 'react-native-fetch-blob';
import { RouteProp } from '@react-navigation/native';

const RootStack = createStackNavigator<RootStackParamList1>();
type authScreenProp = StackNavigationProp<RootStackParamList, 'Drive'>;
type RootStackParamList1 = {
  thumb: undefined;
  SendMail:{ upn: string};
  Drive: { upn: string,name:string };
  drivepreview:{username:string,modifieddate:string,image:any,title:string,id:string,imgweburl:string}
 
};

type GroupScreenRouteProp = RouteProp<RootStackParamList1, 'Drive'>;

type GroupScreenNavigationProp = StackNavigationProp<
  RootStackParamList1,
  'Drive'
>;
type Props = {
  route: GroupScreenRouteProp;
  navigation: GroupScreenNavigationProp;
};
const numColumns = 2;
const size = Dimensions.get('window').width/2.1;
const heightSize = Dimensions.get('window').height/2.8;
const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width;
const CARD_HEIGHT = height*0.65;
const IMAGE_HEIGHT = CARD_HEIGHT*0.66;
const NAME_SECTION_HEIGHT = CARD_HEIGHT*0.12;
const LIKE_SECTION_HEIGHT = CARD_HEIGHT*0.3;
const CARD_TITLE_HEIGHT=CARD_HEIGHT*0.09;
const LIKE_SECTION_2 = CARD_HEIGHT*0.15;
const App = ( {route}) => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]as any);
  const [masterDataSource, setMasterDataSource] = useState([]as any);
  const [followlist, setFollowlist] = useState([]as any);
  const [userItems, SetUserItems] = useState([]as any);
  const [selectedIndex, setSelectedIndex] = useState([] as any);
  const [refreshing, setRefreshing] = useState(false);
  const [pagerefreshing, setPagerefreshing] = useState(false);

 // const {upn,name}=route.params;


  const navigation = useNavigation<authScreenProp>();
 

  async function anyNameFunction() {
   console.log('propsdataaaa ',route.params.upn)

    try {
      const followItemList = await GraphManager.getfollowItemList();
      const thumbnailitems = await GraphManager.getDriveThumbnailFilesAsync(route.params.upn);
      const thumbnailvalue=thumbnailitems.value;
     console.log('thumbnailitems ',thumbnailitems.value)
      let recentfiles:any=[];
    setFollowlist(followItemList.value);
    
     var UrlImage;
     const token:any= await AuthManager.getAccessTokenAsync();
    
     thumbnailvalue.forEach(async (u:any) => {

      await GraphManager.getmyPhoto(u.lastModifiedBy.user.email).then(async (data: any)=>{ 
                  var React = require('react-native'),
                  window = global || window;
                  var reader = new window.FileReader();
                  reader.onload = function () {
                    console.log('userimageeee ',reader.result)
                     u['userimage']=reader.result;
                     recentfiles.push(u);
                     //          // console.log('set url in state',filteredDataSource)
                     SetUserItems(recentfiles),()=>{console.log('set url in state')}
                  }
                  reader.readAsDataURL(data);
                });
     
                    //  var request = new XMLHttpRequest;
                    //  request.open("GET", "https://graph.microsoft.com/v1.0/users/"+u.lastModifiedBy.user.email+"/photos/48x48/$value");
                    //  request.setRequestHeader("Authorization", "Bearer " + token);
                    //  request.responseType = "blob";
           
                    // // console.log('bbbbbbb',request)
          
                    //  request.onload = function () {
                    //   console.log('cccccc',request.status)
          
                    //      if (request.readyState === 4 && request.status === 200) {
                    //      // console.log('dddd',request.response)
          
                    //          UrlImage = request.response;
                    //          //  var imageElm = document.createElement("img");
                    //          var React = require('react-native'),
                    //          window = global || window;
                    //          var reader = new window.FileReader();
                    //          reader.onload = function () {
                    //              // Add the base64 image to the src attribute
                    //              // imageElm.src = reader.result;
                    //            //  console.log('videoimageee',reader.result)
                    //             // that.setState({ managerPhoto: reader.result },()=>{console.log('set url in state')})
                               
                    //             u['userimage']=reader.result;
                                
                    //           //  console.log('bbbbbbb',u)
                    //            // console.log('jdhj',u)
                    //           recentfiles.push(u);
                    //          // console.log('set url in state',filteredDataSource)
                    //           SetUserItems(recentfiles),()=>{console.log('set url in state')}
                    //           // masterDataSource.map( (m:any) => {  
                    //           //   m['Image']=reader.result;
          
                    //           // });
                    //             // this.setState({ UserItemsImg: recentfiles },()=>{console.log('set url in state')})
          
                    //           //  console.log('uimageee',recentfiles)
                    //              // Display the user's profile picture
                    //              //document.getElementsByClassName('user-picture-box')[0].appendChild(imageElm);
                    //          }
          
                    //          reader.readAsDataURL(request.response);
                    //      }
                     
          
                    //  };
                    // // debugger;
                    //  request.send(null);
          
          
    });
    setFilteredDataSource(thumbnailvalue);
    setPagerefreshing(false);
    setTimeout(() => {
      Toast.show('Pull down to load all images.', Toast.LONG);
    }, 8000);
    } catch(error) {
      console.log('text', error);
      
      }
    
}
  useEffect(() => {
    setPagerefreshing(true);
  anyNameFunction();
}, []);
  
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
 

 const convertDateTime = (dateTime: string): string => {
    return moment(dateTime).format('Do MMM');
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
 const  requestCameraPermission = async (imagurl:any) => {
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
  
  const copyToClipboard = (thumbnaa:any) => {
    Clipboard.setString(thumbnaa)
    Toast.show('Copied.', Toast.LONG);
  }


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
  
   
   const onRefresh = () => {
   setRefreshing(true);
   setFilteredDataSource(filteredDataSource);

    // In actual case set refreshing to false when whatever is being refreshed is done!
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  const getItem = () => {
  const _userDiv:any[]=[];
  filteredDataSource.map((v:any,i:any) =>
      {
      //  console.log('vimagee',v.parentReference.driveId)
          _userDiv.push(
            
            v.thumbnails&&v.thumbnails.length>0?

           
           
            <View style={styles.cardaspects}>
   
              <View style={styles.horizontalview}>
              {v.userimage==undefined?<Image source={require('../images/avatarmale.png')}
                     style={{ height: 30, width: 30}} />
               : <Image  source={{uri:v.userimage!}}
               style={{ height: 35, width: 35,borderRadius:25}} />}
                <View style={styles.peopleItem}>
                  <Text style={styles.peopleName}>{v.lastModifiedBy?.user?.displayName}</Text>
                  <View style={styles.horizontalviewdot}>
                  <Text style={styles.peopleEmail}>Modified</Text>
                 
                  <Octicons name="primitive-dot" color='grey' size={10} style={{marginHorizontal:5,marginTop:2}}/>
                  <Text style={styles.peopleEmail}>{convertDateTime(v.fileSystemInfo?.lastModifiedDateTime!)}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('drivepreview',{username:v.lastModifiedBy?.user?.displayName,modifieddate:convertDateTime(v.fileSystemInfo?.lastModifiedDateTime!),image:v.thumbnails![0].large?.url,title:v.name,id:v.id,imgweburl:v.webUrl,profileimg:v.userimage})}>
              
              <View style={styles.imagecard} >
              {v.thumbnails?.map((item1:any)=>(
                <Image source={{uri:item1.large.url}}
                style={{height:IMAGE_HEIGHT,width:CARD_WIDTH,resizeMode: 'contain'}} /> 
            
  ))}
              </View>
              {/* <Text style={styles.cardtitle}>{item.webUrl!}</Text> */}
              {/* <Image source={{uri:item.webUrl!}}
                style={{height:IMAGE_HEIGHT,width:CARD_WIDTH,resizeMode: 'contain'}} />  */}
             
              </TouchableOpacity>
              <Text style={styles.cardtitle}>{v.name}</Text>
  
                <View style={styles.likesection2}>
                <TouchableOpacity  onPress={() => download(v.thumbnails)}>
                <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
                <AntDesign  name="download" color={'#4e4e4e'} size={24} />
              </View>
             </TouchableOpacity >
             <TouchableOpacity  onPress={() => copyToClipboard(v.webUrl)}>
              <View  style={{flex:1, alignItems:'center',justifyContent:'center',marginHorizontal:15}}>
              <Feather  name="copy" color={'#4e4e4e'} size={24} />
               </View>
               </TouchableOpacity>
               <TouchableOpacity  onPress={() => navigation.navigate('SendMail',{upn:v.webUrl})}>
              <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
              <FontAwesome  name="send-o" color={'#4e4e4e'} size={24} />
              </View>
              </TouchableOpacity>
              <TouchableOpacity style={{flex:7, flexDirection:'row', justifyContent:'flex-end',alignContent:'flex-end',}} onPress={() => {followlist.find(v => v === v.id)?selectedIndex.indexOf(i)>-1:selectItem(i),selectedIndex.indexOf(i)>-1  ? unfollow(v.id):follow(v.id)
             }}>
              <View style={{flex:7, flexDirection:'row', justifyContent:'flex-end',alignContent:'flex-end',}}>
              <Ionicons name={selectedIndex.indexOf(i)>-1 ?"md-bookmark":"md-bookmark-outline"} color={'#4e4e4e'} size={24} />
              </View>
              </TouchableOpacity>
              </View>
             
             
  
            </View>
            : <View>
            <View style={styles.horizontalview}>
               
                <View style={styles.peopleItem}>
                <Text style={styles.peopleName}>{v.name}</Text>
                <View style={styles.horizontalviewdot}>
                  <Text style={styles.peopleEmail}>Modified</Text>
                  <Octicons name="primitive-dot" color='grey' size={10} style={{marginHorizontal:5,marginTop:2}}/>
                  <Text style={styles.peopleEmail}>{convertDateTime(v.lastModifiedDateTime!)}</Text>
                  </View>
                </View>
               
               </View>
                <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,marginHorizontal:5}}
                />
               </View>
           
          )
      });
      return _userDiv
  };

  return (
   
    <View style={styles.container}>
          <Modal visible={pagerefreshing}>
        <View style={styles.loading}>
          <ActivityIndicator
            color={Platform.OS === 'android' ? '#276b80' : undefined}
            animating={refreshing}
            size='large' />
        </View>
      </Modal>
      <View style={styles.searchbar}>
        <View style={styles.leftsection}>
        <TouchableOpacity onPress={() => {navigation.goBack() } }>
        <View style={styles.leftsectionimg}>
        <AntDesign  name="arrowleft" color={'#000'} size={24} />

        {/* <Image source={require('../images/left-arrow.png')}
                style={{ height: 30, width: 30,alignSelf:'center',marginTop:2}} />  */}
                </View>
                </TouchableOpacity>
                <Text style={{fontFamily:'Segoe UI',flex:1,marginTop:2, padding: 10,color:'#000',fontSize:22,justifyContent:'flex-start',fontWeight:'700'}}>{route.params.name}</Text>   
                </View>
                </View>
                <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 1}}/>
      <ScrollView  refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            title="Pull to refresh"
          />
        }>
      

{getItem()}

     
       {/* <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,marginTop:10}}/>
      <Text style={{alignSelf:'center',justifyContent:'center',padding:15,fontFamily:'Segoe UI',fontSize:16, fontWeight:'700',color:'grey'}}>Show More</Text> */}
      
      </ScrollView>
    </View>
 
);

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
      padding:0,
      marginTop:0,
    },
    imagecard: {
      height:IMAGE_HEIGHT,
      backgroundColor: '#fff',
      justifyContent:'center',
      alignItems:'center',
    },
    horizontalview: {
      flexDirection: 'row',
      backgroundColor: '#ffffff',
      paddingHorizontal:15,
      alignContent:'center',
      alignItems:'center',
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
      marginLeft:10
    },
    peopleName: {
      fontWeight: '700',
      fontSize: 12
    },
    peopleEmail: {
      fontWeight: '700',
      fontSize:10,
      
    },
    cardtitle: {
      fontWeight: '700',
      fontSize:14,
      color:'black',
      paddingTop:10,
      alignContent:'center',
      paddingHorizontal:15,
      height:CARD_TITLE_HEIGHT,
      backgroundColor:'#fff'
     },
     cardaspects: {
      height: CARD_HEIGHT,
      backgroundColor: '#e0e0e0', 
    },
   
    horizontalviewdot: {
      flexDirection: 'row',
      backgroundColor: '#ffffff',
    },
    likesection2: {
      flexDirection: 'row',
      flexWrap:'nowrap',
      flex:10,
      paddingTop:7,
      paddingBottom:10,
      paddingHorizontal:10,
      height:LIKE_SECTION_2,
      backgroundColor:'#ffffff',
      alignItems:'center',
      alignContent:'center',
      justifyContent:'center'
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
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',marginVertical:15,
      marginHorizontal:10,
     
    },
});  

export default App;
