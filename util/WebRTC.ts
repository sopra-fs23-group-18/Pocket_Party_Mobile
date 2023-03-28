import { RTCIceCandidate, RTCPeerConnection, RTCSessionDescription} from "react-native-webrtc";
import RTCDataChannel from "react-native-webrtc/lib/typescript/RTCDataChannel";

export var peerConnection: RTCPeerConnection;
export var dataChannel: RTCDataChannel;
export const connect = () => {
    var session: WebSocket = new WebSocket("ws://localhost:8080/socket");
    

    session.onopen = () => {
        const initResult = initialize(session);
        peerConnection = initResult.peerConnection;
        dataChannel = initResult.dataChannel;
    };

    session.onmessage = (msg) => {
        console.log("Got message", msg.data);
        var content = JSON.parse(msg.data);
        var data = content.data;
        switch (content.type) {
        case "OFFER":
            handleOffer(data, session, peerConnection);
            break;
        // when a remote peer sends an ice candidate to us
        case "ICE":
            handleCandidate(data, peerConnection);
            break;
        default:
            break;
        }
    };
}
const initialize = (session: WebSocket) => {
    send({
        senderId: "user0",
        type: "JOIN",
    }, session)
    const configuration = null;
    let peerConnection = new RTCPeerConnection(configuration);
    let dataChannel = peerConnection.createDataChannel("dataChannel");

    peerConnection.onicecandidate = (event: any) => {
        if (event.candidate !== null) {
            send({
                senderId: "user0",
                recipentId: "webApp",
                type: "ICE",
                data: event.candidate,
            }, session);
        }
    }
    dataChannel.onmessage = function (event: any) {
        console.log("message:", event.data);
    };
    dataChannel.onerror = function (error) {
        console.log("Error:", error);
    };
    dataChannel.onclose = function () {
        console.log("Data channel is closed");
    };

    return {peerConnection, dataChannel}
}

const send = (msg: any, session: WebSocket) => session.send(JSON.stringify(msg));

const handleOffer = (offer: any, session: WebSocket, peerConnection: RTCPeerConnection) => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    peerConnection.createAnswer()
    .then((answer) => peerConnection.setLocalDescription(answer))
    .then(() => {
        send({
            senderId: "user0",
            recipentId: "webApp",
            type: "ANSWER",
            data: peerConnection.localDescription,
        }, session);
    })
    .catch((reason) => {
        // An error occurred, so handle the failure to connect
        console.log(reason);
    });
}

const handleCandidate = (candidate: any, peerConnection: RTCPeerConnection) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

