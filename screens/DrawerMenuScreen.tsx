// Copyright (c) Microsoft.
// Licensed under the MIT license.

import React, { FC } from 'react';
import {
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ImageSourcePropType
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  DrawerContentComponentProps
} from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { AuthContext } from '../AuthContext';
import { UserContext } from '../UserContext';
import CalendarScreen from '../screens/CalendarScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GraphManager } from '../graph/GraphManager';
import HomeScreen from '../screens/HomeNavigationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TeamScreen from '../screens/TeamScreen';
import DriveItemsFavouritesScreen1 from '../screens/DriveItemsFavouritesScreen';
import SearchNavigationPhotosScreen from '../screens/SearchPeopleNavigation';
import SubscriptionsScreen from '../screens/SubscriptionsScreen';
import HelpScreen from '../screens/HelpScreen';
import { AuthManager } from '../auth/AuthManager';

const Drawer = createDrawerNavigator();

type CustomDrawerContentProps = DrawerContentComponentProps & {
  userName: string;
  userEmail: string;
  userJobtitle:string;
  userdesignation:string;
  userPhoto: string;
  signOut: () => void;
}

type DrawerMenuProps = {
  navigation: StackNavigationProp<ParamListBase>;
}

const CustomDrawerContent: FC<CustomDrawerContentProps> = props => (
  
  <DrawerContentScrollView {...props}>

    <View style={styles.usercontainer}>
    {/* <StatusBar backgroundColor = '#fff' /> */}
      <Image
        source={{uri:props.userPhoto}}
        style={styles.sideMenuProfileIcon}
      />
    <View style={styles.userTextcontainer}>
    <Text style={styles.nameStyle}>{props.userName}</Text>
    <Text style={styles.userSettings}>{props.userJobtitle} in {props.userdesignation}</Text>
    
</View>
      </View>

      <DrawerItemList {...props} />
      <View style={styles.userTextcontainer1}>
        <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,marginHorizontal:5,marginTop:-10}}/>
    {/* <Text style={styles.nameStyleblack}>Subscriptions</Text>
    <Text style={styles.nameStyleblack}>Help Centre</Text> */}
    <DrawerItem label='Subscriptions' style={{paddingBottom:-40}} onPress={() => props.navigation.navigate('Subscription')}/>
    <DrawerItem label='Help Centre' style={{marginTop:-20}} onPress={() => props.navigation.navigate("Help")}/>
    <DrawerItem label='Sign Out' style={{marginTop:-20}} onPress={props.signOut}/>

    
</View>

     
  </DrawerContentScrollView>
);

