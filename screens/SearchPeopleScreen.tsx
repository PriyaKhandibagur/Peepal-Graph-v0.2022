import React, { Component } from 'react';
import {TouchableOpacity,TextInput,StyleSheet, View, Text, FlatList,Image, Dimensions,ActivityIndicator,Modal,
  Platform, } from 'react-native';
import { createStackNavigator,StackNavigationProp } from '@react-navigation/stack';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { GraphManager } from '../graph/GraphManager';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const numColumns = 2;
const size = Dimensions.get('window').width/numColumns;
const heightSize = Dimensions.get('window').height/2.8;
const Stack = createStackNavigator();

class FlatListDemo extends Component<{},any> {

  arrayholder: never[];
  static navigationOptions = {
    title: 'SearchPeopleScreen',
    
    }
    
  constructor(props: {
  } | Readonly<{}>) {
    super(props);

    const PeopleState = React.createContext<PeopleScreenState>({
      loadingPeople: true,
      peopleList: [],
      arrayholder:[],
      value:'',
      navigation:{},
      searchletter:''
    
    });
    type PeopleScreenState = {
      loadingPeople: boolean;
      peopleList: MicrosoftGraph.Person[];
      arrayholder:MicrosoftGraph.Person[];
      value:string;
      navigation:any;
      searchletter:string;
    }
    type RootStackParamList = {
      People: undefined;
      Profile: { upn: string };
    };
    
    this.state = {
      loadingPeople: false,
      peopleList: [],
      value:'',
      error: null,
      searchletter:''
    };

    this.arrayholder = [];
  }


  //  makeRemoteRequest = () => {
   
  // }

  async componentDidMount() {
  //  const navigation = useNavigation();

    this.setState({ loadingPeople: true });
    try {
      // if(text==''){
      //   const people = await GraphManager.getPeopleSearchAsync('k');
      // }
      const people = await GraphManager.getPeopleAsync();
      
      this.setState({
        loadingPeople: false,
        peopleList: people.value,
        arrayholder:people.value,

      });
    } catch(error) {
      console.log('text', error);

    } 
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  async SearchFilterFunction(text: string) {
    console.log('text', text);
    this.setState({ loadingPeople: true });
    try {
      // if(text==''){
      //   const people = await GraphManager.getPeopleSearchAsync('k');
      // }
      const people = await GraphManager.getPeopleSearchAsync(text);
      this.setState({
        loadingPeople: false,
        peopleList: people.value,
        arrayholder:people.value,
      });
    } catch(error) {
      console.log('text', error);

    } 
  }

  //  UserProfileNavigation(text: string) {
  //   const navigation = useNavigation();
  //   console.log('text', text);
  //   navigation.navigate('ProfileScreenUser',{upn:text})
   
  // }

  renderHeader = () => {
    const navigation = useNavigation();

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

      onChangeText={text => this.SearchFilterFunction(text)}
      placeholder="Search users..."
      placeholderTextColor = "#9e9e9e"
      
    //  onClear={(text: string) => this.SearchFilterFunction(text)}
      />
                </View>
        </View>
        <Text style={styles.title}>All users in the organization</Text>

      </View>

         );
         
  };
  
  

  render() {
    // if (this.state.loadingPeople) {
    //   return (
    //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    //       <ActivityIndicator />
    //     </View>
    //   );
    // }
    return (
      <View style={styles.container}>
     

        <FlatList
          data={this.state.peopleList}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {console.log('dataaa') } }>
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
                <TouchableOpacity
          style={styles.SubmitButtonStyle}
          activeOpacity = { .5 }>
                <Text style={styles.TextStyle}> View </Text>
                </TouchableOpacity>
              </View>
            
              </View>
             </View>
            </View>
               </TouchableOpacity>
          )}
          keyExtractor={item => item.email}
         
          ListHeaderComponent={this.renderHeader}
        />
      </View>
    );
  }
 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
   
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
  itemContainer: {
    width: size,
    height:heightSize
  },
  item1: {
    flex: 1,
    margin: 6,
    borderRadius:10,
    backgroundColor: 'white',
    borderWidth: 2,
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
    borderWidth: 2,
    marginTop:30,
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
    fontWeight: '700',
    fontSize: 14,
    fontFamily:'Segoe UI'
  },
  peopleEmail: {
    fontWeight: '600',
    fontSize:12,
    fontFamily:'Segoe UI',
    marginTop:5    
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    fontFamily:'Segoe UI',
    marginHorizontal:10,
    marginVertical:10
  },
});
export default FlatListDemo;