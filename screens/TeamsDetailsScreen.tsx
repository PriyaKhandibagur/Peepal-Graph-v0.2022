// Copyright (c) Microsoft.
// Licensed under the MIT license.

// <HomeScreenSnippet>
import React,{useState} from 'react';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { GraphManager } from '../graph/GraphManager';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator,StackNavigationProp,HeaderBackButton} from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AuthManager } from '../auth/AuthManager';

import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Dimensions,
  SafeAreaView,Modal,ImageSourcePropType,ActivityIndicator
} from 'react-native';
import EditjobProfileScreen from '../screens/EditjobProfileScreen';
import EditAboutMeScreen from '../screens/EditAboutMeScreen';
import EditSkillsScreen from '../screens/EditSkills';
import EditInterestsScreen from '../screens/EditInterestsScreen';
import EditProjectsScreen from '../screens/EditProjectsScreen';
import EditSchoolsEducationScreen from '../screens/EditSchoolsEducationScreen';
import BottomSheet from '../screens/DrawerMenuScreen';
import TeamMembersScreen from '../screens/TeamMembersScreen';
import TeamsChannelFileScreen from '../screens/TeamPostsScreen';
import UserAvatar from 'react-native-user-avatar';
import TextAvatar from 'react-native-text-avatar';
import { UserContext } from '../UserContext';

const Stack = createStackNavigator();
const RootStack = createStackNavigator<RootStackParamList>();
const size = Dimensions.get('window').width/2;
const heightSize = Dimensions.get('window').height/2.6;

const GroupDetailState = React.createContext<GroupDetailScreenState>({
  loading_list: true,
  displayName: '',
  upn:'',
  description: '',
  createdDateTime: '',
  members:[],
  channels:[],
  owners:[],
  channelsdiveid:[],

// membersCount:''
});

type RootStackParamList = {
  Group: undefined;
  Members:{ upn: string,name:string};
  channels:{ upn: string,channelid:string,name:string};
  channelsPosts:{ upn: string,channelid:string,name:string};
  owners:undefined;
  GroupScreenId: { upn: string,name:string,description:string};
};

type GroupScreenRouteProp = RouteProp<RootStackParamList, 'GroupScreenId'>;

type GroupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GroupScreenId'
>;
type Props = {
  route: GroupScreenRouteProp;
  navigation: GroupScreenNavigationProp;
};

type GroupDetailScreenState = {
  loading_list:boolean,
  displayName: string,
  upn:string,
  description: string,
  createdDateTime: string,
  members: MicrosoftGraph.Person[];
  channels: MicrosoftGraph.Channel[];
  owners:MicrosoftGraph.Person[];
  channelsdiveid:MicrosoftGraph.Drive[];
 // membersCount:string;
}


const HomeComponent = () => {
const navigation = useNavigation();
const profileState = React.useContext(GroupDetailState);

const getItem = () => {
  
 const profileState = React.useContext(GroupDetailState);
 const navigation = useNavigation();

 const _userDiv:any[]=[];
     
 profileState.members.map((v:any,i:any) =>
     {
         _userDiv.push(
          <TouchableOpacity activeOpacity={1} onPress={() => {console.log('dataaa') } }>
        
        <View style={styles.peopleItem}>
          {v.img==undefined?<Image source={require('../images/avatarmale.png')}
                style={{ height: 40, width: 40,alignSelf:'center',marginTop:10}} />:<Image source={{uri:v.img}}
                style={{ height: 40, width: 40,alignSelf:'center',marginTop:10}} />
             }
              
                <Text style={styles.profilesub}>{v.displayName}</Text>
             
            </View>
            </TouchableOpacity>
        
         )
     });
     return _userDiv
 };



return (
 
<ScrollView>
<View style={styles.container}>
<Modal
          visible={profileState.loading_list}>
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
<TextAvatar backgroundColor={'#dc143c'} textColor={'#fff'}size={70} type={'circle'}>{profileState.displayName}</TextAvatar>
  <View style={styles.textsection}>
  <Text style={styles.profileUserName}>{profileState.displayName}</Text>
  <Text style={styles.profileEmail}>{profileState.description}</Text>
  </View>
</View>
</View>
<View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />

<View style={styles.firstsection1}>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.profileEmail}>Owners ({profileState.owners.length})</Text>
        <View style={{alignItems:'flex-end',flex:1}}>
        </View>
        </View>

        <FlatList showsHorizontalScrollIndicator={false}
                  horizontal data={profileState.owners}
          renderItem={({item}) =>
          <TouchableOpacity activeOpacity={1} onPress={() => {console.log('dataaa') } }>
        
        <View style={styles.peopleItem}>
              <Image source={require('../images/avatarmale.png')}
                style={{ height: 40, width: 40,alignSelf:'center',marginTop:10}} />
             
                <Text style={styles.profilesub}>{item.displayName}</Text>
             
            </View>
            </TouchableOpacity>
          }
      />           

      </View>
      <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />

<View style={styles.firstsection1}>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.profileEmail}>Members ({profileState.members.length})</Text>
        <View style={{alignItems:'flex-end',flex:1}}>
          <Text onPress={() => { navigation.navigate('Members',{upn:profileState.upn,name:profileState.displayName}); }} style={{fontWeight:'200',fontSize: 12,color:'blue',marginTop:5,}}>MORE</Text>
        </View>
        </View>

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {getItem()}
        </ScrollView>
      </View>
      <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 5,}}
 />



