/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { createContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  useColorScheme,

} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JoinScreen } from './components/pages/JoinScreen';
import { ShakeScreen } from './components/pages/ShakeScreen';
import { TapScreen } from './components/pages/TapScreen';
import { WebRTCTestScreen } from './components/pages/WebRTCTestScreen';
import NameInputScreen from './components/pages/NameInputScreen';
import { QRScanner } from './components/pages/QRScanner';
import { WebSocketConnection } from './util/WebRTC';
import { getWsUrl } from './util/getDomain';
import { Client } from '@stomp/stompjs'
import WaitingScreen from './components/pages/WaitingScreen';
import { AppNavigation } from './components/navigation/AppNavigation';

const Stack = createNativeStackNavigator();

type WebSocketContextType = {
  stompConnection: Client
}
export const WebSocketContext = createContext(null as unknown as WebSocketContextType);


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [connections, setConnections] = useState({
    stompConnection: new Client({
      heartbeatOutgoing: 1000,
      brokerURL: getWsUrl() + "/game",
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true
    })
  })

  useEffect(() => {
     //Here we activate the stomp connection only needed to call once.
     connections.stompConnection.activate();
  }, [])
  
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <WebSocketContext.Provider value={connections}>
      <NavigationContainer >
        <AppNavigation/>
      </NavigationContainer >
    </WebSocketContext.Provider >

  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
