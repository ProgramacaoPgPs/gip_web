import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useMyContext } from './MainContext';
import WebSocketCLPP from '../Services/Websocket';
import { Connection } from '../Connection/Connection';
import { iMessage, iSender, iUser, iWebSocketCLPP, iWebSocketContextType } from '../Interface/iGIPP';
import ContactList from '../Modules/CLPP/Class/ContactList';
import User from '../Class/User';


const WebSocketContext = createContext<iWebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<iMessage[]>([]);
    const [contactList, setContactList] = useState<iUser[]>([]);
    const [sender, setSender] = useState<iSender>({ id: 0 });
    const [monitorScroll, setMonitorScroll] = useState<boolean>(false);
    const changeScrollRef = useRef<() => void>(() => { });
    const [ws, setWs] = useState<any>();
    const { setLoading, userLog } = useMyContext();

    // Função para atualizar contato com base no evento
    function updateContact(event: any, contact: iUser) {
        if (contact.yourContact === 0) contact.yourContact = 1;
        if (contact.notification === 0) {
            const pattern = /^(.{0,25}).*/;
            contact.notification = 1;
        }
        return contact;
    };

    function changeListContact(id: number) {
        let newList = contactList;
        newList[newList.findIndex((item: iUser) => item.id == id)].notification = 0;
        newList[newList.findIndex((item: iUser) => item.id == id)].yourContact = 1;
        setContactList([...newList]);
    }

    useEffect(() => {
        (
            async () => {
                setLoading(true);
                if (userLog.id > 0) {
                    await buildContactList();
                }
                setLoading(false);
            }
        )();
    }, [userLog]);

    // Controle das mensagens e destinatário
    useEffect(() => {
        (async () => {
            try {
                if (userLog.session) {
                    const ws = new WebSocketCLPP(userLog.session, receivedMessage, viewedMessage);
                    ws.connectWebSocket();
                    setWs(ws);
                }
            } catch (error) {
                alert(error);
            }
        })();
    }, [userLog]);

    async function buildContactList() {
        try {
            let contacts = new ContactList(userLog.id);
            const req: any = await contacts.loadListContacts();
            if (req.error) throw new Error(req.message);
            console.log(req.data[0]);
            setContactList([...req.data]);
        } catch (error) {
            console.log(error)
        }
    }

    async function receivedMessage(event: any) {
        const { send_user, message, type } = event;
        console.log(event);
        if (parseInt(send_user) === sender.id) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { send_user, message, type },
            ]);
            if (monitorScroll && changeScrollRef.current) changeScrollRef.current();
        } else {
            setContactList((prevContacts) =>
                prevContacts.map((contact) =>
                    contact.id === send_user ? updateContact(event, contact) : contact
                )
            );
        }
    };

    async function viewedMessage(event: any) {
        const { user } = event;
        setContactList((prevContacts) =>
            prevContacts.map((contact) =>
                contact.id === parseInt(user) ? { ...contact, pendingMessage: 0 } : contact
            )
        );

        const connection = new Connection('7');
        await connection.put(
            {
                id_user: user,
                id_sender: userLog.id,
                UpdateNotification: 1,
            },
            'CLPP/Message.php'
        );

        setSender((prevSender) => ({ ...prevSender, pendingMessage: 0 }));
    };

    return (
        <WebSocketContext.Provider value={{ messages, contactList, sender, setSender, ws, setContactList, changeListContact }}>
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