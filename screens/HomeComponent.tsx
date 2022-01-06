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

type authScreenProp = StackNavigationProp<RootStackParamList, 'Home'>;
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
const App = () => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]as any);
  const [masterDataSource, setMasterDataSource] = useState([]as any);
  //const [followlist, setFollowlist] = useState([]as any);
  const [userItems, SetUserItems] = useState(false);
  const [items, setItems] = useState([] as any);
  const [selectedIndex, setSelectedIndex] = useState([] as any);
  const [refreshing, setRefreshing] = useState(false);
  const [pagerefreshing, setPagerefreshing] = useState(false);


  const navigation = useNavigation<authScreenProp>();
  
  async function anyNameFunction() {
    try {
      const followItemList = await GraphManager.getfollowItemList();
      const recent_files = await GraphManager.getDriveSharedItemsAsync();
      const result=((recent_files.value).filter((user:any)=>user.file?.mimeType.includes("image/jpeg"))).slice(0, 20)
      let recentfiles:any=[];
  //  setFollowlist(followItemList.value);
    
    //  var UrlImage;
    //  const token:any= await AuthManager.getAccessTokenAsync();

     result.forEach(async (u:any,i) => {
      var DriveId= u.remoteItem.parentReference.driveId;
      var ItemId = u.id;
      var userid = u.lastModifiedBy?.user?.email;
      let imagelist:any =[];
      await GraphManager.getUserDetailsAsync(userid).then(async (url: any)=>{ 
        u.designation=url.jobTitle;
                      
        });
       
      await GraphManager.getSharedItemsThumbnails(DriveId,ItemId).then(async (url: any)=>{ 
       
      imagelist=url.value;                                      
        });
        imagelist.map((item:any)=>{
          u.image=item.large.url;
        });

        await GraphManager.getmyPhoto(u.lastModifiedBy.user.email).then(async (data: any)=>{ 
//console.log('dewdw ',data)
          var React = require('react-native'),
          window = global || window;
          var reader = new window.FileReader();
          reader.onload = function () {
          //  console.log('userimageeee ',reader.result)
             u['userimage']=reader.result;
             recentfiles.push(u);
             //          // console.log('set url in state',filteredDataSource)
             setItems(recentfiles),()=>{console.log('set url in state')}
          }
          reader.readAsDataURL(data);
        });
  
        const bookIndex = followItemList.value.findIndex(f=> f.id === u.id);
       // console.log('bookIndex ',bookIndex,followItemList.value.length)
       if(bookIndex!==-1)
          selectedIndex.push(i)
         SetUserItems(true)
    });
    console.log('responseimage ',selectedIndex)
    setFilteredDataSource(result);
    setPagerefreshing(false);
    setFilteredDataSource(result);

    // filteredDataSource.map((v:any,i:any) =>
    //   {
    //  if(followlist.findIndex((f:any)=> f.id === v.id)!==-1){
    //   console.log('indexesss111 ',i)
    //   selectedIndex.indexOf(i)>-1
    //  }
    //  else{
    //   selectItem(i)

    //  }
    //   });

    setTimeout(() => {
      Toast.show('Pull down to refresh all images.', Toast.LONG);
    }, 6000);

    } catch(error) {
      console.log('text', error);
      
      }
    
}
  useEffect(() => {
    setPagerefreshing(true);
  anyNameFunction();

}, []);
  
const selectItem = (index:any) => {
  console.log('1111  ',selectedIndex,index)


  if(selectedIndex.indexOf(index)>-1){
  //  console.log('12221  ',selectedIndex.indexOf(index))
     let newArray = selectedIndex.filter((indexObject:any)=>{
       if(indexObject == index){
           return false;
       }
       return true;
   })
   setSelectedIndex(newArray);
  }else{
  //  console.log('13331  ',selectedIndex.indexOf(index))
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


  const follow = async (driveid:any,item_id:any) => {
  
    try {
     const follow =await GraphManager.drivefollowItem(driveid,item_id);
     Toast.show('bookmarked.', Toast.LONG);
   
    }catch(error) {
      Alert.alert(
        'Error',
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
       'Error',
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
  // anyNameFunction();
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
     //   console.log('vimagee',v.webUrl)
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
                 <TouchableOpacity activeOpacity={1} onPress={() =>
             navigation.navigate('HomePreview',{username:v.lastModifiedBy?.user?.displayName,modifieddate:convertDateTime(v.fileSystemInfo?.lastModifiedDateTime!),image:v.image!,title:v.name,id:v.id,imgweburl:v.webUrl,profileimg:v.userimage,driveid:v.remoteItem.parentReference.driveId,followstate:userItems})
                  }>
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
            <TouchableOpacity onPress={() => shareApp(v.webUrl!)}>
           <View style={{flex:2, alignItems:'center',justifyContent:'center'}}>
           <Ionicons  name="share-social-outline" color={'#4e4e4e'} size={24} />
           </View>
           </TouchableOpacity>

           <TouchableOpacity style={{flex:5.5, flexDirection:'row', justifyContent:'flex-end',alignContent:'flex-end',}}
            onPress={() => {selectItem(i),
              selectedIndex.indexOf(i)>-1  ? unfollow(v.remoteItem.parentReference.driveId,v.id):
              follow(v.remoteItem.parentReference.driveId,v.id)
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
          <Modal visible={pagerefreshing}>
        <View style={styles.loading}>
          <ActivityIndicator
            color={Platform.OS === 'android' ? '#000000' : undefined}
            animating={pagerefreshing}
            size='large' />
        </View>
      </Modal>
      <ScrollView  refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            title="Pull to refresh"
          />
        }
        
        >
      

{getItem()}
          <View style={{backgroundColor:'#fff',justifyContent:'center',alignContent:'center',alignItems:'center',paddingVertical:50}}>
          <AntDesign  name="checkcircleo" color={'#5F259F'} size={64} />

              {/* <Image source={require('../images/checked.png')}
                     style={{ height: 60, width: 60}} /> */}
              <Text style={{ color:'#000',textAlign:'center',fontFamily:'Segoe UI',fontSize:20,marginTop:10}}>You've completely caught up</Text>
              <Text style={{textAlign:'center',fontFamily:'Segoe UI',fontSize:14,marginTop:10}}>Youhave seen all latest top 20 posts</Text>
              <TouchableOpacity activeOpacity={1} onPress={() =>
             navigation.navigate('HomeSearch')
                  }>
              <Text  style={{ color:'blue',textAlign:'center',fontFamily:'Segoe UI',marginTop:10}}> Search for more results </Text>
           </TouchableOpacity>
           </View>
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
