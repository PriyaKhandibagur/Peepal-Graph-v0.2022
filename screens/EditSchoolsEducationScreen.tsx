// Copyright (c) Microsoft.
// Licensed under the MIT license.

// <NewEventScreenSnippet>
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,Image,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createStackNavigator,StackNavigationProp,HeaderBackButton } from '@react-navigation/stack';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { RouteProp } from '@react-navigation/native';
import ProfileScreen from '../screens/ProfileScreen';
import Toast from 'react-native-simple-toast';
import { UserContext } from '../UserContext';
import { GraphManager } from '../graph/GraphManager';
import { TextInput } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();
const RootStack = createStackNavigator<RootStackParamList>();

type RootStackParamList = {
  Schools: undefined;
  SchoolsList:{schools:[]};
  Profile:undefined;
};

type GroupScreenRouteProp = RouteProp<RootStackParamList, 'SchoolsList'>;

type GroupScreenNavigationProp = StackNavigationProp<RootStackParamList,'SchoolsList'>;
type Props = {
  route: GroupScreenRouteProp;
  navigation: GroupScreenNavigationProp;
};

const NewEventState = React.createContext<NewEventState>({
  isCreating: false,
  schools: '',
  schoolsarray:[],
  disableCreate: () => { return true },
  updateValue: () => {}
});

type NewEventState = {
  isCreating: boolean;
  schools: string;
  schoolsarray:Array<String>;
  disableCreate: () => boolean;
  updateValue: (newValue: string | Date | boolean, fieldName: string) => void;
}


// The picker acts very differently on Android and iOS
// iOS can use a single picker for both date and time,
// where Android requires two. Also the iOS version can
// be displayed all the time, while the Android version is a
// modal pop-up. Encapsulating this into a reusable component


