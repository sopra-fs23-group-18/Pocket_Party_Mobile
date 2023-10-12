import {useContext, useEffect} from 'react';
import {
  Vector3,
  listenForNavigationInput,
  stopInputReading,
} from '../../util/InputHandler';
import {WebSocketContext} from '../../App';
import {Input, InputType} from '../../types/Input';
import {Text, View} from 'react-native';
import React from 'react';
import {
  AppState,
  AppStateContext,
  PlayerContext,
} from '../navigation/AppNavigation';
import {ActivationState} from '@stomp/stompjs';

export const PushDownScreen = (): JSX.Element => {
  const connections = useContext(WebSocketContext);
  const playerContext = useContext(PlayerContext);
  const appContext = useContext(AppStateContext);

  useEffect(() => {
    const onInput = (vec: Vector3) => {
      const input: Input = {
        inputType: InputType.PONG,
        rawData: vec,
      };
      connections.stompConnection.publish({
        destination: `/lobbies/${playerContext.player.lobbyId}/players/${playerContext.player.id}/input`,
        body: JSON.stringify(input),
      });
    };

    const onReceive = (msg: any) => {
      const data = JSON.parse(msg.body);
      if (data.signal === 'STOP') {
        appContext.setAppState(AppState.WAITING);
      }
    };

    if (connections.stompConnection.state === ActivationState.ACTIVE) {
      connections.stompConnection.subscribe(
        `/topic/players/${playerContext.player.id}/signal`,
        onReceive,
      );
    }

    connections.stompConnection.onConnect = _ => {
      connections.stompConnection.subscribe(
        `/topic/players/${playerContext.player.id}/signal`,
        onReceive,
      );
    };

    listenForNavigationInput(onInput);

    return () => {
      stopInputReading();
    };
  }, [connections, playerContext, appContext]);

  return (
    <View>
      <Text>PushDown Screen</Text>
    </View>
  );
};
