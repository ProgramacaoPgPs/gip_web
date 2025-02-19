import User from "../Class/User";

export type tUser = {
    id: number;
    administrator: number;
    session: string;
};
export type tChatWindow = {
    onClose: (value?: any) => void;
    idReceived: number;
};

export type tCardUser = {
    name?: string;
    id?: number;
    shop?: number;
    departament?: string;
    sub?: string;
    photo?: string;
    yourContact?: number;
    isSend?: boolean;
    notification?: number;
    openMessage?: (value: any) => void;
    inName?: boolean;
    inStore?: boolean;
    inDepartament?: boolean;
    inSubDepartament?: boolean;
}

export type tItemTable = {
    [key: string]: {
        tag: string;
        value: string;
        isImage?:boolean;
    };
};