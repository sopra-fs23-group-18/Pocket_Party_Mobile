import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ShakeGlyph } from "../ui/ShakeGlyph";
import { listenForShake, stopInputReading } from "../../util/InputHandler";
import { AppState, AppStateContext, PeerConnectionContext, PlayerContext } from "../navigation/AppNavigation";
import { Input, InputType } from "../../types/Input";
import { WebSocketContext } from "../../App";
import { ActivationState } from "@stomp/stompjs";


export const ShakeScreen = (): JSX.Element => {
    const connections = useContext(WebSocketContext);
    // const peerConnectionContext = useContext(PeerConnectionContext);
    const appContext = useContext(AppStateContext);
    const playerContext = useContext(PlayerContext);

    const onReceive = (msg:any) => {
        const data = JSON.parse(msg.body);
        if(data.signal === "STOP"){
            appContext.setAppState(AppState.WAITING);
        }
    }

    const onShake = () => {
        const input: Input = {
            inputType: InputType.SHAKE,
        }
        connections.stompConnection.publish({
            destination: `/lobbies/${playerContext.player.lobbyId}/players/${playerContext.player.id}/input`,
            body: JSON.stringify(input)
        })
        // peerConnectionContext.peerConnection?.send(JSON.stringify(input))
        console.log("Shake detectd");
    }

    useEffect(() => {
        listenForShake(onShake);
        //unmount 
        return () => {
            stopInputReading();
        }
    }, [])

    useEffect(() => {
        if (connections.stompConnection.state === ActivationState.ACTIVE) {
            console.log("got called");

            connections.stompConnection.subscribe(`/topic/players/${playerContext.player.id}/signal`, onReceive);
            return;
        }
        console.log("got called");
        
        connections.stompConnection.onConnect = (_) => {
            connections.stompConnection.subscribe(`/topic/players/${playerContext.player.id}/signal`, onReceive);
        };
    }, [])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.title}>Shake</Text>
            <ShakeGlyph/> 
        </View>)
}

const styles = StyleSheet.create({
    title: {
        position: "absolute",
        width: 195,
        height: 72,
        top: 50,


        fontStyle: "normal",
        fontWeight: "600",
        fontSize: 40,
        lineHeight: 50,
        textAlign: "center",

        color: "#53A57D",
    }
})