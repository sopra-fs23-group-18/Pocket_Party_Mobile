import React, { useContext, useEffect } from "react";
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { WebSocketContext } from "../../App";
import { ActivationState } from "@stomp/stompjs";
import { AppState, AppStateContext, PeerConnectionContext, PlayerContext } from "../navigation/AppNavigation";
import { Input, InputType } from "../../types/Input";



export const TapScreen = (): JSX.Element => {
    const connections = useContext(WebSocketContext);
    // const peerConnectionContext = useContext(PeerConnectionContext);
    const appContext = useContext(AppStateContext);
    const playerContext = useContext(PlayerContext);

    var counter = 0;

    const onReceive = (msg:any) => {
      console.log("Received a msg");
      
      appContext.setAppState(AppState.WAITING);
  }

    const onTap = () => {
      counter++;
      const input: Input = {
          inputType: InputType.TAP,
          rawData: {x : counter, y : 0, z : 0}
      }
      console.log(JSON.stringify(input));
      connections.stompConnection.publish({
          destination: `/lobbies/${playerContext.player.lobbyId}/players/${playerContext.player.id}/input`,
          body: JSON.stringify(input)
      })
      // peerConnectionContext.peerConnection?.send(JSON.stringify(input))
      console.log("Tap detectd: " + counter + " times");
  }

  useEffect(() => {
    if (connections.stompConnection.state === ActivationState.ACTIVE) {
        connections.stompConnection.subscribe(`/topic/players/${playerContext.player.id}/signal`, onReceive);
        return;
    }
    
    connections.stompConnection.onConnect = (_) => {
        connections.stompConnection.subscribe(`/topic/players/${playerContext.player.id}/signal`, onReceive);
    };
}, [])
    return (
        <View style={styles.screen}>
      <TouchableOpacity
        onPress={onTap}
        style={styles.fullScreenButton}>
        <Text style = {styles.bigBlue}>Tap</Text>
      </TouchableOpacity>
    </View>)
}

const styles = StyleSheet.create({
    screen: {
      flex: 1,
    },
    bigBlue: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 80,
      },
    
    fullScreenButton: {
      flex : 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'orange',
    },
  });
  