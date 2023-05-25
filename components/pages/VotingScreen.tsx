import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Dimensions } from 'react-native';
import { bottts } from '@dicebear/collection';
import { SvgXml } from 'react-native-svg';
import { WebSocketContext } from '../../App';
import { ActivationState } from '@stomp/stompjs'
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import Player from '../../models/Player';
import { Button } from '../ui/Button';
import { AppState, AppStateContext, PlayerContext } from '../navigation/AppNavigation';

type Props = NativeStackScreenProps<any>;

const VotingScreen = ({ navigation }: Props) => {
    const connections = useContext(WebSocketContext);
    const appContext = useContext(AppStateContext);
    const playerContext = useContext(PlayerContext);

    const [players, setPlayers] = useState<Player[]>([]);

    const fetchPlayers = useCallback(async () => {
        try {
            const response = await fetch(`/lobbies/${playerContext.player.lobbyId}`);
            const data = await response.json();
            setPlayers(data.teams[0].players);
            console.log(players);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchPlayers();
    }, [fetchPlayers]);

    const [signalSubscription, setSignalSubscription] = useState<any>(null);

    const onReceive = useCallback((msg: any) => {
        const data = JSON.parse(msg.body);
        if (data.signal === "STOP") {
            appContext.setAppState(AppState.WAITING);
        }
    }, [appContext]);

    useEffect(() => {
        if (connections.stompConnection.state === ActivationState.ACTIVE) {
            const subscription = connections.stompConnection.subscribe(`/topic/players/${playerContext.player.id}/signal`, onReceive);
            setSignalSubscription(subscription);
        } else {
            connections.stompConnection.onConnect = () => {
                const subscription = connections.stompConnection.subscribe(`/topic/players/${playerContext.player.id}/signal`, onReceive);
                setSignalSubscription(subscription);
            };
        }

        return () => {
            if (signalSubscription) {
                signalSubscription.unsubscribe();
            }
        };
    }, [connections.stompConnection, playerContext.player.id, onReceive, signalSubscription]);

    return (
        <View>
            <Text>List of Players:</Text>
            {players.map((player: Player) => (
                <View key={player.id}>
                    <SvgXml xml={player.avatar} width={100} height={100} />
                    <Text>{player.nickname}</Text>
                </View>
            ))}
        </View>
    );
};

export default VotingScreen;