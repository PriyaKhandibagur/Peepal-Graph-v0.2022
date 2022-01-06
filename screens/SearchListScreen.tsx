import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,TouchableOpacity,Image,Dimensions,
  Modal,ScrollView,
  TextInput,RefreshControl,ActivityIndicator,Platform
} from 'react-native';
import { GraphManager } from '../graph/GraphManager';
import { createStackNavigator,StackNavigationProp } from '@react-navigation/stack';
import {RootStackParamList} from './RootStackParams';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthManager } from '../auth/AuthManager';
import Toast from 'react-native-simple-toast';

type authScreenProp = StackNavigationProp<RootStackParamList, 'Main'>;
const numColumns = 2;
const size = Dimensions.get('window').width/2.1;
const heightSize = Dimensions.get('window').height/2.8;
const App = () => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]as any);
  const [masterDataSource, setMasterDataSource] = useState([]as any);
  const [userItems, SetUserItems] = useState([]as any);
  const [refreshing, setRefreshing] = useState(false);
  const [text,setsearchtext]=useState('All users in the organization');
  const [pagerefreshing, setPagerefreshing] = useState(false);
  const onPageLoad = _onPageLoad.bind(this);
  const navigation = useNavigation<authScreenProp>();

  async function _onPageLoad(){
   // debugger;
    let ProfileItems = filteredDataSource;
   // console.log('profileItemss',ProfileItems)
    setProfileContent(ProfileItems);
}; 
const onRefresh = () => {
  setRefreshing(true);
  // _onPageLoad();
setFilteredDataSource(filteredDataSource)
   // In actual case set refreshing to false when whatever is being refreshed is done!
   setTimeout(() => {
     setRefreshing(false);
   }, 2000);
 };
