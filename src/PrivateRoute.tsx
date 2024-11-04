import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMyContext } from './Context/MainContext';
import RenderPage from './Components/RenderPage';
import { WebSocketProvider } from './Context/WsContext';
import Clpp from './Modules/CLPP/Clpp';
import { Connection } from './Connection/Connection';
import User from './Class/User';
type Props = {
    children: JSX.Element; // Tipo para o children
}

export default function PrivateRoute({ children }: Props) {
    const { isLogged, setIsLogged, setUserLog } = useMyContext();

    useEffect(() => {
        (async () => {
            
            setIsLogged(await checkedLogin());
            
        })();
    }, []);

    useEffect(() => { console.log(isLogged) }, [isLogged])

    async function checkedLogin(): Promise<boolean> {
        let response = true;
        const conn = new Connection('18');
        const user: any = await conn.get(`&application_id=18&validation=1`, 'GIPP/LoginGipp.php', true);

        setUserLog(new User({
            id: user.data[0]["user_id"],
            session: user.data[0]["session"],
            administrator: 1
        }));

        const req: any = await conn.get(`&application_id=18&user_id=${user.data[0]["user_id"]}`, 'CCPP/Token.php', true);

        if (req.error) {
            response = false;
        }
        return response;
    }

    return isLogged ?
        <WebSocketProvider>
            <RenderPage>
                {children}
            </RenderPage>
        </WebSocketProvider>
        :
        <Navigate to="/" />;
} 