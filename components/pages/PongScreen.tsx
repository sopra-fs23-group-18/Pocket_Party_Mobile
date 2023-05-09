import { useEffect, useState, useContext } from 'react';
import { WebSocketContext } from '../../App';
import { AppState, AppStateContext, PlayerContext } from '../navigation/AppNavigation';
import { listenForPongInput, stopInputReading } from '../../util/InputHandler';
import { StyleSheet, Text, View } from "react-native";
import { PongGlyph } from "../ui/PongGlyph";
import { Input, InputType } from '../../types/Input';
import { ActivationState } from '@stomp/stompjs';

export const PongScreen = (): JSX.Element => {
  // transform the Pong input into a state
  // keep track of the state with a variable
  // update the state when the input changes
  // use the state to change the screen
  const connections = useContext(WebSocketContext);
    // const peerConnectionContext = useContext(PeerConnectionContext);
    const appContext = useContext(AppStateContext);
    const playerContext = useContext(PlayerContext);
  const [state, setState] = useState(0);
  let s = 0;
  const color: { [key: number]: string } = {
    0: "yellow",
    1: "green",
    "-1": "red",
  };
  const text: { [key: number]: string } = {
    0: "Stop",
    1: "Up",
    "-1": "Down",
  };
   
  const onReceive = (msg:any) => {
    const data = JSON.parse(msg.body);
    if(data.signal === "STOP"){
      appContext.setAppState(AppState.WAITING);
    }
  }

  const handlePongInput = (pongInput: number) => {
    console.log(`Received pong input: ${pongInput}`);
    s += pongInput;
    s = Math.max(-1, Math.min(1, s));
    setState(s);
    console.log(`State is now: ${state}`);
    const input: Input = {
      inputType: InputType.PONG,
      rawData: {x : s, y : 0, z : 0}
    }
    console.log(JSON.stringify(input));
    connections.stompConnection.publish({
        destination: `/lobbies/${playerContext.player.lobbyId}/players/${playerContext.player.id}/input`,
        body: JSON.stringify(input)
    })
    console.log("Pong detectd: " + s + " times");
  };


  useEffect(() => {
    listenForPongInput(handlePongInput);

    return () => {
      stopInputReading();
    };
  }, []);

  useEffect(() => {
    if (connections.stompConnection.state === ActivationState.ACTIVE) {
        connections.stompConnection.subscribe(`/topic/players/${playerContext.player.id}/signal`, onReceive);
        return;
    }

    connections.stompConnection.onConnect = (_) => {
        connections.stompConnection.subscribe(`/topic/players/${playerContext.player.id}/signal`, onReceive);
    };
}, [])


  // Render the Pong screen
  return (
    // Your Pong screen code goes here
    // The sreen will change based on the state
    // You can use the state to change the color of the screen and the text

    <View style={[styles.container, { backgroundColor: color[state] }]}>
      <Text style={styles.text}>{text[state]}</Text>
      <PongGlyph size={1000} value={state} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    position: "absolute",
    width: 195,
    height: 172,
    top: 500,
    fontSize: 70,
    textAlign: "center",
    color: "black",
  }
})



