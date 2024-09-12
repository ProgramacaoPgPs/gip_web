import React from 'react';
import { useMyContext } from '../../Context/MainContext';

export default function Gtpp():JSX.Element{
    const {setTitleHead} = useMyContext();
    React.useEffect(()=>{
        setTitleHead({title:'Gerenciador de Tarefas Peg Pese - GTPP',icon:'fa fa-home'});
    },[]);
    return(
        <div id='moduleCLPP'>
            <h1>Bem Vindo ao Gerenciado de tarefas Peg Pese </h1>
            <a href='./#/home'>go to home - <span className='fa fa-rotate-left'></span></a>
        </div>
    );
}