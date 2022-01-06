// Copyright (c) Microsoft.
// Licensed under the MIT license.

// <HomeScreenSnippet>
import React, {useState, useEffect} from 'react';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { GraphManager } from '../graph/GraphManager';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator,HeaderBackButton} from '@react-navigation/stack';
import { AuthManager } from '../auth/AuthManager';
import RNFetchBlob from 'react-native-fetch-blob';
import Base64ArrayBuffer from 'base64-arraybuffer';
import UserAvatar from 'react-native-user-avatar';

import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
  Platform,
  FlatList,
  Dimensions,
  RefreshControl,Modal,ImageSourcePropType,ActivityIndicator
} from 'react-native';
import EditjobProfileScreen from '../screens/EditjobProfileScreen';
import EditAboutMeScreen from '../screens/EditAboutMeScreen';
import EditSkillsScreen from '../screens/EditSkills';
import EditInterestsScreen from '../screens/EditInterestsScreen';
import EditProjectsScreen from '../screens/EditProjectsScreen';
import EditSchoolsEducationScreen from '../screens/EditSchoolsEducationScreen';
import BottomSheet from '../screens/DrawerMenuScreen';
import MoreFilesScreen from '../screens/MoreFilesScreen';
import MorePhotosScreen from '../screens/MorePhotosScreen';
import MoreVideosScreen from '../screens/MoreVideosScreen';
import PeopleAroundUserScreen from '../screens/PeopleAroundUserScreen';
import ProfileUserScreen from '../screens/ProfileUserScreen';
import SendMail from '../screens/SendMail';
import { UserContext } from '../UserContext';
import moment from 'moment-timezone';
import Octicons from 'react-native-vector-icons/Octicons';
import { WindowsZoneName } from 'windows-iana/dist/enums';
import TextAvatar from 'react-native-text-avatar';

const Stack = createStackNavigator();
const RootStack = createStackNavigator<RootStackParamList>();
const size = Dimensions.get('window').width/2.1;
const heightSize = Dimensions.get('window').height/2.6;
declare global {
  interface Window { MyNamespace: any; }
}

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
  shared_files_v:[],
  shared_files_f:[],
  peopleList: [],
  groupList: [],
  managerPhoto:'',
  managerid:''

 // image:require('../images/no-profile-pic.png')
  
});

type RootStackParamList = {
  ProfileScreen: undefined;
  ContactUs: { upn: string,mobileNumber:string };
  AboutMe: { upn: string };
  Skills: { skills: [] };
  Interests:  { interests: [] };
  Schools:{schools:[]};
  Home:undefined;
  Projects: { projects: [] };
  name:{name:string};
  Files:undefined;
  Photos:undefined;
  Videos:undefined;
  Profile: { upn: string };
  Peoplearounduser: { upn: string,name:string};
  SendMail:{ upn: string};
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
  userPhoto: '';
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
  shared_files_v:MicrosoftGraph.DriveItem[];
  shared_files_f:MicrosoftGraph.DriveItem[];
  peopleList: MicrosoftGraph.Person[];
  groupList: MicrosoftGraph.Group[];
  managerPhoto:string;
  managerid:string
 // image:Image;
}
// const state1: ProfileScreenState = {
//   userLoading: false,
//   refreshing:false,
//   manager: '',
//   manager_jobtitle:'',
//   manager_department:'',
//   manager_mobileno:'',
//   manager_email:'',
//   manager_office:'',
//   userFirstName: '',
//   userFullName: '',
//   userEmail: '',
//   userTimeZone: '',
//   userPhoto: require('../images/no-profile-pic.png'),
//   userAboutMe:'',
//   userJobTitle:'',
//   userDepartment:'',
//   userMobile:'',
//   userOfficeLocation:'',
//   userBusinessPhones:[],
//   userSkills:[],
//   userInterests:[],
//   userSchool:[],
//   userPastProjects:[],
//   birthday:'',
//   hiredate:'',
//   shared_files:[],
//   shared_files_v:[],
//   shared_files_f:[],
//   peopleList: [],
//   groupList: []
// } 



