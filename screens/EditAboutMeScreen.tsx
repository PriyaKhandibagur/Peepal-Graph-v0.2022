// Copyright (c) Microsoft.
// Licensed under the MIT license.

// <NewEventScreenSnippet>
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createStackNavigator,StackNavigationProp,HeaderBackButton } from '@react-navigation/stack';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import moment from 'moment-timezone';
import { RouteProp } from '@react-navigation/native';
import { UserContext } from '../UserContext';
import { GraphManager } from '../graph/GraphManager';
import { TextInput } from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import ProfileScreen from '../screens/ProfileScreen';
import { create } from 'react-test-renderer';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Stack = createStackNavigator();
const RootStack = createStackNavigator<RootStackParamList>();
const width = Dimensions.get('window').width;

const width_proportion = '100%';
const height_proportion = '40%';
type RootStackParamList = {
  Aboutme: undefined;
  Profile:undefined;
  GroupScreenId: { upn: string};
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
const NewEventState = React.createContext<NewEventState>({
  isCreating: false,
  aboutMe: '',
  aboutme_text:'',
  disableCreate: () => { return true },
  updateValue: () => {}
});

type NewEventState = {
  isCreating: boolean;
  aboutMe: string;
  aboutme_text:string;
  disableCreate: () => boolean;
  updateValue: (newValue: string | Date | boolean, fieldName: string) => void;
}
const UpdatedValues= React.createContext<UpdateState>({
aboutme_text:''
});

type UpdateState = {
  aboutme_text:string;
}


const NewEventComponent = ({route,navigation}:Props) => {
  const newEventState = React.useContext(NewEventState);
  const updateState = React.useContext(UpdatedValues);
 // const { upn } = route.params;
 

  console.log(updateState.aboutme_text)
  const createEvent = async () => {
    newEventState.updateValue(true, 'isCreating');

    // Create a new Event object with the
    // required fields
    const newEvent: MicrosoftGraph.User = {
      aboutMe: newEventState.aboutme_text
      
    };

    try{
    await GraphManager.UpdateUserDetailsAsync(newEvent);
  //  console.log(newEvent)

  Toast.show('Profile updated.', Toast.LONG);
  newEventState.updateValue(false, 'isCreating');
  navigation.navigate('Profile');
    // Alert.alert('Success',
    //   'Updated..',
    //   [
    //     {
    //       text: 'OK',
    //       onPress: () => {
    //         newEventState.updateValue(false, 'isCreating');
    //       }
    //     }
    //   ]
    // );
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

  return (
    <View style={styles.loading}>
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
                <Text style={{fontFamily:'Segoe UI',flex:1,marginTop:2, padding: 10,color:'#000',fontSize:22,justifyContent:'flex-start',fontWeight:'600'}}>About Me</Text>

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
          <Text style={styles.fieldLabel} >About Me</Text>
          <TextInput style={styles.textInput}
            multiline={true}
            textAlignVertical='top'
            value={newEventState.aboutme_text}
            onChangeText={(text) => newEventState.updateValue(text, 'aboutme_text')} />
        </View>
        

        
    </ScrollView>
  
    </View>
  );
}


export default class NewEventScreen extends React.Component<Props> {
//  static contextType = UserContext;
  
  
  async componentDidMount() {
    const{upn}=this.props.route.params;

    try {
     
      this.setState({
        aboutme_text:upn
        
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

  // Disable the create button if:
  // - App is waiting for the result of create request
  // - Subject is empty
  // - Start time is after end time
  disableCreate = () => {
    return this.state.isCreating ||
      this.state.aboutme_text.length <= 0 
  }

  onStateValueChange = (newValue: string | Date | boolean, fieldName: string) => {

    this.setState({ [fieldName]: newValue });
  
  }

  state: NewEventState = {
    isCreating: false,
    aboutMe: '',
    aboutme_text:'',
    disableCreate: this.disableCreate,
    updateValue: this.onStateValueChange
  };

  render() {
    return (
      <NewEventState.Provider value={this.state}>
        <RootStack.Navigator initialRouteName="Aboutme">
  <RootStack.Screen name="Aboutme" component={NewEventComponent}
  options={{
    headerShown: false,
    
//   headerRight: (props) => (
//     <Text  {...props}
//    style={styles.fieldLabel} >About Me</Text>

// ),
  }}
  />
  <RootStack.Screen name="Profile" component={ProfileScreen}
  options={{
    headerShown: false,
    
  }}
  />
  
</RootStack.Navigator>
       
      </NewEventState.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
      },
  loading: {
    flex: 1,
  },
  formField: {
      backgroundColor: '#ffffff',
    borderColor:'#ffffff',
    borderRadius: 10,
    padding:20,
    marginHorizontal:20,
    marginTop:20

    
  },
  button: {
    justifyContent:'flex-end',
    flexDirection:'row',
    marginHorizontal:10,
    marginTop:10,
    
   },
  fieldLabel: {
    fontWeight: '700',
    marginBottom: 10,
    color:'#303030',
    fontSize:16
  },
  textInput: {
    borderColor: '#5F259F',
    borderWidth: 2,
    borderRadius:5,
    height: 150,
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
// </NewEventScreenSnippet>
