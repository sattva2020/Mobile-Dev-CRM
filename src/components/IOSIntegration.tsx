import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  AppStore,
  Xcode,
  TestFlight,
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
  Server,
  Apple,
  Code,
  Layers
} from 'lucide-react';

// Интерфейсы для iOS интеграции
interface AppStoreConnectMetrics {
  appStats: {
    downloads: number;
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

interface XcodeMetrics {
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
  instruments: {
    frameRate: number;
    memoryLeaks: number;
    cpuSpikes: number;
    networkLatency: number;
  };
}

interface TestFlightMetrics {
  betaTesters: {
    totalTesters: number;
    activeTesters: number;
    newTesters: number;
    feedbackCount: number;
  };
  feedback: {
    totalFeedback: number;
    resolvedFeedback: number;
    pendingFeedback: number;
    averageResponseTime: number;
  };
  crashReports: {
    totalCrashes: number;
    uniqueCrashes: number;
    affectedDevices: number;
    crashRate: number;
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

// Компонент App Store Connect интеграции
const AppStoreConnectIntegration: React.FC<{
  metrics: AppStoreConnectMetrics;
}> = ({ metrics }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <AppStore className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">App Store Connect</h3>
            <p className="text-sm text-gray-600">Статистика App Store</p>
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

// Компонент Xcode интеграции
const XcodeIntegration: React.FC<{
  metrics: XcodeMetrics;
}> = ({ metrics }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-800 rounded-lg">
            <Xcode className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Xcode</h3>
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
          <p className="text-2xl font-bold text-purple-600">{metrics.instruments.frameRate}fps</p>
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
                <p className="text-lg font-semibold text-gray-900">{metrics.instruments.memoryLeaks}</p>
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
                <p className="text-lg font-semibold text-gray-900">{metrics.instruments.networkLatency}ms</p>
                <p className="text-sm text-gray-600">Задержка сети</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент TestFlight интеграции
const TestFlightIntegration: React.FC<{
  metrics: TestFlightMetrics;
}> = ({ metrics }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <TestFlight className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">TestFlight</h3>
            <p className="text-sm text-gray-600">Бета-тестирование</p>
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
          <p className="text-2xl font-bold text-blue-600">{metrics.betaTesters.totalTesters}</p>
          <p className="text-sm text-gray-600">Всего тестеров</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{metrics.betaTesters.activeTesters}</p>
          <p className="text-sm text-gray-600">Активные тестеры</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{metrics.feedback.totalFeedback}</p>
          <p className="text-sm text-gray-600">Отзывы</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{metrics.crashReports.crashRate}%</p>
          <p className="text-sm text-gray-600">Частота крашей</p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Статистика обратной связи</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.feedback.resolvedFeedback}</p>
                <p className="text-sm text-gray-600">Решенные отзывы</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.feedback.averageResponseTime}h</p>
                <p className="text-sm text-gray-600">Среднее время ответа</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Отчеты о крашах</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.crashReports.uniqueCrashes}</p>
                <p className="text-sm text-gray-600">Уникальные краши</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.crashReports.affectedDevices}</p>
                <p className="text-sm text-gray-600">Затронутые устройства</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Главный компонент iOS интеграции
const IOSIntegration: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);
  
  // Моковые данные для демонстрации
  const appStoreConnectMetrics: AppStoreConnectMetrics = {
    appStats: {
      downloads: 18420,
      uninstalls: 800,
      activeInstalls: 17620,
      crashes: 8,
      anrs: 1
    },
    reviews: {
      averageRating: 4.5,
      totalReviews: 980,
      recentReviews: 35,
      ratingDistribution: [
        { rating: 5, count: 520 },
        { rating: 4, count: 280 },
        { rating: 3, count: 120 },
        { rating: 2, count: 45 },
        { rating: 1, count: 15 }
      ]
    },
    revenue: {
      totalRevenue: 18420,
      monthlyRevenue: 3200,
      inAppPurchases: 1500,
      subscriptions: 1700
    },
    crashes: {
      crashRate: 0.1,
      affectedUsers: 25,
      topCrashes: [
        { error: "NSInvalidArgumentException in ViewController", count: 4 },
        { error: "MemoryWarning in ImageCache", count: 2 },
        { error: "NetworkError in API call", count: 2 }
      ]
    }
  };
  
  const xcodeMetrics: XcodeMetrics = {
    buildLogs: {
      totalBuilds: 980,
      successfulBuilds: 920,
      failedBuilds: 60,
      averageBuildTime: 35
    },
    debugInfo: {
      memoryUsage: 75,
      cpuUsage: 55,
      networkUsage: 20,
      batteryUsage: 12
    },
    instruments: {
      frameRate: 60,
      memoryLeaks: 1,
      cpuSpikes: 3,
      networkLatency: 100
    }
  };
  
  const testFlightMetrics: TestFlightMetrics = {
    betaTesters: {
      totalTesters: 150,
      activeTesters: 120,
      newTesters: 15,
      feedbackCount: 45
    },
    feedback: {
      totalFeedback: 45,
      resolvedFeedback: 35,
      pendingFeedback: 10,
      averageResponseTime: 4
    },
    crashReports: {
      totalCrashes: 8,
      uniqueCrashes: 5,
      affectedDevices: 12,
      crashRate: 0.1
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };
  
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen" data-testid="ios-integration">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">iOS интеграция</h1>
          <p className="text-gray-600 mt-1">App Store Connect, Xcode, TestFlight</p>
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
          title="Активные установки"
          value={appStoreConnectMetrics.appStats.activeInstalls.toLocaleString()}
          change={15.2}
          icon={Users}
          color="bg-blue-500"
          description="App Store Connect"
        />
        <MetricCard
          title="Средний рейтинг"
          value={appStoreConnectMetrics.reviews.averageRating.toFixed(1)}
          change={8.5}
          icon={Star}
          color="bg-yellow-500"
          description="App Store"
        />
        <MetricCard
          title="Бета-тестеры"
          value={testFlightMetrics.betaTesters.totalTesters}
          change={12.3}
          icon={TestFlight}
          color="bg-indigo-500"
          description="TestFlight"
        />
        <MetricCard
          title="Успешные сборки"
          value={`${Math.round((xcodeMetrics.buildLogs.successfulBuilds / xcodeMetrics.buildLogs.totalBuilds) * 100)}%`}
          change={5.7}
          icon={CheckCircle}
          color="bg-green-500"
          description="Xcode"
        />
      </div>
      
      {/* Детальные интеграции */}
      <div className="space-y-6">
        <AppStoreConnectIntegration metrics={appStoreConnectMetrics} />
        <XcodeIntegration metrics={xcodeMetrics} />
        <TestFlightIntegration metrics={testFlightMetrics} />
      </div>
    </div>
  );
};

export default IOSIntegration;
