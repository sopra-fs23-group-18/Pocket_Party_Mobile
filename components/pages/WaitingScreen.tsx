import { SvgXml } from "react-native-svg";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { useContext, useEffect, useState } from "react";
import { AppState, AppStateContext, PeerConnectionContext, PlayerContext } from "../navigation/AppNavigation";
import { PeerConnection } from "../../util/WebRTC";
import { WebSocketContext } from "../../App";


const WaitingScreen = () => {
    const playerContext = useContext(PlayerContext);
    const wsConnections = useContext(WebSocketContext);
    const appContext = useContext(AppStateContext);
    const peerConnectionContext = useContext(PeerConnectionContext);
    

    const onReceive = (msg: any) => {
        console.log(msg);
        appContext.setAppState(AppState.IN_GAME)
    }

    const onConnected = () => {
        console.log("HERE i want to do somthing maybe probably not");
        
    };
    useEffect(() => {
        if(peerConnectionContext.peerConnection === null){
            if(playerContext.player.id === null){
                console.log("ERORE");
                return;
            }
            const pc = new PeerConnection({
                webSocketConnection: wsConnections.signalingConnection, onReceive, lobbyId: playerContext.player.lobbyId || -1, playerId: playerContext.player.id || -1, onConnected
            })
            pc.connect()
            peerConnectionContext.setPeerConnection(pc)
        }
    })


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
