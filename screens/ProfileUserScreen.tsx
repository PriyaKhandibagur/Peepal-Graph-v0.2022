// Copyright (c) Microsoft.
// Licensed under the MIT license.

// <HomeScreenSnippet>
import React from 'react';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { GraphManager } from '../graph/GraphManager';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator,HeaderBackButton,StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment-timezone';
import { AuthManager } from '../auth/AuthManager';
import UserAvatar from 'react-native-user-avatar';

import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  Linking,
  FlatList,
  Dimensions,
  RefreshControl,Modal,ImageSourcePropType,ActivityIndicator
} from 'react-native';

import PeopleAroundUserScreen from '../screens/PeopleAroundUserScreen';
import { RouteProp } from '@react-navigation/native';
import  ProfileScreenUser from './ProfileUserScreen'
import  SendMail from './SendMail'
import { UserContext } from '../UserContext';
import TextAvatar from 'react-native-text-avatar';

const Stack = createStackNavigator();
const RootStack = createStackNavigator<RootStackParamList>();
const size = Dimensions.get('window').width/2;
const heightSize = Dimensions.get('window').height/2.6;

const ProfileState = React.createContext<ProfileScreenState>({
  refreshing: false,
  userLoading: false,
  manager: '',
  manager_jobtitle:'',
  manager_department:'',
  manager_mobileno:'',
  manager_email:'',
  manager_office:'',
  userFirstName: '',
  userFullName: '',
  userEmail: '',
  userTimeZone: '',
  userPhoto:'' ,
  userAboutMe:'',
  userJobTitle:'',
  userDepartment:'',
  userMobile:'',
  userOfficeLocation:'',
  userBusinessPhones:[],
  userSkills:[],
  userInterests:[],
  userSchool:[],
  userPastProjects:[],
  birthday:'',
  hiredate:'',
  shared_files:[],
  peopleList: [],
  groupList: [],
  upn:'',
  managerPhoto:'',
  managerid:''


 // image:require('../images/no-profile-pic.png')
  
});

type RootStackParamList = {
  People: undefined;
  ProfileScreenUser: { upn: string };
  Peoplearounduser: { upn: string,name:string};
  Profile: { upn: string };
  SendMail:{ upn: string};
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'ProfileScreenUser'>;

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProfileScreenUser'
>;
type Props = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
};
type ProfileScreenState = {
  refreshing: boolean;
  userLoading: boolean;
  manager: string;
  manager_jobtitle:string,
  manager_department:string,
  manager_mobileno:string,
  manager_email:string,
  manager_office:string,
  userFirstName: string;
  userFullName: string;
  userEmail: string;
  userTimeZone: string;
  userPhoto:string;
  userAboutMe:string;
  userJobTitle:string;
  userDepartment:string;
  userMobile:string;
  userOfficeLocation:string;
  userBusinessPhones:Array<String>;
  userSkills:Array<String>;
  userInterests:Array<String>;
  userSchool:Array<String>;
  userPastProjects:Array<String>;
  birthday:string;
  hiredate:string;
  shared_files:MicrosoftGraph.DriveItem[];
  peopleList: MicrosoftGraph.Person[];
  groupList: MicrosoftGraph.Group[];
  upn:string;
  managerPhoto:string;
  managerid:string
 // image:Image;
}
 