async function setProfileContent(ProfithisleItems:any):Promise<void>{

  try {
    const people = await GraphManager.getUserssAsync();
    const people_result=people.value;
 var UrlImage;
 const token = await AuthManager.getAccessTokenAsync();
// var that:any= this; 
  let recentfiles:any =[];
//   recentfiles=recent_files.value;
// console.log('recentfileesss', recentfiles);

people_result.forEach( (u:any) => {   
           
           var request = new XMLHttpRequest;
           request.open("GET", "https://graph.microsoft.com/v1.0/users/"+u.userPrincipalName+"/photos/64x64/$value");
           request.setRequestHeader("Authorization", "Bearer " + token);
           request.responseType = "blob";
 
           request.onload = function () {

               if (request.readyState === 4 && request.status === 200) {

                   UrlImage = request.response;
                   var React = require('react-native'),
                   window = global || window;
                   var reader = new window.FileReader();
                   reader.onload = function () {
                       
                      u['u']=reader.result;

                    recentfiles.push(u);
                    SetUserItems(recentfiles),()=>{console.log('set url in state')}
                    
                   }

                   reader.readAsDataURL(request.response);
               }
              

           };
          
           request.send(null);


          });
          setFilteredDataSource(people_result);
          setMasterDataSource(people_result);
          setPagerefreshing(false);
        } catch(error) {
          console.log('text', error);
          
        } 

}
  async function anyNameFunction() {
    setPagerefreshing(true);
    try {
      const people = await GraphManager.getUserssAsync();
      const people_result=people.value;
      let recentfiles:any =[];
   var UrlImage;
   const token = await AuthManager.getAccessTokenAsync();
  
  people_result.forEach( async(u:any) => {   
    // await GraphManager.getmyPhoto(u.lastModifiedBy.user.email).then(async (data: any)=>{ 
    //   //console.log('dewdw ',data)
    //             var React = require('react-native'),
    //             window = global || window;
    //             var reader = new window.FileReader();
    //             reader.onload = function () {
    //               console.log('userimageeee ',reader.result)
    //                u['userimage']=reader.result;
    //                recentfiles.push(u);
    //                //          // console.log('set url in state',filteredDataSource)
    //                SetUserItems(recentfiles),()=>{console.log('set url in state')}
    //             }
    //             reader.readAsDataURL(data);
    //           });

     var request = new XMLHttpRequest;
             request.open("GET", "https://graph.microsoft.com/v1.0/users/"+u.userPrincipalName+"/photos/64x64/$value");
             request.setRequestHeader("Authorization", "Bearer " + token);
             request.responseType = "blob";
   
             request.onload = function () {
  
                 if (request.readyState === 4 && request.status === 200) {
  
                     UrlImage = request.response;
                     var React = require('react-native'),
                     window = global || window;
                     var reader = new window.FileReader();
                     reader.onload = function () {
                         
                        u['userimage']=reader.result;
  
                      recentfiles.push(u);
                      SetUserItems(recentfiles),()=>{console.log('set url in state')}
                      
                     }
  
                     reader.readAsDataURL(request.response);
                 }
                
  
             };
            
             request.send(null);
        
    });
            setFilteredDataSource(people_result);
            setMasterDataSource(people_result);
            setPagerefreshing(false);

            setTimeout(() => {
              Toast.show('Pull down to load all images.', Toast.LONG);
            }, 8000);
          } catch(error) {
            console.log('text', error);
            
          } 
  
}
  useEffect(() => {
    anyNameFunction();
  }, []);

  const searchFilterFunction = (text:any) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(
        function (item:any) {
          const itemData = item.displayName
            ? item.displayName.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
      setsearchtext('Search results for users ('+newData.length+')')

    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };


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

 
  const getItem = () => {
  
  const _userDiv:any[]=[];
 // console.log('userdetails',filteredDataSource)           
      
  // eslint-disable-next-line array-callback-return
  filteredDataSource.map((v:any,i:any) =>
      {
      //  console.log('vimagee',v)
          _userDiv.push(
            <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Auth',{upn:v.userPrincipalName})}>

            <View style={styles.itemContainer}>
            <View style={styles.item1}>
            <View style={styles.cardfirstpart}>
            <View style={{justifyContent:'center',alignItems:'center',marginTop:35}}>
            {v.userimage==undefined?<View style={{width:80,height:80,alignSelf:'center',justifyContent:'center',alignContent:'center'}}>
{/* <UserAvatar  borderRadius={80/2} size={80} name={v.displayName} bgColors={['#5f9ea0']}/> */}
<Image source={require('../images/avatarmale.png')}
             style={{ height: 80, width: 80,justifyContent: 'center',}} />

</View>:<Image source={{uri:v.userimage!,}}
             style={{ height: 80, width: 80,justifyContent: 'center',borderRadius:100}} />}
             {/* <Image source={{uri:v.Image}}
             style={{ height: 80, width: 80,justifyContent: 'center',}} /> */}
             </View>
           <View style={styles.peopletextitem}>
             <Text style={styles.peopleName}>{v.displayName}</Text>
             <Text style={styles.peopleEmail}>{v.jobTitle}</Text>
             <Text style={styles.peopleEmail}>{v.department}</Text>
             {/* <TouchableOpacity activeOpacity={1} onPress={() => 
             navigation.navigate('Auth',{upn:v.userPrincipalName})
              }> */}
             <View style={styles.SubmitButtonStyle}>
             <Text  style={styles.TextStyle}> View </Text>
             </View>
             {/* </TouchableOpacity> */}

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
   
      <View style={styles.container}>
        <Modal visible={pagerefreshing}>
        <View style={styles.loading}>
          <ActivityIndicator
            color={Platform.OS === 'android' ? '#000000' : undefined}
            animating={pagerefreshing}
            size='large' />
        </View>
      </Modal>
      <View style={styles.searchbar}>
        <View style={styles.leftsection}>
        <TouchableOpacity onPress={() => {console.log('dataaa')
          navigation.goBack()} }>
        <View style={styles.leftsectionimg}>
        <AntDesign  name="arrowleft" color={'#000'} size={24} />

        {/* <Image source={require('../images/left-arrow.png')}
                style={{ height: 30, width: 30,alignSelf:'center'}} />  */}
                </View>
                </TouchableOpacity>
                <TextInput
        style={{  marginRight: 10, 
   marginLeft: 10, marginTop: 5,  paddingRight: 10,color : "#000",fontSize:18 }}

   onChangeText={(text) => searchFilterFunction(text)}
   value={search}
   underlineColorAndroid="transparent"
      placeholder="Search users..."
      placeholderTextColor = "#9e9e9e"
      
    //  onClear={(text: string) => this.SearchFilterFunction(text)}
      />
                </View>
        </View>
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            title="Pull to refresh"
          />
        }>
        <View style={styles.container1}>

        <Text style={styles.title}>{text}</Text>
        <View style={{flexDirection:'row', flex:1,flexWrap:'wrap',justifyContent:'space-around'
          }}>

{getItem()}
</View>
<View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,marginTop:10}}/>

<View style={{backgroundColor:'#fff',justifyContent:'center',alignContent:'center',alignItems:'center',paddingVertical:50}}>
          <AntDesign  name="checkcircleo" color={'#5F259F'} size={64} />

              {/* <Image source={require('../images/checked.png')}
                     style={{ height: 60, width: 60}} /> */}
              <Text style={{ color:'#000',textAlign:'center',fontFamily:'Segoe UI',fontSize:20,marginTop:10}}>You've completely caught up</Text>
              <Text style={{textAlign:'center',fontFamily:'Segoe UI',fontSize:14,marginTop:10}}>You have seen all latest top 20 profiles</Text>
              <TouchableOpacity activeOpacity={1} onPress={() =>
             navigation.navigate('HomeSearch')
                  }>
              <Text  style={{ color:'blue',textAlign:'center',fontFamily:'Segoe UI',marginTop:10}}> Search for more results </Text>
           </TouchableOpacity>
           </View>
        
         {/* <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,marginTop:10}}/>
        <Text style={{alignSelf:'center',justifyContent:'center',padding:15,fontFamily:'Segoe UI',fontSize:16, fontWeight:'700',color:'grey'}}>Show More</Text> */}
        </View>
        </ScrollView>
      </View>
   
  );
}; 

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#efefef',
    flexDirection:'column',
    justifyContent: 'center',
    flexWrap:'nowrap'
    
  },
  container1: {
   
    flexDirection:'column',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom:10,
    borderBottomLeftRadius:15,
    borderBottomRightRadius:15,
    marginHorizontal:5,
    borderColor:'#efefef',
    borderWidth:2,
    flexWrap:'nowrap'

  },
  itemStyle: {
    padding: 10,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  },
  searchbar: {
    backgroundColor: '#fff',
    height:50
  },
  leftsection: {
    flexDirection:'row',
  },
  leftsectionimg: {
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',marginVertical:15,
    marginHorizontal:10
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    fontFamily:'Segoe UI',
    marginHorizontal:10,
    marginVertical:10
  },
  itemContainer: {
    width: size,
    height:heightSize,
    //flexDirection: 'row',
    //justifyContent: 'center',
  },
  item1: {
    flexDirection:'column',
    flex: 1,
    margin: 6,
    borderRadius:10,
    backgroundColor: 'white',
    borderWidth: 1, 
    borderColor:'#dcdcdc', 
  },
  cardfirstpart: {
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
    marginTop:20,
    justifyContent:'center',
    alignContent:'center',
    borderColor: '#5F259F'
  },
  TextStyle:{
      color:'#5F259F',
      textAlign:'center',
      fontFamily:'Segoe UI'
  },
  peopletextitem: {
    flexDirection: 'column',
    alignItems: 'center',
 justifyContent: 'center',
 marginTop:40
  },
  peopleName: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily:'Segoe UI'
  },
  peopleEmail: {
    fontWeight: '600',
    fontSize:12,
    fontFamily:'Segoe UI',
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    flex:1
  },
});

export default App;