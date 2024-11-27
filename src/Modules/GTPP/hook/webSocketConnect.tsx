import React, { useEffect, useState } from "react";

interface ConnectProps {
    getStateWebSocket?: () => void;
    handleNewMessage?: (message: any) => void; // Ajuste o tipo conforme necessário
}



function useConnect({ getStateWebSocket, handleNewMessage }: ConnectProps) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('tokenGIPP');
        if (!token) {
            console.log('Token não encontrado');
            return;
        }

        const socket = new WebSocket(process.env.REACT_APP_WS_URL || "ws://192.168.0.99:3333");

        socket.onopen = () => {
            setIsConnected(true);
            console.log('Conectado ao WebSocket');
        };

        socket.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket fechado');
        };

        socket.onerror = (error) => {
            setIsConnected(false);
            console.error('Erro no WebSocket:', error);
        };

        socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                setMessages((prev) => [...prev, message]);
                if(handleNewMessage) handleNewMessage(message);
            } catch (error) {
                console.warn("Erro no WebSocket:", event.data);
            }
        };

        setSocket(socket);

        const interval = setInterval(() => {
            if (isConnected) socket.send("__ping__");
        }, 5000);

        return () => {
            clearInterval(interval);
            socket.close();
            setSocket(null);
        };
    }, []);

    useEffect(() => {
        if (socket && !isConnected && getStateWebSocket) {
            getStateWebSocket();
        }
    }, [isConnected, socket]);

    return { socket, isConnected, messages };
}

export default useConnect;
