import React from 'react';
import { CustomButton } from './CustomButton';
import { useMyContext } from '../Context/MainContext';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../Context/WsContext';


export default function Home(): JSX.Element {
    const { setIsLogged, setTitleHead } = useMyContext(); // Seu contexto Pai
    const { messages, contactList, ws,setSender } = useWebSocket(); // Contexto de WebSocket

    const navigate = useNavigate();

    React.useEffect(() => {
        setTitleHead({ title: 'Home - GIPP', icon: 'fa fa-home' });

        // Conecta o WebSocket quando o componente Home é montado
        // connectWebSocket();

        // Exemplo: log das mensagens recebidas para debug
        console.log('WebSocket Messages:', messages);
        console.log('Contact List:', contactList);
    }, []);

    return (
        <div className='d-flex flex-row w-100 h-100'>
            <NavBar />
            <section className='m-2'>
                <CustomButton onClick={() => navigate('/home/GTPP')} className='btn btn-primary' value={'GTPP'} />
                <div>
                    <button className='btn btn-success' onClick={() => {
                        
                        ws.informPreview('68');

                    }}>
                        <i className="fa-regular fa-message text-white"></i>
                    </button>
                    <button onClick={()=>{
                        setSender({id:68})
                    }} className='btn btn-danger'>
                        Vegeta
                    </button>
                </div>
            </section>
        </div>
    );
}