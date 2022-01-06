// Copyright (c) Microsoft.
// Licensed under the MIT license.

// <NewEventScreenSnippet>
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
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
import { AuthManager } from '../auth/AuthManager';
import SwipeablePanel from 'rn-swipeable-panel';

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
  userPhoto:'',
  userName:'',
  swipeablePanelActive: false,
  disableCreate: () => { return true },
  updateValue: () => {}
});

type NewEventState = {
  isCreating: boolean;
  subject: string;
  toRecipient: string;
  body: string;
  userPhoto: string;
  userName:string;
  swipeablePanelActive: false;
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
      subject: newEventState.subject,
      

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
      message.body = {
        content: newEventState.body,
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
      Alert.alert(error,
      'Error',
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
                <Text style={{fontFamily:'Segoe UI',flex:1,marginTop:2, padding: 10,color:'#000',fontSize:22,justifyContent:'flex-start',fontWeight:'700'}}>Share Post</Text>

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
       <ScrollView style={{backgroundColor:'#fff',marginTop:2}}>
  
        <View style={styles.formField}>
        <View style={styles.dateTime}>
          <Image source={{uri:newEventState.userPhoto!}}
                    style={{  width: 40,height: 40, borderRadius: 100 / 2,}} />
          <Text style={styles.fieldLabel}>{newEventState.userName}</Text>
          </View>
          <TextInput style={styles.textInputpa}
           multiline={true}
           defaultValue={newEventState.toRecipient}
            placeholder="Email (separate multiple with ';')"
            value={newEventState.toRecipient}
            onChangeText={(text) => newEventState.updateValue(text, 'toRecipient')} />
        </View>
        
        
        
    </ScrollView>
    </View>
  );
}



export default class NewEventScreen extends React.Component<Props> {
  static contextType = UserContext;
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
    userPhoto:'',
    userName:'',
    swipeablePanelActive: false,
    disableCreate: this.disableCreate,
    updateValue: this.onStateValueChange
  };
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

  async componentDidMount() {
   // const{upn}=this.props.route.params;

    try {
      const user: MicrosoftGraph.User = await GraphManager.getUserAsync();
      this.getphoto();
      this.setState({
       // toRecipient:upn,
        userName:user.displayName!,
        
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
    marginBottom:10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  formField: {
    flex:1,
    backgroundColor: '#ffffff',
    borderColor:'#ffffff',
    paddingBottom:30,
    paddingTop:10,
    paddingHorizontal:20,
    marginTop:10,
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
    paddingVertical: 5,
    paddingHorizontal:25,
    fontSize:14,
    marginTop:-15,
    fontWeight:'600',
    fontFamily: 'Segoe UI',
    height:'100%',
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
    justifyContent:'center',marginVertical:10,
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
