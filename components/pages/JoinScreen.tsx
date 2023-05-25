import {NativeStackScreenProps, } from "@react-navigation/native-stack/lib/typescript/src/types";
import { ActivationState } from "@stomp/stompjs";
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WebSocketContext } from "../../App";
import Player from "../../models/Player";
import { AppState, AppStateContext, PlayerContext } from "../navigation/AppNavigation";
import { Button } from "../ui/Button";


// type JoinScreenProps = {
//     navigation: NativeStackScreenProps<any>,
// }

export const JoinScreen = (props: NativeStackScreenProps<any>): JSX.Element => {
    const { navigation } = props;
    const [error, setError] = useState(null as unknown as string);

    const playerContext = useContext(PlayerContext);
    const appStateContext = useContext(AppStateContext);
    const connections = useContext(WebSocketContext);

    const onButtonPress = (_: GestureResponderEvent) => {
        navigation.navigate('Shake');
    }
    const goToTap = (_: GestureResponderEvent) => {
        navigation.navigate('Tap');
    }

    const goToWebRTC = (_: GestureResponderEvent) => {
        navigation.navigate('WebRTC');
    }

    const goToQRScanner = () => {
        navigation.navigate('QRScanner');
    }
    const goToNIS = (_: GestureResponderEvent) => {
        navigation.navigate('NameInputScreen');
    }

    const rejoin = () => {
        if(connections.stompConnection.state === ActivationState.ACTIVE && connections.stompConnection.connected && playerContext.player){
            connections.stompConnection.publish({
                destination: `/lobbies/${playerContext.player.lobbyId}/rejoin`,
                body: JSON.stringify(playerContext.player)
            });
            return;
        }
        setError("Check your internet connection")
    }

    const onPlayerJoined = (data: any) => {
        // console.log(`TODO: SAVE registered player data ${data.body}`);
        const player: Player = JSON.parse(data.body);
        console.log(`IHAVE player id ${player.id}`);
        
        playerContext.setPlayer(player)
        appStateContext.setAppState(AppState.WAITING)

    }

    const onErrorOccured = (data: any) => {
        setError(data.body.split('"')[1] || "An server error occured");
    }


    useEffect(() => {
        if (connections.stompConnection.state === ActivationState.ACTIVE && connections.stompConnection.connected) {
            connections.stompConnection.subscribe(`/user/queue/join`, onPlayerJoined);
            connections.stompConnection.subscribe(`/user/queue/errors`, onErrorOccured);
        }
        connections.stompConnection.onConnect = (_) => {
            connections.stompConnection.subscribe(`/user/queue/join`, onPlayerJoined);
            connections.stompConnection.subscribe(`/user/queue/errors`, onErrorOccured);

        };

    }, [connections]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {playerContext.player && <TouchableOpacity style={styles.button} onPress={rejoin} ><Text style={styles.buttonText}>Rejoin Game</Text></TouchableOpacity>}
           <Button onPress={goToQRScanner} text="Join a game"/>
        </View>)
};

const styles = StyleSheet.create({
    button: {
        width: 0.8 * Dimensions.get('window').width,
        height: 0.1 * Dimensions.get('window').height,
        borderRadius: 13,
        backgroundColor: '#53A57D',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0.05 * Dimensions.get('window').height,
        position: 'absolute',
        bottom: 0.35 * Dimensions.get('window').height,
    },
    buttonText: {
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 32,
        lineHeight: 40,
        color: '#FFFFFF',
    },
});