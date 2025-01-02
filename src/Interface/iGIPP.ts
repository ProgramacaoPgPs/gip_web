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
export interface CustomNotification  {
    id: number;
    message: string;
}

export interface iSender {
    id: number;
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
export interface iGtppWsContextType {
    task: any;
    taskDetails: iTaskReq;
    taskPercent: number;
    messageNotification: Record<string, any>;
    userTaskBind: any;
    notifications: CustomNotification[],
    states:iStates[],
    setNotifications: (value: CustomNotification[]) => void,
    setTaskPercent: (value: number) => void;
    setTask: (value: any) => void;
    setTaskDetails: (value: any) => void;
    handleAddTask: (description: string, task_id: string) => void;
    clearGtppWsContext: () => void;
    checkedItem: (id: number, checked: boolean, idTask: any, task: any) => void;
    checkTaskComShoDepSub: (task_id: number, company_id: number, shop_id: number, depart_id: number, taskLocal: any) => void;
    changeDescription: (description: string, id: number, descLocal: string) => void;
    stopAndToBackTask: (taskId: number, resource: string | null, date: string | null, taskList: any) => void;
    changeObservedForm: (taskId: number, subId: any, description: string, message?: any, isNote?: any) => void;
}
export interface iStates { 
    color: string, 
    description: string, 
    id: number 
};
export interface iTaskReq {
    error?: boolean,
    data?: {
        csds?: number,
        full_description?: string,
        task_item: [{
            id?: number,
            description?: string,
            check?: boolean,
            task_id?: number,
            order?: number,
            yes_no?: number,
            file?: number,
            note?: any,
        }],
        task_user: [{ task?: number, user_id?: number, status?: boolean }]
    }
}

export interface iWebSocketContextType {

    contactList: iUser[];
    sender: iSender;
    ws: MutableRefObject<WebSocketCLPP>;
    idReceived: number;
    listMessage: { id: number, id_user: number, message: string, notification: number, type: number }[];
    page: number;
    pageLimit: number;
    msgLoad: boolean;
    previousScrollHeight: MutableRefObject<number>;
    messagesContainerRef: RefObject<HTMLDivElement>;
    changeChat: () => void;
    handleScroll: () => void;
    setPage: (value: number) => void;
    setIdReceived: (value: number) => void;
    setSender: React.Dispatch<React.SetStateAction<iSender>>;
    setContactList: (value: iUser[]) => void;
    changeListContact: (value: number) => void;
}
