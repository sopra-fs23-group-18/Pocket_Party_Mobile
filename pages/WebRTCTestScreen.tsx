import React from "react";
import { Button, View } from "react-native";
import { connect, dataChannel } from "../util/WebRTC";

export const WebRTCTestScreen = (): JSX.Element => {

    const sendMessage = (_: Event) => {
       dataChannel.send("Hello Web from mobile")
        
    } 

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Establish connection" onPress={connect}/>
            <Button title="Send message via Web RTC" onPress={sendMessage}/>
        </View>)
}