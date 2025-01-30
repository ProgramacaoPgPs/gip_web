import React, { Children, useEffect } from 'react';
import Clpp from '../Modules/CLPP/Clpp';
import { useMyContext } from '../Context/MainContext';
import SessionTimer from './SessionTimer';
type Props = {
    children: JSX.Element; // Tipo para o children
}
export default function RenderedModules(props: Props): JSX.Element {
    const { token } = useMyContext();
    return (
        <div className='d-flex flex-row w-100 h-100'>
            {props.children}
            <Clpp />
            <SessionTimer expirationDate={token.expiration_date} />
        </div>
    );
}
