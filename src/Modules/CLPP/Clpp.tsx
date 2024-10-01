import React from 'react';
import { useWebSocket } from '../../Context/WsContext';
import './Clpp.css';
import { useMyContext } from '../../Context/MainContext';
import { iUser } from '../../Interface/iGIPP';
import User from '../../Class/User';
import { tCardUser } from '../../types/types';
import CardUser from './Components/CardUser';


export default function Clpp(): JSX.Element {
    const { ws } = useWebSocket(); // Contexto de WebSocket
    const [openChat, setOpenChat] = React.useState<boolean>(false)
    const [isConverse, setIsConverse] = React.useState<boolean>(true);
    const [detailsChat, setDetailsChat] = React.useState<boolean>(false);
    const { userLog } = useMyContext();
    const { contactList, changeListContact } = useWebSocket();

    return (
        <div id='moduleCLPP'>
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
                        <div className="d-flex flex-row w-100 align-items-center form-switch">
                            <input onClick={() => { setIsConverse(!isConverse); }} className="form-check-input " type="checkbox" defaultChecked={isConverse} />
                            <label className='mx-2' htmlFor="flexSwitchCheckChecked">{isConverse ? 'Conversas' : 'Contatos'}</label>
                        </div>
                    </header>
                    <section className='d-flex justify-content-between h-100 overflow-hidden'>
                        <div className='overflow-auto h-100 w-100'>
                            {contactList.filter(item => item.yourContact == (isConverse ? 1 : undefined) && item).map((item) => <CardUser sendMessage={sendMessage} key={`contact_${item.id}`} {...item} name={item.name} yourContact={item.yourContact || 0} isSend={true} notification={item.notification} id={item.id} />)}
                        </div>
                    </section>
                </div>
            }
            <button className={`btn fa-solid my-2 ${openChat ? 'fa-xmark' : 'fa-comments'}`} onClick={() => { setOpenChat(!openChat);/* ws.informPreview('68');*/ }}></button>
        </div>
    );

    function sendMessage(user: User) {
        changeListContact(user.id);
        console.log(`Você ira enviar a mesagem para ${user.name}. ID#: ${user.id}`)
    }
}
