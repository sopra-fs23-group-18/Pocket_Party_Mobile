/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { createContext } from 'react';
import {
  StyleSheet,
  useColorScheme,

} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JoinScreen } from './pages/JoinScreen';
import { ShakeScreen } from './pages/ShakeScreen';
import { TapScreen } from './pages/TapScreen';
import { WebRTCTestScreen } from './pages/WebRTCTestScreen';
import NameInputScreen from './pages/NameInputScreen';
import QRScanner from './pages/QRScanner';
import { WebSocketConnection } from './util/WebRTC';
import { getWsUrl } from './util/getDomain';
import { Client } from '@stomp/stompjs'
import WaitingScreen from './pages/WaitingScreen';

const Stack = createNativeStackNavigator();

type WebSocketContextType = {
  signalingConnection: WebSocketConnection,
  stompConnection: Client
}
export const WebSocketContext = createContext(null as unknown as WebSocketContextType);


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <WebSocketContext.Provider value={{
      signalingConnection: new WebSocketConnection(getWsUrl() + "/socket"), stompConnection: new Client({
        brokerURL: getWsUrl() + "/game",
        forceBinaryWSFrames: true,
        appendMissingNULLonIncoming: true
      })
    }}>
      <NavigationContainer >
        <Stack.Navigator initialRouteName="Join" screenOptions={{
          headerShown: false,
        }}>
          <Stack.Screen name="Join" component={JoinScreen} />
          <Stack.Screen name="Shake" component={ShakeScreen} />
          <Stack.Screen name="Tap" component={TapScreen} />
          <Stack.Screen name="WebRTC" component={WebRTCTestScreen} />
          <Stack.Screen name="QRScanner" component={QRScanner} />
          <Stack.Screen name="NameInputScreen" component={NameInputScreen} />
          <Stack.Screen name="WaitingScreen" component={WaitingScreen} />
        </Stack.Navigator>
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
