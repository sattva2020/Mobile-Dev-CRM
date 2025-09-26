import React, { useState, useEffect } from 'react';
import { realtimeMonitoring, SystemStatus, MetricData, AlertData } from '../shared/services/RealtimeMonitoring';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  Cpu,
  HardDrive,
  Wifi,
  Database,
  Server,
  Monitor
} from 'lucide-react';

/**
 * RealtimeMonitoringDashboard - Дашборд мониторинга в реальном времени
 * Отображает метрики, алерты и статус системы
 */
const RealtimeMonitoringDashboard: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [metrics, setMetrics] = useState<Map<string, MetricData>>(new Map());
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Подписка на обновления статуса
    const unsubscribeStatus = realtimeMonitoring.subscribe('status', (status: SystemStatus) => {
      setSystemStatus(status);
    });

    // Подписка на обновления метрик
    const unsubscribeMetrics = realtimeMonitoring.subscribe('metric', (metric: MetricData) => {
      setMetrics(prev => new Map(prev.set(metric.name, metric)));
    });

    // Подписка на обновления алертов
    const unsubscribeAlerts = realtimeMonitoring.subscribe('alert', (alert: AlertData) => {
      setAlerts(prev => [...prev, alert].slice(-100)); // Keep last 100 alerts
    });

    // Проверка соединения
    const checkConnection = () => {
      setIsConnected(realtimeMonitoring.isConnected());
    };

    const connectionInterval = setInterval(checkConnection, 5000);
    checkConnection();

    return () => {
      unsubscribeStatus();
      unsubscribeMetrics();
      unsubscribeAlerts();
      clearInterval(connectionInterval);
    };
  }, []);

  const getServiceIcon = (status: 'up' | 'down' | 'degraded') => {
    switch (status) {
      case 'up':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getServiceStatusColor = (status: 'up' | 'down' | 'degraded') => {
    switch (status) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}д ${hours}ч ${minutes}м`;
    } else if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    } else {
      return `${minutes}м`;
    }
  };

  const formatMetricValue = (value: number, type: string) => {
    if (type === 'percentage') {
      return `${value.toFixed(1)}%`;
    } else if (type === 'bytes') {
      if (value >= 1024 * 1024 * 1024) {
        return `${(value / (1024 * 1024 * 1024)).toFixed(1)}GB`;
      } else if (value >= 1024 * 1024) {
        return `${(value / (1024 * 1024)).toFixed(1)}MB`;
      } else if (value >= 1024) {
        return `${(value / 1024).toFixed(1)}KB`;
      } else {
        return `${value.toFixed(1)}B`;
      }
    } else {
      return value.toFixed(2);
    }
  };

  const getMetricIcon = (name: string) => {
    if (name.includes('cpu')) return <Cpu className="h-4 w-4" />;
    if (name.includes('memory')) return <Monitor className="h-4 w-4" />;
    if (name.includes('disk')) return <HardDrive className="h-4 w-4" />;
    if (name.includes('network')) return <Wifi className="h-4 w-4" />;
    if (name.includes('database')) return <Database className="h-4 w-4" />;
    return <Server className="h-4 w-4" />;
  };

  const getMetricTrend = (name: string, value: number) => {
    // Простая логика для определения тренда
    if (name.includes('cpu') || name.includes('memory') || name.includes('disk')) {
      if (value > 80) return <TrendingUp className="h-4 w-4 text-red-500" />;
      if (value > 60) return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Мониторинг в реальном времени</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Подключено' : 'Отключено'}
          </span>
        </div>
      </div>

      {/* Статус системы */}
      {systemStatus && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Статус системы</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Object.entries(systemStatus.services).map(([service, status]) => (
              <div key={service} className="flex items-center space-x-3 p-3 rounded-lg border">
                {getServiceIcon(status)}
                <div>
                  <div className="font-medium text-gray-900 capitalize">{service}</div>
                  <div className={`text-sm px-2 py-1 rounded-full ${getServiceStatusColor(status)}`}>
                    {status === 'up' ? 'Работает' : status === 'down' ? 'Не работает' : 'Деградирован'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatMetricValue(systemStatus.metrics.cpu, 'percentage')}
              </div>
              <div className="text-sm text-gray-600">CPU</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatMetricValue(systemStatus.metrics.memory, 'percentage')}
              </div>
              <div className="text-sm text-gray-600">Память</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatMetricValue(systemStatus.metrics.disk, 'percentage')}
              </div>
              <div className="text-sm text-gray-600">Диск</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatUptime(systemStatus.uptime)}
              </div>
              <div className="text-sm text-gray-600">Время работы</div>
            </div>
          </div>
        </div>
      )}

      {/* Метрики */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Метрики</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from(metrics.entries()).map(([name, metric]) => (
            <div key={name} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getMetricIcon(name)}
                <div>
                  <div className="font-medium text-gray-900">{name}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(metric.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-semibold text-gray-900">
                  {formatMetricValue(metric.value, metric.type)}
                </div>
                {getMetricTrend(name, metric.value)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Алерты */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Алерты</h2>
        
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p>Нет активных алертов</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.slice(-10).reverse().map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">{alert.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'error' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                    <div className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                  {alert.resolved && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealtimeMonitoringDashboard;
