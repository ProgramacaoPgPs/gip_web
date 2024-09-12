import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMyContext } from './Context/MainContext';
type Props = {
    children: JSX.Element; // Tipo para o children
}

export default function PrivateRoute({ children }: Props) {
    const { isLogged } = useMyContext();
 
    return isLogged ? children : <Navigate to="/" />;
} 