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
import { createStackNavigator,HeaderBackButton } from '@react-navigation/stack';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import moment from 'moment-timezone';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../UserContext';
import { GraphManager } from '../graph/GraphManager';
import { TextInput } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Stack = createStackNavigator();
const NewEventState = React.createContext<NewEventState>({
  isCreating: false,
  subject: '',
  attendees: '',
  body: '',
  timeZone: '',
  startDate: new Date(),
  endDate: new Date(),
  disableCreate: () => { return true },
  updateValue: () => {}
});

type NewEventState = {
  isCreating: boolean;
  subject: string;
  attendees: string;
  body: string;
  timeZone: string;
  startDate: Date;
  endDate: Date;
  disableCreate: () => boolean;
  updateValue: (newValue: string | Date | boolean, fieldName: string) => void;
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
const DateTimeInput = (props: DateTimeInputProps) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(Platform.OS === 'ios');

  return (
    <View style={Platform.OS === 'android' ? styles.dateTime : null}>
      { Platform.OS === 'android' &&
      <View style={styles.dateTimerow}>
        <Image source={require('../images/calendar.png')}
                    style={{ height: 20, width: 20,margin:10}} />
        <Text
          style={styles.date}
          onPress={()=>{setShowDatePicker(true)}}>
          {formatDate(props.value)}
        </Text>
        </View>
      }
      { showDatePicker &&
        Platform.OS === 'android' &&
        <DateTimePicker
          mode='date'
          value={props.value}
          onChange={(e:any, d:any) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (d)
              props.onChange(e,d);
          }}
          />
      }
      { Platform.OS === 'android' &&
      <View style={styles.Timerow}>
      <Image source={require('../images/clock.png')}
                  style={{ height: 15, width: 15,marginVertical:15,marginHorizontal:10}} />
        <Text
          style={styles.time}
          onPress={()=>{setShowTimePicker(true)}}>
          {formatTime(props.value)}
        </Text>
        </View>
      }
      { showTimePicker &&
        <DateTimePicker
          mode={Platform.OS === 'ios' ? 'datetime' : 'time'}
          value={props.value}
          onChange={(e:any, d:any) => {
            setShowTimePicker(Platform.OS === 'ios');
            if (d)
              props.onChange(e,d);
          }}
          />
      }
      
    </View>
  )
}

const NewEventComponent = () => {
  const newEventState = React.useContext(NewEventState);
  const navigation = useNavigation();
  const createEvent = async () => {
    newEventState.updateValue(true, 'isCreating');

    // Create a new Event object with the
    // required fields
    const newEvent: MicrosoftGraph.Event = {
      subject: newEventState.subject,
      start: {
        dateTime: moment(newEventState.startDate).format('YYYY-MM-DDTHH:mm:ss'),
        timeZone: newEventState.timeZone
      },
      end: {
        dateTime: moment(newEventState.endDate).format('YYYY-MM-DDTHH:mm:ss'),
        timeZone: newEventState.timeZone
      }
    };

    // Only add attendees if the user specified them
    if (newEventState.attendees.length > 0) {
      newEvent.attendees = [];

      // Value should be a ;-delimited list of email addresses
      // NOTE: The app does no validation of this
      const emails = newEventState.attendees.split(';')

      emails.forEach((email) => {
        newEvent.attendees!.push({
          emailAddress: { address: email }
        });
      });
    }

    // Only add body if the user specified one
    if (newEventState.body.length > 0) {
      newEvent.body = {
        content: newEventState.body,
        // For simplicity, add it as a plain-text body
        contentType: 'text'
      };
    }

    await GraphManager.createEvent(newEvent);

    Alert.alert('Success',
      'Event created',
      [
        {
          text: 'OK',
          onPress: () => {
            newEventState.updateValue(false, 'isCreating');
          }
        }
      ]
    );
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
                <Text style={{fontFamily:'Segoe UI',flex:1,marginTop:2, padding: 10,color:'#000',fontSize:22,justifyContent:'flex-start',fontWeight:'600'}}>New Event</Text>

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
        <View style={styles.dateTime}>
        <Image source={require('../images/pencil.png')}
                    style={{ height: 15, width: 15,marginTop:15,marginRight:5}} />
          <TextInput style={styles.textInput}
            multiline={true}
            placeholder='Title'
            placeholderTextColor='#000'
            value={newEventState.subject}
            onChangeText={(text) => newEventState.updateValue(text, 'subject')} />
            </View>
        </View>

        <View style={styles.formField}>
          <View style={styles.dateTime}>
          <Image source={require('../images/clock.png')}
                    style={{ height: 20, width: 20,marginTop:10,marginRight:5}} />
          <Text style={styles.fieldLabel}>Event Time</Text>
          </View>
          <DateTimeInput
            value={newEventState.startDate}
            onChange={(e, date) => newEventState.updateValue(date!, 'startDate')} />
            <View>
            <DateTimeInput
            value={newEventState.endDate}
            onChange={(e, date) => newEventState.updateValue(date!, 'endDate')} />
            </View>
        </View>
       
        <View style={styles.formField}>
        <View style={styles.dateTime}>
          <Image source={require('../images/group.png')}
                    style={{ height: 20, width: 20,marginTop:10}} />
          <Text style={styles.fieldLabel}>Add Participants</Text>
          </View>
          <TextInput style={styles.textInputpa}
           multiline={true}
            placeholder="Email (separate multiple with ';')"
            value={newEventState.attendees}
            onChangeText={(text) => newEventState.updateValue(text, 'attendees')} />
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
        
    </ScrollView>
    </View>
  );
}

const formatTime = (dateTime: Date): string => {
  return moment(dateTime).format('h:mm A');
}

const formatDate = (dateTime: Date): string => {
  return moment(dateTime).format('MMM D, YYYY');
}

// When first loading the form, set the start time
// to the nearest hour or half-hour
const getDefaultStart = (): Date => {
  const now = moment().startOf('minute');
  const offset = 30 - (now.minute() % 30);

  return now.add(offset, 'minutes').toDate();
}

// When first loading the form, set the end time
// to start + 30 min
const getDefaultEnd = (): Date => {
  return moment(getDefaultStart()).add(30, 'minutes').toDate();
}

export default class NewEventScreen extends React.Component {
  static contextType = UserContext;

  // Disable the create button if:
  // - App is waiting for the result of create request
  // - Subject is empty
  // - Start time is after end time
  disableCreate = () => {
    return this.state.isCreating ||
      this.state.subject.length <= 0 ||
      moment(this.state.startDate).isAfter(this.state.endDate);
  }

  onStateValueChange = (newValue: string | Date | boolean, fieldName: string) => {
    this.setState({ [fieldName]: newValue });
  }

  state: NewEventState = {
    isCreating: false,
    subject: '',
    attendees: '',
    body: '',
    timeZone: this.context.userTimeZone,
    startDate: getDefaultStart(),
    endDate: getDefaultEnd(),
    disableCreate: this.disableCreate,
    updateValue: this.onStateValueChange
  };

  render() {
    return (
      <NewEventState.Provider value={this.state}>
        <Stack.Navigator>
          <Stack.Screen name='NewEvent'
            component={ NewEventComponent }
            options={({navigation, route}) => ({
              headerShown:false
             })} />
        </Stack.Navigator>
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
