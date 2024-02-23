import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {createContext, useContext, useEffect, useState} from 'react';
import Player from '../../models/Player';
// import {PeerConnection} from '../../util/WebRTC';
import {JoinScreen} from '../pages/JoinScreen';
import NameInputScreen from '../pages/NameInputScreen';
import {QRScanner} from '../pages/QRScanner';
import {ShakeScreen} from '../pages/ShakeScreen';
import {TapScreen} from '../pages/TapScreen';
import {VibrationScreen} from '../pages/VibrationScreen';
// import {PongScreen} from '../pages/PongScreen';
import WaitingScreen from '../pages/WaitingScreen';
import {RPSScreen} from '../pages/RPSScreen';
import {StrategyScreen} from '../pages/StrategyScreen';
import App, {WebSocketContext} from '../../App';
import {PushDownScreen} from '../pages/PushDown';
import { PongScreen } from '../pages/PongScreen';

const Stack = createNativeStackNavigator();

export enum AppState {
    SHAKE,
    TAP,
    VIBRATION,
    PONG,
    RPS,
    STRATEGY,
    NOT_JOINED,
    WAITING,
    IN_GAME,
}

type AppStateContextType = {
    appState: AppState,
    setAppState: React.Dispatch<React.SetStateAction<AppState>>
}

type PlayerConextType = {
    player: Player,
    setPlayer: React.Dispatch<React.SetStateAction<Player>>
}

type PeerConnectionContextType = {
    peerConnection: PeerConnection,
    setPeerConnection: React.Dispatch<React.SetStateAction<PeerConnection>>
}

export const AppStateContext = createContext(null as unknown as AppStateContextType);
export const PlayerContext = createContext(null as unknown as PlayerConextType);

export const AppNavigation = (): JSX.Element => {
    const [appState, setAppState] = useState(AppState.NOT_JOINED);

    //TODO maybe persist player information
    const [player, setPlayer] = useState(null as unknown as Player);
    const connections = useContext(WebSocketContext);

  useEffect(() => {
    connections.stompConnection.onWebSocketClose = () => {
      console.log('Disconnected');

      setAppState(AppState.NOT_JOINED);
    };
  }, [connections]);
  const renderStack = (appState: AppState) => {
    switch (appState) {
      case AppState.NOT_JOINED:
        return (
          <>
            <Stack.Screen name="Join" component={JoinScreen} />
            <Stack.Screen name="QRScanner" component={QRScanner} />
            <Stack.Screen name="NameInputScreen" component={NameInputScreen} />
          </>
        );
      case AppState.SHAKE:
        return (
          <>
            <Stack.Screen name="Shake" component={ShakeScreen} />
          </>
        );
      case AppState.VIBRATION:
        return (
          <>
            <Stack.Screen name="Vibration" component={VibrationScreen} />
          </>
        );
      case AppState.TAP:
        return (
          <>
            <Stack.Screen name="Tap" component={TapScreen} />
          </>
        );
      case AppState.PONG:
        return (
          <>
            <Stack.Screen name="Pong" component={PongScreen} />
          </>
        );
      case AppState.RPS:
        return (
          <>
            <Stack.Screen name="RPS" component={RPSScreen} />
          </>
        );
      case AppState.STRATEGY:
        return (
          <>
            <Stack.Screen name="Strategy" component={StrategyScreen} />
          </>
        );
      case AppState.WAITING:
        return (
          <>
            <Stack.Screen name="WaitingScreen" component={WaitingScreen} />
          </>
        );
      default:
        break;
    }
  };

    return (
        <AppStateContext.Provider value={{ appState, setAppState }}>
                <PlayerContext.Provider value={{ player, setPlayer }}>
                    <Stack.Navigator screenOptions={{
                        headerShown: false,
                    }}>
                        {renderStack(appState)}
                    </Stack.Navigator>
                </PlayerContext.Provider>
        </AppStateContext.Provider>
    );
}