const HomeComponent = () => {
 
const navigation = useNavigation();
const userContext = React.useContext(UserContext);
const profileState = React.useContext(ProfileState);
var skills=profileState.userSkills;
var interests=profileState.userInterests;
var schools=profileState.userSchool;
var businessPhones=profileState.userBusinessPhones;
var pastProjects=profileState.userPastProjects;

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
  <Image source={{uri: profileState.userPhoto!,}}
         style={styles.profilePhoto} />
  {/* <Image source={require('../images/avatarmale.png')}
         resizeMode='contain'
         style={styles.profilePhoto} /> */}
  <View style={styles.textsection}>
  <Text style={styles.profileUserName}>{profileState.userFullName}</Text>
  <Text style={styles.profileEmail}>{profileState.userJobTitle}</Text>
  <Text style={styles.profileEmail}>{profileState.userDepartment}</Text>

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

<View style={{backgroundColor:'#5F259F',paddingHorizontal:10,paddingTop:2,paddingBottom:5,marginLeft:10,marginTop:10}}>
<Image source={require('../images/telephone.png')}
       style={{width: 20,height: 20,justifyContent:'center',alignContent:'center',marginTop:5}}/>
</View>
</View>
  </View>
</View>
</View>
<View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />

<View style={styles.subprofileView}>
<View style={styles.horizontal}>
<Text style={styles.profileEmail}>About me</Text>
<View style={styles.EditView}>
<TouchableOpacity  onPress={() => {
          navigation.navigate('AboutMe',{upn:profileState.userAboutMe});
        }}>
<Image source={require('../images/pencil.png')}
         resizeMode='contain'
         
         style={{height:15,width:15,flexDirection:'row-reverse' }} />
         </TouchableOpacity>

  </View>
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

<View style={styles.EditView}>
<TouchableOpacity  onPress={() => {
          navigation.navigate('ContactUs',{mobileNumber: profileState.userMobile });
        }}>
<Image source={require('../images/pencil.png')}
         resizeMode='contain'
         
         style={{height:15,width:15,flexDirection:'row-reverse' }} />
         </TouchableOpacity>
  

  </View>
  </View>
  {profileState.userMobile==null?<View style={styles.customItem}><Image source={require('../images/phone-call.png')}
       style={styles.iconStyle}/>
<Text style={styles.profilesub}>Not updated</Text>
</View>:<View style={styles.customItem}><Image source={require('../images/phone-call.png')}
       style={styles.iconStyle}/>
<Text style={styles.profilesub}>{profileState.userMobile}</Text>
</View>
 }


<View style={styles.customItem}>
<Image source={require('../images/email.png')}
       style={styles.iconStyle}/>
<Text style={styles.profilesub}>{profileState.userEmail}</Text>

</View>

{profileState.hiredate==null||convertDateTime(profileState.hiredate!)=='01/01/0001'?<View style={ styles.customItem}><Image source={require('../images/calendar.png')}
       style={styles.iconStyle}/>
  <Text style={styles.profilesub}>Not updated</Text></View>:<View style={styles.customItem}><Image source={require('../images/calendar.png')}
       style={styles.iconStyle}/>
  <Text style={styles.profilesub}>{convertDateTime(profileState.hiredate!)}</Text></View>}

  {profileState.userOfficeLocation==null?<View style={styles.customItem}><Image source={require('../images/location.png')}
       style={styles.iconStyle}/><Text style={styles.profilesub}>Not updated</Text></View>:<View style={styles.customItem}><Image source={require('../images/location.png')}
       style={styles.iconStyle}/>
<Text style={styles.profilesub}>{profileState.userOfficeLocation}</Text></View>}
 
</View>
<View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />

<View style={styles.subprofileView}>
<View style={styles.horizontal}>
<Text style={styles.profileEmail}>Schools and Education</Text>

<View style={styles.EditView}>
<TouchableOpacity  onPress={() => {
          navigation.navigate('Schools',{schools:schools});
        }}>
<Image source={require('../images/pencil.png')}
         resizeMode='contain'
         
         style={{height:15,width:15,flexDirection:'row-reverse' }} />
         </TouchableOpacity>
  </View>
  </View>
  
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
{profileState.manager==''||profileState.manager==null||profileState.manager==undefined?<View><Text style={styles.profilesub}>Not updated</Text></View>:<View style={styles.horizontalname}>{profileState.managerPhoto==''?<TextAvatar backgroundColor={'#5f9ea0'} textColor={'#fff'}size={100} type={'circle'}>{profileState.manager}</TextAvatar>:
  <Image source={{uri: profileState.managerPhoto!}}
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
 <View style={styles.EditView}>
 <TouchableOpacity  onPress={() => {
          navigation.navigate('Projects',{projects:pastProjects});
        }}>
<Image source={require('../images/pencil.png')}
         resizeMode='contain'
         
         style={{height:15,width:15,flexDirection:'row-reverse' }} />
         </TouchableOpacity>
  </View>
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

<View style={styles.firstsection1}>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.profileEmail}>Videos</Text>
        <View style={{alignItems:'flex-end',flex:1}}>
          <Text onPress={() => { navigation.navigate('Videos'); }} style={{fontWeight:'200',fontSize: 12,color:'blue',marginTop:5,}}>MORE</Text>
        </View>
        </View>
{profileState.shared_files_v.length<1?<View><Text style={styles.profilesub}>No Videos are Available</Text></View>:
<FlatList data={profileState.shared_files_v.slice(0, 3)}
          renderItem={({item}) =>
          <TouchableOpacity activeOpacity={1} onPress={() => {console.log('dataaa') } }>
        
            <View style={styles.horizontalview}>
            {item.thumbnails?.map((item1:any)=>(
              <Image source={{uri:item1.large.url}}
              style={{height:50,width:80,resizeMode: 'contain'}} /> 
          
))}
              <View style={styles.peopleItem}>
                <Text style={styles.profilesub}>{item.name}</Text>
                <View style={styles.horizontalviewdot}>
                <Text style={styles.peopleEmail}>Modified</Text>
                <Octicons name="primitive-dot" color='grey' size={10} style={{marginHorizontal:5,marginTop:3}}/>
                <Text style={styles.peopleEmail}>{convertDateTime(item.fileSystemInfo?.lastModifiedDateTime!)}</Text>
                </View>
              </View>
            </View>
            </TouchableOpacity>
          }
      />         
}
      </View>
      <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />

<View style={styles.subprofileView}>
<View style={styles.horizontal}>
 <Text style={styles.profileEmail}>Skills</Text>
 <View style={styles.EditView}>
 <TouchableOpacity  onPress={() => {
          navigation.navigate('Skills',{skills:skills});
        }}>
<Image source={require('../images/pencil.png')}
         resizeMode='contain'
         
         style={{height:15,width:15,flexDirection:'row-reverse' }} />
         </TouchableOpacity>
  </View>
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

<View style={styles.firstsection1}>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.profileEmail}>Files</Text>
        <View style={{alignItems:'flex-end',flex:1}}>
          <Text onPress={() => { navigation.navigate('Files'); }} style={{fontWeight:'200',fontSize: 12,color:'blue',marginTop:5,}}>MORE</Text>
        </View>
        </View>
{profileState.shared_files_f.length<1?<View><Text style={styles.profilesub}>No Files are Available</Text></View>:
<FlatList data={profileState.shared_files_f.slice(0, 3)}
          renderItem={({item}) =>
          <TouchableOpacity activeOpacity={1} onPress={() => {console.log('dataaa') } }>
        
            <View style={styles.horizontalview}>
            {item.thumbnails?.map((item1:any)=>(
              <Image source={{uri:item1.large.url}}
              style={{height:50,width:80,resizeMode:'stretch'}} /> 
          
))}
              <View style={styles.peopleItem}>
                <Text style={styles.profilesub}>{item.name}</Text>
                <View style={styles.horizontalviewdot}>
                <Text style={styles.peopleEmail}>Modified</Text>
                <Octicons name="primitive-dot" color='grey' size={10} style={{marginHorizontal:5,marginTop:3}}/>
                <Text style={styles.peopleEmail}>{convertDateTime(item.fileSystemInfo?.lastModifiedDateTime!)}</Text>
                </View>
              </View>
            </View>
            </TouchableOpacity>
          }
      />           
}     
      </View>
      <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />

<View style={styles.subprofileView}>
<View style={styles.horizontal}>
  <Text style={styles.profileEmail}>Interests</Text>
  <View style={styles.EditView}>
  <TouchableOpacity  onPress={() => {
          navigation.navigate('Interests',{interests:interests});
        }}>
<Image source={require('../images/pencil.png')}
         resizeMode='contain'
         
         style={{height:15,width:15,flexDirection:'row-reverse' }} />
         </TouchableOpacity>

  </View>
  </View>
  {interests.length<1?<View><Text style={styles.profilesub}>Not updated</Text></View>:<View style={styles.profileView}>{ interests.map((item, key)=>(
    <View style={styles.customItem}>
    <MaterialCommunityIcons name="circle" color={'#4e4e4e'} size={10}style={{marginTop:5,marginHorizontal: 10}} />
   <Text key={key} style={styles.profilesub} > { item } </Text>
   </View>
   ))}
  </View>}
  </View>
  <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />

<View style={styles.firstsection1}>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.profileEmail}>Photos</Text>
        <View style={{alignItems:'flex-end',flex:1}}>
          <Text onPress={() => { navigation.navigate('Photos'); }} style={{fontWeight:'200',fontSize: 12,color:'blue', marginTop:5,}}>MORE</Text>
        </View>
        </View>
{profileState.shared_files.length<1?<View><Text style={styles.profilesub}>No Photos are Available</Text></View>:
<FlatList
     
     data={profileState.shared_files.slice(0, 4)}
     numColumns={2}
     renderItem={({ item }) => {
           return (
                <TouchableOpacity activeOpacity={1}>
              <View style={styles.itemContainer}>
              <View style={styles.item1}>
              {item.thumbnails?.map((item1:any)=>(
              <Image source={{uri:item1.large.url}}
              style={{height:100,width:size,resizeMode: 'contain'}} /> 
          
))}
            </View>
           </View>
              </TouchableOpacity>
             );
         }}
/>
}
        
           </View>
      <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />


