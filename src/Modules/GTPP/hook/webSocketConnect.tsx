import React, { useEffect, useState } from "react";

interface ConnectProps {
    getStateWebSocket?: any;
    handleNewMessage?:any; // Callback para mensagens recebidas
}

function Connect({ getStateWebSocket, handleNewMessage }: ConnectProps) {
    const [socket, setSocket] = useState<WebSocket | null>(null); // Gerencia a instância do WebSocket
    const [isConnected, setIsConnected] = useState(false); // Estado de conexão
    const [messages, setMessages] = useState<any[]>([]); // Estado para armazenar as mensagens
    const [pingTimeout, setPingTimeout] = useState<NodeJS.Timeout | null>(null); // Timeout de ping

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Se o token estiver presente, tenta se conectar ao WebSocket
        if (token) {
            const newSocket = new WebSocket("ws://192.168.0.99:3333");

            // Definir eventos do WebSocket
            newSocket.onopen = () => {
                setIsConnected(true); // Marca a conexão como aberta
                console.log('Conectado ao WebSocket');
            };

            newSocket.onclose = () => {
                setIsConnected(false); // Marca a conexão como fechada
                console.log('WebSocket fechado');
            };

            newSocket.onerror = (error) => {
                setIsConnected(false); // Marca a conexão como fechada em caso de erro
                console.error('Erro no WebSocket:', error);
            };

            // Receber mensagens do WebSocket
            newSocket.onmessage = (event) => {
                const message = JSON.parse(event.data); // Assumindo que as mensagens sejam JSON
                setMessages((prevMessages) => [...prevMessages, message]); // Adiciona a nova mensagem no estado
                handleNewMessage(message); // Chama o callback com a nova mensagem
            };

            // Armazenar a instância do socket no estado
            setSocket(newSocket);

            // Função Ping
            function Ping() {
                if (isConnected) {
                    newSocket.send("__ping__"); // Envia o ping
                    console.log('Ping enviado');
                }
            }

            // Configura um timeout para verificar a resposta do WebSocket
            const timeout = setInterval(() => {
                Ping();
            }, 5000); // Envia o ping a cada 5 segundos

            setPingTimeout(timeout); // Armazenar o timeout no estado para controle

            // Limpeza ao desmontar o componente
            return () => {
                clearInterval(timeout); // Limpa o intervalo de ping
                if (newSocket) {
                    newSocket.close(); // Fecha a conexão WebSocket
                }
                setSocket(null); // Limpa a instância do socket
            };
        } else {
            console.log('Token não encontrado');
        }
    }, []); // O useEffect roda uma vez, quando o componente for montado

    // Função de callback para o estado do WebSocket (comunicado do estado do WebSocket)
    useEffect(() => {
        if (socket && !isConnected) {
            getStateWebSocket(); // Chama a função para informar sobre a desconexão ou status
        }
    }, [isConnected, socket, getStateWebSocket]); // Executa quando o status de conexão muda

    return {socket, isConnected, messages, pingTimeout};
}

export default Connect;
