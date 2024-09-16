let ws: WebSocket;

interface NotifyMessage {
  objectType?: string;
  user?: string;
  message?: string;
  error?: boolean;
  send_user?: string;
}

export default class WebSocketCLPP {
  isConnected: boolean = false;
  tokens: any;
  sender: { id: string }= { id: '148' };
  funcReceived!: (notify: NotifyMessage) => void;
  funcView!: (notify: NotifyMessage) => Promise<void>;

  constructor(
    tokens: any,
    funcReceived: (notify: NotifyMessage) => void,
    funcView: (notify: NotifyMessage) => Promise<void>
  ) {
    this.tokens = tokens;
    if(funcReceived) this.funcReceived = funcReceived;
    if(funcView) this.funcView = funcView;
  }

  connectWebSocket(): void {
    try {
      const localWs = new WebSocket('ws://192.168.0.99:9193');
      ws = localWs;

      localWs.onopen = () => {
        this.onOpen(localWs);
        console.log('connected',localWs)
      };

      localWs.onerror = (ev: Event) => {
        this.onError(ev);
      };

      localWs.onclose = () => {
        this.onClose();
      };

      localWs.onmessage = (ev: MessageEvent) => {
        this.onMessage(ev);
      };
      
    } catch (error) {
      console.log(error);
    }
  }

  onOpen(localWs: WebSocket): void {
    const jsonString = {
      auth: this.tokens,
      app_id: 18,
    };
    localWs.send(JSON.stringify(jsonString));
    this.isConnected = true;
  }

  onError(ev: Event): void {
    console.log(ev);
  }

  onClose(): void {
    setTimeout(() => {
      this.connectWebSocket();
    }, 1000);
    this.isConnected = false;
  }

  async onMessage(ev: MessageEvent): Promise<void> {
    const getNotify: NotifyMessage = JSON.parse(ev.data);

    if (getNotify.objectType === 'notification') {
      if (getNotify.user === this.sender.id) {
        await this.funcView(getNotify);
      }
    } else if (getNotify.message && !getNotify.error) {
      this.funcReceived(getNotify);
      if (getNotify.send_user === this.sender.id) {
        this.informPreview(this.sender.id);
      }
    }
  }

  async informPreview(idSender: string): Promise<void> {
    const jsonString: { type: number; send_id: string } = {
      type: 3,
      send_id: idSender,
    };
    ws.send(JSON.stringify(jsonString));
  }

  informSending(type: number, send_id: string, message_id: string): void {
    const jsonString: { type: number; send_id: string; last_id: string } = {
      type,
      send_id,
      last_id: message_id,
    };
    ws.send(JSON.stringify(jsonString));
  }

  informSendingGroup(type: number, group_id: string, message_id: string): void {
    const jsonString: { type: number; group_id: string; last_id: string } = {
      type,
      group_id,
      last_id: message_id,
    };
    ws.send(JSON.stringify(jsonString));
  }
}