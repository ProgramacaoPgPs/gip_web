import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useMyContext } from './MainContext';
import WebSocketCLPP from '../Services/Websocket';
import { Connection } from '../Connection/Connection';
import {  iSender, iUser,  iWebSocketContextType } from '../Interface/iGIPP';
import ContactList from '../Modules/CLPP/Class/ContactList';


const WebSocketContext = createContext<iWebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [msgLoad, setMsgLoad] = useState<boolean>(true);

    const [idReceived, setIdReceived] = React.useState<number>(0);
    const [pageLimit, setPageLimit] = useState<number>(1);
    const [page, setPage] = useState<number>(1);
    const previousScrollHeight = useRef<number>(0);

    const [contactList, setContactList] = useState<iUser[]>([]);

    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const [sender, setSender] = useState<iSender>({ id: 0 });
    
    const [listMessage, setListMessage] = useState<{ id: number, id_user: number, message: string, notification: number, type: number }[]>([]);

    const { setLoading, userLog } = useMyContext();
    const ws = useRef(new WebSocketCLPP(userLog.session, callbackOnMessage));

    
    useEffect(() => {
        // Abre a coonexão com o websocket.
        (async () => {
            try {
                if (userLog.session) {
                    ws.current.connectWebSocket();
                }
            } catch (error) {
                alert(error);
            }
        })();
        //Carrega a sua lista de contato.
        (async () => {
            if (userLog.id > 0) {
                setLoading(true);
                await buildContactList();
                setLoading(false);
            }
        }
        )();
    }, [userLog]);

    // Garante a atualização do callback.
    useEffect(() => {
        ws.current.callbackOnMessage = callbackOnMessage;
    }, [idReceived, listMessage]);

    useEffect(() => {
        const fetchMessages = async () => {
            setMsgLoad(true);
            try {
                if (idReceived) {
                    const req = await loadMessage();
                    if (req.error) throw new Error(req.message);
                    setPageLimit(req.pages);
                    setListMessage(reloadList(req.data.reverse()));
                }
            } catch (error) {
                console.error(error);
                alert(error);
            }
            setMsgLoad(false);
        };

        fetchMessages();
    }, [page, idReceived]);

    function includesMessage(message:{ id: number, id_user: number, message: string, notification: number, type: number }){
        listMessage.push(message);
        setListMessage([...listMessage]);
        if (messagesContainerRef.current) {
            if (messagesContainerRef.current.scrollTop === 0 && page < pageLimit) {
                previousScrollHeight.current = messagesContainerRef.current.scrollHeight;
            }
        }
    }
  
    // Verifica quando o usuário rola até o topo
    function handleScroll() {
        setTimeout(()=>{
            if (messagesContainerRef.current) {
                if (messagesContainerRef.current.scrollTop === 0 && page < pageLimit) {
                    previousScrollHeight.current = messagesContainerRef.current.scrollHeight;
                    setPage(page + 1);
                }
            }
        },250);
    };

    async function loadMessage(): Promise<{ error: boolean, message?: string, data?: any, pages: number }> {
        const conn = new Connection('18');
        const listMessage: { error: boolean, message?: string, data?: any, pages: number } = await conn.get(`&pages=${page}&id_user=${userLog.id}&id_send=${idReceived}`, 'CLPP/Message.php')
            || { error: true, message: 'fail', pages: 1 };
        return listMessage;
    }

    function reloadList(pList: any[]): any[] {
        const newList: any = [...listMessage];
        newList.unshift(...pList);
        return newList;
    }

    function changeChat() {
        setIdReceived(0);
        setPage(1);
        setListMessage([]);
    }

    // Função para atualizar contato com base no evento
    function updateContact(event: any, contact: iUser) {
        if (contact.yourContact === 0) contact.yourContact = 1;
        if (contact.notification === 0) {
            const pattern = /^(.{0,25}).*/;
            contact.notification = 1;
        }
        return contact;
    };

    async function callbackOnMessage(event: any) {
        if (event.objectType === 'notification') {
            if (event.user === idReceived) {
                await viewedMessage(event);
            }
        } else if (event.message && !event.error) {
            await receivedMessage(event);
            // Se a janela de batepapo estiver aberta, ele informa que a msg já foi visualizada.
            if (event.send_user === idReceived) {
                ws.current.informPreview(idReceived.toString());
            }
        }
    }

    function changeListContact(id: number) {
        let newList = contactList;
        newList[newList.findIndex((item: iUser) => item.id == id)].notification = 0;
        newList[newList.findIndex((item: iUser) => item.id == id)].yourContact = 1;
        setContactList([...newList]);
    }

    async function buildContactList() {
        try {
            let contacts = new ContactList(userLog.id);
            const req: any = await contacts.loadListContacts();
            if (req.error) throw new Error(req.message);
            setContactList([...req.data]);
        } catch (error) {
            console.log(error)
        }
    }

    async function receivedMessage(event: any) {
        const { send_user, message, type } = event;

        if (parseInt(send_user) === idReceived) {
            
            listMessage.push({
                id: 999,
                "id_user": event.send_user,
                "message": event.message,
                "notification": 0,
                "type": event.type
            });
            setListMessage([...listMessage])

        } else {
            setContactList((prevContacts) =>
                prevContacts.map((contact) =>
                    contact.id === send_user ? updateContact(event, contact) : contact
                )
            );
        }
    };

    async function viewedMessage(event: any) {
        // console.log(event)
        // const { user } = event;
        // setContactList((prevContacts) =>
        //     prevContacts.map((contact) =>
        //         contact.id === parseInt(user) ? { ...contact, pendingMessage: 0 } : contact
        //     )
        // );

        // const connection = new Connection('7');
        // await connection.put(
        //     {
        //         id_user: user,
        //         id_sender: userLog.id,
        //         UpdateNotification: 1,
        //     },
        //     'CLPP/Message.php'
        // );

        // setSender((prevSender) => ({ ...prevSender, pendingMessage: 0 }));
    };

    return (
        <WebSocketContext.Provider value={{ previousScrollHeight, messagesContainerRef, listMessage, pageLimit, msgLoad, contactList, sender, ws, idReceived, page, includesMessage, setPage, setIdReceived, setSender, setContactList, changeListContact, changeChat, handleScroll }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};