// Copyright (c) Microsoft.
// Licensed under the MIT license.

import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,TouchableOpacity,Image,
  View,
} from 'react-native';
import { createStackNavigator,HeaderBackButton } from '@react-navigation/stack';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import moment from 'moment-timezone';
import { findOneIana } from 'windows-iana';
import { UserContext } from '../UserContext';
import { GraphManager } from '../graph/GraphManager';
import NewEventScreen from '../screens/NewEventScreen';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();
const CalendarState = React.createContext<CalendarScreenState>({
  loadingEvents: true,
  events: []
});

type CalendarScreenState = {
  loadingEvents: boolean;
  events: MicrosoftGraph.Event[];
}
type RootStackParamList = {
  Calendar: undefined;
  NewEvent: undefined;
};

const CalendarComponent = () => {
  const calendarState = React.useContext(CalendarState);
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Modal visible={calendarState.loadingEvents}>
        <View style={styles.loading}>
          <ActivityIndicator
            color={Platform.OS === 'android' ? '#276b80' : undefined}
            animating={calendarState.loadingEvents}
            size='large' />
        </View>
      </Modal>
      <FlatList data={calendarState.events}
        renderItem={({item}) =>
          <View style={styles.eventItem}>
            <Text style={styles.eventSubject}>{item.subject}</Text>
            <Text style={styles.eventDuration}>
              {convertDateTime(item.start!.dateTime!)} - {convertDate(item.end!.dateTime!)}
            </Text>
          </View>
        } />
         <TouchableOpacity activeOpacity={0.5} onPress={() => {
          navigation.navigate('NewEvent');
        }} style={styles.TouchableOpacityStyle} >
 
 <Image source={require('../images/plus_float.png')} 
 
        style={styles.FloatingButtonStyle} />

</TouchableOpacity>
    </View>
  );
}

// <ConvertDateSnippet>
const convertDateTime = (dateTime: string): string => {
  return moment(dateTime).format('MMM Do   H:mm a');
};
const convertDate = (dateTime: string): string => {
  return moment(dateTime).format('H:mm a');
};
// </ConvertDateSnippet>

export default class CalendarScreen extends React.Component {
  static contextType = UserContext;

  state: CalendarScreenState = {
    loadingEvents: true,
    events: []
  };

  async componentDidMount() {
    try {
      const tz = this.context.userTimeZone || 'UTC';
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

      this.setState({
        loadingEvents: false,
        events: events.value
      });
    } catch(error) {
      Alert.alert(
        'Error getting events',
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

  render() {
    return (
      <CalendarState.Provider value={this.state}>
        <Stack.Navigator>
          <Stack.Screen name='Calendar'
            component={ CalendarComponent }
            options={({navigation, route}) => ({
              headerStyle: {
                backgroundColor: '#fff'
             },
             headerTitle:'Calendar',
             headerTitleStyle: {
              color:'black',
              
            },navigationOptions:  {
              tabBarVisible: false,
            },
              headerLeft: (props) => (
                <HeaderBackButton
                  {...props}
                  tintColor={'black'}
                  onPress={() => navigation.goBack(null)}
                />
              ),})} />

<Stack.Screen name='NewEvent'
            component={ NewEventScreen }
            options={({navigation, route}) => ({
              headerShown:false
             })} />

        </Stack.Navigator>
      </CalendarState.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#efefef'
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  eventItem: {
    paddingVertical: 10,
    paddingHorizontal:20,
    marginTop:5,
    backgroundColor:'#ffffff'
  },
  eventSubject: {
    fontWeight: '600',
    fontSize: 16
  },
  eventOrganizer: {
    fontWeight: '200'
  },
  eventDuration: {
    fontWeight: '400'
  },
  TouchableOpacityStyle:{
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    bottom: 20,
    right: 10,
    height: 60,
    backgroundColor: '#5F259F',
    borderRadius: 100,
  },
 
  FloatingButtonStyle: {
 
    resizeMode: 'contain',
    width: 30,
    height: 30,
  }
});
