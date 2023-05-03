import { ActivationState } from "@stomp/stompjs";
import React, { useContext, useEffect } from "react";
import { Platform, StyleSheet, Text, Vibration, View } from "react-native";
import { WebSocketContext } from "../../App";
import { AppState, AppStateContext, PlayerContext } from "../navigation/AppNavigation";
import { VibrateGlyph } from "../ui/VibrateGlyph";

export const VibrationScreen = (): JSX.Element => {
    const connections = useContext(WebSocketContext);
    const appContext = useContext(AppStateContext);
    const playerContext = useContext(PlayerContext);

    const vibrationSchemaOne = Platform.OS === 'android' ? [400, 200, 400, 200, 400, 200, 400] : [200, 200, 200];
    const vibrationSchemaTwo = Platform.OS === 'android' ? [400, 50, 400, 50, 400, 300, 400] : [50, 50, 200];
    const vibrationSchemaThree = Platform.OS === 'android' ? [400, 50, 400, 100, 400, 200, 400] : [50, 100, 200];

    const onReceive = (msg: any) => {
        const parsed = JSON.parse(msg.body);
        if (parsed.signal === "STOP") {
            appContext.setAppState(AppState.WAITING);
            return;
        }

        if (parsed.signal === "PLAY") {
            switch (parsed.data) {
                case "VIB_ONE":
                    Vibration.cancel()
                    Vibration.vibrate(vibrationSchemaOne);
                    break;
                case "VIB_TWO":
                    Vibration.cancel()
                    Vibration.vibrate(vibrationSchemaTwo);
                    break;
                case "VIB_THREE":
                    Vibration.cancel()
                    Vibration.vibrate(vibrationSchemaThree);
                default:
                    break;
            }
        }
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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.title}>Listen</Text>
            <VibrateGlyph/> 
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