const NewEventComponent = ({route,navigation}:Props) => {
  const newEventState = React.useContext(NewEventState);

  const createEvent = async () => {
    newEventState.updateValue(true, 'isCreating');

    // Create a new Event object with the
    // required fields
    const newEvent: MicrosoftGraph.User = {
      schools:[]
     
    };

    // Only add attendees if the user specified them
    if (newEventState.schoolsarray.length > 0) {
     // newEvent.skills = [];

      // Value should be a ;-delimited list of email addresses
      // NOTE: The app does no validation of this
    //  const schools_list = newEventState.schools.split(';')

      newEventState.schoolsarray.forEach((school:any) => {
        newEvent.schools!.push(school);
      });
    }

    // Only add body if the user specified one
    
    try{
      await GraphManager.UpdateUserDetailsAsync(newEvent);
    //  console.log(newEvent)
  
    Toast.show('Profile updated.', Toast.LONG);
    newEventState.updateValue(false, 'isCreating');
    navigation.navigate('Profile');
      
      }catch(error) {
        Alert.alert(
        'getting error',
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

  const addItem = async () => {
    newEventState.updateValue(true, 'isCreating');

    newEventState.schoolsarray.push(newEventState.schools)
    newEventState.updateValue(false, 'isCreating');

    // Create a new Event object with the
    // required fields
   

    // Only add attendees if the user specified them
   
  }
  const removeItem =(item:any) => {
    newEventState.updateValue(true, 'isCreating');
    const valueToRemove = item
    const filteredItems = newEventState.schoolsarray.filter(item1 => item1 !== valueToRemove)
    newEventState.schoolsarray=filteredItems;
    newEventState.updateValue(false, 'isCreating');
  }
  return (
    <View style={styles.container}>

   
      <Modal visible={newEventState.isCreating}>
        <View style={styles.loading}>
          <ActivityIndicator
            color={Platform.OS === 'android' ? '#276b80' : undefined}
            animating={newEventState.isCreating}
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
                style={{ height: 30, width: 30,alignSelf:'center',marginTop:2}} />  */}
                </View>
                </TouchableOpacity>
                <Text style={{fontFamily:'Segoe UI',flex:1,marginTop:2, padding: 10,color:'#000',fontSize:22,justifyContent:'flex-start',fontWeight:'600'}}>Schools and Education</Text>

                <TouchableOpacity
                onPress={createEvent}
                style={[
                styles.button,
                ]}
     disabled={newEventState.disableCreate()}
   >
     <Text style={{fontFamily:'Segoe UI', color:'#000',fontSize:18,textAlign:'right',fontWeight:'600',paddingTop:5}}>POST</Text>
   
       </TouchableOpacity>
                </View>
                </View>

        <ScrollView style={styles.container}>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Schools and Education</Text>
          <View style={styles.profileView}>{newEventState.schoolsarray.map((item, key)=>(
      <View style={styles.customItem}>
      <MaterialCommunityIcons name="circle" color={'#4e4e4e'} size={10}style={{marginTop:5,marginHorizontal: 10}} />
          <Text key={key} style={styles.profilesub} > { item } </Text>
          <MaterialCommunityIcons onPress={() => removeItem(item)  } name="close" color={'#4e4e4e'} size={20}style={{marginHorizontal: 10}} />

   </View>
   ))}
  </View>
        </View>
        
       
       
        <View style={styles.formField}>
        <TextInput style={styles.textInput}
            placeholder="Add School"
            onChangeText={(text) => newEventState.updateValue(text, 'schools')}
            
             />

<TouchableOpacity
     onPress={addItem}
     style={[
       styles.addbutton,
     ]}
     disabled={newEventState.disableCreate()}
   >
     <Text style={{justifyContent:'center',fontFamily:'Segoe UI',alignContent:'center',flexDirection:'row',color:'#ffffff',fontSize:16}}>ADD</Text>
   
       </TouchableOpacity>

        </View>
    </ScrollView>
    
       </View>

  );
}



export default class NewEventScreen extends React.Component<Props>  {
  static contextType = UserContext;
  async componentDidMount() {
    const{schools}=this.props.route.params;

    console.log(schools);

    try {
     
      this.setState({
        schoolsarray:schools
        
      });
     
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
  disableCreate = () => {
    return this.state.isCreating
      
  }

  onStateValueChange = (newValue: string | Date | boolean, fieldName: string) => {
    this.setState({ [fieldName]: newValue });
  }

  state: NewEventState = {
    isCreating: false,
    schools: '',
    schoolsarray:[],
    disableCreate: this.disableCreate,
    updateValue: this.onStateValueChange
  };

  render() {
    return (
      <NewEventState.Provider value={this.state}>
         <RootStack.Navigator initialRouteName="Schools">
  <RootStack.Screen name="Schools" component={NewEventComponent}
  options={{
    headerShown: false,
  }}
  />
  <RootStack.Screen name="Profile" component={ProfileScreen}
  options={{
    headerShown: false}}
  />
  
</RootStack.Navigator>
      </NewEventState.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loading: {
    height:30,
    flex:0.1,
    justifyContent:'center',
    alignContent:'center'
   
  },
  formField: {
    backgroundColor: '#ffffff',
    borderColor:'#ffffff',
    borderRadius: 10,
    paddingHorizontal:20,
    paddingVertical:30,
    marginHorizontal:20,
    marginVertical:10

  },
  fieldLabel: {
    fontWeight: '600',
    marginBottom: 10,
    color:'#303030',
    fontSize:16
  },
  textInput: {
    borderColor: '#604c8b',
    borderWidth: 2,
    borderRadius:5,
    height: 50,
    paddingHorizontal:10,
    justifyContent:'center',
    alignContent:'center',
    color:'#303030'
  },
  multiLineTextInput: {
    borderColor: 'gray',
    borderWidth: 1,
    height: 200,
    padding: 10
  },
  time: {
    padding: 10,
    backgroundColor: '#e6e6e6',
    color: '#147efb',
    marginRight: 10
  },
  date: {
    padding: 10,
    backgroundColor: '#e6e6e6',
    color: '#147efb'
  },
  dateTime: {
    flexDirection: 'row'
  },
  button: {
    justifyContent:'flex-end',
    flexDirection:'row',
    marginHorizontal:10,
    marginTop:10,
    
   },
   addbutton: {
    width:'30%',
    height:40,
    backgroundColor:'#5f259f',
    borderColor:'#5f259f',
    borderWidth:2,
    borderRadius:10,
    justifyContent:'center',
    alignContent:'center',
    alignSelf:'flex-end',
    alignItems:'center',
    marginTop:20
   
   },
   profileView: { 
    flexWrap:'nowrap',
    alignSelf: 'stretch'

  },
  customItem: {
    flex:1,
    flexDirection: 'row',
    marginTop:10,
    flexWrap:'nowrap'
  },
  profilesub: {
    fontWeight: '400',
    fontSize: 14,
    color:'#303030',
    flexWrap:'wrap',
    alignItems:'center',
    fontFamily: 'Segoe UI',
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

