import User from "../Class/User";

export type tUser ={
    id:number;
    administrator:number;
    session:string;
};

export type tCardUser = {
    name?: string;
    id?:number;
    shop?: number;
    departament?: string;
    sub?: string;
    photo?: string;
    yourContact?: number;
    isSend?:boolean;
    notification?:number;
    sendMessage:(value:any)=>void;
}