const HomeComponent = () => {
const navigation = useNavigation();
const userContext = React.useContext(UserContext);
const profileState = React.useContext(ProfileState);
var skills=profileState.userSkills;
var interests=profileState.userInterests;
var schools=profileState.userSchool;
var businessPhones=profileState.userBusinessPhones;
var pastProjects=profileState.userPastProjects;
console.log('userrrrrrphhh',profileState.userPhoto)
 console.log('managerphotoooo',profileState.managerPhoto)

 const getItem = () => {
 
  const _userDiv:any[]=[];
 // console.log('userdetails',filteredDataSource)           
      
  // eslint-disable-next-line array-callback-return
  profileState.peopleList.slice(0,4).map((v:any,i:any) =>
      {
       // console.log('vimagee',v.Image)
          _userDiv.push(
            
           <TouchableOpacity activeOpacity={1} onPress={() => {
             navigation.navigate('Profile',{upn:v.userPrincipalName});
           }} >
         <View style={styles.itemContainer1}>
         <View style={styles.item2}>
         <View style={styles.cardfirstpart1}>
         <View style={{justifyContent:'center',alignItems:'center',marginTop:35}}>
         {v.Image==undefined?<View style={{width:80,height:80,alignSelf:'center',justifyContent:'center',alignContent:'center'}}>
          <UserAvatar  borderRadius={80/2} size={80} name={v.displayName} bgColors={['#5f9ea0']}/>
          </View>:<Image source={{uri:v.Image!,}}
              style={{ height: 80, width: 80,justifyContent: 'center',borderRadius:100}} />}
          </View>
        <View style={styles.peopletextitem}>
          <Text style={{fontWeight: '400',fontSize:16,fontFamily: 'Segoe UI',}}>{v.displayName}</Text>
          <Text style={{fontWeight: '400',fontSize:14,fontFamily: 'Segoe UI',}}>{v.jobTitle}</Text>
          <Text style={{fontWeight: '400',fontSize:14,fontFamily: 'Segoe UI',}}>{v.department}</Text>
 
          <TouchableOpacity
    style={styles.SubmitButtonStyle}
    activeOpacity = { .5 }
   
 >
          <Text style={styles.TextStyle}> View </Text>
          </TouchableOpacity>
        </View>
      
        </View>
       </View>
      </View>
         </TouchableOpacity>
          )
      });
      return _userDiv
  };
 
return (
  <SafeAreaView style={{flex: 1}}>
<ScrollView 

//  refreshControl={
//    <RefreshControl
//      refreshing={profileState.refreshing}
//      onRefresh={_onRefresh}
//    />
//  }
>
<View style={styles.container}>
<Modal
          visible={profileState.userLoading}>
          <View style={{ flex:1,backgroundColor:"#00000020", justifyContent:"center",alignItems:"center"}}>
            <View style={{backgroundColor:"white",padding:10,borderRadius:5, width:"80%", alignItems:"center"}}>
              <Text style={styles.fieldLabel}>Loading...</Text>
              <ActivityIndicator size="large" color="#f35588"/>
            </View>
          </View>
        </Modal>
     
<View style={styles.profileView}>
<View style={styles.subprofileView}>
<View style={styles.horizontalname}>
{profileState.userPhoto==''?<TextAvatar backgroundColor={'#5f9ea0'} textColor={'#fff'}size={100} type={'circle'}>{profileState.userFullName}</TextAvatar>:
  <Image source={{uri: profileState.userPhoto!,}}
         resizeMode='contain'
         style={styles.profilePhoto} />
}
{/* <Image source={{uri: profileState.userPhoto!,}}
         style={styles.profilePhoto} /> */}
 
  <View style={styles.textsection}>
  <Text style={styles.profileUserName}>{profileState.userFullName}</Text>
  <Text style={profileState.userJobTitle==null?{display:'none'}:styles.profileEmail}>{profileState.userJobTitle}</Text>
  <Text style={profileState.userDepartment==null?{display:'none'}:styles.profileEmail}>{profileState.userDepartment}</Text>
  <View style={styles.horizontalname}>
<View style={{backgroundColor:'#5F259F',paddingHorizontal:10,marginTop:10}}>
<TouchableOpacity  onPress={() => {
          navigation.navigate('SendMail',{upn:profileState.userEmail});
        }}>
<View style={styles.purplebox}>
<Image source={require('../images/email-white.png')}
       style={{width: 20,height: 20,marginRight:10}}/>
<Text style={ {fontWeight: '200',fontSize: 14,alignItems:'center',
    fontFamily: 'Segoe UI',color:'white'}}>Send Email</Text>
</View>
</TouchableOpacity>
</View>
<TouchableOpacity onPress={() => {
          makeCall(profileState.userMobile);
        }}>
<View style={{backgroundColor:'#5F259F',paddingHorizontal:10,paddingTop:2,paddingBottom:5,marginLeft:10,marginTop:10}}>
<Image source={require('../images/telephone.png')}
       style={{width: 20,height: 20,justifyContent:'center',alignContent:'center',marginTop:5}}/>
</View>
</TouchableOpacity>
</View>
  </View>
</View>
</View>
<View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />

<View style={styles.subprofileView}>
<View style={styles.horizontal}>
<Text style={styles.profileEmail}>About me</Text>

  </View>
  {profileState.userAboutMe==null?<View><Text style={styles.profilesub}>Not updated</Text></View>:<View style={styles.customItem}>
<Text style={styles.profilesub}>{profileState.userAboutMe}</Text>
</View>}
</View>
<View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />


<View style={styles.subprofileView}>
<View style={styles.horizontal}>
<Text style={styles.profileEmail}>Contact</Text>
  </View>
  {/* <View style={styles.customItem}> */}
    {profileState.userMobile==null?<View style={styles.customItem}><Image source={require('../images/phone-call.png')}
       style={styles.iconStyle}/>
<Text style={styles.profilesub}>Not updated</Text>
</View>:<View style={styles.customItem}><Image source={require('../images/phone-call.png')}
       style={styles.iconStyle}/>
<Text style={styles.profilesub}>{profileState.userMobile}</Text>
</View>
 }

{/* </View> */}

<View style={profileState.userEmail==null?{display:'none'}: styles.customItem}>
<Image source={require('../images/email.png')}
       style={styles.iconStyle}/>
<Text style={styles.profilesub}>{profileState.userEmail}</Text>

</View>

  {/* <View style={ styles.customItem}> */}
    {profileState.hiredate==null||convertDateTime(profileState.hiredate!)=='01/01/0001'?<View style={ styles.customItem}><Image source={require('../images/calendar.png')}
       style={styles.iconStyle}/>
  <Text style={styles.profilesub}>Not updated</Text></View>:<View style={ styles.customItem}><Image source={require('../images/calendar.png')}
       style={styles.iconStyle}/>
  <Text style={styles.profilesub}>{convertDateTime(profileState.hiredate!)}</Text></View>}

{/* </View> */}

{/* <View style={styles.customItem}> */}
  {profileState.userOfficeLocation==null?<View style={styles.customItem}><Image source={require('../images/location.png')}
       style={styles.iconStyle}/><Text style={styles.profilesub}>Not updated</Text></View>:<View style={ styles.customItem}><Image source={require('../images/location.png')}
       style={styles.iconStyle}/>
<Text style={styles.profilesub}>{profileState.userOfficeLocation}</Text></View>}

{/* </View> */}
 
</View>
<View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />

<View style={ styles.subprofileView}>
  
<Text style={styles.profileEmail}>Schools and Education</Text>

  {schools.length<1?<View><Text style={styles.profilesub}>Not updated</Text></View>: <View style={styles.profileView}>{schools.map((item, key)=>(
      <View style={styles.customItem}>
        <MaterialCommunityIcons name="circle" color={'#4e4e4e'} size={10}style={{marginTop:5,marginHorizontal: 10}} />
           
           <Text key={key} style={styles.profilesub} > { item } </Text>
   </View>
   ))}
  </View>}
  
  </View>

  <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />

<View style={styles.subprofileView}>
<Text style={styles.profileEmail}>Manager</Text>
  {profileState.manager==''?<View><Text style={styles.profilesub}>Not updated</Text></View>:<View style={styles.horizontalname}>{profileState.managerPhoto==''?<TextAvatar backgroundColor={'#5f9ea0'} textColor={'#fff'}size={100} type={'circle'}>{profileState.manager}</TextAvatar>:
  <Image source={{uri: profileState.managerPhoto}}
         resizeMode='contain'
         style={styles.managerPhoto} />
}

 
  <View style={styles.textsection}>

<Text style={styles.profileUserName}>{profileState.manager}</Text>

<Text style={profileState.manager_jobtitle==null?{display:'none'}:styles.profileEmail}>{profileState.manager_jobtitle}</Text>
<Text style={profileState.manager_department==null?{display:'none'}:styles.profileEmail}>{profileState.manager_department}</Text>
<View style={styles.horizontalname}>
<View style={{backgroundColor:'#5F259F',paddingHorizontal:10,marginTop:10}}>
<TouchableOpacity  onPress={() => {
          navigation.navigate('SendMail',{upn:profileState.manager_email});
        }}>
<View style={styles.purplebox}>
<Image source={require('../images/email-white.png')}
       style={{width: 20,height: 20,marginRight:10}}/>
<Text style={ {fontWeight: '200',fontSize: 14,alignItems:'center',
    fontFamily: 'Segoe UI',color:'white'}}>Send Email</Text>
</View>
</TouchableOpacity>
</View>
<TouchableOpacity onPress={() => {
          makeCall(profileState.manager_mobileno);
        }}>
<View style={{backgroundColor:'#5F259F',paddingHorizontal:10,paddingTop:2,paddingBottom:5,marginLeft:10,marginTop:10}}>
<Image source={require('../images/telephone.png')}
       style={{width: 20,height: 20,justifyContent:'center',alignContent:'center',marginTop:5}}/>
</View>
</TouchableOpacity>
</View>
</View>
</View>}
 
</View>
<View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />

<View style={styles.subprofileView}>
<View style={styles.horizontal}>
 <Text style={styles.profileEmail}>Projects</Text>
 
 </View>
  {pastProjects.length<1? <View><Text style={styles.profilesub}>Not updated</Text></View>:<View style={styles.profileView}>{ pastProjects.map((item, key)=>(
  <View style={styles.customItem}>
  <MaterialCommunityIcons name="circle" color={'#4e4e4e'} size={10}style={{marginTop:5,marginHorizontal: 10}} />
      <Text key={key} style={styles.profilesub} > { item } </Text>
</View>
))}
</View>}
  
  </View>
 
<View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />

<View style={ styles.subprofileView}>
<View style={styles.horizontal}>
 <Text style={styles.profileEmail}>Skills</Text>

  </View>
  {skills.length<1?<View><Text style={styles.profilesub}>Not updated</Text></View>: <View style={styles.profileView}>{ skills.map((item, key)=>(
      <View style={styles.customItem}>
        <MaterialCommunityIcons name="circle" color={'#4e4e4e'} size={10}style={{marginTop:5,marginHorizontal: 5}} />
         <Text key={key} style={styles.profilesub} > { item } </Text>
   </View>
   ))}
  </View>}
  
  </View>
  <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />



<View style={styles.subprofileView}>
<View style={styles.horizontal}>
  <Text style={styles.profileEmail}>Interests</Text>

  </View>
  {interests.length<1?<View><Text style={styles.profilesub}>Not updated</Text></View>:<View style={styles.profileView}>{ interests.map((item, key)=>(
    <View style={styles.customItem}>
    <MaterialCommunityIcons name="circle" color={'#4e4e4e'} size={10}style={{marginTop:5,marginHorizontal: 10}} />
   <Text key={key} style={styles.profilesub} > { item } </Text>
   </View>
   ))}
  </View>}
  
  </View>
  <View style={profileState.peopleList.length<1?{display:'none'}:{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />

<View style={profileState.peopleList.length<1?{display:'none'}: styles.peoplearoundsect}>
<View style={{flexDirection:'row',paddingHorizontal:20,paddingVertical:10}}>
          <Text style={styles.profileEmail}>People around user</Text>
        
        </View>
        <View style={{flexDirection:'row', flex:1,flexWrap:'wrap',justifyContent:'space-around'
          }}>
{getItem()}
</View>

        {/* <FlatList
     
     data={profileState.peopleList.slice(0,10)}
    
     numColumns={2}
     renderItem={({ item }) => {
           return (
                <TouchableOpacity activeOpacity = { 1 } onPress={() => {console.log('upnnnnnnn',item.userPrincipalName)
                navigation.navigate('Profile',{upn:item.userPrincipalName,name:item.displayName});
              }}>
              <View style={styles.itemContainer1}>
              <View style={styles.item2}>
              <View style={styles.cardfirstpart1}>
              <View style={{justifyContent:'center',alignItems:'center',marginTop:35}}>
               <Image source={require('../images/avatarmale.png')}
               style={{ height: 80, width: 80,justifyContent: 'center',}} />
               </View>
             <View style={styles.peopletextitem}>
               <Text style={{fontWeight: '400',fontSize:16,fontFamily: 'Segoe UI',}}>{item.displayName}</Text>
               <Text style={{fontWeight: '400',fontSize:14,fontFamily: 'Segoe UI',}}>{item.jobTitle}</Text>
               <Text style={{fontWeight: '400',fontSize:14,fontFamily: 'Segoe UI',}}>{item.department}</Text>
               <TouchableOpacity
         style={styles.SubmitButtonStyle}
         activeOpacity = { .5 }
        
      >
               <Text style={styles.TextStyle}> View </Text>
               </TouchableOpacity>
             </View>
           
             </View>
            </View>
           </View>
              </TouchableOpacity>
             );
         }}
/> */}
         
</View>








  </View>
  </View>
  </ScrollView>
  </SafeAreaView>
 
  );
}
const convertDateTime = (dateTime: string): string => {
  return moment(dateTime).format('DD/MM/yyyy');
};
const makeCall = (phone:string) => {
  // const profileState = React.useContext(ProfileState);
 
   let phoneNumber = '';
 console.log('ppppp '+phone)
   if (Platform.OS === 'android') {
     phoneNumber = 'tel:'+phone;
   } else {
     phoneNumber = 'telprompt:'+phone;
   }
 
   Linking.openURL(phoneNumber);
 };

export default class ProfileScreen extends React.Component<Props> {
 
  
  state: ProfileScreenState = {
    refreshing: true,
    userLoading: true,
    manager:'',
    manager_jobtitle:'',
    manager_department:'',
    manager_mobileno:'',
    manager_email:'',
    manager_office:'',
    userFirstName: 'Adele',
    userFullName: 'Adele Vance',
    userEmail: 'adelev@contoso.com',
    userTimeZone: 'UTC',
    userPhoto: '',
    userAboutMe:'',
    userJobTitle:'',
    userDepartment:'',
    userMobile:'',
    userOfficeLocation:'',
    userBusinessPhones:[],
    userSkills:[],
    userInterests:[],
    userSchool:[],
    userPastProjects:[],
    birthday:'',
    hiredate:'null',
    shared_files:[],
    peopleList: [],
    groupList: [],
    upn:'',
    managerPhoto:'',
    managerid:''
  };
  async  getphoto(this: any){
    var UrlImage;
    const token = await AuthManager.getAccessTokenAsync();
     console.log('usermail',this.state.userEmail)
      var that= this;    
        // AuthContext.acquireToken("https://graph.microsoft.com", function (error, token) {
          var request = new XMLHttpRequest;
          request.open("GET", "https://graph.microsoft.com/v1.0/users/"+this.state.userEmail+"/photo/$value");
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
                      that.setState({ userPhoto: reader.result },()=>{console.log('set url in state')})
  
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
 
  async  managergetphoto(this: any){
    var UrlImage;
    const token = await AuthManager.getAccessTokenAsync();
  
      var that= this;    
        // AuthContext.acquireToken("https://graph.microsoft.com", function (error, token) {
          var request = new XMLHttpRequest;
          request.open("GET", "https://graph.microsoft.com/v1.0/users/"+this.state.managerid+"/photo/$value");
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
                      that.setState({ managerPhoto: reader.result },()=>{console.log('set url in state')})
                      console.log('managerresponseeereader',this.state.managerPhoto)

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
    const{upn}=this.props.route.params;
    try {
      const user: MicrosoftGraph.User = await GraphManager.getUserDetailsAsync(upn);
      const managerApi: MicrosoftGraph.User = await GraphManager.getUserManagerAsync(upn);
     // const shared_files = await GraphManager.getUserDriveSharedItemsAsync(upn);
      const people = await GraphManager.getUserPeopleAsync(upn);
      const groups = await GraphManager.getUserGroupsAsync(upn);
      const photo = people.value;

      const shared_files = await GraphManager.getDriveSharedItemsAsync();
    //  await GraphManager.getPhotoAsync().then((image:any)=>{this.setState({userPhoto:image})});

      var UrlImage;
      const token = await AuthManager.getAccessTokenAsync();
      let recentfiles:any =[];
      photo.map( (u:any) => {   
       console.log('aaaaaaaa',u.userPrincipalName)
 
     // await getProfilePhoto(u.userPrincipalName,String(_acccessToken)).then((image)=>{
     //     u.Image=image
     // }) 
     var request = new XMLHttpRequest;
     request.open("GET", "https://graph.microsoft.com/v1.0/users/"+u.userPrincipalName+"/photos/64x64/$value");
     request.setRequestHeader("Authorization", "Bearer " + token);
     request.responseType = "blob";
 
    // console.log('bbbbbbb',request)
 
     request.onload = function () {
    //  console.log('cccccc',request.status)
 
         if (request.readyState === 4 && request.status === 200) {
         // console.log('dddd',request.response)
 
             UrlImage = request.response;
             //  var imageElm = document.createElement("img");
             var React = require('react-native'),
             window = global || window;
             var reader = new window.FileReader();
             reader.onload = function () {
                 // Add the base64 image to the src attribute
                 // imageElm.src = reader.result;
                // console.log('responseeereader',reader.result)
                // that.setState({ managerPhoto: reader.result },()=>{console.log('set url in state')})
               
                u['Image']=reader.result;
 
              //  console.log('bbbbbbb',u)
               // console.log('jdhj',u)
              recentfiles.push(u);
             // console.log('set url in state',filteredDataSource)
             //// SetUserItems(recentfiles),()=>{console.log('set url in state')}
              // masterDataSource.map( (m:any) => {  
              //   m['Image']=reader.result;
 
              // });
                // this.setState({ UserItemsImg: recentfiles },()=>{console.log('set url in state')})
 
              //  console.log('uimageee',recentfiles)
                 // Display the user's profile picture
                 //document.getElementsByClassName('user-picture-box')[0].appendChild(imageElm);
             }
 
             reader.readAsDataURL(request.response);
         }
         
     };
    // debugger;
     request.send(null);
 
 
    });
    this.setState({
      refreshing: false,
      userLoading: false,
      manager: managerApi.displayName,
      manager_jobtitle:managerApi.jobTitle,
      manager_department:managerApi.department,
      manager_mobileno:managerApi.mobilePhone,
      manager_email:managerApi.userPrincipalName,
      manager_office:managerApi.officeLocation,
      userFirstName: user.givenName!,
      userFullName: user.displayName!,
      // Work/School accounts have email address in mail attribute
      // Personal accounts have it in userPrincipalName
      userEmail: user.mail! || user.userPrincipalName!,
      userTimeZone: user.mailboxSettings?.timeZone!,
      
      userAboutMe:user.aboutMe!,
      userJobTitle:user.jobTitle!,
      userDepartment:user.department!,
      userMobile:user.mobilePhone!,
      userOfficeLocation:user.officeLocation!,
      userBusinessPhones:user.businessPhones!,
      userSkills:user.skills!,
      userInterests:user.interests!,
      userSchool:user.schools!,
      userPastProjects:user.pastProjects!,
      birthday:user.birthday!,
      hiredate:user.hireDate!,
      shared_files:shared_files.value!,
      peopleList: recentfiles,
      groupList: groups.value!,
      upn:upn,
      managerid:managerApi.userPrincipalName

    });

    this.getphoto();
    this.managergetphoto();

    } catch(error) {
      const user: MicrosoftGraph.User = await GraphManager.getUserDetailsAsync(upn);
     // const managerApi: MicrosoftGraph.User = await GraphManager.getUserManagerAsync(upn);
     // const shared_files = await GraphManager.getUserDriveSharedItemsAsync(upn);
      const people = await GraphManager.getUserPeopleAsync(upn);
      const groups = await GraphManager.getUserGroupsAsync(upn);

      this.setState({
        refreshing: false,
        userLoading: false,
        manager: '',
        manager_jobtitle:'',
        manager_department:'',
        manager_mobileno:'',
        manager_email:'',
        manager_office:'',
        userFirstName: user.givenName!,
        userFullName: user.displayName!,
        // Work/School accounts have email address in mail attribute
        // Personal accounts have it in userPrincipalName
        userEmail: user.mail! || user.userPrincipalName!,
        userTimeZone: user.mailboxSettings?.timeZone!,
        
        userAboutMe:user.aboutMe!,
        userJobTitle:user.jobTitle!,
        userDepartment:user.department!,
        userMobile:user.mobilePhone!,
        userOfficeLocation:user.officeLocation!,
        userBusinessPhones:user.businessPhones!,
        userSkills:user.skills!,
        userInterests:user.interests!,
        userSchool:user.schools!,
        userPastProjects:user.pastProjects!,
        birthday:user.birthday!,
        hiredate:user.hireDate!,
      //  shared_files:shared_files.value!,
        peopleList: people.value!,
        groupList: groups.value!,
        upn:upn
       
      });
    }
  }

  render() {

    return (
      <ProfileState.Provider value={this.state}>

<RootStack.Navigator initialRouteName="People">
  <RootStack.Screen name="People" component={HomeComponent}
  options={({navigation, route}) => ({
    headerStyle: {
      backgroundColor: '#fff'
   },
   headerTitle:this.state.userFullName,
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
    ),})}
  />
  
  <RootStack.Screen name="Peoplearounduser" component={PeopleAroundUserScreen}
  options={({navigation, route}) => ({
    headerShown:false
   })}
  />
   <RootStack.Screen name="Profile" component={ProfileScreenUser}
  options={({navigation, route}) => ({
    headerShown:false
   })}
  />
  <RootStack.Screen
    name="SendMail"
    
    component={SendMail}
    options={{
      headerShown: false}}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
</RootStack.Navigator>
      </ProfileState.Provider>

   
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'flex-start',
    alignSelf: 'stretch',
    backgroundColor:'white',    
    //justifyContent:'center',
    //alignContent:'center'
  },
  fieldLabel: {
    fontWeight: '600',
    marginBottom: 10,
    color:'#303030',
    fontSize:16
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventItem: {
    padding: 10
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileView: { 
    flexWrap:'nowrap',
    alignSelf: 'stretch'

  },
  subprofileView:{
  paddingHorizontal:20,
  paddingTop:15,
  paddingBottom:20,
  justifyContent:'center'
  },
  textsection:{
    paddingHorizontal:15,
    justifyContent:'center'
    },
    profilePhoto: {
      paddingVertical: 10,
      paddingRight:10,
      paddingLeft:5,
      width: 100,
      height: 100,
      borderRadius: 70,
    },
  managerPhoto: {
    paddingVertical: 10,
    paddingHorizontal:20,
    width: 100,
    height: 100,
    borderRadius: 70,
  },
  profileUserName: {
    fontWeight: '400',
    fontSize:16,
    fontFamily: 'Segoe UI',
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginTop:5,
    marginRight: 10,
  },
  customItem: {
    flex:1,
    flexDirection: 'row',
    marginTop:10,
    flexWrap:'nowrap'
  },
  purplebox: {
    flex:1,
    flexDirection: 'row',
    marginVertical:5,
    flexWrap:'nowrap'
  },
  horizontal: {
    flex:2,
    flexDirection: 'row',
    
  },
  horizontalname: {
    flexDirection: 'row',
    marginTop:5,
    marginRight:10
  },
  profileEmail: {
    fontWeight: '400',
    fontSize: 14,
    alignItems:'center',
    fontFamily: 'Segoe UI',
  },
  profilesub: {
    fontWeight: '400',
    fontSize: 14,
    flexWrap:'wrap',
    alignItems:'center',
    fontFamily: 'Segoe UI',
  },
  subTitle: {
    fontWeight: '100',
    fontSize: 12,
    alignItems:'center',
    fontFamily:'Segoe UI'
    
  },
  EditView: {
    flex:1,
    flexDirection: 'row-reverse',
  },
  firstsection: {
    paddingHorizontal:15,
    paddingVertical:20,
    marginTop:5,
    backgroundColor: '#ffffff',
  },
  firstsection1: {
    padding:15,
    marginTop:5,
    backgroundColor: '#ffffff',
  },
  peoplearoundsect: {
    backgroundColor: '#ffffff',
    marginBottom:15
  },
  cardview: {
    width:250,
    height:130,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    marginVertical:12,
    marginLeft:5,
    marginRight:10,
    borderColor:'#dcdcdc',
    borderRadius: 5,
  },
  peoplecardview: {
    width:175,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    marginVertical:12,
    marginRight:15,
    justifyContent:'center',
    alignItems:'center',
    borderColor:'#dcdcdc',
    borderRadius: 5,
    paddingVertical:20
  },
  imagecard: {
    height:130,
    backgroundColor: '#00377B',
    marginHorizontal:10,
    justifyContent:'center',
    alignItems:'center'
  },
  horizontalview: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingRight:15,
    paddingVertical:10,
    marginVertical: 1,
    marginHorizontal: 5,
  },
  itemImageview:{
    backgroundColor: '#ffffff',
    justifyContent:'center'
  },
  peopleItem: {
    flexDirection: 'column',
    paddingLeft:10,
    paddingRight:15,
  
  },
 
  peopletextitem: {
    flexDirection: 'column',
    alignItems: 'center',
 justifyContent: 'center',
 marginTop:40
  },
  titlename: {
    fontWeight: '700',
    fontSize: 14,
    marginLeft:10,
    fontFamily:'Segoe UI'

  },
  peopleName: {
    fontWeight: '700',
    fontSize: 14,
    marginRight:10,
    fontFamily:'Segoe UI'

  },
  peopleEmail: {
    fontWeight: '200',
    fontSize:12,
    color:'grey',
    fontFamily:'Segoe UI'

  },
  lastdate: {
    fontWeight: '200',
    fontSize:10,
    color:'grey',
    fontFamily:'Segoe UI'

  },
  cardtitle: {
    fontWeight: '600',
    fontSize:14,
    color:'grey',
    fontFamily:'Segoe UI'

   },
   cardaspectsnone: {
    display:'none'

  },
  itemContainer: {
    width: size,
    height:120,
    marginTop:20
  },
  item1: {
    flex: 1,
   
    
  },
  cardfirstpart: {
    backgroundColor:'#9DB88F',
    height:60,
    borderTopLeftRadius:10,
    borderTopRightRadius:10
   },
   itemContainer1: {
    width: size,
    height:heightSize
  },
  item2: {
    flex: 1,
    margin: 6,
    borderRadius:10,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor:'#dcdcdc', 
   
    
  },
  cardfirstpart1: {
    backgroundColor:'#9DB88F',
    height:60,
    borderTopLeftRadius:10,
    borderTopRightRadius:10
   },
   SubmitButtonStyle: {
    paddingHorizontal:20,
    height:30,
    backgroundColor:'#ffffff',
    borderRadius:30,
    borderWidth: 1,
    marginTop:30,
    justifyContent:'center',
    alignContent:'center',
    borderColor: '#5F259F'
  },
  
   TextStyle:{
       color:'#5F259F',
       textAlign:'center',
       fontFamily:'Segoe UI',
       fontSize:14
   },
  
});
// </HomeScreenSnippet>
