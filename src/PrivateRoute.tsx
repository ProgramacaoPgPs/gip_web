import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMyContext } from './Context/MainContext';
import RenderPage from './Components/RenderPage';
import { WebSocketProvider } from './Context/WsContext';
import Clpp from './Modules/CLPP/Clpp';
type Props = {
    children: JSX.Element; // Tipo para o children
}

export default function PrivateRoute({ children }: Props) {
    const { isLogged } = useMyContext();

    return isLogged ?
        <WebSocketProvider>
            <RenderPage>
                {children}
            </RenderPage>
        </WebSocketProvider>
        :
        <Navigate to="/" />
        ;
} 