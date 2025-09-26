import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Play,
  Database,
  Zap,
  Shield,
  MessageSquare,
  BarChart3,
  Download,
  Upload,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Star,
  TrendingUp,
  Activity,
  Bug,
  Wrench,
  Cloud,
  Lock,
  Eye,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ExternalLink,
  Monitor,
  Smartphone as MobileIcon,
  Laptop,
  Server
} from 'lucide-react';

// Интерфейсы для Android интеграции
interface FirebaseMetrics {
  analytics: {
    activeUsers: number;
    sessions: number;
    crashFreeUsers: number;
    avgSessionDuration: number;
  };
  crashlytics: {
    crashCount: number;
    crashFreeUsers: number;
    nonFatalCount: number;
    stability: number;
  };
  performance: {
    appStartTime: number;
    httpResponseTime: number;
    networkRequestCount: number;
    slowFrames: number;
  };
  messaging: {
    sentMessages: number;
    deliveredMessages: number;
    openRate: number;
    clickRate: number;
  };
}

interface PlayConsoleMetrics {
  appStats: {
    installs: number;
    uninstalls: number;
    activeInstalls: number;
    crashes: number;
    anrs: number;
  };
  reviews: {
    averageRating: number;
    totalReviews: number;
    recentReviews: number;
    ratingDistribution: Array<{ rating: number; count: number }>;
  };
  revenue: {
    totalRevenue: number;
    monthlyRevenue: number;
    inAppPurchases: number;
    subscriptions: number;
  };
  crashes: {
    crashRate: number;
    affectedUsers: number;
    topCrashes: Array<{ error: string; count: number }>;
  };
}

interface AndroidStudioMetrics {
  buildLogs: {
    totalBuilds: number;
    successfulBuilds: number;
    failedBuilds: number;
    averageBuildTime: number;
  };
  debugInfo: {
    memoryUsage: number;
    cpuUsage: number;
    networkUsage: number;
    batteryUsage: number;
  };
  performanceProfiler: {
    frameRate: number;
    memoryLeaks: number;
    cpuSpikes: number;
    networkLatency: number;
  };
}

