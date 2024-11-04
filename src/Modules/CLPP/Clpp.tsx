import React, { useEffect, useRef, useState } from 'react';
import { useWebSocket } from '../../Context/WsContext';
import './Clpp.css';
import { useMyContext } from '../../Context/MainContext';
import { iUser } from '../../Interface/iGIPP';
import User from '../../Class/User';
import { tCardUser, tWindowsMessage } from '../../types/types';
import CardUser from './Components/CardUser';
import { Connection } from '../../Connection/Connection';
import StructureModal from '../../Components/CustomModal';

const logo = require("../../Assets/Image/peg_pese_loading.png");


export default function Clpp(): JSX.Element {
    const { ws } = useWebSocket(); // Contexto de WebSocket
    const [openChat, setOpenChat] = React.useState<boolean>(false)
    const [isConverse, setIsConverse] = React.useState<boolean>(true);
    const [detailsChat, setDetailsChat] = React.useState<boolean>(false);
    const [windowsMessage, setWindowsMessage] = React.useState<boolean>(false);
    const [idReceiver, setIdReiceved] = React.useState<number>(0);
    const { userLog } = useMyContext();
    const { contactList, changeListContact } = useWebSocket();


    return (
        <div id='moduleCLPP' className={`${openChat ? 'cardContactBtn' : null}`}>
            {
                openChat &&
                <div className='bg-white p-2 rounded d-flex flex-column'>
                    <header className='d-flex flex-column align-items-center'>
                        <div className='d-flex justify-content-between align-items-center bg-light w-100 rounded p-2'>
                            <div>
                                <i className='fa-solid fa-comments'></i> Chat Log Peg Pese - CLPP
                            </div>
                            <i onClick={() => setDetailsChat(!detailsChat)} className={`btn text-primary fa-solid fa-circle-info`}></i>
                        </div>
                        {detailsChat && <CardUser sendMessage={sendMessage} {...userLog} name={userLog.name} />}

                    </header>

                    <section className='d-flex justify-content-between h-100 overflow-hidden'>
                        {
                            windowsMessage ?
                                <WindowsMessage idReceiver={idReceiver} onClose={() => setWindowsMessage(false)} /> :
                                <div className='overflow-auto h-100 w-100'>
                                    <div className="d-flex flex-row w-100 align-items-center form-switch">
                                        <input onClick={() => { setIsConverse(!isConverse); }} className="form-check-input " type="checkbox" defaultChecked={isConverse} />
                                        <label className='mx-2' htmlFor="flexSwitchCheckChecked">{isConverse ? 'Conversas' : 'Contatos'}</label>
                                    </div>
                                    {contactList.filter(item => item.yourContact == (isConverse ? 1 : undefined) && item).map((item) => <CardUser sendMessage={sendMessage} key={`contact_${item.id}`} {...item} name={item.name} yourContact={item.yourContact || 0} isSend={true} notification={item.notification} id={item.id} />)}
                                </div>
                        }

                    </section>
                </div>
            }
            <button className={`btn fa-solid my-2 ${openChat ? 'fa-xmark' : 'fa-comments'}`} onClick={async () => {
                setOpenChat(!openChat);
                /*ws.informPreview('68');*/
            }}></button>
        </div>
    );

    function sendMessage(user: User) {
        changeListContact(user.id);
        ws.informPreview(user.id.toString());
        console.log(`Você ira enviar a mesagem para ${user.name}. ID#: ${user.id}`);
        setWindowsMessage(true);
        setIdReiceved(user.id);
    }
}



function WindowsMessage(props: tWindowsMessage): JSX.Element {
    const [listMessage, setListMessage] = useState<{ id: number, id_user: number, message: string, notification:number }[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageLimit, setPageLimit] = useState<number>(1);
    const [msgLoad, setMsgLoad] = useState<boolean>(true);
    const { userLog } = useMyContext();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const previousScrollHeight = useRef<number>(0);

    useEffect(() => {
        const fetchMessages = async () => {
            setMsgLoad(true);
            try {
                const req = await loadMessage();
                if (req.error) throw new Error(req.message);
                setPageLimit(req.pages);
                setListMessage(reloadList(req.data.reverse()));
            } catch (error) {
                alert(error);
            }
            setMsgLoad(false);
        };

        fetchMessages();
    }, [page]);

    // Rolagem automática para o final ao carregar mensagens
    useEffect(() => {
        if (page === 1 && messagesEndRef.current) {
            // Rolagem até o final apenas na primeira página
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth'});
        } else if (messagesContainerRef.current) {
            // Mantenha a posição de rolagem ao carregar mais páginas
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight - previousScrollHeight.current;
        }
    }, [listMessage]);

    // Verifica quando o usuário rola até o topo
    function handleScroll() {
        if (messagesContainerRef.current) {
            if (messagesContainerRef.current.scrollTop === 0 && page < pageLimit) {
                previousScrollHeight.current = messagesContainerRef.current.scrollHeight;
                setPage(page + 1);
            }
        }
    };

    async function loadMessage(): Promise<{ error: boolean, message?: string, data?: any, pages: number }> {
        const conn = new Connection('18');
        const listMessage: { error: boolean, message?: string, data?: any, pages: number } = await conn.get(`&pages=${page}&id_user=${userLog.id}&id_send=${props.idReceiver}`, 'CLPP/Message.php')
            || { error: true, message: 'fail', pages: 1 };
        return listMessage;
    }

    function reloadList(pList: any[]): any[] {
        const newList: any = [...listMessage];
        newList.unshift(...pList);
        return newList;
    }

    return (
        <div id='divWindowsMessage' className='d-flex flex-column h-100 w-100'>
            {msgLoad && (
                <StructureModal className="StructureModal ModalBgWhite">
                    <div className="d-flex flex-column align-items-center">
                        <img className="spinner-grow-img" src={logo} alt="Logo Peg Pese" />
                    </div>
                </StructureModal>
            )}
            <i onClick={() => props.onClose()} className="fa-solid fa-rotate-left text-end text-danger my-2"> Voltar</i>
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className='d-flex flex-column overflow-auto h-100 w-100 p-2'
            >
                {listMessage.map((item) => (
                    <div key={`message_${item.id}`} className={`d-flex flex-column my-2 w-100 ${item.id_user === userLog.id ? 'text-end align-items-end messageSent' : 'text-start align-items-start messageReceived'}`}>
                        <div className="p-2 rounded">{controllerMessage(item)}</div>
                        {
                           item.id_user === userLog.id && <span className={`fa-solid fa-check-double notifyMessage my-2 ${item.notification == 1 ? 'text-secundary':'text-primary'}`}></span>
                        }
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div>
                {/* Placeholder for future input or button */}
            </div>
        </div>
    );

    function controllerMessage(message:any):any {
        let response;
        if (parseInt(message.type) === 1) {
            response = message.message;
        } else if (parseInt(message.type) === 2) {
            response = <a href={`http://192.168.0.99:71/GLOBAL/Controller/CLPP/uploads/${message.message}`} target='_blank'><img alt="Mensagem no formato de imagem." className='fileStyle' src={`http://192.168.0.99:71/GLOBAL/Controller/CLPP/uploads/${message.message}`} /></a>;
        } 
        // else {
        //      response = iconFileMessage(message);
        // }
        return response;
    }
}
