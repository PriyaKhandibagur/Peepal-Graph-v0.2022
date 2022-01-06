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
// import { ScrollView } from 'react-native-gesture-handler';
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

type authScreenProp = StackNavigationProp<RootStackParamList, 'PGTV'>;
const numColumns = 2;
const size = Dimensions.get('window').width/2.1;
const heightSize = Dimensions.get('window').height/2.8;
const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width;
const CARD_HEIGHT = height*0.7;
const IMAGE_HEIGHT = CARD_HEIGHT*0.66;
const NAME_SECTION_HEIGHT = CARD_HEIGHT*0.12;
const LIKE_SECTION_HEIGHT = CARD_HEIGHT*0.3;
const CARD_TITLE_HEIGHT=CARD_HEIGHT*0.1;
const LIKE_SECTION_2 = CARD_HEIGHT*0.19;
const App = () => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]as any);
  const [followlist, setFollowlist] = useState([]as any);
  const [userItems, SetUserItems] = useState([]as any);
  const [selectedIndex, setSelectedIndex] = useState([] as any);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const onPageLoad = _onPageLoad.bind(this);
 // const navigation = useNavigation<authScreenProp>();
  async function _onPageLoad(){
   // debugger;
    let ProfileItems = filteredDataSource;
   // console.log('profileItemss',ProfileItems)
    setProfileContent(ProfileItems);
}; 

