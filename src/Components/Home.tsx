import React from 'react';
import { CustomButton } from './CustomButton';
import { useMyContext } from '../Context/MainContext';
import NavBar from './Navbar/NavBar';
import { useNavigate } from 'react-router-dom';


export default function Home(): JSX.Element {
    const { setIsLogged,setTitleHead } = useMyContext();
    React.useEffect(()=>{
        setTitleHead({title:'Home - GIPP',icon:'fa fa-home'});
    },[]);
    const listPath = [{page: '/home', children: 'Home'}, {page: '/config', children: 'Configuração'}, {page: '/home', children: 'Sair'}];
    const navigate = useNavigate();

    return (
        <div className='d-flex flex-row w-100 h-100'>
            <NavBar list={listPath}/>
            <section className='m-2'>
                <CustomButton onClick={() => navigate('/home/GTPP')} className='btn btn-primary' value={'GTPP'} />
            </section>
        </div>
    );
}