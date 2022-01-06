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
import Video, { FilterType } from 'react-native-video';
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
import { AuthManager } from '../auth/AuthManager';

const RootStack = createStackNavigator<RootStackParamList>();

const { width, height } = Dimensions.get('window');

const Metrics = {
  section: 16,
  halfSection: 8,
};

const CARD_WIDTH = width;
const CARD_HEIGHT = height*0.85;
const IMAGE_HEIGHT = CARD_HEIGHT*0.94;
const NAME_SECTION_HEIGHT = CARD_HEIGHT*0.08;
const LIKE_SECTION_2 = CARD_HEIGHT*0.08;

const Stack = createStackNavigator();
const DriveItemsState = React.createContext<HomeScreenState>({
  loadingItems: true,
  username:'',
  modifieddate:'',
  image:'',
  title:'',
  driveid: '',
  itemid:'',
  imgweburl:'',
  followlist:[],
  upn:'',
  profilephoto:''


});

type HomeScreenState = {
  loadingItems: boolean,
  username:string,
  modifieddate:string,
  image:string,
  title:string,
  driveid: string,
  itemid:string,
  imgweburl:string,
  followlist:[],
  upn:'',
  profilephoto:string


}
type RootStackParamList = {
  preview: undefined;
  drivepreview:{driveid: string,itemid:string,username:string,modifieddate:string,title:string,imgweburl:string,upn:string}
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
  const [filterType,setFilterType]=useState(FilterType.NONE);

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
   homeState.imgweburl.includes('Videos')?
    <View style={styles.container}>
    
      <Modal visible={homeState.loadingItems}>
        <View style={styles.loading}>
          <ActivityIndicator
            color={Platform.OS === 'android' ? '#276b80' : undefined}
            animating={homeState.loadingItems}
            size='large' />
        </View>
      </Modal>

     
       
      <Modal>
      <View style={styles.searchbar}>
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
                <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,}}/>
          <View style={ styles.cardaspects}>

            <View style={styles.horizontalview}>
              <Image  source={{uri:homeState.profilephoto!}}
                    style={{ height: 30, width: 30}} />
              <View style={styles.peopleItem}>
                <Text style={styles.peopleName}>{homeState.username}</Text>
                <Text style={styles.peopleEmail}>Modified {homeState.modifieddate}</Text>
              </View>
            </View>
          
                   
