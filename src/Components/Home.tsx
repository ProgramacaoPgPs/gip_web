import React from 'react';
import { CustomButton } from './CustomButton';
import { useMyContext } from '../Context/MainContext';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../Context/WsContext';
import Clpp from '../Modules/CLPP/Clpp';


export default function Home(): JSX.Element {
    const { setIsLogged, setTitleHead } = useMyContext(); // Seu contexto Pai
    const navigate = useNavigate();

    React.useEffect(() => {
        setTitleHead({ title: 'Home - GIPP', icon: 'fa fa-home' });
    }, []);

    return (
        <div className='d-flex flex-row w-100 h-100'>
            <NavBar />
            <section className='m-2'>
                <CustomButton onClick={() => navigate('/home/GTPP')} className='btn btn-primary' value={'GTPP'} />
            </section>
        </div>
    );
}