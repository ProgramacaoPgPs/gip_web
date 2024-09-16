import WebSocketCLPP from "../Services/Websocket";

export interface iUser{
    id: number;
    youContact?: number;
    notification?: number;
    pendingMessage?: number;
    name?: string;
    company?: string;
    administrator: number;
    session: string;
}
export interface iSender{
    id:number;
}

export interface iMessage {
    send_user: number;
    message: string;
    type: number;
}

export interface iWebSocketCLPP {
    tokens: any;
    sender: iUser;
    funcReceived: (event: any) => Promise<void>;
    funcView: (event: any) => Promise<void>;
    connectWebSocket: () => void;
}

export interface iWebSocketContextType {
    // connectWebSocket: () => void;
    messages: iMessage[];
    contactList: iUser[];
    sender: iSender;
    setSender: React.Dispatch<React.SetStateAction<iSender>>;
    ws: WebSocketCLPP;
}
