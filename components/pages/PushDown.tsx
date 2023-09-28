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

export const PushDownScreen = (): JSX.Element => {
  const connections = useContext(WebSocketContext);

  useEffect(() => {
    const onInput = (vec: Vector3) => {
      const input: Input = {
        inputType: InputType.PONG,
        rawData: vec,
      };
      connections.stompConnection.publish({
        destination: '/lobbies/0/players/2/input',
        body: JSON.stringify(input),
      });
    };

    listenForNavigationInput(onInput);

    return () => {
      stopInputReading();
    };
  }, [connections]);

  return (
    <View>
      <Text>PushDown Screen</Text>
    </View>
  );
};
