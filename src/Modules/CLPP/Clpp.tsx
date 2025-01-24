import React from 'react';
import { useWebSocket } from '../../Context/WsContext';
import './Clpp.css';
import { useMyContext } from '../../Context/MainContext';
import User from '../../Class/User';
import CardUser from './Components/CardUser';
import ChatWindow from './Chat/ChatWindow';
import Contacts from './Components/Contacts';




export default function Clpp(): JSX.Element {
    const [openChat, setOpenChat] = React.useState<boolean>(false)
    const [isConverse, setIsConverse] = React.useState<boolean>(true);
    const [detailsChat, setDetailsChat] = React.useState<boolean>(false);
    const [chat, setChat] = React.useState<boolean>(false);
    const { userLog } = useMyContext();
    const { ws, contactList, changeListContact, idReceived, setIdReceived } = useWebSocket();

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
                        {detailsChat && <CardUser openMessage={openMessage} {...userLog} name={userLog.name} />}

                    </header>

                    <section className='d-flex justify-content-between h-100 overflow-hidden'>
                        {
                            chat ?
                                <ChatWindow idReceived={idReceived} onClose={() => setChat(false)} />
                                :
                                <Contacts setIsConverse={() => setIsConverse(!isConverse)} isConverse={isConverse} contactList={contactList} openMessage={openMessage} />
                        }
                    </section>
                </div>
            }
            <button className={`btn fa-solid my-2 ${openChat ? 'fa-xmark' : 'fa-comments'}`} onClick={async () => {
                setOpenChat(!openChat);
            }}></button>
        </div>
    );

    function openMessage(user: User) {
        changeListContact(user.id);
        ws.current.informPreview(user.id.toString());
        setChat(true);
        setIdReceived(user.id);
    }
}

