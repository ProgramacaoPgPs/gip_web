class WebSocketGTPPClass {
  private socket: WebSocket | null = null;
  private isConnected: boolean = false;
  private responseWebSocket: object | null = {};
  private dataResponseWebSocket: object | null | any[] = [];
  private pingIntervalRef: NodeJS.Timeout | null = null;
  private timeoutRef: NodeJS.Timeout | null = null;
  private lastSentMessage: object | null = null;

  constructor() {
    this.connect();
  }

  // Função para conectar ao WebSocket
  private connect(): void {
    if (localStorage?.tokenGIPP) {
      this.socket = new WebSocket("ws://192.168.0.99:3333");

      this.socket.onopen = () => {
        const authMessage = {
          auth: localStorage.tokenGIPP,
          app_id: 18,
        };
        this.socket?.send(JSON.stringify(authMessage));
        this.startPing();
        this.isConnected = true;
      };

      this.socket.onerror = (ev) => {
        console.error("Erro no WebSocket", ev);
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.stopPing();
        setTimeout(() => this.connect(), 10000);
      };

      this.socket.onmessage = (ev) => {
        const data = ev.data;
        if (data === "__pong__") {
          this.pong();
          return;
        }
        try {
          const response = JSON.parse(data);
          this.responseWebSocket = response;

          if (response.error) {
            console.error("Erro recebido:", response.error);
          } else if (response.send_user_id && response.object) {
            this.dataResponseWebSocket = response.object;
          }
        } catch (error) {
          console.error("Erro ao fazer o parse do JSON", error);
        }
      };
    }
  }

  private startPing(): void {
    if (this.pingIntervalRef) {
      clearInterval(this.pingIntervalRef);
    }

    this.pingIntervalRef = setInterval(() => {
      this.ping();
    }, 10000);
  }

  private stopPing(): void {
    if (this.pingIntervalRef) {
      clearInterval(this.pingIntervalRef);
      this.pingIntervalRef = null;
    }
  }

  private ping(): void {
    if (this.isConnected && this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send("__ping__");

      if (this.timeoutRef) {
        clearTimeout(this.timeoutRef);
      }

      this.timeoutRef = setTimeout(() => {
        console.warn("Timeout: não recebeu __pong__");
      }, 5000);
    }
  }

  private pong(): void {
    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
      this.timeoutRef = null;
    }
  }

  public send(json: object): void {
    if (this.isConnected && this.socket?.readyState === WebSocket.OPEN) {
      this.lastSentMessage = json;
      this.socket.send(JSON.stringify(json));
      console.log('Mensagem enviada:', this.lastSentMessage);
    } else {
      console.warn("Não está conectado ao WebSocket ou o socket está fechado");
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.stopPing();
      this.socket.close();
      this.isConnected = false;
    }
  }

  public getResponseWebSocket(): object | null {
    return this.responseWebSocket;
  }

  public getDataResponseWebSocket(): object | null | any[] {
    return this.dataResponseWebSocket;
  }

  public getLastSentMessage(): object | null {
    return this.lastSentMessage;
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }
}

export default WebSocketGTPPClass;
