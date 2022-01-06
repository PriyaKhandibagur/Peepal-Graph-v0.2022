import React, { useState,useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  Platform,
  PermissionsAndroid,
  StyleSheet,FlatList,
  Text,Image,TextInput,
  View,TouchableOpacity
} from 'react-native';
import { SwipeablePanel } from 'rn-swipeable-panel';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { GraphManager } from '../graph/GraphManager';
import { AuthManager } from '../auth/AuthManager';
import Toast from 'react-native-simple-toast';
import { RouteProp } from '@react-navigation/native';
import { createStackNavigator,StackNavigationProp } from '@react-navigation/stack';
import { wrap } from 'lodash';
import UserAvatar from 'react-native-user-avatar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import * as ImagePicker from 'react-native-image-picker';
import Video, { FilterType } from 'react-native-video';
import DocumentPicker from 'react-native-document-picker';

const App = () => {
 // const{upn}=route.params;
 const navigation = useNavigation();
 const [modalVisible, setModalVisible] = useState(false);
  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    openLarge: false,
    showCloseButton: true,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
    // ...or any prop you want
  });
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [team, setTeam] = useState('Anyone');
  const [teamslist, setTeamslist] = useState([]as any);
  const [channellist, setChannellist] = useState([]as any);
  const [channelid, setChannelid] = useState('');
  const [teamname, setTeamname] = useState('');
  const [channelname, setChannelname] = useState('');
  const [posttext, setPosttext] = useState('');
  const [teamid, setTeamid] = useState('');
  const [filePath, setFilePath]:any = useState({}as any);
  const [videofilePath, setVideofilePath]:any = useState([]as any);
  const [filterType,setFilterType]=useState(FilterType.NONE);
  const [loading, setLoading] = useState(false);
  const [singleFile, setSingleFile] = useState(null);


  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };
  async  function getphoto(this: any){
    var UrlImage;
    const token = await AuthManager.getAccessTokenAsync();
  
      var that= this;    
        // AuthContext.acquireToken("https://graph.microsoft.com", function (error, token) {
          var request = new XMLHttpRequest;
          request.open("GET", "https://graph.microsoft.com/v1.0/me/photos/64x64/$value");
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
                   //   console.log('responseeereader',reader.result)
                   setUserPhoto(reader.result);
                    //  that.setState({ userPhoto: reader.result },()=>{console.log('set url in state')})
  
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
  async function anyNameFunction() {
    try {
      getphoto();
      const user: MicrosoftGraph.User = await GraphManager.getUserAsync();
      const teams = await GraphManager.getTeamsAsync();
     
     
       // toRecipient:upn,
        setUserName(user.displayName!);
        setTeamslist(teams.value);     
     
    } catch(error) {
        
    }
  }
  useEffect(() => {
   // setPagerefreshing(true);
  anyNameFunction();
  console.log('vfilepppp',videofilePath)

}, []);
const modalview=async(item:any)=>{
 closePanel();
 setLoading(true)
 
  setTeamid(item.id);
  setTeamname('')
  setTeamname(item.displayName)
 // setTeam('')
  setTeam(item.displayName)
  setChannellist('');
  const teamschannels = await GraphManager.getTeamChannelAsync(item.id);
  setChannellist(teamschannels.value)
  setLoading(false);

  setModalVisible(true)

}
const modalviewchannel=async(itemid,itemname)=>{
   setChannelid(itemid)
   setChannelname(itemname)
   setModalVisible(false)
   setTeam(teamname+' / '+itemname)

 }
 const createEvent = async () => {
 // setImagestring(filePath[0].base64+"")
  // Create a new Event object with the
  // required fields
  console.log('filelength',filePath.length,'poststexttt',posttext.length)
 
  const newEvent: MicrosoftGraph.ChatMessage = {
    
  };

  if(posttext.length>0){

    newEvent.body = {
      content:posttext
    }
    
    await GraphManager.postTeamPostsAsync(newEvent,teamid,channelid);
  setPosttext('')
  Toast.show('Sent', Toast.LONG);

  }else{

  const chatMessage = {
    body: {
          contentType: 'html',
          content: '<div><div>\n<div><span><img height=\"297\" src=\"../hostedContents/1/$value\" width=\"297\" style=\"vertical-align:bottom; width:297px; height:297px\"></span>\n\n</div>\n\n\n</div>\n</div>'
      },
      hostedContents: [
          {
            '@microsoft.graph.temporaryId': '1',
            contentBytes:filePath[0].base64+'',
              contentType: 'image/jpg'
          }
      ]
  };
  await GraphManager.postTeamPostsAsync(chatMessage,teamid,channelid);
  setFilePath({})
  Toast.show('Sent', Toast.LONG);
}
 
  
 

    


//Its working fine with the below code.
  
  
}
const selectVideo = async () => {
  ImagePicker.launchImageLibrary({ mediaType: 'video',includeBase64: true}, (response) => {
      setVideofilePath(response)
      console.log('vfiihidhu',response);
      
  })
}


const selectFile = async () => {
  // Opening Document Picker to select one file
  try {
    const res:any = await DocumentPicker.pick({
      // Provide which type of file you want user to pick
      type: [DocumentPicker.types.allFiles],
      // There can me more options as well
      // DocumentPicker.types.allFiles
      // DocumentPicker.types.images
      // DocumentPicker.types.plainText
      // DocumentPicker.types.audio
      // DocumentPicker.types.pdf
    });
    // Printing the log realted to the file
    console.log('res : ' + JSON.stringify(res));
    // Setting the state to show single file attributes
    setSingleFile(res);
  } catch (err:any) {
    setSingleFile(null);
    // Handling any exception (If any)
    if (DocumentPicker.isCancel(err)) {
      // If user canceled the document selection
     // alert('Canceled');
     Toast.show('cancelled', Toast.LONG);

    } else {
      // For Unknown Error
    //  alert('Unknown Error: ' + JSON.stringify(err));
    Toast.show(JSON.stringify(err), Toast.LONG);

      throw err;
    }
  }
};


const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
          buttonPositive:''
        },
      );
      // If CAMERA Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else return true;
};

const requestExternalWritePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'App needs write permission',
          buttonPositive:''
        },
      );
      // If WRITE_EXTERNAL_STORAGE Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
     // alert('Write permission err', err);
    }
    return false;
  } else return true;
};


const captureImage = async (type) => {
  let options:any = {
    includeBase64: true,
    mediaType: type,
    maxWidth: 300,
    maxHeight: 550,
    quality: 1,
    videoQuality: 'low',
    durationLimit: 30, //Video max duration in seconds
    saveToPhotos: true,
  };
  let isCameraPermitted = await requestCameraPermission();
  let isStoragePermitted = await requestExternalWritePermission();
  if (isCameraPermitted && isStoragePermitted) {
    launchCamera(options, (response:any) => {
      console.log('Response = ', response);

      if (response.didCancel) {
       // alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
      //  alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
      //  alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
       // alert(response.errorMessage);
        return;
      }
      console.log('base64 -> ', response.base64);
      console.log('uri -> ', response.uri);
      console.log('width -> ', response.width);
      console.log('height -> ', response.height);
      console.log('fileSize -> ', response.fileSize);
      console.log('type -> ', response.type);
      console.log('fileName -> ', response.fileName);
      setFilePath(response.assets);
    });
  }
};


const chooseFile = (type:any) => {
  let options:any = {
    includeBase64: true,
    mediaType: type,
    maxWidth: 300,
    maxHeight: 550,
    quality: 1,
  };
  launchImageLibrary(options, (response) => {
    console.log('Response = ', response);
    console.log('uri -> ', response.assets);
     setFilePath(response.assets);
    // setImagestring(filePath[0].base64+"")

    // console.log('iiiimmmm',response.assets)
    // setImagestring(response.assets[0].base64!)
   //  console.log('bbbbbbbbfileeeepathhh',filePath[0].base64)

    // response.assets?.map((item, key)=>(
     // console.log('fileeeepathhh',filePath[0].uri)
      
    
     
     
  });
};




  return (
    <View style={styles.container}>
     <Modal visible={loading}transparent={true}>
          <View style={styles.loading}>
            <ActivityIndicator
              color={Platform.OS === 'android' ? '#276b80' : undefined}
              animating={loading}
              size='large' />
          </View>
        </Modal>
      
      <Modal visible={modalVisible}animationType="slide"transparent={true}>
      {/* <View style={styles.centeredView}> */}
      <View style={styles.modalView}>
        <View style={{alignSelf:'flex-end'}}>
      <TouchableOpacity activeOpacity={1} onPress={() => setModalVisible(false)}>
      <AntDesign  name="closecircle" color={'#DCDCDC'} size={30} />
        </TouchableOpacity>
        </View>
        <Text style={styles.modalText}>{teamname}</Text>
        <Text style={{height:30,width:'100%',marginHorizontal:10,fontSize:16,fontWeight:'700',flexDirection:'row',marginTop:10}}>Select Channel</Text>
        <FlatList data={channellist}
          renderItem={({item,index}) =>
          <TouchableOpacity activeOpacity={1} onPress={() => modalviewchannel(item.id,item.displayName)
  //  navigation.navigate('GroupDetailScreen',{upn: item.id ,name:item.displayName,description:item.description})
             } >
          
            
            <View style={styles.horizontalview}>
            <View style={{width:30,height:30,alignSelf:'center',justifyContent:'center',alignContent:'center'}}>
<UserAvatar  borderRadius={30/2} size={30} name={item.displayName} bgColors={['#a52a2a', '#5f9ea0','#deb887', '#0000ff','#dc143c','#008b8b','#9932cc','#ff1493','#483d8b','#696969','#228b22']}/>
</View> 
              <View style={styles.peopleItem}>
                <Text style={styles.peopleName}>{item.displayName}</Text>
              </View>
            </View>
            </TouchableOpacity>
          }
      />  
        </View>
        {/* </View> */}
      </Modal>

      <View style={styles.searchbar}>
        <View style={styles.leftsection}>
        <TouchableOpacity onPress={() => {console.log('dataaa')
          navigation.goBack()
         }
         }
          >
        <View style={styles.leftsectionimg}>
        <AntDesign  name="arrowleft" color={'#000'} size={24} />

        {/* <Image source={require('../images/left-arrow.png')}
                style={{ height: 30, width: 30,alignSelf:'center',marginTop:2}} />  */}
                </View>
                </TouchableOpacity>
                <Text style={{fontFamily:'Segoe UI',flex:1,marginTop:2, padding: 10,color:'#000',fontSize:22,justifyContent:'flex-start',fontWeight:'700'}}>Share Post</Text>

                <TouchableOpacity
                onPress={createEvent}
                style={[
                styles.button,
                ]}
   >
     <Text style={{fontFamily:'Segoe UI', color:'blue',fontSize:18,textAlign:'right',fontWeight:'600',marginVertical:5,marginRight:10}}>POST</Text>
   
       </TouchableOpacity>
                </View>
                </View>
       {/* <ScrollView style={{backgroundColor:'#fff',marginTop:2}}> */}
  
        <View style={styles.formField}>
        <View style={styles.dateTime}>
          <Image source={{uri:userPhoto!}}
                    style={{  width: 50,height: 50, borderRadius: 100 / 2,}} />
          <View style={{flexDirection:'column'}}>
          <Text style={styles.fieldLabel}>{userName}</Text>
          <TouchableOpacity
                onPress={openPanel}
                // style={[
                // styles.button,
                // ]}
    // disabled={newEventState.disableCreate()}
   >
          <View style={{flexDirection:'row',marginTop:5,marginLeft:10,padding:2,justifyContent:'center',alignContent:'center',alignItems:'center',borderWidth:1,borderRadius:50,flexWrap: 'wrap',borderColor:'#efefef'}}> 
          
          <Text style={{fontWeight: '700',fontFamily: 'Segoe UI',paddingRight:5}}>{team}</Text>
          <AntDesign  name="caretdown" color={'#000'} size={12} />

          </View>
          </TouchableOpacity>

          </View>

          </View>
          <TextInput style={filePath.length==0||filePath.length===undefined?styles.textInputpa:{display:'none'}}
           multiline={true}
            placeholder="What do you want to talk about?"
            value={posttext}
           // numberOfLines={1}
            autoFocus={true}
            onChangeText={(text) => setPosttext(text)}
            />
          {/* <Text style={{fontWeight: '600',fontFamily: 'Segoe UI',padding:2,borderColor:'#efefef',borderWidth:1,flexWrap: 'wrap'}}>{videofilePath.index}</Text> */}

<View style={filePath.length===undefined?{display:'none'}:{flex:1,flexDirection:'row',marginTop:40} }>
        <Image 
          source={filePath.length===undefined||filePath.length==0?{uri:''}:{uri:filePath[0].uri!}}
          style={filePath.length==0||filePath.length===undefined?{display:'none'}: styles.imageStyle}
        />
         {/* <Video 
      controls
      filter={filterType}
      filterEnable={true}
      source={videofilePath.length===undefined||videofilePath.length==0?{uri:videofilePath[0].uri!}:{uri:videofilePath[0].uri!}}
      style={videofilePath.length==0||videofilePath.length===undefined?{display:'none'}:styles.backgroundVideo}
      // Can be a URL or a local file.
        /> */}
         <View
        style={{
          position: 'absolute',
          right: -5,
          top: -10,
          backgroundColor: 'transparent',
        }}
      >
        <TouchableOpacity activeOpacity={0.5} onPress={() => setFilePath({})}>
       
        <AntDesign  name="closecircle" color={'#000'} size={30} />
        </TouchableOpacity>
        </View>

        </View>
        </View>

       
        <View style={styles.likesection2}>
        <TouchableOpacity onPress={() => captureImage('photo')}>
             <View style={{flex:2, alignItems:'center',justifyContent:'center'}}>
             <Ionicons  name="camera" color={'#4e4e4e'} size={30} />
           </View>
          </TouchableOpacity >

          <TouchableOpacity onPress={() => chooseFile('photo')}>
           <View  style={{flex:2, alignItems:'center',justifyContent:'center',marginHorizontal:15}}>
           <Entypo  name="image-inverted" color={'#4e4e4e'} size={30} />
            </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setFilePath({})}>
           <View style={{flex:2, alignItems:'center',justifyContent:'center'}}>
           <MaterialIcons  name="message" color={'#4e4e4e'} size={30} />
           </View>
           </TouchableOpacity>


           </View>
          
      
        <SwipeablePanel {...panelProps} isActive={isPanelActive}>
        {/* <PanelContent /> Your Content Here */}
        <View style={{marginHorizontal:10,paddingBottom:100,marginBottom:200}}>

        <Text style={{height:30,width:'100%',marginHorizontal:10,fontSize:16,fontWeight:'700',flexDirection:'row',marginTop:10}}>Select Team</Text>
        <FlatList data={teamslist}
          renderItem={({item}) =>
          <TouchableOpacity activeOpacity={1} onPress={() => modalview(item)
  //  navigation.navigate('GroupDetailScreen',{upn: item.id ,name:item.displayName,description:item.description})
             } >
          
            
            <View style={styles.horizontalview}>
            <View style={{width:30,height:30,alignSelf:'center',justifyContent:'center',alignContent:'center'}}>
<UserAvatar  borderRadius={30/2} size={30} name={item.displayName} bgColors={['#a52a2a', '#5f9ea0','#deb887', '#0000ff','#dc143c','#008b8b','#9932cc','#ff1493','#483d8b','#696969','#228b22']}/>
</View> 
              <View style={styles.peopleItem}>
                <Text style={styles.peopleName}>{item.displayName}</Text>
              </View>
            </View>
            </TouchableOpacity>
          }
      />  
      </View>
      </SwipeablePanel>
        
        
    {/* </ScrollView> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  formField: {
    flex:0.9,
    backgroundColor: '#ffffff',
    borderColor:'#ffffff',
    paddingTop:10,
    paddingHorizontal:20,
    marginTop:10,
    
   // height:'80%'
  },
  fieldLabel: {
    fontWeight: '600',
    fontFamily: 'Segoe UI',
    paddingHorizontal:10
  },
  textInput: {
    borderColor: 'gray',
    paddingHorizontal: 10,
    fontSize:14,
    fontWeight:'600',
    fontFamily: 'Segoe UI',
  },
  textInputpa: {
   // backgroundColor: "#fafafa", 
   // textAlignVertical : "top" ,
    paddingHorizontal:10,
  },
  multiLineTextInput: {
    borderColor: 'gray',
    height: 180,
    paddingVertical: 10,
    paddingHorizontal:25,
    fontFamily: 'Segoe UI',
  },
  time: {
    paddingVertical: 10,
    color: '#000',
    alignSelf:'center'
  },
  date: {
    paddingVertical: 10,
    paddingHorizontal:5,
    color: '#000',
  },
  dateTime: {
    flexDirection: 'row'
  },
  Timerow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginLeft:25,
    paddingRight:10,
    marginTop:6
  },
  dateTimerow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop:10,
    marginLeft:15
  },
  searchbar: {
    backgroundColor: '#fff',
    height:55,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    alignContent:'center'
    
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
   button: {
    justifyContent:'flex-end',
    flexDirection:'row',
    marginHorizontal:10,
    marginTop:10,
    
   },
   horizontalview: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingTop:10,
    marginRight: 10,
    paddingHorizontal:15,
    alignItems: "center",
    justifyContent:'center',
    alignContent:'center',
  },
  peopleItem: {
    flexDirection: 'column',
    paddingRight:20,
    paddingLeft:10,
    width:'100%',
    alignContent:'center',
    justifyContent:'center',
  },
  peopleName: {
    fontWeight: '600',
    fontFamily: 'Segoe UI',
    fontSize: 16,
    paddingTop:1
  },
  peopleEmail: {
    fontWeight: '200',
    fontSize:12,
    marginRight:10,
    fontFamily: 'Segoe UI',
  },


  modalView: {
    marginVertical: 80,
    marginHorizontal:20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  // button: {
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 2
  // },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 5,
    textAlign: "center",
    alignItems: "center",
    justifyContent:'center',
    alignContent:'center',
    fontSize:18,
    fontWeight:'700',
    fontFamily:'Segoe UI'
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  likesection2: {
    flexDirection: 'row',
    flexWrap:'nowrap',
    paddingHorizontal:15,
    height:20,
    backgroundColor:'#ffffff',
    alignItems:'center',
    alignContent:'center',
    flex:0.1
  },
  imageStyle: {
    width: '100%',
    height: 300,
    justifyContent:'center',
    alignContent:'center',
  //  alignSelf:'center'
  },
  backgroundVideo: {
    height: 300,
    width:'100%'
    
  },
});

export default App;
function imageBase64Text(imageBase64Text: any) {
  throw new Error('Function not implemented.');
}

