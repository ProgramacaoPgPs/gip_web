import { useEffect, useState } from 'react';

/**
 * Custom Hook para gerenciar a conexão WebSocket com o servidor.
 *
 * @returns {Object} Objeto contendo o estado da conexão e métodos para interagir com o WebSocket.
 * - isConnected: booleano que indica se a conexão está ativa.
 * - send: função para enviar mensagens pelo WebSocket.
 * - disconnect: função para desconectar o WebSocket.
 * - data: função para capturar os dados do WebSocket que são enviados por outras aplicações.
 */
const useWebSocketGTPP = () => {
  // Estado que armazena a instância do WebSocket.
  const [socket, setSocket] = useState<WebSocket | null>(null);
  
  // Estado que indica se o WebSocket está conectado.
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  // Estado que armazena o timeout para verificar a resposta do ping.
  const [timeOut, setTimeOut] = useState<NodeJS.Timeout | null>(null);

  // Estado aonde vou pegar os dados do webSocket
  const [data, setData] = useState<Object | null>({});

  useEffect(() => {
    /**
     * Função para conectar ao WebSocket.
     * Inicializa a conexão e configura os manipuladores de eventos.
     */
    const connect = () => {
      // Verifica se o token de autenticação está presente no localStorage.
      if (localStorage?.tokenGIPP) {
        // Cria uma nova instância do WebSocket.
        const ws = new WebSocket("ws://192.168.0.99:3333");

        // Manipulador de evento chamado quando a conexão é aberta.
        ws.onopen = () => {
          console.log("Conexão aberta");
          
          // Mensagem de autenticação a ser enviada ao servidor.
          const authMessage = {
            auth: localStorage.tokenGIPP,
            app_id: 18,
          };
          
          // Envia a mensagem de autenticação ao servidor.
          ws.send(JSON.stringify(authMessage));
          
          // Configura um intervalo para enviar pings a cada 10 segundos.
          setInterval(() => ping(ws), 10000);
          
          // Atualiza o estado para indicar que a conexão está ativa.
          setIsConnected(true);
        };

        // Manipulador de evento chamado em caso de erro na conexão.
        ws.onerror = (ev) => {
          console.error("Erro no WebSocket", ev);
        };

        // Manipulador de evento chamado quando a conexão é fechada.
        ws.onclose = () => {
          console.log("Conexão fechada. Tentando reconectar...");
          
          // Atualiza o estado para indicar que a conexão foi encerrada.
          setIsConnected(false);
          
          // Tenta reconectar após 1 segundo.
          setTimeout(connect, 1000);
        };

        // Manipulador de evento chamado quando uma mensagem é recebida.
        ws.onmessage = (ev) => {
          const data = ev.data;

          // Se a mensagem recebida for um pong, chama a função pong.
          if (data === "__pong__") {
            pong();
            return;
          }

          // Tenta analisar a resposta recebida como JSON.
          const response = JSON.parse(data);
          console.log("Dados recebidos:", response);
          setData(response);

          // Verifica se há um erro na resposta e registra no console.
          if (response.error) {
            console.error("Erro na resposta:", response.error);
          } else if (response.send_user_id) {
            console.log("ID do usuário:", response.send_user_id);
            // Se houver um objeto na resposta, exibe-o no console.
            if (response.object) {
              console.log("Objeto:", response.object);
            }
          }
        };

        // Atualiza o estado com a nova instância do WebSocket.
        setSocket(ws);
      }
    };

    // Chama a função de conexão ao montar o componente.
    connect();

    // Função de limpeza que é chamada quando o componente é desmontado.
    return () => {
      disconnect();
    };
  }, []);

  /**
   * Função para enviar um ping ao servidor e verificar a conexão.
   * @param {WebSocket} ws - A instância do WebSocket.
   */
  const ping = (ws: WebSocket) => {
    // Verifica se o WebSocket está conectado e envia um ping.
    if (isConnected && ws) {
      ws.send("__ping__");
      
      // Configura um timeout para verificar se o pong é recebido.
      const timeout = setTimeout(() => {
        console.log("Timeout: não recebeu __pong__");
      }, 5000);
      // Atualiza o estado com o timeout.
      setTimeOut(timeout);
    }
  };

  /**
   * Função chamada ao receber um pong do servidor.
   * Limpa o timeout configurado para o ping.
   */
  const pong = () => {
    if (timeOut) {
      clearTimeout(timeOut); // Limpa o timeout ativo.
      setTimeOut(null); // Reseta o estado do timeout.
    }
  };

  /**
   * Função para enviar uma mensagem ao servidor pelo WebSocket.
   * @param {Object} json - O objeto que será convertido em JSON e enviado.
   */
  const send = (json: object) => {
    // Verifica se o WebSocket está conectado antes de enviar a mensagem.
    if (isConnected && socket) {
      socket.send(JSON.stringify(json)); // Envia a mensagem em formato JSON.
    } else {
      console.warn("Não está conectado ao WebSocket");
    }
  };

  /**
   * Função para desconectar o WebSocket.
   */
  const disconnect = () => {
    socket?.close(); // Fecha a conexão do WebSocket, se estiver aberto.
    setIsConnected(false); // Atualiza o estado para indicar desconexão.
  };

  // Retorna o estado da conexão e as funções para interação com o WebSocket.
  return { isConnected, send, disconnect, data };
};

export default useWebSocketGTPP;