<Video 
      controls
      filter={filterType}
      filterEnable={true}
      source={{uri:'https://southeastasia1-mediap.svc.ms/transform/thumbnail?provider=spo&inputFormat=mov&cs=ZGU4YmM4YjUtZDlmOS00OGIxLWE4YWQtYjc0OGRhNzI1MDY0fFNQTw&docid=https%3A%2F%2Frenewin%2Dmy%2Esharepoint%2Ecom%2F%5Fapi%2Fv2%2E0%2Fdrives%2Fb%21vvLnnLM71UWXMEHVqINld%5FL2lnecPFtDhNmk8tRMeEo8Nf6efe1JQYG0%2DH38OMec%2Fitems%2F01FYPXDENQJS7LST6CPNDYXACQCHTTNJE3%3Ftempauth%3DeyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0%2EeyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvcmVuZXdpbi1teS5zaGFyZXBvaW50LmNvbUAyNTk4ZDg5NC04MmY1LTQ3MTgtODc0MS1kNjQ3MzE1ZmFiNmEiLCJpc3MiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAiLCJuYmYiOiIxNjI4ODM0NDAwIiwiZXhwIjoiMTYyODg1NjAwMCIsImVuZHBvaW50dXJsIjoibXpnaHN3aXJFOUFKd1JadlR0SDR1WHZjdTMwYUFqemJoaHR6ckdzc05YRT0iLCJlbmRwb2ludHVybExlbmd0aCI6IjE1OCIsImlzbG9vcGJhY2siOiJUcnVlIiwidmVyIjoiaGFzaGVkcHJvb2Z0b2tlbiIsInNpdGVpZCI6Ik9XTmxOMll5WW1VdE0ySmlNeTAwTldRMUxUazNNekF0TkRGa05XRTRPRE0yTlRjMyIsImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIEV4cGxvcmVyIiwiZ2l2ZW5fbmFtZSI6IlByaXlhbmthIiwiZmFtaWx5X25hbWUiOiJLaGFuZGliYWd1ciIsInNpZ25pbl9zdGF0ZSI6IltcImttc2lcIl0iLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsInRpZCI6IjI1OThkODk0LTgyZjUtNDcxOC04NzQxLWQ2NDczMTVmYWI2YSIsInVwbiI6InByaXlhbmthLmtoYW5kaWJhZ3VyQHJlbmV3aW4uY29tIiwicHVpZCI6IjEwMDMwMDAwQTU2RkY2QjAiLCJjYWNoZWtleSI6IjBoLmZ8bWVtYmVyc2hpcHwxMDAzMDAwMGE1NmZmNmIwQGxpdmUuY29tIiwic2NwIjoibXlmaWxlcy5yZWFkIGFsbGZpbGVzLnJlYWQgbXlmaWxlcy53cml0ZSBhbGxmaWxlcy53cml0ZSBncm91cC5yZWFkIGdyb3VwLndyaXRlIGFsbHNpdGVzLmZ1bGxjb250cm9sIGFsbHNpdGVzLm1hbmFnZSBhbGxzaXRlcy5yZWFkIGFsbHNpdGVzLndyaXRlIGFsbHByb2ZpbGVzLnJlYWQgYWxscHJvZmlsZXMucmVhZCBhbGxwcm9maWxlcy53cml0ZSIsInR0IjoiMiIsInVzZVBlcnNpc3RlbnRDb29raWUiOm51bGx9%2ET3o0Mk15ZzFkTnlpc284NGo5b2RQVDFoUi9PdXV6RWluT1VNeEd2M0Y4Zz0%26version%3DPublished&width=800&height=800&cb=63762887767'}}
      poster={homeState.image}
      style={styles.backgroundVideo}
      // Can be a URL or a local file.
        />        
            {/* <View style={styles.likesection2}>
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
            <TouchableOpacity style={{flex:7, flexDirection:'row', justifyContent:'flex-end',alignContent:'flex-end',}} onPress={() => {toggle(),select===true? unfollow(homeState.itemid):follow(homeState.itemid)
           }}>
            <View style={{flex:7, flexDirection:'row', justifyContent:'flex-end',alignContent:'flex-end',}}>
            <Ionicons  name={select===true ?"md-bookmark":"md-bookmark-outline"} color={'#4e4e4e'} size={24} />
            </View>
            </TouchableOpacity>
            </View> */}
           

          </View>
         </Modal>


    </View>:
    <View style={styles.container}>
    

    <Modal visible={homeState.loadingItems}>
      <View style={styles.loading}>
        <ActivityIndicator
          color={Platform.OS === 'android' ? '#276b80' : undefined}
          animating={homeState.loadingItems}
          size='large' />
      </View>
    </Modal>

   
     
    <Modal>
    <View style={styles.searchbar}>
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
                <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,}}/>
        <View style={ styles.cardaspects}>

          <View style={styles.horizontalview}>
            <Image  source={require('../images/avatarmale.png')}
                  style={{ height: 30, width: 30}} />
            <View style={styles.peopleItem}>
              <Text style={styles.peopleName}>{homeState.username}</Text>
              <Text style={styles.peopleEmail}>Modified {homeState.modifieddate}</Text>
            </View>
          </View>
   <View style={styles.imagecard}>
            <Image style={{height:IMAGE_HEIGHT,width:CARD_WIDTH,}} source={{uri:homeState.image}}/>
          </View>

          {/* <View style={styles.likesection2}>
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
          <TouchableOpacity style={{flex:7, flexDirection:'row', justifyContent:'flex-end',alignContent:'flex-end',}} onPress={() => {toggle(),select===true? unfollow(homeState.itemid):follow(homeState.itemid)
         }}>
          <View style={{flex:7, flexDirection:'row', justifyContent:'flex-end',alignContent:'flex-end',}}>
          <Ionicons  name={select===true ?"md-bookmark":"md-bookmark-outline"} color={'#4e4e4e'} size={24} />
          </View>
          </TouchableOpacity>
          </View> */}
         

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
  driveid: '',
  itemid:'',
  imgweburl:'',
  followlist:[],
  upn:'',
  profilephoto:''

  };
  async  managergetphoto(this: any){
    var UrlImage;
    const token = await AuthManager.getAccessTokenAsync();
   console.log('maaaanaager',this.state.upn)
      var that= this;    
        // AuthContext.acquireToken("https://graph.microsoft.com", function (error, token) {
          var request = new XMLHttpRequest;
          request.open("GET", "https://graph.microsoft.com/v1.0/users/"+this.state.upn+"/photo/$value");
          request.setRequestHeader("Authorization", "Bearer " + token);
          request.responseType = "blob";
  
          request.onload = function () {
              if (request.readyState === 4 && request.status === 200) {
  
                  UrlImage = request.response;
                  //  var imageElm = document.createElement("img");
                  var React = require('react-native'),
                  window = global || window;
                  var reader = new window.FileReader();
                  reader.onload = function () {
                      // Add the base64 image to the src attribute
                      // imageElm.src = reader.result;
                      console.log('responseeereader',reader.result)
                      that.setState({ profilephoto: reader.result },()=>{console.log('set url in state')})
  
                      // Display the user's profile picture
                      //document.getElementsByClassName('user-picture-box')[0].appendChild(imageElm);
                  }
                  reader.readAsDataURL(request.response);
              }
          };
         // debugger;
        //  console.log('request:', reader.result)
          request.send(null);
      // });
  }
  async componentDidMount() {
    const{driveid,itemid,username,modifieddate,title,imgweburl,upn}=this.props.route.params;
   // console.log('iurrrr '+image)
   // image.map()
    try {
      const thumbnailitems =await GraphManager.getSharedItemsThumbnails(driveid,itemid);
      const followItemList = await GraphManager.getfollowItemList();
      this.setState({
        loadingItems: false,
        username:username,
        modifieddate:modifieddate,
        image:thumbnailitems.value[0].large.url,
        title:title,
        imgweburl:imgweburl,
        followlist:followItemList.value,
        upn:upn

      
      });
      this.managergetphoto();

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
    backgroundColor:'#ffffff'
  },
  container1: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#000'
    
  },
  backgroundVideo: {
    height: IMAGE_HEIGHT,
    width:width,
    resizeMode:'cover',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#000'
    
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
 
   cardaspects: {
    height: CARD_HEIGHT,
    backgroundColor: '#e0e0e0',
    

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
  likesection2: {
    flexDirection: 'row',
    flexWrap:'nowrap',
    flex:10,
    paddingHorizontal:10,
    height:LIKE_SECTION_2,
    backgroundColor:'#ffffff',
    alignItems:'center',
    justifyContent:'center'
  },
  
});
