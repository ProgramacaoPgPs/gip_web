export type tUser ={
    id:number;
    administrator:number;
    session:string;
};

export type tCardUser = {
    name?: string;
    shop: number;
    departament: string;
    sub: string;
    photo: string;
    youContact?: number;
    isSend?:boolean;
    sendMessage:(value:string)=>void;
}