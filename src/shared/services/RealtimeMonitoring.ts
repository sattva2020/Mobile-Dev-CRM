/**
 * RealtimeMonitoring - Система мониторинга в реальном времени
 * Подключается к WebSocket для получения метрик и алертов
 */
export interface MetricData {
  name: string;
  value: number;
  timestamp: Date;
  labels: Record<string, string>;
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
}

export interface AlertData {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  labels: Record<string, string>;
}

export interface SystemStatus {
  services: {
    frontend: 'up' | 'down' | 'degraded';
    backend: 'up' | 'down' | 'degraded';
    database: 'up' | 'down' | 'degraded';
    redis: 'up' | 'down' | 'degraded';
    prometheus: 'up' | 'down' | 'degraded';
    grafana: 'up' | 'down' | 'degraded';
  };
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  alerts: AlertData[];
  uptime: number;
}

export class RealtimeMonitoring {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectInterval = 5000;
  private pingInterval: NodeJS.Timeout | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private metrics: Map<string, MetricData> = new Map();
  private alerts: AlertData[] = [];
  private systemStatus: SystemStatus | null = null;

  constructor(private wsUrl: string) {
    this.connect();
  }

  private connect(): void {
    try {
      this.ws = new WebSocket(this.wsUrl);
      
      this.ws.onopen = () => {
        console.log('Realtime monitoring connected');
        this.reconnectAttempts = 0;
        this.startPing();
        this.requestSystemStatus();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse monitoring message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('Realtime monitoring disconnected');
        this.stopPing();
        this.reconnect();
      };

      this.ws.onerror = (error) => {
        console.error('Realtime monitoring error:', error);
      };

    } catch (error) {
      console.error('Failed to connect to monitoring:', error);
      this.reconnect();
    }
  }

  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached for monitoring');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting to monitoring... (attempt ${this.reconnectAttempts})`);
    
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

  private handleMessage(data: any): void {
    switch (data.type) {
      case 'metric':
        this.handleMetric(data.data);
        break;
      case 'alert':
        this.handleAlert(data.data);
        break;
      case 'status':
        this.handleSystemStatus(data.data);
        break;
      case 'pong':
        // Handle pong response
        break;
      default:
        console.warn('Unknown monitoring message type:', data.type);
    }
  }

  private handleMetric(metric: MetricData): void {
    this.metrics.set(metric.name, metric);
    
    // Notify metric listeners
    const listeners = this.listeners.get('metric');
    if (listeners) {
      listeners.forEach(listener => listener(metric));
    }
  }

  private handleAlert(alert: AlertData): void {
    this.alerts.push(alert);
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
    
    // Notify alert listeners
    const listeners = this.listeners.get('alert');
    if (listeners) {
      listeners.forEach(listener => listener(alert));
    }
    
    // Show browser notification for critical alerts
    if (alert.severity === 'critical' || alert.severity === 'error') {
      this.showAlertNotification(alert);
    }
  }

  private handleSystemStatus(status: SystemStatus): void {
    this.systemStatus = status;
    
    // Notify status listeners
    const listeners = this.listeners.get('status');
    if (listeners) {
      listeners.forEach(listener => listener(status));
    }
  }

  private showAlertNotification(alert: AlertData): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(`🚨 ${alert.title}`, {
        body: alert.message,
        icon: '/favicon.ico',
        tag: alert.id,
        data: alert
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }

  public subscribe(
    type: 'metric' | 'alert' | 'status',
    listener: (data: any) => void
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

  public send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('Monitoring WebSocket is not connected');
    }
  }

  public requestSystemStatus(): void {
    this.send({ type: 'status_request', timestamp: new Date() });
  }

  public requestMetrics(names?: string[]): void {
    this.send({ 
      type: 'metrics_request', 
      names,
      timestamp: new Date() 
    });
  }

  public getMetrics(): Map<string, MetricData> {
    return new Map(this.metrics);
  }

  public getAlerts(): AlertData[] {
    return [...this.alerts];
  }

  public getSystemStatus(): SystemStatus | null {
    return this.systemStatus;
  }

  public getActiveAlerts(): AlertData[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  public getCriticalAlerts(): AlertData[] {
    return this.alerts.filter(alert => 
      !alert.resolved && 
      (alert.severity === 'critical' || alert.severity === 'error')
    );
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
}

// Глобальный экземпляр мониторинга
export const realtimeMonitoring = new RealtimeMonitoring(
  process.env.REACT_APP_MONITORING_WS_URL || 'ws://localhost:3001/monitoring'
);
