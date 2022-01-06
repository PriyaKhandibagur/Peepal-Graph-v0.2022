// Copyright (c) Microsoft.
// Licensed under the MIT license.

// <NewEventScreenSnippet>
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,Image,
  View,TouchableOpacity
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createStackNavigator,StackNavigationProp } from '@react-navigation/stack';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import moment from 'moment-timezone';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../UserContext';
import { GraphManager } from '../graph/GraphManager';
import { TextInput } from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import { RouteProp } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
const RootStack = createStackNavigator<RootStackParamList>();

const Stack = createStackNavigator();
type RootStackParamList = {
  thumb: undefined;

  SendMail: { upn: string};
 
};

type GroupScreenRouteProp = RouteProp<RootStackParamList, 'SendMail'>;

type GroupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SendMail'
>;
type Props = {
  route: GroupScreenRouteProp;
  navigation: GroupScreenNavigationProp;
};

const NewEventState = React.createContext<NewEventState>({
  isCreating: false,
  subject: '',
  toRecipient: '',
  body: '',
  attachment:'',
  disableCreate: () => { return true },
  updateValue: () => {}
});

type NewEventState = {
  isCreating: boolean;
  subject: string;
  toRecipient: string;
  body: string;
  attachment:string;
  disableCreate: () => boolean;
  updateValue: (newValue: string | Date | boolean|any, fieldName: string) => void;
}

type DateTimeInputProps = {
  value: Date;
  onChange: (event: Event, newValue: Date | undefined) => void;
}

// The picker acts very differently on Android and iOS
// iOS can use a single picker for both date and time,
// where Android requires two. Also the iOS version can
// be displayed all the time, while the Android version is a
// modal pop-up. Encapsulating this into a reusable component


const NewEventComponent = () => {
  const newEventState = React.useContext(NewEventState);
  const navigation = useNavigation();
  const createEvent = async () => {
    newEventState.updateValue(true, 'isCreating');

    // Create a new Event object with the
    // required fields
    const message:any={
      subject:newEventState.subject,
      

    }
  //  newEvent(message);
    const newEvent: any = {
      message:message
      
     
      
    };

    // Only add attendees if the user specified them
    if (newEventState.toRecipient.length > 0) {
      message.toRecipients = [];

      // Value should be a ;-delimited list of email addresses
      // NOTE: The app does no validation of this
      const emails = newEventState.toRecipient.split(';')

      // message.toRecipients.push({
      //   emailAddress: { address: newEventState.toRecipient }
      //      });

      emails.forEach((email) => {
        message.toRecipients.push({
          emailAddress: { address: email }
        });
      });
      console.log('emaillll',message.toRecipients)

    }

    // Only add body if the user specified one
    if (newEventState.body.length > 0) {
     
      const bodyattach=newEventState.attachment+'\n'+newEventState.body;
      message.body = {
        content: bodyattach,
        // For simplicity, add it as a plain-text body
        contentType: 'text'
      };
      
      
    }else{
      const bodyattach=newEventState.attachment;
      message.body = {
        content: bodyattach,
        // For simplicity, add it as a plain-text body
        contentType: 'text'
      };
    }
    console.log('recipient',newEventState.toRecipient)

    console.log('create_mail',newEvent)
    try{
    await GraphManager.sendmail(newEvent);
    Toast.show('Mail sent.', Toast.LONG);
    newEventState.updateValue(false, 'isCreating');
   
    }catch(error:any){
      Alert.alert(error,'Error',
      [
        {
          text: 'OK',
          // onPress: () => {
          //   newEventState.updateValue(false, 'isCreating');
          // }
        }
      ]
    );
    }

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
                <Text style={{fontFamily:'Segoe UI',flex:1,marginTop:2, padding: 10,color:'#000',fontSize:22,justifyContent:'flex-start',fontWeight:'600'}}>Send Link</Text>

                <TouchableOpacity
                onPress={createEvent}
                style={[
                styles.button,
                ]}
     disabled={newEventState.disableCreate()}
   >
     <Text style={{fontFamily:'Segoe UI', color:'#000',fontSize:18,textAlign:'right',fontWeight:'600',paddingTop:5}}>SEND</Text>
   
       </TouchableOpacity>
                </View>
                </View>
       <ScrollView style={styles.container}>
       
        <View style={styles.formField}>
        <View style={styles.dateTime}>
          <Image source={require('../images/group.png')}
                    style={{ height: 20, width: 20,marginTop:10}} />
          <Text style={styles.fieldLabel}>To:</Text>
          </View>
          <TextInput style={styles.textInputpa}
           multiline={true}
           defaultValue={newEventState.toRecipient}
            placeholder="Email (separate multiple with ';')"
            value={newEventState.toRecipient}
            onChangeText={(text) => newEventState.updateValue(text, 'toRecipient')} />
        </View>
        <View style={styles.formField}>
        <View style={styles.dateTime}>
        <Image source={require('../images/pencil.png')}
                    style={{ height: 15, width: 15,marginTop:15,marginRight:5}} />
          <TextInput style={styles.textInput}
            multiline={true}
            placeholder='Subject'
            placeholderTextColor='#000'
            value={newEventState.subject}
            onChangeText={(text) => newEventState.updateValue(text, 'subject')} />
            </View>
        </View>

        <View style={styles.formField}>
        <View style={styles.dateTime}>
          <Image source={require('../images/menu.png')}
                    style={{ height: 20, width: 20,marginTop:10}} />
          <Text style={styles.fieldLabel}>Description</Text>
          </View>
          <TextInput style={styles.multiLineTextInput}
            multiline={true}
            textAlignVertical='top'
            value={newEventState.body}
            onChangeText={(text) => newEventState.updateValue(text, 'body')} />
        </View>

        <View style={styles.formField}>
          <Text style={{fontFamily:'Segoe UI',color: 'blue',fontSize:14}}onPress={() => Linking.openURL('http://google.com')}>
           {newEventState.attachment}
          </Text>
          </View>
        
    </ScrollView>
    </View>
  );
}