<View style={styles.subprofileView}>
<Text style={styles.profileUserName}>Channels ({profileState.channels.length})</Text>
<SafeAreaView style={{flex: 1}}>
<FlatList data={profileState.channels}
          renderItem={({item}) =>
            <View>
              <TouchableOpacity activeOpacity={1} onPress={() => {
                  navigation.navigate('channels',{upn:profileState.upn,channelid:item.id,name:item.displayName});
                }}>
            <View style={styles.horizontalview}>
            <View style={{width:40,height:40,alignSelf:'center',justifyContent:'center',alignContent:'center'}}>
<UserAvatar  borderRadius={40/2} size={40} name={item.displayName} bgColors={['#a52a2a', '#5f9ea0','#deb887', '#0000ff','#dc143c','#008b8b','#9932cc','#ff1493','#483d8b','#696969','#228b22']}/>
</View> 
              <View style={styles.peopleItem}>
                <Text style={styles.peopleName}>{item.displayName}</Text>
              </View>
            </View>
            <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 0.5,}}/>
            </TouchableOpacity>
           </View>
          }
      />  
      </SafeAreaView>         
</View>

  </View>
  </View>
  </ScrollView>
 
  );
}

export default class ProfileScreen extends React.Component<Props> {
 
  
  state: GroupDetailScreenState = {
    loading_list: true,
    displayName: '',
    upn:'',
    description: '',
    createdDateTime: '',  
    members:[],
    channels:[],
    owners:[],
    channelsdiveid:[]
  //  membersCount:'',
  };
 
async  getphoto(this: any){
 
     await this.state.members.forEach(async (u:any) => {
       const token = await AuthManager.getAccessTokenAsync();
 
      // var UrlImage;
       console.log('firstttt')
         var that= this;    
             var request = new XMLHttpRequest;
             request.open("GET", "https://graph.microsoft.com/v1.0/me/Photos/48X48/$value");
             request.setRequestHeader("Authorization", "Bearer " + token);
             request.responseType = "blob";
             console.log('seconddd')
 
             request.onload = function () {
                 if (request.readyState === 4 && request.status === 200) {
                   console.log('thirddd')
 
                  // UrlImage = request.response;
                     //  var imageElm = document.createElement("img");
                     var React = require('react-native'),
                     window = global || window;
                     var reader = new window.FileReader();
                     reader.onload = function () {
                         // Add the base64 image to the src attribute
                         // imageElm.src = reader.result;
                         u.Image=reader.result;
 
                         //SetUserItems(ProfileItems)
                       //  that.setState({ imageurl: reader.result },()=>{console.log('set url in state')})
     
                         
                     }
                     reader.readAsDataURL(request.response);
                 }
             };
            
             request.send(null);
         // });
     }
                 
 
     
     )
 }
  async componentDidMount() {
    const{upn,name,description}=this.props.route.params;
    const recentfiles:any =[];

    var UrlImage;
    const token = await AuthManager.getAccessTokenAsync();
    try {

      const groupMembersapi= await GraphManager.getTeamMemberAsync(upn);
      const teamschannels = await GraphManager.getTeamChannelAsync(upn);
      const teamschannelsdrive = await GraphManager.getGroupDriveItemsAsync(upn);
      const groupOwnersapi= await GraphManager.getTeamOwnersAsync(upn);
      let photo:any=groupMembersapi.value;

       photo.forEach( (u:any) => {   
       console.log('aaaaaaaa',u.userPrincipalName)
 
     
     var request = new XMLHttpRequest;
     request.open("GET", "https://graph.microsoft.com/v1.0/users/"+u.userPrincipalName+"/photo/$value");
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
                // console.log('responseeereader',reader.result)
                // that.setState({ managerPhoto: reader.result },()=>{console.log('set url in state')})
               // console.log('poooooooooo',reader.result)

                u['img']=reader.result;
    
              
             // photo.push({img:reader.result});
             // recentfiles.push(photo);
              
             
             }
             
           //  console.log('membersss',photo)

             reader.readAsDataURL(request.response);
         }
         
     };
    
    // debugger;
     request.send(null);
 
    
   
    });
  //  setFilteredDataSource(recentfiles);
  console.log('photoooo',photo)
  this.setState({
   loading_list: false,
   displayName: name,
   upn:upn,
   description:description,
 //  description: groupDetailsapi.description!,
 //  createdDateTime: groupDetailsapi.createdDateTime!,
   members:photo,
   channels:teamschannels.value!,
   owners:groupOwnersapi.value!,
   channelsdiveid:teamschannelsdrive.value!
 
 });
 
              
     
     

    //   const result = this.state.channels.map(item => {
    //     return {
         
    //       label: item.id
    //     };
    //   });
    //  console.log('result  '+result.toString)
      


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
      <GroupDetailState.Provider value={this.state}>