export default class DrawerMenuContent extends React.Component<DrawerMenuProps> {
  static contextType = AuthContext;
  static navigationOptions: ({}) => ({
    tabBarVisible: false,
  })
  state = {
    // TEMPORARY
    userLoading: true,
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
  }
  async  getphoto(this: any){
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
  _signOut = async () => {
    this.context.signOut();
  }
  // <ComponentDidMountSnippet>
  async componentDidMount() {
    this.props.navigation.setOptions({
      headerShown: false,
    });

    try {
      // Get the signed-in user from Graph
      const user: MicrosoftGraph.User = await GraphManager.getUserAsync();
      this.getphoto();
     // const photo: MicrosoftGraph.ProfilePhoto = await GraphManager.getPhotoAsync();

      // Update UI with display name and email
      this.setState({
        userLoading: false,
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
        userPastProjects:user.pastProjects!
      //  userPhoto:photo!
      });
    } catch(error) {
      console.log('errorrr ',JSON.stringify(error))
      Alert.alert(
        'Error getting user',
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
  // </ComponentDidMountSnippet>

  render() {
    const userLoaded = !this.state.userLoading;
    const { navigation } = this.props;
    return (
      <UserContext.Provider value={this.state}>
        
        <Drawer.Navigator
        
          drawerType='front'
          overlayColor="transparent"
          drawerContentOptions={{
            activeTintColor: '#5F259F',
            activeBackgroundColor:'#efefef',
            itemStyle: {marginVertical:-2,marginLeft:10},
            labelStyle: {
              fontFamily: 'Segoe UI',
              color: 'black',
              fontWeight:'200',
              marginLeft:-15
            },
            
          }}
          
        //   screenOptions={{headerRight: () => <View style={{flexDirection:'row',paddingRight:10,alignItems:'center',}}>
        //     <TouchableOpacity onPress={() => {console.log('dataaa')
        //  navigation.navigate('People'); } }>
        //     <Image source={require('../images/loupe.png')} 
        //             style={{ height: 20, width: 20}} />
        //     </TouchableOpacity>
        //   <Image source={require('../images/messenger.png')}
        //             style={{ height: 20, width: 20,paddingRight:15}} />
        //   </View>
        //   }
        // }

        

        screenOptions={{headerRight: () => <View style={{flexDirection:'row',flex:1,paddingRight:10,alignItems:'center',}}><Ionicons onPress={() => {
          navigation.navigate('Search1');
        }} name="ios-search-outline" color={'black'} size={24} />


        </View>
        }
      }
        
          drawerContent={props => (
            <CustomDrawerContent {...props}
              userName={this.state.userFullName}
              userEmail={this.state.userEmail}
              userJobtitle={this.state.userJobTitle}
              userdesignation={this.state.userDepartment}
              userPhoto={this.state.userPhoto}
              signOut={this._signOut}
               />
          )
          
          }>
          <Drawer.Screen name='Peepal Graph'
            component={HomeScreen}
           
            options={{
              
            headerStyle: {
              backgroundColor: '#fff',
           },
            
            headerTitleStyle:{marginLeft:-20},
            headerTintColor:'black',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
            }} />
            
            { userLoaded &&
            <Drawer.Screen name='Calendar'
              component={CalendarScreen}
              options={{drawerLabel: 'Calendar',headerShown:false,
              drawerIcon: ({ color, size }) => (
                <Image source={require('../images/calendar.png')}
                    style={{ height: 20, width: 20}} />
              ),
            }} />
          }
          
{ userLoaded &&
            <Drawer.Screen name='Teams'
              component={TeamScreen}
              options={{drawerLabel: 'Teams',headerShown:false,
              drawerIcon: ({ color, size }) => (
                <Image source={require('../images/group.png')}
                    style={{ height: 20, width: 20}} />
              ),
            }} />
          }
         
         { userLoaded &&
            <Drawer.Screen name='Bookmarks'
              component={DriveItemsFavouritesScreen1}
              options={{drawerLabel: 'Bookmarks',headerShown:false,
              drawerIcon: ({ color, size }) => (
                <Image source={require('../images/bookmark.png')}
                    style={{ height: 20, width: 20}} />
              ),
            }} />
            
          }
         
          { userLoaded &&
            <Drawer.Screen name='Profile' 
              component={ProfileScreen}
              options={{drawerLabel: 'Profile', headerShown:false,
              drawerIcon: ({ color, size }) => (
                <Image source={require('../images/user.png')}
                    style={{ height: 20, width: 20}} />
              ),
            }} />
          }
  
          { userLoaded &&
            <Drawer.Screen name='Search1'
              component={SearchNavigationPhotosScreen}
              options={{
                drawerLabel: () => null,
                drawerIcon: () => null,
                headerShown:false
            }} />
          }
 { userLoaded &&
            <Drawer.Screen name='Subscription'
              component={SubscriptionsScreen}
              options={{
                drawerLabel: () => null,
                drawerIcon: () => null,
                headerShown:false
            }} />
          }
 { userLoaded &&
            <Drawer.Screen name='Help'
              component={HelpScreen}
              options={{
                drawerLabel: () => null,
                drawerIcon: () => null,
                headerShown:false
            }} />
          }

        </Drawer.Navigator>

      </UserContext.Provider>

    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  profileView: {
    alignItems: 'center',
    padding: 10
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  profileUserName: {
    fontWeight: '700'
  },
  profileEmail: {
    fontWeight: '200',
    fontSize: 10
  }, 
  sideMenuProfileIcon: {
    width: 40,
    height: 40,
    borderRadius: 100 / 2,
    
  },
  usercontainer:{
    flexDirection:'row',
    backgroundColor:'#5F259F',
    paddingHorizontal:10,
    paddingVertical:30,
   },
    userTextcontainer:{
    flex:3,
    justifyContent: 'center',
    marginLeft:10,
    color:'white',
   }, 
   userTextcontainer1:{
    flex:3,
    justifyContent: 'center',
    marginLeft:10,
    color:'white',
    marginTop:-40
   }, 
   sidebarDivider:{
    height:1,
    width:"100%",
    backgroundColor:"lightgray",
    marginVertical:10
  },
    userSettings:{
     flexDirection:'row',
     marginVertical:2,
     fontSize:12,
     color:'white'
   },
    nameStyle:{
     flexWrap: 'wrap',
     flexDirection:'row',
     fontSize:16,
     color:'white',
   },
   nameStyleblack:{
    flexWrap: 'wrap',
    flexDirection:'row',
    fontSize:14,
    color:'black',
    marginLeft:10,
    marginTop:15,
    fontFamily:'Segoe UI',
  }, 
   settingstext:{
     flexWrap: 'wrap',
     fontSize:12,
     color:'blue',
   },
});
