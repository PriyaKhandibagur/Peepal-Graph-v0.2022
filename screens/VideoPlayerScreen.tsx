// Copyright (c) Microsoft.
// Licensed under the MIT license.

// <HomeScreenSnippet>
import React,{useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,Dimensions,
  View,
} from 'react-native';
import { createStackNavigator,StackNavigationProp,HeaderBackButton } from '@react-navigation/stack';
import Video, { FilterType } from 'react-native-video';
import { UserContext } from '../UserContext';
import { RouteProp } from '@react-navigation/native';
import VideoPlayer from 'react-native-video-player';

const RootStack = createStackNavigator<RootStackParamList>();

const { width } = Dimensions.get('window');

const DriveItemsState = React.createContext<HomeScreenState>({
  url:'',
  name:''
});

type HomeScreenState = {
  url:string,
  name:string
}
type RootStackParamList = {
  thumb: undefined;

  video: { url: string,name:string };
 
 
};

type GroupScreenRouteProp = RouteProp<RootStackParamList, 'video'>;

type GroupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'video'
>;
type Props = {
  route: GroupScreenRouteProp;
  navigation: GroupScreenNavigationProp;
};
const HomeComponent = () => {
  const homeState = React.useContext(DriveItemsState);
  const [filterType,setFilterType]=useState(FilterType.NONE);

  console.log('videourlll ',homeState.url)
  return (
    <View style={styles.container}>
     {/* <VideoPlayer
      endWithThumbnail
    video={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}}
    style={styles.backgroundVideo}

    thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
/> */}
      <Video 
      controls
      filter={filterType}
      filterEnable={true}
      source={{uri:homeState.url!}}
      style={styles.backgroundVideo}
      // Can be a URL or a local file.
        />
    </View>
  );
}

export default class HomeScreen extends React.Component <Props>{
  static contextType = UserContext;
  //const [filterType, setFilterType] = React.useState(FilterType);

  state: HomeScreenState = {
    url:'',
    name:''
  };

  async componentDidMount() {
    const {url,name}=this.props.route.params;
    console.log('urlllllll2222 ',url)
      this.setState({
       url:url,
       name:name
      });
    
  }
  render() {
    return (
      <DriveItemsState.Provider value={this.state}>
      <RootStack.Navigator initialRouteName="thumb">
           <RootStack.Screen name="thumb" component={HomeComponent}
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
                      onPress={() => navigation.goBack(null)}
                    />
                  ),
                                 
  
                  })}/>
         
   </RootStack.Navigator>

    </DriveItemsState.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#000'
    
  },
  backgroundVideo: {
    height: '100%',
    width:width
    
  },
});
// </HomeScreenSnippet>
