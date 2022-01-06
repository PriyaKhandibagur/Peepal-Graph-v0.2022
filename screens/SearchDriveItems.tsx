import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,TouchableOpacity,Image,Dimensions,
  FlatList,
  TextInput,
} from 'react-native';
import { GraphManager } from '../graph/GraphManager';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { createStackNavigator,StackNavigationProp } from '@react-navigation/stack';
import {RootStackParamList} from './RootStackParams';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment-timezone';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
type authScreenProp = StackNavigationProp<RootStackParamList, 'SearchFirst'>;
const numColumns = 2;
const size = Dimensions.get('window').width/numColumns-5;
const heightSize = Dimensions.get('window').height/2.8;
const App = () => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [text,setsearchtext]=useState('Search drive items');

  const navigation = useNavigation<authScreenProp>();
  async function anyNameFunction() {
    try {
    const people = await GraphManager.getDriveItemsAsync();
   // const result=(people.value).filter((user:any)=>user.personType.subclass=="OrganizationUser")

    setFilteredDataSource(people.value);
    setMasterDataSource(people.value);
  } catch(error) {
    console.log('text', error);
    
  } 
}
  useEffect(() => {
    anyNameFunction();
    
  
    // fetch('https://jsonplaceholder.typicode.com/posts')
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     setFilteredDataSource(responseJson);
    //     setMasterDataSource(responseJson);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }, []);

  const searchFilterFunction = (text:any) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(
        function (item:any) {
          const itemData = item.name
            ? item.name.toUpperCase()
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
    return moment(dateTime).format('DD/MM/yyyy h:mm a');
  };
  
  
  return (
   
      <View style={styles.container}>
        
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
      placeholder="Search library items..."
      placeholderTextColor = "#9e9e9e"
      
    //  onClear={(text: string) => this.SearchFilterFunction(text)}
      />
                </View>
        </View>
        <ScrollView>
        <View style={styles.container1}>


        <FlatList
          data={filteredDataSource}
          numColumns={2}
          renderItem={({ item }:any) => (
            <TouchableOpacity activeOpacity = { 1 } onPress={() => {
              navigation.navigate('DriveItems',{upn:item.id,name:item.name});
            }}>
            <View style={styles.horizontalview}>
                <Image source={require('../images/drive_folder.png')}
                  style={{ height: 40, width: 40}} />
                <View style={styles.peopleItem}>
                <Text style={styles.peopleName}>{item.name}</Text>
                <View style={styles.horizontalviewdot}>
                  <Text style={styles.peopleEmail}>Modified</Text>
                  <Octicons name="primitive-dot" color='grey' size={10} style={{marginHorizontal:5,marginTop:4}}/>
                  <Text style={styles.peopleEmail}>{convertDateTime(item.fileSystemInfo?.lastModifiedDateTime!)}</Text>
                  </View>
                <View style={{borderBottomColor: '#e0e0e0',borderBottomWidth: 1,marginTop:10}}/>
                </View>
               </View>
  
            </TouchableOpacity>
          )}
          keyExtractor={(item, email) => email.toString()}
        />
         
        </View>
        </ScrollView>
      </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#efefef',
    
  },
  container1: {
    flex:1,
    backgroundColor: 'white',
    marginBottom:10,
    borderBottomLeftRadius:15,
    borderBottomRightRadius:15,
    borderColor:'#efefef',
    borderWidth:2
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
  horizontalviewdot: {
    flexDirection: 'row',
    backgroundColor: '#ffffff', 
  },
  horizontalview: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal:10,
    marginRight:10,
    paddingVertical:5
  },
  peopleItem: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingHorizontal:10,
    paddingTop:2,
    marginVertical: 1,
    marginLeft: 5,
    marginRight:10,
    width:'100%',
  },
});

export default App;