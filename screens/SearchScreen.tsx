import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,TouchableOpacity,Image,Dimensions,
  FlatList,
  TextInput,Modal,ActivityIndicator,Platform
} from 'react-native';
import { GraphManager } from '../graph/GraphManager';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { createStackNavigator,StackNavigationProp } from '@react-navigation/stack';
import {RootStackParamList} from './RootStackParams';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { UserContext } from '../UserContext';
import moment from 'moment-timezone';
import { findOneIana } from 'windows-iana';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

type authScreenProp = StackNavigationProp<RootStackParamList, 'SearchFirst'>;
const numColumns = 2;
const numColumns_p = 3;

const size = Dimensions.get('window').width/numColumns-10;
const size_p = Dimensions.get('window').width/numColumns_p;

const heightSize = Dimensions.get('window').height/2.8;
const App = () => {
  const [search, setSearch] = useState('');
  const [loading, setloading] = useState(true);
  const [designation, setdesignation] = useState('');
  const [memberscount, setmemberscount] = useState('');
  const [text,setsearchtext]=useState('People');
  const [textphoto,setsearchtextphoto]=useState('Posts');
  const [textvideo,setsearchtextvideo]=useState('Groups');
  const [textpeople,setsearchtextpeople]=useState('More People');
  const [textfiles,setsearchtextfiles]=useState('Events');
  const [filteredDataSource, setFilteredDataSource] = useState([] as  any);
  const [masterDataSource, setMasterDataSource] = useState([] as  any);
  const [photofilteredDataSource, setphotoFilteredDataSource] = useState([]as  any);
  const [photomasterDataSource, setphotoMasterDataSource] = useState([]as  any);
  const [videofilteredDataSource, setvideoFilteredDataSource] = useState([] as  any);
  const [videomasterDataSource, setvideoMasterDataSource] = useState([]as  any);
  const [filesfilteredDataSource, setfilesFilteredDataSource] = useState([]as  any);
  const [filesmasterDataSource, setfilesMasterDataSource] = useState([]as  any);
  const [filteredDataSourcePeople, setFilteredDataSourcePeople] = useState([] as  any);
  const [masterDataSourcePeople, setMasterDataSourcePeople] = useState([] as  any);
  const [userTimeZone, setuserTimeZone] = useState('' as  any);

  const navigation = useNavigation<authScreenProp>();

  const getdesignation= (id:string):any|undefined => {
   // designation
  ////  console.log('entering1111')
    const designation1 = async () => {
    ////  console.log('entering'+id)
      try{
        const designationnn = await GraphManager.getUserDetailsAsync(id);
      ////  console.log('vvvvvv '+designationnn.jobTitle)
       setdesignation(designationnn.jobTitle)
        
      }catch(error) {
        console.log('text', error);
        
      } 

    }
    designation1();
    return designation

  }
  const teammembers= (id:string):any|undefined => {
    let membersarray:any=[];
   // let stringg:any='0';
    const members = async () => {
      const groupMembersapi= await GraphManager.getTeamMemberAsync(id);
    membersarray=groupMembersapi.value;
    setmemberscount(membersarray.length);
   const stringg=membersarray.length;
   // console.log('stringg '+stringg)
  //  return members.length;
    //console.log(await got.json())
 //   return stringg;
      return stringg;
  }
  members();

 // return stringg;

  }

  async function anyNameFunction() {
    loading
    
    try {
    const people = await GraphManager.getUserssAsync();
    const people2 = await GraphManager.getPeopleAsync();
    const drive_items = await GraphManager.getDriveItemsAsync();
    const shared_items = await GraphManager.getDriveSharedItemsAsync();
    const teams = await GraphManager.getTeamsAsync();

    const tz:any = userTimeZone || 'UTC';
    // Convert user's Windows time zone ("Pacific Standard Time")
    // to IANA format ("America/Los_Angeles")
    // Moment.js needs IANA format
    const ianaTimeZone = findOneIana(tz);

    // Get midnight on the start of the current week in the user's
    // time zone, but in UTC. For example, for PST, the time value
    // would be 07:00:00Z
    const startOfWeek = moment
      .tz(ianaTimeZone!.valueOf())
      .startOf('day')
      .utc();

    const endOfWeek = moment(startOfWeek)
      .add(7, 'day');

    const events = await GraphManager.getCalendarView(
      startOfWeek.format(),
      endOfWeek.format(),
      tz);

    setloading(false);
    setFilteredDataSource(people.value);
    setMasterDataSource(people.value);
    setphotoFilteredDataSource(shared_items.value);
    setphotoMasterDataSource(shared_items.value);
    setvideoFilteredDataSource(teams.value);
    setvideoMasterDataSource(teams.value);
    setfilesFilteredDataSource(events.value);
    setfilesMasterDataSource(events.value);
    setFilteredDataSourcePeople(people2.value);
    setMasterDataSourcePeople(people2.value);
           
            // let new_post_files:any = [];
            // let posts_files =  drive_items.value ;
            // Promise.all(
            //   posts_files.map(async (item:any )=>{
            //     //  console.log('itemiddddd '+item.remoteItem.parentReference.driveId)
            //         const driveidd=item.id;
            //       const thumbnailitems = await GraphManager.getDriveThumbnailFilesAsync(item.id);
            //      // console.log('second item list'+thumbnailitems.value)
            //      const photosfile=(thumbnailitems.value).filter((user:any)=>user.thumbnails&&user.thumbnails.length>0&&thumbnailitems.value&&thumbnailitems.value.length>0&&user.file?.mimeType.includes("application"))

            //       let postsf=photosfile;
                  
            //       postsf.map((item:any)=>{
            //         new_post_files.push(item)
            //       });
                   
            //     // console.log('newpostlist '+new_post)
            //     setloading(false);
            //     setfilesFilteredDataSource(new_post_files);
            //     setfilesMasterDataSource(new_post_files); 
            //     })
            // )

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
      setsearchtext('Search results for people ('+newData.length+')')

      const newData1 = photomasterDataSource.filter(
        function (item:any) {
          const itemData = item.name
            ? item.name.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      setphotoFilteredDataSource(newData1);
      setSearch(text);
      setsearchtextphoto('Search results for posts ('+newData1.length+')')

      const newDatav = videomasterDataSource.filter(
        function (item:any) {
          const itemData = item.displayName
            ? item.displayName.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      setvideoFilteredDataSource(newDatav);
      setSearch(text);
      setsearchtextvideo('Search results for groups ('+newDatav.length+')')

      const newDataf = filesmasterDataSource.filter(
        function (item:any) {
          const itemData = item.subject
            ? item.subject.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      setfilesFilteredDataSource(newDataf);
      setSearch(text);
      setsearchtextfiles('Search results for events ('+newDataf.length+')')

      const newDatap = filteredDataSourcePeople.filter(
        function (item:any) {
          const itemData = item.displayName
            ? item.displayName.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSourcePeople(newDatap);
      setSearch(text);
      setsearchtextpeople('Search results for more people ('+newDatap.length+')')

    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
     // setSearch(text);
      setphotoFilteredDataSource(photomasterDataSource);
      setvideoFilteredDataSource(videomasterDataSource);
      setfilesFilteredDataSource(filesmasterDataSource);
      setFilteredDataSourcePeople(masterDataSourcePeople);

      setSearch(text);
      setsearchtext('People')
      setsearchtextphoto('Posts')
      setsearchtextvideo('Groups')
      setsearchtextfiles('Events')
      setsearchtextpeople('More People')
    }
  };

  const ItemView = ({item}:any) => {
    return (
      // Flat List Item
      <Text
        style={styles.itemStyle}
        onPress={() => getItem(item)}>
        {item.displayname.toUpperCase()}
      </Text>
    );
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

  const getItem = (item:any) => {
    const navigation = useNavigation<authScreenProp>();
   // console.log(item.id)
    //navigation.navigate('Auth');
    // Function for click on an item
  //  alert('Id : ' + item.id + ' Title : ' + item.title);
  };
  const convertDateTime = (dateTime: string): string => {
    return moment(dateTime).format('MMM Do   H:mm a');
  };
  const convertDateTimeevents = (dateTime: string): string => {
    return moment(dateTime).format('H:mm a');
  };
  const EmptyListMessage = ({item}:any) => {
    return (
      // Flat List Item
      <View style={{display:'none'}}>
      </View>
    );
  };
  return (
    <Modal>
    <SafeAreaView style={{flex: 1,marginBottom:20}}>
      <View style={styles.container}>
      <Modal visible={loading}>
        <View style={styles.loading}>
          <ActivityIndicator
            color={Platform.OS === 'android' ? '#276b80' : undefined}
            animating={loading}
            size='large' />
        </View>
      </Modal>
      <View style={styles.searchbar}>
        <View style={styles.leftsection}>
        <TouchableOpacity onPress={() => {console.log('dataaa')
          navigation.goBack() } }>
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
      placeholder="Search"
      placeholderTextColor = "#9e9e9e"
      
    //  onClear={(text: string) => this.SearchFilterFunction(text)}
      />
                </View>
        </View>
        <ScrollView>
        <View>
      

        <View style={{backgroundColor:'#fff',marginTop:15,borderRadius:10,margin:10}}>
        <View style={{flexDirection:'row',marginRight:10}}>
        <Text style={styles.title}>{text}</Text>
        </View>
        <FlatList
          data={filteredDataSource.slice(0,4)}
          numColumns={2}
          renderItem={({ item }:any) => (
            <TouchableOpacity activeOpacity={1}>
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

                <TouchableOpacity 
          style={styles.SubmitButtonStyle}
          activeOpacity = { 1 } >
                <Text style={styles.TextStyle}> View </Text>
                </TouchableOpacity>
              </View>
            
              </View>
             </View>
            </View>
               </TouchableOpacity>
          )}
          keyExtractor={(item, email) => email.toString()}
        />
        <View style={filteredDataSource.length>0?{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,marginTop:10}:{display:'none'}}/>
        <Text onPress={() => { navigation.navigate('SearchPeople',{list:filteredDataSource}) }} style={filteredDataSource.length>0?{alignSelf:'center',justifyContent:'center',padding:15,fontFamily:'Segoe UI',fontWeight:'700',color:'grey'}:{display:'none'}}>See all people results</Text>
      </View>

      <View style={{backgroundColor:'#fff',paddingBottom:10,borderRadius:10,margin:10}}>
      <View style={{flexDirection:'row',marginRight:10}}>
        <Text style={styles.title}>{textphoto}</Text>
       </View>
        <FlatList
          data={photofilteredDataSource.slice(0,2)}
          ListEmptyComponent={EmptyListMessage}
          renderItem={({ item }:any) => (
            <TouchableOpacity activeOpacity={1}>
          
            <View style={styles.horizontalviewitem}>
              <Image source={require('../images/homepage.jpeg')}
                style={{ height: 50, width: 80,marginLeft:5}} />
              <View style={styles.peopleItem}>
                <Text style={styles.usernametitle}>{item.name}</Text>
                <Text style={styles.username}>{item.lastModifiedBy?.user?.displayName}</Text>
                <View style={styles.horizontalviewdot}>
                <Text style={styles.peopleEmail1}>Modified</Text>
                <Octicons name="primitive-dot" color='grey' size={10} style={{marginHorizontal:5,marginTop:3}}/>
                <Text style={styles.peopleEmail1}>{convertDateTime(item.fileSystemInfo?.lastModifiedDateTime!)}</Text>
                </View>
              </View>
            </View>
            <View style={photofilteredDataSource.length>0?{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,marginVertical:10}:{display:'none'}}/>
            </TouchableOpacity>
          )}
          keyExtractor={(item, id) => id.toString()}
        />
       <Text onPress={() => { navigation.navigate('SearchPosts',{list:photofilteredDataSource}) }} style={photofilteredDataSource.length>0?{alignSelf:'center',justifyContent:'center',padding:5,fontFamily:'Segoe UI',fontWeight:'700',color:'grey'}:{display:'none'}}>See all post results</Text>

      </View>

      <View style={{backgroundColor:'#fff',marginTop:5,paddingBottom:10,borderRadius:10,margin:10}}>
      <View style={{flexDirection:'row',marginRight:10}}>
        <Text style={styles.title}>{textvideo}</Text>
        </View>
        <FlatList
          data={videofilteredDataSource.slice(0,2)}
          ListEmptyComponent={EmptyListMessage}
          renderItem={({ item }:any) => (
            <TouchableOpacity activeOpacity={1}>
           <View style={styles.horizontalview}>
              <Image source={require('../images/avatarmale.png')}
                    style={{ height: 40, width: 40}} />
              <View style={styles.peopleItem}>
                <Text style={styles.peopleName}>{item.displayName}</Text>
                <Text style={styles.peopleEmail}>{item.description}</Text>

              </View>
            </View>
            
            <View style={videofilteredDataSource.length>0?{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,marginVertical:10}:{display:'none'}}/>
            </TouchableOpacity>
          )}
          keyExtractor={(item, id) => id.toString()}
        />   
<Text onPress={() => { navigation.navigate('SearchTeams',{list:videofilteredDataSource}) }} style={videofilteredDataSource.length>0?{alignSelf:'center',justifyContent:'center',padding:5,fontFamily:'Segoe UI',fontWeight:'700',color:'grey'}:{display:'none'}}>See all group results</Text>
      </View>

      <View style={{backgroundColor:'#fff',marginTop:5,paddingBottom:10,borderRadius:10,margin:10}}>
      <View style={{flexDirection:'row',marginRight:10}}>
        <Text style={styles.title}>{textfiles}</Text>
      
        </View>
        <FlatList data={filesfilteredDataSource.slice(0,2)}
        renderItem={({item}) =>
        <TouchableOpacity activeOpacity={1}>
          <View style={styles.eventItem}>
            <Text style={styles.eventSubject}>{item.subject}</Text>
            <Text style={styles.eventDuration}>
              {convertDateTime(item.start!.dateTime!)} - {convertDateTimeevents(item.end!.dateTime!)}
            </Text>

          </View>
          <View style={filesfilteredDataSource.length>0?{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,marginVertical:10}:{display:'none'}}/>
          </TouchableOpacity>
        } />    
          <Text onPress={() => { navigation.navigate('SearchEvents',{list:filesfilteredDataSource}) }} style={filesfilteredDataSource.length>0?{alignSelf:'center',justifyContent:'center',padding:5,fontFamily:'Segoe UI',fontWeight:'700',color:'grey'}:{display:'none'}}>See all event results</Text>

      </View>

      <View style={{backgroundColor:'#fff',marginTop:5,paddingBottom:10,borderRadius:10,margin:10}}>
      <View style={{flexDirection:'row',marginRight:10}}>
        <Text style={styles.title}>{textpeople}</Text>
        </View>
        <FlatList
          data={filteredDataSourcePeople.slice(0,2)}
          ListEmptyComponent={EmptyListMessage}
          renderItem={({ item }:any) => (
            <TouchableOpacity activeOpacity={1}>
           <View style={styles.horizontalview}>
              <Image source={require('../images/avatarmale.png')}
                    style={{ height: 40, width: 40}} />
              <View style={styles.peopleItem}>
                <Text style={styles.peopleName}>{item.displayName}</Text>
                <Text style={styles.peopleEmail}>{item.jobTitle}</Text>
                <Text style={styles.peopleEmail}>{item.department}</Text>

              </View>
            </View>
            
            <View style={filteredDataSourcePeople.length>0?{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,marginVertical:10}:{display:'none'}}/>
            </TouchableOpacity>
          )}
          keyExtractor={(item, id) => id.toString()}
        />   
<Text onPress={() => { navigation.navigate('SearchPeople2',{list:filteredDataSourcePeople}) }} style={filteredDataSourcePeople.length>0?{alignSelf:'center',justifyContent:'center',padding:5,fontFamily:'Segoe UI',fontWeight:'700',color:'grey'}:{display:'none'}}>See all people results</Text>
      </View>

      </View>
      </ScrollView>
      </View>
    </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#efefef',
    marginBottom:30
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
    marginVertical:15,
  },
  itemContainer: {
    width: size,
    height:heightSize
  },
  item1: {
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
    paddingVertical:5,
    backgroundColor:'#ffffff',
    borderRadius:30,
    borderWidth: 1,
    marginTop:10,
    height:30,
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
 alignContent:'center',
 alignSelf:'center',
 marginTop:50,
  },
  peopleName: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily:'Segoe UI',
    alignSelf:'center',
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
    paddingHorizontal:1
  },
  username: {
    fontWeight: '600',
    fontSize: 12,
    fontFamily:'Segoe UI',
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
    paddingHorizontal:1
  },
  usernametitle: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily:'Segoe UI',
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
    paddingHorizontal:1
  },
  peopleName1: {
    fontWeight: '700',
    fontSize: 14,
    fontFamily:'Segoe UI'
  },
  peopleEmail: {
    fontWeight: '600',
    fontSize:12,
    fontFamily:'Segoe UI',
  },
  peopleEmail1: {
    fontWeight: '600',
    fontSize:10,
    fontFamily:'Segoe UI',
  },
  Timerow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth:1,
    borderRadius:25,
    marginLeft:10,
    paddingRight:10,
    height:30,
    marginTop:20
  },
  time: {
    color:'#000',
    fontWeight:'400',
    fontSize:12,
    alignSelf:'center'
  },
  dateTime: {
    flexDirection: 'row'
  },
  itemimgContainer: {
    width: size_p,
    height:120,
    
  },
  itemimg: {
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    flex:1
  },
  horizontalviewdot: {
    flexDirection: 'row',
    backgroundColor: '#ffffff', 
  },
  peopleItem: {
    flexDirection: 'column',
    paddingLeft:10,
    paddingRight:15,
  },
  profilesub: {
    fontWeight: '400',
    fontSize: 14,
    flexWrap:'wrap',
    alignItems:'center',
    fontFamily: 'Segoe UI',
  },
  horizontalview: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingRight:15,
    marginHorizontal: 10,
  },
  horizontalviewitem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 10,
    marginTop:10
  },
  eventItem: {
    paddingHorizontal:16,
    backgroundColor:'#ffffff'
  },
  eventSubject: {
    fontWeight: '600',
    fontSize: 14
  },
  eventDuration: {
    fontWeight: '400',
    marginBottom:5
  },
});

export default App;