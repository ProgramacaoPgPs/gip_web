import React from 'react';
import { CustomButton } from './CustomButton';
import { useMyContext } from '../Context/MainContext';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
const iconGTPP = require("../Assets/Image/GTTP_icon.png");

export default function Home(): JSX.Element {
    const { setTitleHead } = useMyContext();

    React.useEffect(() => {
        setTitleHead({ title: 'Home - GIPP', simpleTitle:"Home", icon: 'fa fa-home' });
    }, []);

    const listPath = [{ page: '/home', children: 'Home', icon: 'fa fa-home' }, /*{ page: '/config', children: 'Configuração', icon: 'fa fa-gear' },*/ {
        page: '/', children: 'Sair', icon: 'fa fa-sign-out', actionAdd: () => {
            localStorage.removeItem("tokenGIPP");
            localStorage.removeItem("codUserGIPP");
        }
    }];
    const navigate = useNavigate();

    return (
        <div className='d-flex flex-row w-100 h-100 container-fluid p-0 m-0'>
            <NavBar list={listPath} />
            <section className='p-2 flex-grow-1'>
                <CustomButton onClick={() => navigate('/home/GTPP')} className='btn col-4 col-sm-3 col-md-2 col-lg-1 p-0 m-0 shadow-lg'>
                    <img className="rounded w-100" src={iconGTPP} alt="Logo Peg Pese" />
                </CustomButton>
            </section>
        </div>
    );
}