import { RTCIceCandidate, RTCPeerConnection, RTCSessionDescription } from "react-native-webrtc";
import RTCDataChannel from "react-native-webrtc/lib/typescript/RTCDataChannel";
import { RTCSessionDescriptionInit } from "react-native-webrtc/lib/typescript/RTCSessionDescription";

export class PeerConnection {
    /**
     * 
     * @param PeerConnectionConfig config 
     */
    private _signalingConnection;
    private _active: Boolean = false;
    private _onReceive: (msg: any) => void;
    private _dataChannel: RTCDataChannel | null = null;
    private _peerConnection: RTCPeerConnection | null = null;

    constructor(config: PeerConnectionConfig) {
        this._signalingConnection = config.webSocketConnection;
        this._signalingConnection.setOnMessage((msg: any) => {
            var content = JSON.parse(msg.data);
            var data = content.data;
            switch (content.type) {
                case "OFFER":
                    this._handleOffer(data);
                    break;
                // when a remote peer sends an ice candidate to us
                case "ICE":
                    this._handleCandidate(data);
                    break;
                default:
                    break;
            }
        });
        this._onReceive = config.onReceive;
    }


    _sendSignal(msg: any) {
        this._signalingConnection.send(JSON.stringify(msg));
    }

    send = (msg: any) => {
        if (!this._active) {
            console.warn("Could not send message to peer because Peer Connection is not active");
            return;
        }
        this._dataChannel?.send(msg);
    }

    _reconnect = () => {
        setTimeout(() => {
            this.connect()
        }, 2000)
    }

    close = () => {
        this._active = false;
        this._peerConnection?.close();
    }

    connect = () => {
        this._active = true;
        this._sendSignal({
            //TODO Provide real userID
            senderId: "user0",
            type: "JOIN",
        })

        const configuration = {
            "iceServers": [{
                "urls": "stun:stun2.l.google.com:19302"
            }]
        };
        this._peerConnection = new RTCPeerConnection(configuration);

        this._dataChannel = this._peerConnection.createDataChannel("dataChannel");
        this._dataChannel.onmessage = (event: any) => {
            this._onReceive(event.data);
        };

        this._dataChannel.onerror = (error) => {
            console.warn(`An error occured on the data channel ${error}`)
            // reconnect
            this._reconnect()
        };

        this._dataChannel.onclose = () => {
            if (this._active) {
                this._reconnect()
            }
            console.log("Data channel closed");
        };

        this._peerConnection.onicecandidate = (event: any) => {
            if (event.candidate !== null) {
                this._sendSignal({
                    senderId: "user0",
                    recipentId: "webApp",
                    type: "ICE",
                    data: event.candidate,
                });
            }
        }

        this._peerConnection.onconnectionstatechange = (ev: any) => {
            switch (this._peerConnection?.connectionState) {
                case "connected":
                    console.log("peer connection established successfully!!");
                    break;
                default:
                    break;
            }
        }


        this._peerConnection.ondatachannel = (event: any) => {
            this._dataChannel = event.channel;
        };


    }

    _handleOffer = (offer: RTCSessionDescriptionInit) => {
        this._peerConnection?.setRemoteDescription(new RTCSessionDescription(offer));
        this._peerConnection?.createAnswer()
            .then((answer) => this._peerConnection?.setLocalDescription(answer))
            .then(() => {
                this._sendSignal({
                    senderId: "user0",
                    recipentId: "webApp",
                    type: "ANSWER",
                    data: this._peerConnection?.localDescription,
                });
            })
            .catch((reason) => {
                // An error occurred, so handle the failure to connect
                console.log(reason);
            });
    }

    _handleCandidate = (candidate: any) => {
        this._peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
    };
};

type PeerConnectionConfig = {
    webSocketConnection: WebSocketConnection,
    onReceive: (msg: any) => void,
}

export class WebSocketConnection {
    private _url: string;
    public connection: WebSocket;
    private _onMessage: ((msg: any) => void) | null = null;
    private _onClose: ((e: any) => void) | null = null;

    constructor(url: string) {
        this._url = url;
        this.connection = new WebSocket(this._url);
        this.connection.onerror = () => {
            // Try to reconnect every 5 seconds
            setTimeout(() => {
                this.connection = new WebSocket(this._url);
                this.connection.onmessage = this._onMessage;
                this.connection.onclose = this._onClose;
            }, 5000)
        }
    }

    setOnMessage = (onMessage: (msg: any) => void) => {
        this._onMessage = onMessage;
        this.connection.onmessage = onMessage;
    }

    setOnClose = (onClose: (e: any) => void) => {
        this._onClose = onClose;
        this.connection.onclose = onClose;
    }

    send = (msg: any) => {
        if (this.connection.readyState !== 1) {
            console.warn("Could not send signaling message to server because Web Socket connection is not open");
            return;
        }
        this.connection.send(msg);
    }
}