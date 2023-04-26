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
    private _onConnectedDo: (pc: PeerConnection) => void;
    private _dataChannel: RTCDataChannel | null = null;
    public  _peerConnection: RTCPeerConnection | null = null;
    private _lobbyId: number = 1;
    private _playerId: number | null = null;
    private _msg_queue: [string] | [] = [];

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
        this._onConnectedDo = config.onConnected;
        this._playerId = config.playerId;
        this._lobbyId = config.lobbyId;
    }


    _sendSignal(msg: any) {
        this._signalingConnection.send(JSON.stringify(msg));
    }

    send = (msg: any) => {
        if (!this._active) {
            console.warn("Could not send message to peer because Peer Connection is not active");
            return;
        }
        if(this._dataChannel?.readyState !== "open"){
            console.warn("Data channel is not open at the moment adding msg to queue")
            this._msg_queue.push(msg as unknown as never);
            return;
        }
        this._dataChannel?.send(msg);
    }

    _reconnect = () => {
        console.log("Reconnection scheduled");
        
        setTimeout(() => {
            this.close()
            this.connect()
        }, 2000)
    }

    close = () => {
        this._active = false;
        this._dataChannel?.close();
        this._peerConnection?.close();
        this._dataChannel = null;
        this._peerConnection = null;
    }

    connect = () => {
        this._active = true;
        this._sendSignal({
            senderId: `player${this._playerId}`,
            type: "JOIN",
        })

        const configuration = {
            "iceServers": [{
                "urls": "stun:stun.nextcloud.com:443"
            }]
        };
        this._peerConnection = new RTCPeerConnection(configuration);

        this._dataChannel = this._peerConnection.createDataChannel(`dataChannel`, { ordered: true, negotiated: true, id: 0 });
        this._dataChannel.onmessage = (event: any) => {
            this._onReceive(event.data);
        };

        this._dataChannel.onerror = (error) => {
            console.warn(`An error occured on the data channel ${error}`)
            // reconnect
      
        };

        this._dataChannel.onclose = () => {
            console.log("Data channel closed");
            if (this._active) {
                // this._reconnect()
                this.close();
                this.connect();
            }
            
          
        };
        this._dataChannel.onopen = (event) => {
            console.log("Data channel is now open");
            console.log(`Having ${this._msg_queue.length} messages in queue sending all of them now`);
            for (let i = 0; i < this._msg_queue.length; i++) {
                const msg = this._msg_queue.shift();
                if(msg){
                    this._dataChannel?.send(msg);
                }
            }
        }

        this._peerConnection.onicecandidate = (event: any) => {
            if (event.candidate !== null) {
                this._sendSignal({
                    senderId: `player${this._playerId}`,
                    recipentId: `webApp${this._lobbyId}`,
                    type: "ICE",
                    data: event.candidate,
                });
            }
        }

        this._peerConnection.onconnectionstatechange = (ev: any) => {
            console.log(this._peerConnection?.connectionState);
            
            switch (this._peerConnection?.connectionState) {
                case "connected":
                    this._onConnectedDo(this);
                    console.log("peer connection established successfully!!");
                    break;
                case "connecting":
                    // this._dataChannel?.close();
                    // this._dataChannel = null;
                    break;
                case "failed":
                    if (this._active) {
                        // this._reconnect()
                        this.close();
                        this.connect();
                    }
                default:
                    break;
            }
        }
    }

    _handleOffer = (offer: RTCSessionDescriptionInit) => {
        this._peerConnection?.setRemoteDescription(new RTCSessionDescription(offer));
        this._peerConnection?.createAnswer()
            .then((answer) => this._peerConnection?.setLocalDescription(answer))
            .then(() => {
                this._sendSignal({
                    senderId: `player${this._playerId}`,
                    recipentId: `webApp${this._lobbyId}`,
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

    setOnReceive = (onRecieve: (msg: any) => void ) => {
        this._onReceive = onRecieve
        // if(this._dataChannel !== null){
        //     this._dataChannel.onmessage = (event: any) => {
        //         this._onReceive(event.data);
        //     };
        // }
        
    }
};

type PeerConnectionConfig = {
    webSocketConnection: WebSocketConnection,
    onReceive: (msg: any) => void,
    onConnected:  (pc: PeerConnection) => void,
    lobbyId: number,
    playerId: number,
}

export class WebSocketConnection {
    private _url: string;
    private _msg_queue: [string] | [] = [];
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
        this.connection.onopen = () => {
            console.log("WS open now");
            for (let i = 0; i < this._msg_queue.length; i++) {
                const msg = this._msg_queue.shift();
                this.connection.send(msg || '');
            }
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
            this._msg_queue.push(msg as unknown as never);
            console.warn("Could not send signaling message to server because Web Socket connection is not open");
            return;
        }
        this.connection.send(msg);
    }
}