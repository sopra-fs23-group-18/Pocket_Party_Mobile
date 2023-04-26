import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, View } from "react-native";
import { WebSocketContext } from "../../App";
import { getWsUrl } from "../../util/getDomain";
import { PeerConnection, WebSocketConnection } from "../../util/WebRTC";


export const WebRTCTestScreen = (): JSX.Element => {
    const webSocketConnection = useRef(null as unknown as WebSocketConnection);
    const [peerConnection, setPeerConnection] = useState(null as unknown as PeerConnection);
    const connections = useContext(WebSocketContext);

    useEffect(() => {
        webSocketConnection.current = new WebSocketConnection(getWsUrl()+"/socket");
    }, []);

    const onReceive = (msg: any) => {
        console.log(msg);
    }

    const onConnected = (pc: PeerConnection) => {
        pc.send("HEllo web")
        console.log("on Connected called");

        
    }
    const connect = (_: Event) => {
        if(peerConnection === null){
            const pc = new PeerConnection({
                webSocketConnection: connections.signalingConnection, onReceive, lobbyId: 67, playerId: 70, onConnected
            })
            pc.connect();
            setPeerConnection(pc);
        }
    }

    useEffect(() => {
        console.log(peerConnection?._peerConnection);
        
    }, [peerConnection?._peerConnection?._pcId])

    const sendMessage = (_: Event) => {
       peerConnection?.send("Hello Web from mobile")
    } 

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Establish connection" onPress={connect}/>
            <Button title="Send message via Web RTC" onPress={sendMessage}/>
        </View>)
}