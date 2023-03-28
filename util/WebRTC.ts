import { RTCIceCandidate, RTCPeerConnection, RTCSessionDescription} from "react-native-webrtc";

const configuration = null;
export const peerConnection = new RTCPeerConnection(configuration);
export var dataChannel = peerConnection.createDataChannel("dataChannel");

const send = (msg: any, session: WebSocket) => session.send(JSON.stringify(msg));

const handleOffer = (offer: any, session: WebSocket) => {
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

const handleCandidate = (candidate: any) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

export const connect = (): void => {
    var session: WebSocket = new WebSocket("ws://localhost:8080/socket");

    session.onopen = () => {
        initialize(session);  
    };

    session.onmessage = (msg) => {
        console.log("Got message", msg.data);
        var content = JSON.parse(msg.data);
        var data = content.data;
        switch (content.type) {
        case "OFFER":
            handleOffer(data, session);
            break;
        // when a remote peer sends an ice candidate to us
        case "ICE":
            handleCandidate(data);
            break;
        default:
            break;
        }
    };
};

const initialize = (session: WebSocket) => {
    send({
        senderId: "user0",
        type: "JOIN",
    }, session)
        
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

    peerConnection.ondatachannel = function (event: any) {
        dataChannel = event.channel;
    };

}

