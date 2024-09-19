import React, { createContext, useContext, useState, FC, useEffect } from 'react';
import StructureModal, { MessageModal } from '../Components/CustomModal';
import { tUser } from '../types/types';
import WebSocketCLPP from '../Services/Websocket';
import { iUser } from '../Interface/iGIPP';
import ContactList from '../Modules/CLPP/Class/ContactList';
import User from '../Class/User';
const logo = require('../Assets/Image/peg_pese_loading.png')
// Definindo o tipo dos dados no contexto
interface MyMainContext {
    loading: boolean;
    setLoading: (step: boolean) => void;

    modal: boolean;
    setModal: (step: boolean) => void;

    setMessage: (value: {
        text: string;
        type: 1 | 2 | 3 | 4
    }) => void;

    isLogged: boolean;
    setIsLogged: (step: boolean) => void;

    titleHead: { title: string, icon?: string };
    setTitleHead: (value: {
        title: string;
        icon?: string;
    }) => void;

    userLog: User;
    setUserLog: (value: User) => void;

    contactList: User[];
}

interface Props {
    children: JSX.Element; // Tipo para o children
}

// Criar o contexto
export const MyContext = createContext<MyMainContext | undefined>(undefined);

// Componente que fornece o contexto
export function MyProvider({ children }: Props) {

    const [loading, setLoading] = useState<boolean>(false);
    const [modal, setModal] = useState<boolean>(false);
    const [message, setMessage] = useState<{ text: string, type: 1 | 2 | 3 | 4 }>({ text: '', type: 1 });
    const [isLogged, setIsLogged] = useState<boolean>(false);
    const [titleHead, setTitleHead] = useState<{ title: string, icon?: string }>({ title: 'Gestão Integrada Peg Pese - GIPP', icon: '' });
    const [userLog, setUserLog] = useState<User>(new User({ id: 0, session: '', administrator: 0 }));
    const [contactList, setContactList] = useState<User[]>([]);
    let contacts: ContactList | null;


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

    async function buildContactList() {
        try {
            contacts = new ContactList(userLog.id);
            const req: any = await contacts.loadListContacts();
            if (req.error) throw new Error(req.message);
            setContactList([...req.data]);
        } catch (error) {
            alert(error)
        }
    }
    return (
        <MyContext.Provider value={{ loading, setLoading, modal, setModal, setMessage, isLogged, setIsLogged, titleHead, setTitleHead, userLog, setUserLog, contactList }}>
            {
                loading &&
                <StructureModal style='StructureModal ModalBgWhite'>
                    <div className='d-flex flex-column align-items-center'>
                        <img className="spinner-grow-img" src={logo} alt="Logo Peg Pese" />
                    </div>
                </StructureModal>
            }

            {
                modal &&
                <StructureModal style='StructureModal ModalBgWhite'>
                    <MessageModal message={message.text} type={message.type} onClose={() => { setModal(false) }} />
                </StructureModal>
            }

            {children}
        </MyContext.Provider>
    );
}

// Hook personalizado para usar o contexto
export const useMyContext = (): MyMainContext => {
    const context = useContext(MyContext);
    if (!context) {
        throw new Error('useMyContext must be used within a MyProvider');
    }
    return context;
};