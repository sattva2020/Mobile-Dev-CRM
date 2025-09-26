import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GitHubService } from '../services/githubService';
import { Notification } from '../context/AppContext';
import { 
  Github, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users,
  GitBranch,
  Star,
  Eye,
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';

// Компонент статистики репозитория
const RepositoryStats: React.FC<{ stats: any }> = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center space-x-2">
        <GitBranch className="h-4 w-4 text-blue-500" />
        <span className="text-sm text-gray-600">Issues</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{stats.totalIssues}</div>
      <div className="text-xs text-gray-500">
        {stats.openIssues} открытых, {stats.closedIssues} закрытых
      </div>
    </div>

    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center space-x-2">
        <GitBranch className="h-4 w-4 text-green-500" />
        <span className="text-sm text-gray-600">Pull Requests</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{stats.totalPulls}</div>
      <div className="text-xs text-gray-500">
        {stats.openPulls} открытых, {stats.mergedPulls} смерженных
      </div>
    </div>

    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center space-x-2">
        <Activity className="h-4 w-4 text-purple-500" />
        <span className="text-sm text-gray-600">Коммиты</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{stats.totalCommits}</div>
      <div className="text-xs text-gray-500">
        {stats.commitsLastWeek} за неделю
      </div>
    </div>

    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center space-x-2">
        <TrendingUp className="h-4 w-4 text-orange-500" />
        <span className="text-sm text-gray-600">Активность</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{stats.commitsLastMonth}</div>
      <div className="text-xs text-gray-500">коммитов за месяц</div>
    </div>
  </div>
);

