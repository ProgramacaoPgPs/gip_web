import React from 'react';
import { tCardUser } from '../../../types/types';

const logo = require('../../../Assets/Image/groupCLPP.png');


export default function CardUser(props: tCardUser): JSX.Element {
    return (
        <div className='cardContact border rounded my-2 overflow-hidden' >
            <div className='d-flex align-items-center w-100 p-2'>
                <header className='overflow-hidden rounded-circle object-fit-cover'>
                    <img src={props.photo ? `data:image/png;base64,${props.photo}` : logo} />
                </header>
                <div className='d-flex flex-column mx-2 overflow-hidden text-nowrap'>
                    <span className=''>
                        <strong >Nome: </strong> {props.name || 'N/P'}
                    </span>
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
                {props.isSend &&
                    <button onClick={()=>props.sendMessage(props.name || 'N/P')} className='btn'>
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                }
            </div>
        </div>
    );
}