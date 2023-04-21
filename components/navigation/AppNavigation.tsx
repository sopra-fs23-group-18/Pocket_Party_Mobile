import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { createContext, useEffect, useState } from "react"
import Player from "../../models/Player";
import { JoinScreen } from "../pages/JoinScreen";
import NameInputScreen from "../pages/NameInputScreen";
import { QRScanner } from "../pages/QRScanner";
import { ShakeScreen } from "../pages/ShakeScreen";
import { TapScreen } from "../pages/TapScreen";
import WaitingScreen from "../pages/WaitingScreen";
import { WebRTCTestScreen } from "../pages/WebRTCTestScreen";

const Stack = createNativeStackNavigator();

export enum AppState {
    NOT_JOINED,
    WAITING,
    IN_GAME,
}

type AppStateContextType = {
    appState: AppState,
    setAppState: React.Dispatch<React.SetStateAction<AppState>>
}

type PlayerConextType = {
    player: Player,
    setPlayer: React.Dispatch<React.SetStateAction<Player>>
}

export const AppStateContext = createContext(null as unknown as AppStateContextType);
export const PlayerContext = createContext(null as unknown as PlayerConextType)

export const AppNavigation = (): JSX.Element => {
    const [appState, setAppState] = useState(AppState.NOT_JOINED);
    
    //TODO maybe persist player information
    const [player, setPlayer] = useState(null as unknown as Player);

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
            case AppState.IN_GAME:
                return (
                    <>
                        <Stack.Screen name="Shake" component={ShakeScreen} />
                        <Stack.Screen name="Tap" component={TapScreen} />
                        <Stack.Screen name="WebRTC" component={WebRTCTestScreen} />
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
            <PlayerContext.Provider value={{ player, setPlayer }}>
                <Stack.Navigator screenOptions={{
                    headerShown: false,
                }}>
                    {renderStack(appState)}
                </Stack.Navigator>
            </PlayerContext.Provider>
        </AppStateContext.Provider>
    );
}