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
  Text,
  Image,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createStackNavigator,StackNavigationProp,HeaderBackButton } from '@react-navigation/stack';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import moment from 'moment-timezone';
import { RouteProp } from '@react-navigation/native';
import ProfileScreen from '../screens/ProfileScreen';
import { UserContext } from '../UserContext';
import { GraphManager } from '../graph/GraphManager';
import { TextInput } from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';

const Stack = createStackNavigator();
const RootStack = createStackNavigator<RootStackParamList>();

type RootStackParamList = {
  Contact: undefined;
  Profile:undefined;
  GroupScreenId: { mobileNumber:string};
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
  mobilePhone: '',
  startDate: new Date(),
  officelocation:'',
//  mobilepropval:'',
  disableCreate: () => { return true },
  updateValue: () => {}
});

type NewEventState = {
  isCreating: boolean;
  mobilePhone: string;
  startDate: Date;
  officelocation:string;
 // birthday:Date,
//  mobilepropval:string;
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

  return (
    <View style={Platform.OS === 'android' ? styles.dateTime : null}>
     { Platform.OS === 'android' &&
        <Text
          style={styles.date}
          onPress={()=>{setShowDatePicker(true)}}>
          {formatDate(props.value)}
        </Text>
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
    </View>
  )
}



const NewEventComponent = ({route,navigation}:Props)=> {
  const newEventState = React.useContext(NewEventState);
 // const{upn}=route.params;
 // console.log(newEventState.mobilePhone+moment(newEventState.startDate).format('YYYY-MM-DDT00:00:00Z'))
  
  const createEvent = async () => {
    newEventState.updateValue(true, 'isCreating');

    // Create a new Event object with the
    // required fields
    const newEvent: MicrosoftGraph.User = {
      mobilePhone: newEventState.mobilePhone,
    //  hireDate: moment(newEventState.startDate).format('YYYY-MM-DDT00:00:00Z'),
    //  officeLocation:'R R Nagar'
    //  birthday: moment(newEventState.birthday).format('YYYY-MM-DDTHH:mm:ss')
       
     
    };
    console.log(newEventState.mobilePhone+moment(newEventState.startDate).format('YYYY-MM-DDT00:00:00Z'))

    try{
    await GraphManager.UpdateUserDetailsAsync(newEvent);
    console.log(newEvent)

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

  return (
    <View style={styles.loading}>
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
                <Text style={{fontFamily:'Segoe UI',flex:1,marginTop:2, padding: 10,color:'#000',fontSize:22,justifyContent:'flex-start',fontWeight:'600'}}>Contact</Text>

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
      <Modal visible={newEventState.isCreating}>
        <View style={styles.loading}>
          <ActivityIndicator
            color={Platform.OS === 'android' ? '#276b80' : undefined}
            animating={newEventState.isCreating}
            size='large' />
        </View>
      </Modal>
        
      <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Mobile</Text>
          <TextInput style={styles.textInput}
            multiline={true}
            textAlignVertical='top'
            defaultValue={newEventState.mobilePhone}
           // placeholder={newEventState.mobilepropval}
            value={newEventState.mobilePhone}
            onChangeText={(text) => newEventState.updateValue(text, 'mobilePhone')} />

          

        </View>
        
    </ScrollView>

  </View>
    
  );
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

export default class NewEventScreen extends React.Component<Props> {
  static contextType = UserContext;
  
  // Disable the create button if:
  // - App is waiting for the result of create request
  // - Subject is empty
  // - Start time is after end time
  
  async componentDidMount() {
    const{mobileNumber}=this.props.route.params;

    try {
     
      this.setState({
        mobilePhone:mobileNumber
        
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
    return this.state.isCreating ||
      this.state.mobilePhone.length <= 0 
  }
  onStateValueChange = (newValue: string | Date | boolean, fieldName: string) => {

    this.setState({ [fieldName]: newValue });
   // this.setState({mobilepropval:mobileNumber})
   // console.log(this.state.mobilepropval)
  }

  state: NewEventState = {
    isCreating: false,
    mobilePhone: '',
    startDate:getDefaultStart(),
    officelocation:'',
  //  birthday:getDefaultStart(),
  //  mobilepropval:'',
    disableCreate: this.disableCreate,
    updateValue: this.onStateValueChange
  };
 
  render() {
    return (
      <NewEventState.Provider value={this.state}>
         <RootStack.Navigator initialRouteName="Contact">
  <RootStack.Screen name="Contact" component={NewEventComponent}
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
    flex: 1,
  },
  formField: {
    backgroundColor: '#ffffff',
    borderColor:'#ffffff',
    borderRadius: 10,
    paddingBottom:40,
    paddingTop:10,
    paddingHorizontal:20,
    marginHorizontal:20,
    marginTop:20
  },
  fieldLabel: {
    fontWeight: '600',
    marginTop: 20,
    marginBottom:10,
    fontSize:14,
  },
  textInput: {
    height: 40,
    padding: 10,
    borderColor: '#9e9e9e',
    borderWidth: 2,
    borderRadius:5,
    justifyContent:'center',
    alignContent:'center',
    color: '#303030',
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
    height: 40,
    padding: 10,
    justifyContent:'center',
    alignContent:'stretch',
    alignItems:'stretch',
    color: '#303030',
    
  },
  dateTime: {
    
  },
  button: {
    justifyContent:'flex-end',
    flexDirection:'row',
    marginHorizontal:10,
    marginTop:10,
    
   },
   SectionStyle: {
    flexDirection: 'row',
  
    backgroundColor: '#fff',
    borderColor: '#9e9e9e',
    borderWidth: 2,
    borderRadius:5,
    height: 40,
},
ImageStyle: {
  height: 20,
  width: 20,
alignSelf:'center',
marginRight:10
},
iconview: {
  flex:1,
  flexDirection: 'row-reverse',
  
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
