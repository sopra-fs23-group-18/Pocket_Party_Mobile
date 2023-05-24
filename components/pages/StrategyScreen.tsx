import { useEffect, useState, useContext } from 'react';
import { WebSocketContext } from '../../App';
import { AppState, AppStateContext, PlayerContext } from '../navigation/AppNavigation';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Input, InputType } from '../../types/Input';
import { ActivationState } from '@stomp/stompjs';


export const StrategyScreen = (): JSX.Element => {
    // three buttons, one for each input type (rock, paper, scissors)
    // when a button is pressed, send the input to the server
    
    const connections = useContext(WebSocketContext);
    const appContext = useContext(AppStateContext);
    const playerContext = useContext(PlayerContext);
    const [choice, setChoice] = useState(0);

    let lastChoice = 0;


    const onReceive = (msg:any) => {
        const data = JSON.parse(msg.body);
        if(data.signal === "STOP"){
            appContext.setAppState(AppState.WAITING);
        }
    }

    const greedyChoice = (choice: number) => {
        // the next choice should not be the same as the last choice
        // if it is, remind the player to choose a different one
        if (choice === lastChoice) {
            Alert.alert("You can't choose the same number twice in a row!");
            return;
        }
        lastChoice = choice;
        setChoice(choice);
        
        const input: Input = {
            inputType: InputType.STRATEGY,
            rawData: {x : choice, y : 0, z : 0},
        }
        console.log(JSON.stringify(input));
        connections.stompConnection.publish({
            destination: `/lobbies/${playerContext.player.lobbyId}/players/${playerContext.player.id}/input`,
            body: JSON.stringify(input)
        })
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
            <Text style={styles.title}>{choice}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText} onPress={() => greedyChoice(1)}>
                        💵
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText} onPress={() => greedyChoice(3)}>
                        💰💰💰
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText} onPress={() => greedyChoice(5)}>
                        💎💎💎💎💎
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "lightgreen",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "black",
        fontSize: 80,
        fontWeight: "bold",
        marginBottom: 20,
        textTransform: "uppercase",
    },
    buttonContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        height: 500,
    },
    button: {
        backgroundColor: "lightgreen",
        width: 250,
        height: 150,
        borderRadius: 75,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 60,
        fontWeight: "bold",
        color: "#fff",
    },
});
     