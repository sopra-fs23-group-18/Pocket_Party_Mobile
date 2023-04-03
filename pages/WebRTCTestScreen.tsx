import React, { useEffect, useRef } from "react";
import { Button, View } from "react-native";
import { getWsUrl } from "../util/getDomain";
import { PeerConnection, WebSocketConnection } from "../util/WebRTC";


export const WebRTCTestScreen = (): JSX.Element => {
    const webSocketConnection = useRef(null as unknown as WebSocketConnection);
    const peerConnection = useRef(null as unknown as PeerConnection);

    useEffect(() => {
        webSocketConnection.current = new WebSocketConnection(getWsUrl()+"/socket");
    }, []);

    const connect = (_: Event) => {
        if(peerConnection.current === null){
            peerConnection.current = new PeerConnection({webSocketConnection: webSocketConnection.current, onReceive: (msg: any) => {
                console.log(`Received msg from web app ${msg}`); 
            }})
            peerConnection.current.connect();
        }
    }
    const sendMessage = (_: Event) => {
       peerConnection.current?.send("Hello Web from mobile")
    } 

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Establish connection" onPress={connect}/>
            <Button title="Send message via Web RTC" onPress={sendMessage}/>
        </View>)
}