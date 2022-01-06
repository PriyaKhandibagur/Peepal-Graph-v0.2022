// Copyright (c) Microsoft.
// Licensed under the MIT license.

import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,TouchableOpacity,
  Text,TextInput,
  Image,
  useWindowDimensions,
  View,
  Dimensions,
} from 'react-native';
import { createStackNavigator,StackNavigationProp,HeaderBackButton } from '@react-navigation/stack';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { GraphManager } from '../graph/GraphManager';
import { useNavigation } from '@react-navigation/native';
import RenderHtml  from "react-native-render-html";
import HTML from 'react-native-render-html';
import { NavigationContainer,ParamListBase } from '@react-navigation/native';
import { Value } from 'react-native-reanimated';
import { RouteProp } from '@react-navigation/native';
import { UserContext } from '../UserContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RootStack = createStackNavigator<RootStackParamList>();

const Stack = createStackNavigator();


const PeopleState = React.createContext<PeopleScreenState>({
  loadingPeople: true,
  messageslist:[],
  upn:'',
  channelid:'',
  name:'',
  posttext:'',
  updateValue: () => {}
});

type RootStackParamList = {
  GroupScreen: undefined;

  GroupDetailScreen: { upn: string,channelid:string,name:string};
};
type GroupScreenRouteProp = RouteProp<RootStackParamList, 'GroupDetailScreen'>;

type GroupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GroupDetailScreen'
>;
type Props = {
  route: GroupScreenRouteProp;
  navigation: GroupScreenNavigationProp;
};
type PeopleScreenState = {
  loadingPeople: boolean;
  messageslist:MicrosoftGraph.Message[];
  upn:'';
  channelid:string;
  name:string;
  posttext:string;
  updateValue: (newValue: any, fieldName: string) => void;
}
// const state:PeopleScreenState={
//   loadingPeople: true,
//   messageslist:[],
//   upn:'',
//   name:'',
//   updateValue: this.onStateValueChange

// }

const PeopleComponent = () => {

  const peopleState = React.useContext(PeopleState);
  const navigation = useNavigation();
  // const contentWidth = useWindowDimensions().width;
  const { width } = useWindowDimensions();

  const createEvent = async () => {
    peopleState.updateValue(true, 'isCreating');

    // Create a new Event object with the
    // required fields
    const newEvent: MicrosoftGraph.ChatMessage = {
      
    };

   
    if (peopleState.posttext.length > 0) {
      newEvent.body = {
        content: peopleState.posttext,
        // For simplicity, add it as a plain-text body
        
      };
    }
    await GraphManager.postTeamPostsAsync(newEvent,peopleState.upn,peopleState.channelid);
    peopleState.updateValue('', 'posttext')
    try {
      const recent_files = await GraphManager.getTeamPostsAsync(peopleState.upn,peopleState.channelid);
     console.log('enteringggg')
     
     peopleState.updateValue(recent_files.value,'messageslist') 

    //  console.log('recent_files',this.state.messageslist.length)
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
    return(
      
      <View style={styles.container}>
        
        <Modal visible={peopleState.loadingPeople}>
          <View style={styles.loading}>
            <ActivityIndicator
              color={Platform.OS === 'android' ? '#276b80' : undefined}
              animating={peopleState.loadingPeople}
              size='large' />
          </View>
        </Modal>

        <FlatList data={peopleState.messageslist}
          renderItem={({item}:any) =>
          
            <View style={styles.horizontalview}>
              <Image source={require('../images/avatarmale.png')}
                style={{ height: 25, width: 25}} />
              <View style={styles.peopleItem}>
              <Text>{item.from?.user.displayName!}</Text>
              <RenderHtml
      contentWidth={width}
      
      source={ {
        html: item.body?.content
      }}
      renderersProps={renderersProps}

    />


   </View>
            </View>
            
          }
      />           
<View style={{borderWidth: 1,flexDirection:'row',backgroundColor:'#fafafa',alignContent:'center',alignItems:'center'}}>
<TextInput placeholder="Type a new message"
 multiline={true} 
 numberOfLines={1}
 maxLength={1000} 
 value={peopleState.posttext}
 onChangeText={(text) => peopleState.updateValue(text, 'posttext')}
 style={{  backgroundColor: "#fafafa", textAlignVertical : "top" ,width:'90%',paddingHorizontal:10}} />
 <TouchableOpacity
                onPress={createEvent} >
              <Ionicons  name="send-sharp" color={'#000'} size={24} />
              </TouchableOpacity>    
              </View>
      </View>
    );
        
}
// const source = {
//   html: `
// <p style='text-align:center;'>
//   Hello World!
// </p>`
// };
const renderersProps = {
  img: {
    enableExperimentalPercentWidth: true
  }
};


export default class PeopleScreen extends React.Component<Props>{
  onStateValueChange = (newValue: string | Date | boolean, fieldName: string) => {
    this.setState({ [fieldName]: newValue });
  }
  state: PeopleScreenState = {
    loadingPeople: true,
    messageslist:[],
    upn:'',
    channelid:'',
    name:'',
    posttext:'',
    updateValue: this.onStateValueChange

  };

  async componentDidMount() {
    const{upn,channelid,name}=this.props.route.params;

    console.log('upnidsssss',upn +'  '+channelid);
   
      try {
        const recent_files = await GraphManager.getTeamPostsAsync(upn,channelid);
       console.log('enteringggg')
        this.setState({
          loadingPeople: false,
          messageslist: recent_files.value,
          name:name,
          upn:upn,
          channelid:channelid
        });
  
        console.log('recent_files',this.state.messageslist.length)
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
  
      }  }
  render() {
    return (
      <PeopleState.Provider value={this.state}>

<RootStack.Navigator initialRouteName="GroupScreen">
  <RootStack.Screen name="GroupScreen" component={PeopleComponent}
  options={({navigation, route}) => ({
    headerStyle: {
      backgroundColor: '#fff'
   },
   headerTitle:this.state.name,
   headerTitleStyle: {
    color:'black',
    
  },navigationOptions:  {
    tabBarVisible: false,
  },
    headerLeft: (props) => (
      <HeaderBackButton
        {...props}
        tintColor={'black'}
        onPress={() => navigation.goBack()}
      />
    ),})}
  />
  
</RootStack.Navigator>



       
      </PeopleState.Provider>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  horizontalview: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal:10,
    marginVertical: 1,
    marginHorizontal: 5,
  },
  peopleItem: {
    flexDirection: 'column',
    paddingHorizontal:10
  },
  peopleName: {
    fontWeight: '700',
    fontSize: 16
  },
  peopleEmail: {
    fontWeight: '200',
    fontSize:14
  }
  
});
