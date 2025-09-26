/**
 * NotificationService - Сервис для уведомлений в реальном времени
 * Поддерживает WebSocket соединения и push уведомления
 */
export interface NotificationMessage {
  id: string;
  type: 'task' | 'project' | 'comment' | 'system';
  title: string;
  message: string;
  userId: string;
  data?: Record<string, any>;
  timestamp: Date;
  read: boolean;
}

export interface WebSocketMessage {
  type: 'notification' | 'ping' | 'pong';
  data?: any;
  timestamp: Date;
}

export class NotificationService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private pingInterval: NodeJS.Timeout | null = null;
  private listeners: Map<string, Set<(message: NotificationMessage) => void>> = new Map();

  constructor(private wsUrl: string) {
    this.connect();
  }

  private connect(): void {
    try {
      this.ws = new WebSocket(this.wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.startPing();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.stopPing();
        this.reconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.reconnect();
    }
  }

  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  private startPing(): void {
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping', timestamp: new Date() });
      }
    }, 30000);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'notification':
        this.handleNotification(message.data);
        break;
      case 'pong':
        // Handle pong response
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private handleNotification(notification: NotificationMessage): void {
    // Notify all listeners for this notification type
    const listeners = this.listeners.get(notification.type);
    if (listeners) {
      listeners.forEach(listener => listener(notification));
    }

    // Show browser notification if permission granted
    this.showBrowserNotification(notification);
  }

  private async showBrowserNotification(notification: NotificationMessage): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
        data: notification.data
      });

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
      };
    }
  }

  public async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  public subscribe(
    type: string,
    listener: (message: NotificationMessage) => void
  ): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    
    this.listeners.get(type)!.add(listener);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(type);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  public send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  public sendNotification(
    type: 'task' | 'project' | 'comment' | 'system',
    title: string,
    message: string,
    userId: string,
    data?: Record<string, any>
  ): void {
    const notification: NotificationMessage = {
      id: this.generateId(),
      type,
      title,
      message,
      userId,
      data,
      timestamp: new Date(),
      read: false
    };

    this.send({
      type: 'notification',
      data: notification,
      timestamp: new Date()
    });
  }

  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  public disconnect(): void {
    this.stopPing();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// Глобальный экземпляр сервиса уведомлений
export const notificationService = new NotificationService(
  process.env.REACT_APP_WS_URL || 'ws://localhost:3001'
);
