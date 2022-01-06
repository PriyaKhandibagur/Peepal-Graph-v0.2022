import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HeaderBackButton } from '@react-navigation/stack';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DrawerMenuScreen from '../screens/DrawerMenuScreen';
import TabDriveItemsScreen from '../screens/DriveAllItemsScreen';
import TasksListScreen from '../screens/PGTVNavigationScreen';
import MyNetworkPeopleScreen from '../screens/SearchNavigationScreen';
import ToDoTasksTabScreen from '../screens/SharePostScreen';
import { ParamListBase,  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {
  Image,
} from 'react-native';
import { createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  
  return (
    <Tab.Navigator
    initialRouteName="Peepal Graph"
      tabBarOptions={{
        tabStyle: {
            paddingVertical: 5
        },
        activeTintColor: '#5F259F',
        
      }}
      
    >
      <Tab.Screen
        name="Peepal Graph"
        component={DrawerMenuScreen}
        
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" color={color} size={size} />
           
          ),
         
        }}
      />
       <Tab.Screen
        name="My Network"
        component={MyNetworkPeopleScreen}
        
        options={{
          tabBarLabel: 'My Network',
          tabBarVisible:false,
          tabBarIcon: ({ color, size}) => (
            <MaterialCommunityIcons  name="account-group" color={color} size={size} />
                     ),
      //    tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="Post"
        component={ToDoTasksTabScreen}
        options={({navigation, route}) => ({
          headerShown:false,
          headerStyle: {
            backgroundColor: '#5F259F'
         },
         headerTitleStyle: {
          color:'white',
        },navigationOptions:  {
          tabBarVisible: false,
        },
          headerLeft: (props:any) => (
            <HeaderBackButton
              {...props}
              tintColor={'white'}
              onPress={() => navigation.navigate('Home')}
            />
          ),
          tabBarLabel: 'Post',
          tabBarVisible:false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons  name="plus-circle" color={color} size={size} />
          ),
        })}
      />
     
      <Tab.Screen
        name="PGTV"
        component={TasksListScreen}
        options={{
          tabBarLabel: 'PGTV',
          tabBarVisible:false,
          tabBarIcon: ({ color, size }) => (
            // <MaterialCommunityIcons  name="microsoft-teams" color={color} size={size} />
            <MaterialCommunityIcons  name="youtube-tv" color={color} size={size} />

          ),
        }}
      />
       <Tab.Screen
        name="Library"
        component={TabDriveItemsScreen}
        options={({navigation, route}) => ({
          headerShown:true,
          headerStyle: {
            backgroundColor: '#5F259F'
         },
         headerTitleStyle: {
          color:'white',
        },navigationOptions:  {
          tabBarVisible: false,
        },
          headerLeft: (props:any) => (
            <HeaderBackButton
              {...props}
              tintColor={'white'}
              onPress={() => navigation.navigate('Home')}
            />
          ),
          tabBarLabel: 'Library',
          tabBarVisible:false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome  name="folder" color={color} size={20} />

          ),
        })}
      />
     
    </Tab.Navigator>
  );
}
// const getHeaderTitle = (route:any) => {
//   const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

//   switch (routeName) {
//     case 'Peepal Graph':
//       return 'Peepal Graph';
//     case 'My Network':
//       return 'My Network';
//     case 'Library':
//       return 'Library';
//   }
// };

export default App;