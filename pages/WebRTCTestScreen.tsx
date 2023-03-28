import React from "react";
import { Button, View } from "react-native";
import { connect, dataChannel, peerConnection } from "../util/WebRTC";

export const WebRTCTestScreen = (): JSX.Element => {

    const connectThisShit = (_: Event) => {
        connect();
    } 

    const sendMessage = (_: Event) => {
       dataChannel.send("Hello Web from mobile")
        
    } 

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Establish connection" onPress={connectThisShit}/>
            <Button title="Send message via Web RTC" onPress={sendMessage}/>
        </View>)
}