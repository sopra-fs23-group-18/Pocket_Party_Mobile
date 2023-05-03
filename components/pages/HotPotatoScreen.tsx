import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect } from "react";
import { WebSocketContext } from "../../App";
import { ActivationState } from "@stomp/stompjs";
import { AppState, AppStateContext, PeerConnectionContext, PlayerContext } from "../navigation/AppNavigation";
import { Input, InputType } from "../../types/Input";


export const HotPotatoScreen = () => {
    const connections = useContext(WebSocketContext);

    const appContext = useContext(AppStateContext);
    const playerContext = useContext(PlayerContext);


    const onReceive = (msg: any) => {
        const data = JSON.parse(msg.body);
        if (data.signal === "STOP") {
            appContext.setAppState(AppState.WAITING);
        }
    }

    const onTap = () => {
        const input: Input = {
            inputType: InputType.TAP,
            hasTapped: { hasTapped: true }
        }
        console.log(JSON.stringify(input));
        connections.stompConnection.publish({
            destination: `/lobbies/${playerContext.player.lobbyId}/players/${playerContext.player.id}/input`,
            body: JSON.stringify(input)
        })
        // peerConnectionContext.peerConnection?.send(JSON.stringify(input))
        console.log("Tap detected! Bomb will be passed on!");
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
        <View style={styles.container}>
            <TouchableOpacity
                onPress={onTap}>
                <View style={styles.imageContainer}>
                    <Image source={require('../../images/bombe.png')} style={styles.image} />
                </View>
            </TouchableOpacity>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    imageContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#FF0000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
    },
});
