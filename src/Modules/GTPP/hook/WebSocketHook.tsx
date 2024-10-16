import { useEffect, useState, useRef } from 'react';

/**
 * Custom Hook para gerenciar a conexão WebSocket com o servidor.
 */
const useWebSocketGTPP = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [responseWebSocket, setResponseWebSocket] = useState<Object | null>({});
  const [dataResponseWebSocket, setDataResponseWebSocket] = useState<Object | null>([]);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);  // Ref para controlar o intervalo de ping
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);      // Ref para o timeout do pong

  useEffect(() => {
    const connect = () => {
      if (localStorage?.tokenGIPP) {
        const ws = new WebSocket("ws://192.168.0.99:3333");

        ws.onopen = () => {
          // Remove ou comente a linha abaixo para evitar log de abertura de conexão
          // console.log("Conexão aberta"); 
          const authMessage = {
            auth: localStorage.tokenGIPP,
            app_id: 18,
          };
          ws.send(JSON.stringify(authMessage));
          startPing(ws); // Inicia o ping
          setIsConnected(true);
        };

        ws.onerror = (ev) => {
          console.error("Erro no WebSocket", ev);
        };

        ws.onclose = () => {
          // Remove ou comente a linha abaixo para evitar log de fechamento de conexão
          // console.log("Conexão fechada, tentando reconectar...");
          setIsConnected(false);
          stopPing(); // Para o ping quando o socket fecha
          setTimeout(connect, 1000); // Tenta reconectar após 1 segundo
        };

        ws.onmessage = (ev) => {
          const data = ev.data;
          if (data === "__pong__") {
            pong(); // Cancela o timeout se o pong foi recebido
            return;
          }
          const response = JSON.parse(data);
          setResponseWebSocket(response);

          if (response.error) {
            // Trata o erro aqui
          } else if (response.send_user_id && response.object) {
            setDataResponseWebSocket(response.object);
          }
        };

        setSocket(ws);
      }
    };

    connect(); // Inicia a conexão WebSocket

    return () => {
      disconnect(); // Limpa tudo ao desmontar o componente
    };
  }, []);

  // Função para iniciar o ping
  const startPing = (ws: WebSocket) => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current); // Evita múltiplos intervalos
    }

    pingIntervalRef.current = setInterval(() => {
      ping(ws);
    }, 10000); // Envia ping a cada 10 segundos
  };

  // Função para parar o ping
  const stopPing = () => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  };

  // Função para enviar ping
  const ping = (ws: WebSocket) => {
    if (isConnected && ws.readyState === WebSocket.OPEN) {
      ws.send("__ping__");

      // Usando timeoutRef para armazenar o timeout do pong
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Cancela qualquer timeout anterior
      }

      timeoutRef.current = setTimeout(() => {
        // Remova ou comente esta linha se não quiser logs de timeout
        // console.log("Timeout: não recebeu __pong__");
      }, 5000); // Aguarda até 5 segundos para receber __pong__
    }
  };

  // Função para lidar com o pong
  const pong = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Cancela o timeout se o __pong__ for recebido
      timeoutRef.current = null;
    }
  };

  // Função para enviar mensagens através do WebSocket
  const send = (json: object) => {
    if (isConnected && socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(json));
    } else {
      console.warn("Não está conectado ao WebSocket ou o socket está fechado");
    }
  };

  // Função para desconectar o WebSocket
  const disconnect = () => {
    if (socket) {
      stopPing(); // Para o ping antes de fechar a conexão
      socket.close();
      setIsConnected(false);
    }
  };

  return { isConnected, send, disconnect, responseWebSocket, dataResponseWebSocket };
};

export default useWebSocketGTPP;