export default class NewEventScreen extends React.Component<Props> {
  static contextType = UserContext;
  async componentDidMount() {
    const{upn}=this.props.route.params;

    try {
     
      this.setState({
        attachment:upn
        
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
      this.state.subject.length <= 0 
  }

  onStateValueChange = (newValue: any, fieldName: string) => {
    this.setState({ [fieldName]: newValue });
  }

  state: NewEventState = {
    isCreating: false,
    subject: '',
    toRecipient: '',
    body: '',
    attachment:'',
    disableCreate: this.disableCreate,
    updateValue: this.onStateValueChange
  };

  render() {
    return (
      

<NewEventState.Provider value={this.state}>
<RootStack.Navigator initialRouteName="thumb">
     <RootStack.Screen name="thumb" component={NewEventComponent}
           options={({navigation, route}) => ({
            headerShown:false              
            })}/>
            
    
</RootStack.Navigator>

</NewEventState.Provider>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom:10
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  formField: {
    backgroundColor: '#ffffff',
    borderColor:'#ffffff',
    borderRadius: 10,
    paddingBottom:30,
    paddingTop:10,
    paddingHorizontal:20,
    marginHorizontal:15,
    marginTop:10
  },
  fieldLabel: {
    fontWeight: '600',
    fontFamily: 'Segoe UI',
    padding:10
  },
  textInput: {
    borderColor: 'gray',
    paddingHorizontal: 10,
    fontSize:14,
    height:50,
    fontWeight:'600',
    fontFamily: 'Segoe UI',
  },
  textInputpa: {
    borderColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal:25,
    fontSize:14,
    marginTop:-15,
    height:60,
    fontWeight:'600',
    fontFamily: 'Segoe UI',

  },
  multiLineTextInput: {
    borderColor: 'gray',
    height: 180,
    paddingVertical: 10,
    paddingHorizontal:25,
    fontFamily: 'Segoe UI',
  },
  time: {
    paddingVertical: 10,
    color: '#000',
    alignSelf:'center'
  },
  date: {
    paddingVertical: 10,
    paddingHorizontal:5,
    color: '#000',
  },
  dateTime: {
    flexDirection: 'row'
  },
  Timerow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginLeft:25,
    paddingRight:10,
    marginTop:6
  },
  dateTimerow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop:10,
    marginLeft:15
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
   button: {
    justifyContent:'flex-end',
    flexDirection:'row',
    marginHorizontal:10,
    marginTop:10,
    
   },
});
// </NewEventScreenSnippet>
