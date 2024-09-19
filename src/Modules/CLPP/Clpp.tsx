import React from 'react';
import { useWebSocket } from '../../Context/WsContext';
import './Clpp.css';
import { useMyContext } from '../../Context/MainContext';
import { iUser } from '../../Interface/iGIPP';


export default function Clpp(): JSX.Element {
    const { messages, contactList, ws } = useWebSocket(); // Contexto de WebSocket
    const [openChat, setOpenChat] = React.useState<boolean>(false)
    const [isConverse, setIsConverse] = React.useState<boolean>(true);
    const [detailsChat, setDetailsChat] = React.useState<boolean>(false);
    const { userLog } = useMyContext();

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
                        {detailsChat && <CardUser {...userLog}/>}
                        <div className="d-flex flex-row w-100 align-items-center form-switch">
                            <input onClick={() => setIsConverse(!isConverse)} className="form-check-input " type="checkbox" defaultChecked={isConverse} />
                            <label className='mx-2' htmlFor="flexSwitchCheckChecked">{isConverse ? 'Conversas' : 'Contatos'}</label>
                        </div>
                    </header>
                    <section className='d-flex justify-content-between h-100 overflow-auto'>
                        {
                            isConverse
                                ?
                                <article>
                                    Conversas
                                </article>
                                :
                                <article>
                                    Contatos
                                </article>
                        }


                    </section>
                </div>
            }
            <button className={`btn fa-solid my-2 ${openChat ? 'fa-xmark' : 'fa-comments'}`} onClick={() => {
                setOpenChat(!openChat);
                ws.informPreview('68');
            }}>

            </button>
        </div>
    );
}



function CardUser(props:iUser): JSX.Element {
    return (
        <div className='d-flex align-items-center overflow-hidden w-100'>
            <img className='rounded-circle h-75 w-25' src={`data:image/png;base64,${props.photo}`} />
            <div className='d-flex flex-column mx-2'>
                <span>
                    <strong>Loja: </strong> {props.shop}
                </span>
                <span>
                    <strong>departamento: </strong> {props.departament}
                </span>
                <span>
                    <strong>subdepartamento: </strong> {props.sub}
                </span>
            </div>
        </div>
    );
}