<RootStack.Navigator initialRouteName="Group">
  <RootStack.Screen name="Group" component={HomeComponent}
  options={({navigation, route}) => ({
    headerStyle: {
      backgroundColor: '#fff'
   },
   headerTitle:this.state.displayName,
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
    ),})}
  />
  <RootStack.Screen
    name="Members"
    component={TeamMembersScreen}
    options={{
      headerShown: false,
    }}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
  <RootStack.Screen
    name="channels"
    component={TeamsChannelFileScreen}
    options={{
      headerShown: false,
     
    }}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
  <RootStack.Screen
    name="owners"
    component={EditAboutMeScreen}
    options={{
      headerShown: false,
     
    }}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
 {/* <RootStack.Screen
    name="channelsPosts"
    component={TeamsChannelPostsScreen}
    options={{
      headerShown: false,
     
    }}
   // initialParams={{ upn:'priyanka.khandibagur@renewin.com'}}
  />
  */}
</RootStack.Navigator>
      </GroupDetailState.Provider>

   
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
  paddingTop:10,
  paddingBottom:20,
  justifyContent:'center'
  },
  textsection:{
    paddingHorizontal:10,
    justifyContent:'center'
    },
  profilePhoto: {
    paddingVertical: 10,
    paddingHorizontal:20,
    width: 60,
    height: 60,
    marginTop:5,
    borderRadius: 40,
  },
  managerPhoto: {
    paddingVertical: 10,
    paddingHorizontal:20,
    width: 100,
    height: 100,
    marginTop:5,
    borderRadius: 40,
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
    marginTop:5
  },
  profileEmail: {
    fontWeight: '400',
    fontSize: 16,
    marginTop:5,
    alignItems:'center',
    fontFamily: 'Segoe UI',
  },
  profilesub: {
    fontWeight: '600',
    fontSize: 12,
    flexWrap:'wrap',
    marginVertical:5,
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
    paddingHorizontal:15,
    paddingVertical:10,
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
    paddingLeft:5,
    paddingVertical:10,
    marginVertical: 1,
    marginHorizontal: 5,
    flexWrap:'wrap'
  },
  itemImageview:{
    backgroundColor: '#ffffff',
    justifyContent:'center'
  },
  peopleItem: {
    flexDirection: 'column',
    paddingLeft:5,
    paddingRight:10,
     justifyContent:'center',
     alignContent:'center',
    flexWrap:'wrap'
  
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
    fontWeight:'600',
    fontSize: 14,
    marginRight:10,
    marginLeft:5,
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
    borderWidth: 2,
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

function getItemList() {
  throw new Error('Function not implemented.');
}
// </HomeScreenSnippet>
