import { MutableRefObject, RefObject } from "react";
import WebSocketCLPP from "../Services/Websocket";

export interface iUser {
    id: number;
    yourContact?: number;
    notification?: number;
    pendingMessage?: number;
    name?: string;
    company?: string;
    shop?: number;
    departament?: string;
    sub?: string;
    CSDS?: string;
    photo?: string;
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

    contactList: iUser[];
    sender: iSender;
    ws: MutableRefObject<WebSocketCLPP>;
    idReceived:number; 
    listMessage: { id: number, id_user: number, message: string, notification: number, type: number }[];
    page:number;
    pageLimit:number;
    msgLoad:boolean;
    previousScrollHeight:MutableRefObject<number>;
    messagesContainerRef:RefObject<HTMLDivElement>;
    changeChat:()=>void;
    handleScroll:()=>void;
    setPage:(value:number)=>void;
    setIdReceived:(value:number)=>void;
    setSender: React.Dispatch<React.SetStateAction<iSender>>;
    setContactList:(value:iUser[])=>void;
    changeListContact:(value:number)=>void;
}
