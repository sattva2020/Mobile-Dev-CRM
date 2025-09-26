import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Upload,
  Settings,
  BarChart3,
  Activity
} from 'lucide-react';
import SupabaseService from '../services/supabaseService';

interface SupabaseStatus {
  isConnected: boolean;
  isRunning: boolean;
  url: string;
  anonKey: string;
  projectId: string;
}

const SupabaseManager: React.FC = () => {
  const [status, setStatus] = useState<SupabaseStatus>({
    isConnected: false,
    isRunning: false,
    url: 'http://localhost:54321',
    anonKey: '',
    projectId: '550e8400-e29b-41d4-a716-446655440000'
  });
  const [supabaseService, setSupabaseService] = useState<SupabaseService | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Load configuration from localStorage
  useEffect(() => {
    const savedUrl = localStorage.getItem('supabase-url');
    const savedAnonKey = localStorage.getItem('supabase-anon-key');
    const savedProjectId = localStorage.getItem('supabase-project-id');

    if (savedUrl) setStatus(prev => ({ ...prev, url: savedUrl }));
    if (savedAnonKey) setStatus(prev => ({ ...prev, anonKey: savedAnonKey }));
    if (savedProjectId) setStatus(prev => ({ ...prev, projectId: savedProjectId }));

    // Check if Supabase is running
    checkSupabaseStatus();
  }, []);

  const checkSupabaseStatus = async () => {
    try {
      const response = await fetch(`${status.url}/health`);
      if (response.ok) {
        setStatus(prev => ({ ...prev, isRunning: true, isConnected: true }));
        initializeSupabaseService();
      } else {
        setStatus(prev => ({ ...prev, isRunning: false, isConnected: false }));
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, isRunning: false, isConnected: false }));
      addLog('Supabase не запущен или недоступен');
    }
  };

  const initializeSupabaseService = () => {
    if (status.url && status.anonKey) {
      const service = new SupabaseService(status.url, status.anonKey, status.projectId);
      setSupabaseService(service);
      addLog('Supabase сервис инициализирован');
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const startSupabase = async () => {
    setIsLoading(true);
    addLog('Запуск Supabase...');
    
    try {
      // This would typically call a backend endpoint to start Supabase
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus(prev => ({ ...prev, isRunning: true }));
      addLog('Supabase запущен успешно');
      
      // Initialize service after startup
      setTimeout(() => {
        initializeSupabaseService();
        checkSupabaseStatus();
      }, 1000);
      
    } catch (error) {
      addLog(`Ошибка запуска Supabase: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const stopSupabase = async () => {
    setIsLoading(true);
    addLog('Остановка Supabase...');
    
    try {
      // This would typically call a backend endpoint to stop Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus(prev => ({ ...prev, isRunning: false, isConnected: false }));
      setSupabaseService(null);
      addLog('Supabase остановлен');
      
    } catch (error) {
      addLog(`Ошибка остановки Supabase: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMetrics = async () => {
    if (!supabaseService) return;
    
    setIsLoading(true);
    try {
      const metricsData = await supabaseService.getProjectMetrics();
      setMetrics(metricsData);
      addLog('Метрики загружены');
    } catch (error) {
      addLog(`Ошибка загрузки метрик: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const migrateData = async () => {
    if (!supabaseService) return;
    
    setIsLoading(true);
    addLog('Начало миграции данных из LocalStorage...');
    
    try {
      await supabaseService.migrateFromLocalStorage();
      addLog('Миграция данных завершена успешно');
      await loadMetrics();
    } catch (error) {
      addLog(`Ошибка миграции: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = (field: keyof SupabaseStatus, value: string) => {
    setStatus(prev => ({ ...prev, [field]: value }));
    
    // Save to localStorage
    if (field === 'url') localStorage.setItem('supabase-url', value);
    if (field === 'anonKey') localStorage.setItem('supabase-anon-key', value);
    if (field === 'projectId') localStorage.setItem('supabase-project-id', value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supabase Manager</h1>
          <p className="text-gray-600">Управление локальным Supabase</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            status.isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-sm text-gray-600">
            {status.isConnected ? 'Подключен' : 'Отключен'}
          </span>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <Database className={`h-8 w-8 ${status.isConnected ? 'text-green-600' : 'text-gray-400'}`} />
            <div>
              <h3 className="font-semibold text-gray-900">База данных</h3>
              <p className="text-sm text-gray-600">
                {status.isConnected ? 'Активна' : 'Недоступна'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <Activity className={`h-8 w-8 ${status.isRunning ? 'text-blue-600' : 'text-gray-400'}`} />
            <div>
              <h3 className="font-semibold text-gray-900">Сервис</h3>
              <p className="text-sm text-gray-600">
                {status.isRunning ? 'Запущен' : 'Остановлен'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Метрики</h3>
              <p className="text-sm text-gray-600">
                {metrics ? 'Загружены' : 'Не загружены'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Конфигурация</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supabase URL
            </label>
            <input
              type="text"
              value={status.url}
              onChange={(e) => updateConfig('url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="http://localhost:54321"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anon Key
            </label>
            <input
              type="password"
              value={status.anonKey}
              onChange={(e) => updateConfig('anonKey', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project ID
            </label>
            <input
              type="text"
              value={status.projectId}
              onChange={(e) => updateConfig('projectId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="550e8400-e29b-41d4-a716-446655440000"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Действия</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={startSupabase}
            disabled={isLoading || status.isRunning}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-4 w-4 mr-2" />
            {isLoading ? 'Запуск...' : 'Запустить'}
          </button>
          
          <button
            onClick={stopSupabase}
            disabled={isLoading || !status.isRunning}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Square className="h-4 w-4 mr-2" />
            {isLoading ? 'Остановка...' : 'Остановить'}
          </button>
          
          <button
            onClick={checkSupabaseStatus}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Проверить статус
          </button>
          
          <button
            onClick={loadMetrics}
            disabled={isLoading || !status.isConnected}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Загрузить метрики
          </button>
          
          <button
            onClick={migrateData}
            disabled={isLoading || !status.isConnected}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-4 w-4 mr-2" />
            Мигрировать данные
          </button>
        </div>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Метрики проекта</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Задачи</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Всего:</span>
                  <span className="font-medium">{metrics.tasks.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">В работе:</span>
                  <span className="font-medium">{metrics.tasks.byStatus.in_progress || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Выполнено:</span>
                  <span className="font-medium">{metrics.tasks.byStatus.done || 0}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Требования</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Всего:</span>
                  <span className="font-medium">{metrics.requirements.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Одобрено:</span>
                  <span className="font-medium">{metrics.requirements.byStatus.approved || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">В работе:</span>
                  <span className="font-medium">{metrics.requirements.byStatus.in_progress || 0}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Уведомления</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Всего:</span>
                  <span className="font-medium">{metrics.notifications.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Непрочитано:</span>
                  <span className="font-medium">{metrics.notifications.unread}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Логи</h3>
        <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-sm">Логи отсутствуют</p>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="text-sm font-mono text-gray-700">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupabaseManager;