<View style={styles.peoplearoundsect}>
<View style={{flexDirection:'row',paddingHorizontal:20,paddingVertical:10}}>
          <Text style={styles.profileEmail}>People around me</Text>
        
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
                <TouchableOpacity activeOpacity={1} onPress={() => {
                  navigation.navigate('Profile',{upn:item.userPrincipalName});
                }} >
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

<View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />


  </View>
  </View>
  </ScrollView>
 
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
export default class ProfileScreen extends React.Component {
 
  
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
    hiredate:'',
    shared_files:[],
    shared_files_v:[],
    shared_files_f:[],
    peopleList: [],
    groupList: [],
    managerPhoto:'',
    managerid:''
  };

  async  getphoto(this: any){
    console.log('aaaaa','111')

    var UrlImage;
    const token = await AuthManager.getAccessTokenAsync();
    console.log('tokkkkkeeenn',token)
      var that= this;    
        // AuthContext.acquireToken("https://graph.microsoft.com", function (error, token) {
          var request = new XMLHttpRequest;
          
          request.open("GET", "https://graph.microsoft.com/v1.0/me/photos/64x64/$value");
          request.setRequestHeader("Authorization", "Bearer " + token);
          request.responseType = "blob";
         // console.log('statusss',request.status)
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
   console.log('maaaanaager',this.state.managerid)
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
                      console.log('responseeereader',reader.result)
                      that.setState({ managerPhoto: reader.result },()=>{console.log('set url in state')})
  
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
    
    try {
      const managerApi: MicrosoftGraph.User = await GraphManager.getManagerAsync();
      const user: MicrosoftGraph.User = await GraphManager.getUserAsync();
      const shared_files = await GraphManager.getDriveSharedItemsAsync();
      const drive_items = await GraphManager.getDriveItemsAsync();
      const people = await GraphManager.getPeopleAsync();
      const groups = await GraphManager.getGroupsAsync();
      const photo = people.value;
     
      this.getphoto();

     var UrlImage;
     const token = await AuthManager.getAccessTokenAsync();
     let recentfiles:any =[];
     photo.map( (u:any) => {   
      console.log('aaaaaaaa',u.userPrincipalName)

    // await getProfilePhoto(u.userPrincipalName,String(_acccessToken)).then((image)=>{
    //     u.Image=image
    // }) 
    var request = new XMLHttpRequest;
    request.open("GET", "https://graph.microsoft.com/v1.0/users/"+u.userPrincipalName+"/photo/$value");
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
 //  setFilteredDataSource(recentfiles);



               
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
       // userPhoto:photo.data!,
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
       // shared_files:shared_files.value!,
        peopleList: recentfiles,
        groupList: groups.value!,
        managerid:managerApi.userPrincipalName
      });
      console.log('photoooo11111 ',this.state.managerid)
// send http request in a new thread (using native code)

  // Status code is not 200
  // .catch((errorMessage, statusCode) => {
  //   console.log('jskhdjshaj',errorMessage,statusCode)
  //   // error handling
  // })


  this.managergetphoto();


      let new_post:any = [];
      let new_postv:any = [];
      let new_postf:any = [];

      let posts =  drive_items.value ;
      Promise.all(
          posts.map(async (item:any )=>{
          //  console.log('itemiddddd '+item.remoteItem.parentReference.driveId)
              const driveidd=item.id;
            const thumbnailitems = await GraphManager.getDriveThumbnailFilesAsync(item.id);
           // console.log('second item list'+thumbnailitems.value)
           const photos1=(thumbnailitems.value).filter((user:any)=>user.thumbnails&&user.thumbnails.length>0&&thumbnailitems.value&&thumbnailitems.value.length>0&&user.file?.mimeType.includes("image/jpeg"))
           const videos=(thumbnailitems.value).filter((user:any)=>user.thumbnails&&user.thumbnails.length>0&&thumbnailitems.value&&thumbnailitems.value.length>0&&user.file?.mimeType.includes("video"))
           const files=(thumbnailitems.value).filter((user:any)=>user.thumbnails&&user.thumbnails.length>0&&thumbnailitems.value&&thumbnailitems.value.length>0&&user.file?.mimeType.includes("application"))

            let posts2=photos1;
            let videopost=videos;
            let filespost=files;

            posts2.map((item:any)=>{
             new_post.push(item)
            });
            videopost.map((item:any)=>{
              new_postv.push(item)
             });
             filespost.map((item:any)=>{
              new_postf.push(item)
             });
         //  console.log('newpostlist '+new_post)
         
          this.setState({
            refreshing: false,
            userLoading: false,
            shared_files:new_post!,
            shared_files_v:new_postv!,
            shared_files_f:new_postf!,

          }); 
          })
          
      )


    } catch(error) {
        Alert.alert(
        'Error getting manager details',
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
      <ProfileState.Provider value={this.state}>

<RootStack.Navigator initialRouteName="ProfileScreen">
  <RootStack.Screen name="ProfileScreen" component={HomeComponent}
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
  <RootStack.Screen
    name="ContactUs"
    component={EditjobProfileScreen}
    options={{
      headerShown: false,
    }}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
  <RootStack.Screen
    name="Home"
    component={BottomSheet}
    options={{
      headerShown: false,
     
    }}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
  <RootStack.Screen
    name="AboutMe"
    component={EditAboutMeScreen}
    options={{
      headerShown: false,
     
    }}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
  <RootStack.Screen
    name="Skills"
    
    component={EditSkillsScreen}
    
    options={{
     
      headerShown: false,
      headerStyle: {
        backgroundColor: '#fff'
     },
     headerTitleStyle: {
      color:'black',
    },
    }}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
  <RootStack.Screen
    name="Projects"
    component={EditProjectsScreen}
    options={{
      headerShown: false}}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
   <RootStack.Screen
    name="Schools"
    component={EditSchoolsEducationScreen}
    options={{
      headerShown: false}}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
  <RootStack.Screen
    name="Interests"
    
    component={EditInterestsScreen}
    options={{
      
      headerShown: false}}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
   <RootStack.Screen
    name="Files"
    
    component={MoreFilesScreen}
    options={{
      
      headerShown: false}}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
   <RootStack.Screen
    name="Photos"
    
    component={MorePhotosScreen}
    options={{
      
      headerShown: false}}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
   <RootStack.Screen
    name="Videos"
    
    component={MoreVideosScreen}
    options={{
      
      headerShown: false}}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
   <RootStack.Screen
    name="Peoplearounduser"
    
    component={PeopleAroundUserScreen}
    options={{
      headerShown: false}}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
   <RootStack.Screen
    name="Profile"
    
    component={ProfileUserScreen}
    options={{
      headerShown: false}}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
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
    backgroundColor:'white'

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
    borderRadius: 55,
  },
  managerPhoto: {
    paddingVertical: 10,
    paddingHorizontal:20,
    width: 100,
    height: 100,
    marginTop:5,
    borderRadius: 70,
  },
  profileUserName: {
    fontWeight: '600',
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
    marginTop:5,
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
    marginRight:10
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
    marginVertical: 6,
    marginHorizontal:2,
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
   horizontalviewdot: {
    flexDirection: 'row',
    backgroundColor: '#ffffff', 
  },
});
// </HomeScreenSnippet>