// Компонент информации о rate limit
const RateLimitInfo: React.FC<{ rateLimit: any }> = ({ rateLimit }) => {
  const percentage = (rateLimit.used / rateLimit.limit) * 100;
  const isLow = percentage > 80;
  const isCritical = percentage > 95;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">GitHub API Rate Limit</span>
        <span className={`text-sm font-medium ${
          isCritical ? 'text-red-600' : isLow ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {rateLimit.remaining} / {rateLimit.limit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            isCritical ? 'bg-red-500' : isLow ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Сброс: {new Date(rateLimit.reset).toLocaleString('ru-RU')}
      </div>
    </div>
  );
};

// Компонент синхронизации
const SyncPanel: React.FC<{
  onSync: () => Promise<void>;
  isSyncing: boolean;
  lastSync?: string;
  syncResult?: { synced: number; errors: string[] };
}> = ({ onSync, isSyncing, lastSync, syncResult }) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Синхронизация с GitHub</h3>
      <button
        onClick={onSync}
        disabled={isSyncing}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          isSyncing
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
        <span>{isSyncing ? 'Синхронизация...' : 'Синхронизировать'}</span>
      </button>
    </div>

    {lastSync && (
      <div className="text-sm text-gray-600 mb-4">
        Последняя синхронизация: {new Date(lastSync).toLocaleString('ru-RU')}
      </div>
    )}

    {syncResult && (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm text-gray-700">
            Синхронизировано задач: {syncResult.synced}
          </span>
        </div>
        {syncResult.errors.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">Ошибки:</span>
            </div>
            {syncResult.errors.map((error, index) => (
              <div key={index} className="text-xs text-red-600 ml-6">
                • {error}
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

// Главный компонент GitHub интеграции
const GitHubIntegration: React.FC = () => {
  const { state, actions } = useApp();
  const [githubService, setGitHubService] = useState<GitHubService | null>(null);
  const [repositoryInfo, setRepositoryInfo] = useState<any>(null);
  const [repositoryStats, setRepositoryStats] = useState<any>(null);
  const [rateLimit, setRateLimit] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ synced: number; errors: string[] } | null>(null);

  // Инициализация GitHub сервиса
  useEffect(() => {
    if (state.settings.github.token && state.settings.github.repository.owner && state.settings.github.repository.name) {
      const service = new GitHubService(
        state.settings.github.token,
        state.settings.github.repository.owner,
        state.settings.github.repository.name
      );
      setGitHubService(service);
      loadRepositoryData(service);
    }
  }, [state.settings.github]);

  const loadRepositoryData = async (service: GitHubService) => {
    setIsLoading(true);
    try {
      const [info, stats, limit] = await Promise.all([
        service.getRepositoryInfo(),
        service.getRepositoryStats(),
        service.getRateLimit(),
      ]);
      
      setRepositoryInfo(info);
      setRepositoryStats(stats);
      setRateLimit(limit);
    } catch (error) {
      console.error('Error loading repository data:', error);
        actions.addNotification({
          type: 'error',
          title: 'Ошибка загрузки данных',
          message: 'Не удалось загрузить информацию о репозитории',
          source: 'github',
          read: false,
        });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    if (!githubService) return;

    setIsSyncing(true);
    try {
      const result = await githubService.syncTasksWithIssues(state.tasks);
      setSyncResult(result);
      
      actions.setLastSync(new Date().toISOString());
        actions.addNotification({
          type: 'success',
          title: 'Синхронизация завершена',
          message: `Синхронизировано ${result.synced} задач`,
          source: 'github',
          read: false,
        });

      if (result.errors.length > 0) {
        actions.addNotification({
          type: 'warning',
          title: 'Ошибки синхронизации',
          message: `Обнаружено ${result.errors.length} ошибок`,
          source: 'github',
          read: false,
        });
      }
    } catch (error) {
      console.error('Error syncing with GitHub:', error);
      actions.addNotification({
        type: 'error',
        title: 'Ошибка синхронизации',
        message: 'Не удалось синхронизировать с GitHub',
        source: 'github',
        read: false,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const testConnection = async () => {
    if (!githubService) return;

    try {
      const isConnected = await githubService.testConnection();
      if (isConnected) {
        actions.setGitHubService(true);
        actions.addNotification({
          type: 'success',
          title: 'Подключение успешно',
          message: 'GitHub API доступен',
          source: 'github',
          read: false,
        });
      } else {
        actions.setGitHubService(false);
        actions.addNotification({
          type: 'error',
          title: 'Ошибка подключения',
          message: 'Не удалось подключиться к GitHub API',
          source: 'github',
          read: false,
        });
      }
    } catch (error) {
      actions.setGitHubService(false);
      actions.addNotification({
        type: 'error',
        title: 'Ошибка подключения',
        message: 'Ошибка при тестировании подключения',
        source: 'github',
        read: false,
      });
    }
  };

  if (!state.settings.github.token) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Github className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            GitHub не настроен
          </h3>
          <p className="text-yellow-700 mb-4">
            Для использования GitHub интеграции необходимо настроить Personal Access Token
          </p>
          <button
            onClick={() => window.location.href = '#settings'}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Перейти к настройкам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GitHub интеграция</h1>
          <p className="text-gray-600 mt-1">
            Управление задачами и синхронизация с GitHub Issues
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={testConnection}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Тест подключения
          </button>
          <button
            onClick={() => githubService && loadRepositoryData(githubService)}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Загрузка...' : 'Обновить данные'}
          </button>
        </div>
      </div>

      {/* Информация о репозитории */}
      {repositoryInfo && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {repositoryInfo.fullName}
              </h2>
              <p className="text-gray-600 mb-4">{repositoryInfo.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>{repositoryInfo.stars}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitBranch className="h-4 w-4" />
                  <span>{repositoryInfo.forks}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{repositoryInfo.openIssues} issues</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {repositoryInfo.language}
                  </span>
                </div>
              </div>
            </div>
            <a
              href={repositoryInfo.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Открыть в GitHub
            </a>
          </div>
        </div>
      )}

      {/* Статистика репозитория */}
      {repositoryStats && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика репозитория</h3>
          <RepositoryStats stats={repositoryStats} />
        </div>
      )}

      {/* Rate Limit */}
      {rateLimit && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Rate Limit</h3>
          <RateLimitInfo rateLimit={rateLimit} />
        </div>
      )}

      {/* Панель синхронизации */}
      <SyncPanel
        onSync={handleSync}
        isSyncing={isSyncing}
        lastSync={state.lastSync}
        syncResult={syncResult || undefined}
      />

      {/* Быстрые действия */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => githubService && loadRepositoryData(githubService)}
            className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <RefreshCw className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Обновить статистику</span>
          </button>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            <Zap className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">Синхронизировать задачи</span>
          </button>
          <button
            onClick={testConnection}
            className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <CheckCircle className="h-5 w-5 text-purple-600" />
            <span className="text-purple-800 font-medium">Проверить подключение</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GitHubIntegration;