// Компонент карточки метрики
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<any>;
  color: string;
  description?: string;
  trend?: 'up' | 'down' | 'stable';
}> = ({ title, value, change, icon: Icon, color, description, trend = 'stable' }) => {
  const isPositive = change >= 0;
  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          <ChangeIcon className="h-4 w-4" />
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-gray-600 font-medium">{title}</p>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

// Компонент Firebase интеграции
const FirebaseIntegration: React.FC<{
  metrics: FirebaseMetrics;
}> = ({ metrics }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-500 rounded-lg">
            <Cloud className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Firebase</h3>
            <p className="text-sm text-gray-600">Google Firebase интеграция</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{metrics.analytics.activeUsers.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Активные пользователи</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{metrics.crashlytics.stability}%</p>
          <p className="text-sm text-gray-600">Стабильность</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{metrics.performance.appStartTime}ms</p>
          <p className="text-sm text-gray-600">Время запуска</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{metrics.messaging.openRate}%</p>
          <p className="text-sm text-gray-600">Открытие сообщений</p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Analytics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.analytics.sessions.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Сессии</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{Math.round(metrics.analytics.avgSessionDuration / 60)}m</p>
                <p className="text-sm text-gray-600">Средняя сессия</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Performance</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.performance.httpResponseTime}ms</p>
                <p className="text-sm text-gray-600">HTTP время ответа</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.performance.slowFrames}</p>
                <p className="text-sm text-gray-600">Медленные кадры</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент Google Play Console интеграции
const PlayConsoleIntegration: React.FC<{
  metrics: PlayConsoleMetrics;
}> = ({ metrics }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-500 rounded-lg">
            <Play className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Google Play Console</h3>
            <p className="text-sm text-gray-600">Статистика приложения</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{metrics.appStats.activeInstalls.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Активные установки</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{metrics.reviews.averageRating.toFixed(1)}</p>
          <p className="text-sm text-gray-600">Средний рейтинг</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{metrics.crashes.crashRate}%</p>
          <p className="text-sm text-gray-600">Частота крашей</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">${metrics.revenue.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Общий доход</p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Распределение рейтингов</h4>
            <div className="space-y-2">
              {metrics.reviews.ratingDistribution.map((rating, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">{rating.rating}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(rating.count / Math.max(...metrics.reviews.ratingDistribution.map(r => r.count))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{rating.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Топ краши</h4>
            <div className="space-y-2">
              {metrics.crashes.topCrashes.map((crash, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <span className="text-sm text-gray-700 truncate flex-1">{crash.error}</span>
                  <span className="text-sm text-red-600 font-medium">{crash.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент Android Studio интеграции
const AndroidStudioIntegration: React.FC<{
  metrics: AndroidStudioMetrics;
}> = ({ metrics }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Android Studio</h3>
            <p className="text-sm text-gray-600">Инструменты разработки</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{metrics.buildLogs.successfulBuilds}</p>
          <p className="text-sm text-gray-600">Успешные сборки</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{metrics.buildLogs.averageBuildTime}s</p>
          <p className="text-sm text-gray-600">Среднее время сборки</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{metrics.debugInfo.memoryUsage}MB</p>
          <p className="text-sm text-gray-600">Использование памяти</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{metrics.performanceProfiler.frameRate}fps</p>
          <p className="text-sm text-gray-600">Частота кадров</p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Производительность</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.debugInfo.cpuUsage}%</p>
                <p className="text-sm text-gray-600">Использование CPU</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.performanceProfiler.memoryLeaks}</p>
                <p className="text-sm text-gray-600">Утечки памяти</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Сетевые метрики</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.debugInfo.networkUsage}MB</p>
                <p className="text-sm text-gray-600">Сетевой трафик</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.performanceProfiler.networkLatency}ms</p>
                <p className="text-sm text-gray-600">Задержка сети</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Главный компонент Android интеграции
const AndroidIntegration: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);
  
  // Моковые данные для демонстрации
  const firebaseMetrics: FirebaseMetrics = {
    analytics: {
      activeUsers: 15420,
      sessions: 28450,
      crashFreeUsers: 98.5,
      avgSessionDuration: 180
    },
    crashlytics: {
      crashCount: 12,
      crashFreeUsers: 99.2,
      nonFatalCount: 45,
      stability: 99.2
    },
    performance: {
      appStartTime: 1200,
      httpResponseTime: 150,
      networkRequestCount: 25,
      slowFrames: 2
    },
    messaging: {
      sentMessages: 1250,
      deliveredMessages: 1180,
      openRate: 85.5,
      clickRate: 12.3
    }
  };
  
  const playConsoleMetrics: PlayConsoleMetrics = {
    appStats: {
      installs: 25420,
      uninstalls: 1200,
      activeInstalls: 24220,
      crashes: 15,
      anrs: 3
    },
    reviews: {
      averageRating: 4.2,
      totalReviews: 1250,
      recentReviews: 45,
      ratingDistribution: [
        { rating: 5, count: 650 },
        { rating: 4, count: 320 },
        { rating: 3, count: 180 },
        { rating: 2, count: 80 },
        { rating: 1, count: 20 }
      ]
    },
    revenue: {
      totalRevenue: 15420,
      monthlyRevenue: 2850,
      inAppPurchases: 1200,
      subscriptions: 1650
    },
    crashes: {
      crashRate: 0.2,
      affectedUsers: 45,
      topCrashes: [
        { error: "NullPointerException in MainActivity", count: 8 },
        { error: "OutOfMemoryError in ImageLoader", count: 5 },
        { error: "NetworkException in API call", count: 3 }
      ]
    }
  };
  
  const androidStudioMetrics: AndroidStudioMetrics = {
    buildLogs: {
      totalBuilds: 1250,
      successfulBuilds: 1180,
      failedBuilds: 70,
      averageBuildTime: 45
    },
    debugInfo: {
      memoryUsage: 85,
      cpuUsage: 65,
      networkUsage: 25,
      batteryUsage: 15
    },
    performanceProfiler: {
      frameRate: 60,
      memoryLeaks: 2,
      cpuSpikes: 5,
      networkLatency: 120
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };
  
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen" data-testid="android-integration">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Android интеграция</h1>
          <p className="text-gray-600 mt-1">Firebase, Google Play Console, Android Studio</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Последние 24 часа</option>
            <option value="7d">Последние 7 дней</option>
            <option value="30d">Последние 30 дней</option>
            <option value="90d">Последние 90 дней</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Активные пользователи"
          value={firebaseMetrics.analytics.activeUsers.toLocaleString()}
          change={12.5}
          icon={Users}
          color="bg-blue-500"
          description="Firebase Analytics"
        />
        <MetricCard
          title="Стабильность"
          value={`${firebaseMetrics.crashlytics.stability}%`}
          change={2.1}
          icon={Shield}
          color="bg-green-500"
          description="Crashlytics"
        />
        <MetricCard
          title="Средний рейтинг"
          value={playConsoleMetrics.reviews.averageRating.toFixed(1)}
          change={5.2}
          icon={Star}
          color="bg-yellow-500"
          description="Google Play"
        />
        <MetricCard
          title="Успешные сборки"
          value={`${Math.round((androidStudioMetrics.buildLogs.successfulBuilds / androidStudioMetrics.buildLogs.totalBuilds) * 100)}%`}
          change={8.3}
          icon={CheckCircle}
          color="bg-purple-500"
          description="Android Studio"
        />
      </div>
      
      {/* Детальные интеграции */}
      <div className="space-y-6">
        <FirebaseIntegration metrics={firebaseMetrics} />
        <PlayConsoleIntegration metrics={playConsoleMetrics} />
        <AndroidStudioIntegration metrics={androidStudioMetrics} />
      </div>
    </div>
  );
};

export default AndroidIntegration;