async function setProfileContent(ProfithisleItems:any):Promise<void>{

   // let _acccessToken= localStorage.getItem('accessToken');
 // console.log('itemsfiltered')
 try {
  const followItemList = await GraphManager.getfollowItemList();
  const recent_files = await GraphManager.getDriveSharedItemsAsync();
  const result=((recent_files.value).filter((user:any)=>user.name.includes("Meeting Recording.mp4"))).slice(0, 10)
 
  let posts =  result ;

setFilteredDataSource(result);
setFollowlist(followItemList.value);
// setMasterDataSource(result);
//  _onPageLoad();

// } catch(error) {
// console.log('text', error);

// } 
 var UrlImage;
 const token:any= await AuthManager.getAccessTokenAsync();
// var that:any= this; 
  let recentfiles:any =[];
//   recentfiles=recent_files.value;
// console.log('recentfileesss', recentfiles);

await result.forEach(async (u:any) => {
  var DriveId= u.remoteItem.parentReference.driveId;
  var ItemId = u.id;
  var userid = u.lastModifiedBy?.user?.email;
  let imagelist:any =[];
  await GraphManager.getUserDetailsAsync(userid).then(async (url: any)=>{ 
    u.designation=url.jobTitle;
                  
    });
   
  await GraphManager.getSharedItemsThumbnails(DriveId,ItemId).then(async (url: any)=>{ 
  // SetUserItems(url.value);   
  imagelist=url.value;                                    
      // this.setState({
      //     UserItems:url.value
      //   });
      // })
    });
    imagelist.map((item:any)=>{
      u.image=item.large.url;
    });
  //  setFilteredDataSource(filteredDataSource);


                 var request = new XMLHttpRequest;
                 request.open("GET", "https://graph.microsoft.com/v1.0/users/"+u.lastModifiedBy.user.email+"/photos/48x48/$value");
                 request.setRequestHeader("Authorization", "Bearer " + token);
                 request.responseType = "blob";
             
                 request.onload = function () {
                  console.log('cccccc',request.status)
      
                     if (request.readyState === 4 && request.status === 200) {
      
                         UrlImage = request.response;
                         var React = require('react-native'),
                         window = global || window;
                         var reader = new window.FileReader();
                         reader.onload = function () {
                            
                            u['userimage']=reader.result;
      
                          recentfiles.push(u);
                         // console.log('set url in state',filteredDataSource)
                          SetUserItems(recentfiles),()=>{console.log('set url in state')}
                         
                         }
      
                         reader.readAsDataURL(request.response);
                     }
                    
                 };
                // debugger;
                 request.send(null);
      
      
                // });
    
          setFilteredDataSource(result);
          setTimeout(() => {
            Toast.show('Pull down to load all images.', Toast.LONG);
          }, 8000);

});

} catch(error) {
  console.log('text', error);
  
  }
        }
  
  useEffect(() => {
    setProfileContent('');

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

  function createPageLink(webUrl){
    const oneDriveUrl = webUrl.substr(0,webUrl.indexOf('ragi_renewin_com') + 'ragi_renewin_com'.length);
    var relUrl = webUrl.substr(webUrl.indexOf('/personal'))
    const parentUrl = relUrl.split('/').slice(0, -1).join('/');
    console.log('weburllllll',`${oneDriveUrl}/_layouts/15/onedrive.aspx?id=${relUrl}&parent=${parentUrl}`)
    return `${oneDriveUrl}/_layouts/15/onedrive.aspx?id=${relUrl}&parent=${parentUrl}`;    
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

  

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };
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
   const onRefresh = () => {
   setRefreshing(true);
  // setProfileContent('');
setFilteredDataSource(filteredDataSource);
    // In actual case set refreshing to false when whatever is being refreshed is done!
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  const getItem = () => {
   // _onPageLoad();
   // const navigation = useNavigation<authScreenProp>();
   // console.log('useriiittemsss',data)
    //navigation.navigate('Auth');
    // Function for click on an item
  //  alert('Id : ' + item.id + ' Title : ' + item.title);
  const _userDiv:any[]=[];
 // console.log('userdetails',filteredDataSource)           
      
  // eslint-disable-next-line array-callback-return
  filteredDataSource.map((v:any,i:any) =>
      {
      //  console.log('vimagee',v.parentReference.driveId)
          _userDiv.push(
            
            <View key={v.id} style={styles.cardaspects}>
            <View style={styles.horizontalview}>
            
              {/* {v.userimage&&<Image  source={{uri:v.userimage!}}
              style={{ height: 35, width: 35,borderRadius:25}} />} */}
               {v.userimage==undefined?<Image source={require('../images/avatarmale.png')}
                     style={{ height: 30, width: 30}} />
               : <Image  source={{uri:v.userimage!}}
               style={{ height: 35, width: 35,borderRadius:25}} />}
            {/* <TextAvatar backgroundColor={'#9e9e9e'} textColor={'#fff'}size={30} type={'circle'}>{v.lastModifiedBy?.user?.displayName}</TextAvatar> */}

                  
                   <View style={styles.peopleItem}>
                     <Text style={styles.peopleName}>{v.lastModifiedBy?.user?.displayName}</Text>
                     <View style={styles.horizontalviewdot}>
                <Text style={styles.peopleEmail}>{v.designation}</Text>
               
                <Octicons name="primitive-dot" color='grey' size={10} style={{marginHorizontal:5,marginTop:2}}/>
                     <Text style={styles.peopleEmail}>{convertDateTime(v.lastModifiedDateTime!)}</Text>
</View>
                   </View>
                 </View>
                 
                 <TouchableOpacity activeOpacity = { 1 } onPress={() => {
            navigation.navigate('PGTVPreview',{url:v.image!,name:v.name});
          }}>
              <View style={styles.imagecard}>
              <Image onError={(e) => console.log(e.nativeEvent.error) } source={{uri:v.image!}}
                   style={{height:IMAGE_HEIGHT,width:'100%',resizeMode:"stretch" }} />
               
                {/* <View  style={styles.imagecard}> */}
                {/* {_userDiv} */}
                    {/* <Text style={{display:'none'}}>{this.getdesignation(item.remoteItem?.parentReference?.driveId,item.id)}</Text>
                <Image onError={(e) => console.log(e.nativeEvent.error) } source={{uri:this.state.thumbnailimgstr}}
                   style={{height:IMAGE_HEIGHT,width:CARD_WIDTH,resizeMode: 'contain'}} /> */}
     
              </View>
              </TouchableOpacity>
              <Text style={styles.cardtitle}>{v.name}</Text>

              <View style={styles.likesection2}>
             <TouchableOpacity onPress={() => download(v.image)}>
             <View style={{flex:2, alignItems:'center',justifyContent:'center'}}>
             <AntDesign  name="download" color={'#4e4e4e'} size={24} />
           </View>
          </TouchableOpacity >
          <TouchableOpacity onPress={() => copyToClipboard(v.webUrl)}>
           <View  style={{flex:2, alignItems:'center',justifyContent:'center',marginHorizontal:15}}>
           <Feather  name="copy" color={'#4e4e4e'} size={24} />
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => shareApp(v.webUrl)}>
           <View style={{flex:2, alignItems:'center',justifyContent:'center'}}>
           <Ionicons  name="share-social-outline" color={'#4e4e4e'} size={24} />
           </View>
           </TouchableOpacity>
           <TouchableOpacity style={{flex:5.5, flexDirection:'row', justifyContent:'flex-end',alignContent:'flex-end',}} onPress={() => {followlist.find(f => f === v.id)?selectedIndex.indexOf(i)>-1:selectItem(i),selectedIndex.indexOf(i)>-1  ? unfollow(v.remoteItem.parentReference.driveId,v.id):follow(v.remoteItem.parentReference.driveId,v.id)
           }}>
           <View style={{flex:4, flexDirection:'row', justifyContent:'flex-end',alignContent:'flex-end',}}>
           <Ionicons name={selectedIndex.indexOf(i)>-1 ?"md-bookmark":"md-bookmark-outline"} color={'#4e4e4e'} size={24} />
           </View>
           </TouchableOpacity>
           </View>
           <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 1}}
 />
     
           
            </View>
           
          )
      });
      return _userDiv
  };

  return (
   
    <View style={styles.container}>
           <View style={styles.searchbar}>
        <View style={styles.leftsection}>
        <TouchableOpacity 
         onPress={() => {
           navigation.goBack() } }
          >
        <View style={styles.leftsectionimg}>
        <AntDesign  name="arrowleft" color={'#000'} size={24} />

        {/* <Image source={require('../images/left-arrow.png')}
                style={{ height: 30, width: 30,alignSelf:'center',marginTop:2}} />  */}
                </View>
                </TouchableOpacity>
                <Text style={{fontFamily:'Segoe UI',flex:1,marginTop:2, padding: 10,color:'#000',fontSize:22,justifyContent:'flex-start',fontWeight:'700'}}>PGTV</Text>   
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

      {/* <FlatList
        data={filteredDataSource}
        numColumns={2}
        renderItem={({ item }:any) => (
          <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Auth',{upn:item.userPrincipalName})}>
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
              <Text style={styles.peopleEmail}>{item.department}</Text>
              <View 
        style={styles.SubmitButtonStyle}
       >
              <Text  style={styles.TextStyle}> View </Text>
              </View>
            </View>
          
            </View>
           </View>
          </View>
             </TouchableOpacity>
        )}
        keyExtractor={(item, email) => email.toString()}
      /> */}
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
      justifyContent:'center',marginVertical:10,
      marginHorizontal:10,
     
    },
});  

export default App;
