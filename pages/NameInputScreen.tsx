import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Dimensions } from 'react-native';
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';
import { SvgXml } from 'react-native-svg';
import { WebSocketContext } from '../App';
import { ActivationState } from '@stomp/stompjs'
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import Player from '../models/Player';
const NameInputScreen = (props: NativeStackScreenProps<any>) => {
    const connections = useContext(WebSocketContext);
    const { navigation } = props;
    const onPlayerJoined = (data: any) => {
        console.log(`TODO: SAVE registered player data ${data.body}`);
    }

    useEffect(() => {
        if (connections.stompConnection.state === ActivationState.ACTIVE) {
            connections.stompConnection.subscribe(`/user/queue/join`, onPlayerJoined);
            return;
        }
        connections.stompConnection.onConnect = (_) => {
            connections.stompConnection.subscribe(`/user/queue/join`, onPlayerJoined);
        };
        //Here we activate the stomp connection only needed to call once.
        connections.stompConnection.activate();

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
        navigation.navigate("WaitingScreen", { avatar });

        const player: Player = {
            nickname: name,
            avatar: avatar
        };

        if (connections.stompConnection.state === ActivationState.ACTIVE) {
            connections.stompConnection.publish({
                destination: `/lobbies/${1}`,
                body: JSON.stringify(player)
            })
            return;
        }

        //TODO Handle no internet connection
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Choose a nickname</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={handleNameChange}
            />
            <TouchableOpacity style={styles.button} onPress={handleReadyPress}>
                <Text style={styles.buttonText}>Ready</Text>
            </TouchableOpacity>
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
        fontFamily: 'Outfit',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 20,
        textAlign: 'center',
        color: '#53A57D',
    },
    input: {
        width: '80%',
        height: 40,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    button: {
        width: 0.8 * Dimensions.get('window').width,
        height: 0.1 * Dimensions.get('window').height,
        borderRadius: 13,
        backgroundColor: '#53A57D',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0.05 * Dimensions.get('window').height,
        position: 'absolute',
        bottom: 0.1 * Dimensions.get('window').height,
    },
    buttonText: {
        fontFamily: 'Outfit',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 32,
        lineHeight: 40,
        color: '#FFFFFF',
    },
});

export default NameInputScreen;
