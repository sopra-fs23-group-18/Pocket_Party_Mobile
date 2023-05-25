import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';
import { WebSocketContext } from '../../App';
import { ActivationState } from '@stomp/stompjs'
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import Player from '../../models/Player';
import { Button } from '../ui/Button';
import { AppState, AppStateContext, PlayerContext } from '../navigation/AppNavigation';

const NameInputScreen = (props: NativeStackScreenProps<any>) => {
    const connections = useContext(WebSocketContext);
    const appStateContext = useContext(AppStateContext);
    const playerContext = useContext(PlayerContext);
    const [error, setError] = useState(null as unknown as string); 

    const { navigation, route } = props;
    const { inviteCode }: any = route.params;
    const onPlayerJoined = (data: any) => {
        // console.log(`TODO: SAVE registered player data ${data.body}`);
        const player: Player = JSON.parse(data.body);        
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

    }, [connections])

    const [name, setName] = useState('');

    const handleNameChange = (text: string) => {
        setName(text);
    };

    const handleReadyPress = () => {
        console.log('Button pressed');
        const avatar = createAvatar(bottts, {
            seed: name,
            size: 128,
        }).toString();


        const player: Player = {
            nickname: name,
            avatar: avatar
        };

        if (connections.stompConnection.state === ActivationState.ACTIVE && connections.stompConnection.connected) {
            connections.stompConnection.publish({
                destination: `/lobbies/${inviteCode}`,
                body: JSON.stringify(player)
            })
            console.log("SENDED THIS SHIT");

            return;
        } else {
            setError("No connection: Check your internet conenction");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Choose a nickname</Text>
            {error &&
                <Text style={styles.errorText}>{error}</Text>
            }
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={handleNameChange}
                maxLength={15}
            />
            <Button onPress={handleReadyPress} text='Ready' />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    label: {
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 20,
        textAlign: 'center',
        color: '#53A57D',
    },
    errorText: {
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 12,
        lineHeight: 40,
        textAlign: 'center',
        color: '#ff7979',
    },
    input: {
        width: '80%',
        height: 40,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        color: "black",
    }
});

export default NameInputScreen;
