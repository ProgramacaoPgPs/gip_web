import React from 'react';
import { useWebSocket } from '../../Context/WsContext';
import './Clpp.css';

export default function Clpp(): JSX.Element {
    const { messages, contactList, ws, setSender } = useWebSocket(); // Contexto de WebSocket
    const [openChat, setOpenChat] = React.useState<boolean>(false)

    React.useEffect(() => {
        // Exemplo: log das mensagens recebidas para debug
        console.log('WebSocket Messages:', messages);
        console.log('Contact List:', contactList);
    }, []);

    return (
        <div id='moduleCLPP'>
            {
                openChat &&
                <div className='bg-white p-2 rounded'>
                    A
                </div>
            }
            <button className={`btn fa-solid my-2 ${openChat ?'fa-xmark':'fa-comments'}`} onClick={() => {
                setOpenChat(!openChat);
                ws.informPreview('68');
            }}>
        
            </button>
        </div>
    );
}