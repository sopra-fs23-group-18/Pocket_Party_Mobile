import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { createContext, useEffect, useState } from "react"
import Player from "../../models/Player";
import { PeerConnection } from "../../util/WebRTC";
import { JoinScreen } from "../pages/JoinScreen";
import NameInputScreen from "../pages/NameInputScreen";
import { QRScanner } from "../pages/QRScanner";
import { ShakeScreen } from "../pages/ShakeScreen";
import { TapScreen } from "../pages/TapScreen";
import WaitingScreen from "../pages/WaitingScreen";
import { WebRTCTestScreen } from "../pages/WebRTCTestScreen";

const Stack = createNativeStackNavigator();

export enum AppState {
    SHAKE,
    TAP,
    NOT_JOINED,
    WAITING,
    IN_GAME,
    HOTPOTATO,
}

type AppStateContextType = {
    appState: AppState,
    setAppState: React.Dispatch<React.SetStateAction<AppState>>
}

type PlayerConextType = {
    player: Player,
    setPlayer: React.Dispatch<React.SetStateAction<Player>>
}

type PeerConnectionContextType = {
    peerConnection: PeerConnection,
    setPeerConnection: React.Dispatch<React.SetStateAction<PeerConnection>>
}

export const AppStateContext = createContext(null as unknown as AppStateContextType);
export const PlayerContext = createContext(null as unknown as PlayerConextType);
export const PeerConnectionContext = createContext(null as unknown as PeerConnectionContextType);

export const AppNavigation = (): JSX.Element => {
    const [appState, setAppState] = useState(AppState.NOT_JOINED);

    //TODO maybe persist player information
    const [player, setPlayer] = useState(null as unknown as Player);

    const [peerConnection, setPeerConnection] = useState(null as unknown as PeerConnection);

    const renderStack = (appState: AppState) => {
        switch (appState) {
            case AppState.NOT_JOINED:
                return (
                    <>
                        <Stack.Screen name="Join" component={JoinScreen} />
                        <Stack.Screen name="QRScanner" component={QRScanner} />
                        <Stack.Screen name="NameInputScreen" component={NameInputScreen} />
                    </>
                )
            case AppState.SHAKE:
                return (
                    <>
                        <Stack.Screen name="Shake" component={ShakeScreen} />
                        <Stack.Screen name="WebRTC" component={WebRTCTestScreen} />
                    </>
                )
            case AppState.TAP:
                return (
                    <>
                        <Stack.Screen name="Tap" component={TapScreen} />
                    </>
                )
            case AppState.WAITING:
                return (
                    <>
                        <Stack.Screen name="WaitingScreen" component={WaitingScreen} />
                    </>
                )
            default:
                break;
        }
    }


    return (
        <AppStateContext.Provider value={{ appState, setAppState }}>
            <PeerConnectionContext.Provider value={{ peerConnection, setPeerConnection }}>
                <PlayerContext.Provider value={{ player, setPlayer }}>
                    <Stack.Navigator screenOptions={{
                        headerShown: false,
                    }}>
                        {renderStack(appState)}
                    </Stack.Navigator>
                </PlayerContext.Provider>
            </PeerConnectionContext.Provider>
        </AppStateContext.Provider>
    );
}
