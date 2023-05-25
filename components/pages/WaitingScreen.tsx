import { SvgXml } from "react-native-svg";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { useContext, useEffect, useState } from "react";
import { AppState, AppStateContext, PeerConnectionContext, PlayerContext } from "../navigation/AppNavigation";
import { PeerConnection } from "../../util/WebRTC";
import { WebSocketContext } from "../../App";
import { ActivationState } from "@stomp/stompjs";


const WaitingScreen = () => {
    const playerContext = useContext(PlayerContext);
    const connections = useContext(WebSocketContext);
    const appContext = useContext(AppStateContext);

    const onReceive = (msg: any) => {
        const data = JSON.parse(msg.body);
        if (data.signal === "VOTE") {
            console.log("VOTESIGNAL RECEIVED");
            appContext.setAppState(AppState.VOTING);
        }
        if (data.signal === "START") {
            switch (data.minigame) {
                case "TIMING_TUMBLE":
                    appContext.setAppState(AppState.SHAKE);
                    break;
                case "QUICK_FINGERS":
                    appContext.setAppState(AppState.TAP);
                    break;
                case "VIBRATION VOYAGE":
                    appContext.setAppState(AppState.VIBRATION);
                    break;
                case "POCKET_PONG":
                    appContext.setAppState(AppState.PONG);
                    break;
                case "ROCK_PAPER_SCISSORS":
                    appContext.setAppState(AppState.RPS);
                    break;
                case "GREEDY_GAMBIT":
                    appContext.setAppState(AppState.STRATEGY);
                    break;
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


    const spinValue = new Animated.Value(0);

    Animated.loop(
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: true,
        })
    ).start();

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={styles.container}>
            <SvgXml xml={playerContext.player.avatar} style={styles.avatar} />
            <View style={styles.loader}>
                <Animated.View
                    style={[
                        styles.loaderItem,
                        { transform: [{ rotate: spin }, { translateX: -90 }] },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.loaderItem,
                        { transform: [{ rotate: spin }, { translateY: -90 }] },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.loaderItem,
                        { transform: [{ rotate: spin }, { translateX: 90 }] },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.loaderItem,
                        { transform: [{ rotate: spin }, { translateY: 90 }] },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.loaderItem,
                        { transform: [{ rotate: spin }, { translateX: -60 }, { translateY: -60 }] },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.loaderItem,
                        { transform: [{ rotate: spin }, { translateX: 60 }, { translateY: -60 }] },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.loaderItem,
                        { transform: [{ rotate: spin }, { translateX: -60 }, { translateY: 60 }] },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.loaderItem,
                        { transform: [{ rotate: spin }, { translateX: 60 }, { translateY: 60 }] },
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#53A57D"
    },
    avatar: {
        width: 100,
        height: 100,
    },
    loader: {
        position: "absolute",
        width: 100,
        height: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    loaderItem: {
        position: "absolute",
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "pink",
    },
});

export default WaitingScreen;
