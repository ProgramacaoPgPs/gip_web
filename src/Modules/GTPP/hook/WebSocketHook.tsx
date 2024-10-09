import { useEffect, useState } from 'react';

/**
 * Custom Hook para gerenciar a conexão WebSocket com o servidor.
 */
const useWebSocketGTPP = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [timeOut, setTimeOut] = useState<NodeJS.Timeout | null>(null);
  const [data, setData] = useState<Object | null>({});

  useEffect(() => {
    const connect = () => {
      if (localStorage?.tokenGIPP) {
        const ws = new WebSocket("ws://192.168.0.99:3333");

        ws.onopen = () => {
          console.log("Conexão aberta");
          const authMessage = {
            auth: localStorage.tokenGIPP,
            app_id: 18,
          };
          ws.send(JSON.stringify(authMessage));
          setInterval(() => ping(ws), 10000);
          setIsConnected(true);
        };

        ws.onerror = (ev) => {
          console.error("Erro no WebSocket", ev);
        };

        ws.onclose = () => {
          console.log("Conexão fechada. Tentando reconectar...");
          setIsConnected(false);
          setTimeout(connect, 1000);
        };

        ws.onmessage = (ev) => {
          const data = ev.data;
          if (data === "__pong__") {
            pong();
            return;
          }
          const response = JSON.parse(data);
          console.log("Dados recebidos:", response);
          setData(response);

          if (response.error) {
            console.error("Erro na resposta:", response.error);
          } else if (response.send_user_id) {
            console.log("ID do usuário:", response.send_user_id);
            if (response.object) {
              console.log("Objeto:", response.object);
            }
          }
        };

        setSocket(ws);
      }
    };

    connect();

    return () => {
      disconnect();
    };
  }, []);

  const ping = (ws: WebSocket) => {
    if (isConnected && ws && ws.readyState === WebSocket.OPEN) {
      ws.send("__ping__");
      const timeout = setTimeout(() => {
        console.log("Timeout: não recebeu __pong__");
      }, 5000);
      setTimeOut(timeout);
    } else {
      console.warn("Tentativa de enviar ping quando o WebSocket não está conectado.");
    }
  };

  const pong = () => {
    if (timeOut) {
      clearTimeout(timeOut);
      setTimeOut(null);
    }
  };

  const send = (json: object) => {
    if (isConnected && socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(json));
    } else {
      console.warn("Não está conectado ao WebSocket ou o socket está fechado");
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
      setIsConnected(false);
    }
  };

  return { isConnected, send, disconnect, data };
};

export default useWebSocketGTPP;
