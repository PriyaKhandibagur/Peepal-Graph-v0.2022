import React, {useState} from 'react';
// Import required components
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GraphManager } from '../graph/GraphManager';
import Toast from 'react-native-simple-toast';

// Import Image Picker
// import ImagePicker from 'react-native-image-picker';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';

const App = () => {
  const [filePath, setFilePath]:any = useState({}as any);
  const navigation = useNavigation();

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
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);
      console.log('uri -> ', response.assets);

           console.log('bbbbbbbbfileeeepathhh',filePath.length)

       setFilePath(response.assets);
      // response.assets?.map((item, key)=>(
      //  console.log('fileeeepathhh',filePath[0].uri)
        
      
       
       
    });
  };
  const uploadImage = async () => {
    // Check if any file is selected or not
    if (filePath != null) {
      // If file selected then create FormData
      const fileToUpload = filePath;
      console.log('filetouplaod',filePath[0].fileName)
      await GraphManager.fileUplaod(fileToUpload,filePath[0].fileName);
      Toast.show('uplaod succesful.', Toast.LONG);


      // const data = new FormData();
      // data.append('name', 'Image Upload');
      // data.append('file_attachment', fileToUpload);
      // // Please change file upload URL
      // let res = await fetch(
      //   'http://localhost/upload.php',
      //   {
      //     method: 'post',
      //     body: data,
      //     headers: {
      //       'Content-Type': 'multipart/form-data; ',
      //     },
      //   }
      // );
      // let responseJson = await res.json();
      // if (responseJson.status == 1) {
      //  // alert('Upload Successful');
      // }
    } else {
      // If no file selected the show alert
     // alert('Please Select File first');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <Text style={styles.titleText}>
        Example of Image Picker in React Native
      </Text> */}
             <View style={styles.searchbar}>
        <View style={styles.leftsection}>
        <TouchableOpacity onPress={() => {console.log('dataaa')
          navigation.goBack() } }>
        <View style={styles.leftsectionimg}>
        <AntDesign  name="arrowleft" color={'#000'} size={24} />

        {/* <Image source={require('../images/left-arrow.png')}
                style={{ height: 30, width: 30,alignSelf:'center',marginTop:2}} />  */}
                </View>
                </TouchableOpacity>
                <Text style={{fontFamily:'Segoe UI',flex:1,marginTop:2, padding:10,color:'#000',fontSize:22,justifyContent:'flex-start',fontWeight:'600'}}>Create Content</Text>

                
     <Text onPress={uploadImage} style={{fontFamily:'Segoe UI', color:'#000',fontSize:18,textAlign:'right',fontWeight:'600',paddingTop:15,paddingRight:10}}>Upload</Text>
   
                </View>  
                </View>
                <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,}}/>

      <View style={styles.container}>
        {/* <Image
          source={{
            uri: 'data:image/jpeg;base64,' + filePath.data,
          }}
          style={styles.imageStyle}
        /> */}
        <View style={filePath.length===undefined?{display:'none'}:{flex:1,justifyContent:'center',alignContent:'center',alignItems:'center'} }>
        <Image 
          source={filePath.length===undefined?{uri:filePath.uri}:{uri:filePath[0].uri!}}
          style={styles.imageStyle}
        />
               
         <Text style={styles.textStyle}>{filePath.length===undefined?filePath.fileName: filePath[0].fileName}</Text>

        </View>
        <View style={{flex:1}}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => captureImage('photo')}>
          <Text style={styles.textStyle}>
            Take Photo
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => captureImage('video')}>
          <Text style={styles.textStyle}>
            Record Video
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile('photo')}>
          <Text style={styles.textStyle}>Choose Image</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile('video')}>
          <Text style={styles.textStyle}>Choose Video</Text>
        </TouchableOpacity> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 2,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5,
    marginVertical: 10,
    width: 250,
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
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