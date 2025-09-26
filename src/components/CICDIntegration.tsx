import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Github,
  Zap,
  Cloud,
  Database,
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
  Play,
  AppStore,
  TestTube,
  Layers,
  Code,
  Terminal
} from 'lucide-react';

// Интерфейсы для CI/CD интеграции
interface GitHubActionsMetrics {
  workflows: {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    averageRunTime: number;
  };
  builds: {
    totalBuilds: number;
    successfulBuilds: number;
    failedBuilds: number;
    averageBuildTime: number;
  };
  deployments: {
    totalDeployments: number;
    successfulDeployments: number;
    failedDeployments: number;
    averageDeploymentTime: number;
  };
  security: {
    vulnerabilities: number;
    securityScans: number;
    dependencyUpdates: number;
    securityAlerts: number;
  };
}

interface FastlaneMetrics {
  lanes: {
    totalLanes: number;
    successfulLanes: number;
    failedLanes: number;
    averageLaneTime: number;
  };
  platforms: {
    ios: {
      builds: number;
      deployments: number;
      screenshots: number;
    };
    android: {
      builds: number;
      deployments: number;
      screenshots: number;
    };
  };
  automation: {
    automatedTasks: number;
    manualTasks: number;
    timeSaved: number;
  };
}

interface AppCenterMetrics {
  builds: {
    totalBuilds: number;
    successfulBuilds: number;
    failedBuilds: number;
    averageBuildTime: number;
  };
  tests: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    testCoverage: number;
  };
  crashes: {
    totalCrashes: number;
    uniqueCrashes: number;
    affectedUsers: number;
    crashRate: number;
  };
  analytics: {
    activeUsers: number;
    sessions: number;
    retention: number;
    engagement: number;
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

// Компонент GitHub Actions интеграции
const GitHubActionsIntegration: React.FC<{
  metrics: GitHubActionsMetrics;
}> = ({ metrics }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-800 rounded-lg">
            <Github className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">GitHub Actions</h3>
            <p className="text-sm text-gray-600">CI/CD автоматизация</p>
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
          <p className="text-2xl font-bold text-green-600">{metrics.workflows.successfulRuns}</p>
          <p className="text-sm text-gray-600">Успешные запуски</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{metrics.builds.successfulBuilds}</p>
          <p className="text-sm text-gray-600">Успешные сборки</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{metrics.deployments.successfulDeployments}</p>
          <p className="text-sm text-gray-600">Успешные деплои</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{metrics.security.vulnerabilities}</p>
          <p className="text-sm text-gray-600">Уязвимости</p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Статистика workflow</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.workflows.totalRuns}</p>
                <p className="text-sm text-gray-600">Всего запусков</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{Math.round(metrics.workflows.averageRunTime / 60)}m</p>
                <p className="text-sm text-gray-600">Среднее время</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Безопасность</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.security.securityScans}</p>
                <p className="text-sm text-gray-600">Сканирования</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.security.dependencyUpdates}</p>
                <p className="text-sm text-gray-600">Обновления зависимостей</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент Fastlane интеграции
const FastlaneIntegration: React.FC<{
  metrics: FastlaneMetrics;
}> = ({ metrics }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-500 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Fastlane</h3>
            <p className="text-sm text-gray-600">Автоматизация мобильной разработки</p>
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
          <p className="text-2xl font-bold text-green-600">{metrics.lanes.successfulLanes}</p>
          <p className="text-sm text-gray-600">Успешные lanes</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{metrics.platforms.ios.builds + metrics.platforms.android.builds}</p>
          <p className="text-sm text-gray-600">Всего сборок</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{metrics.platforms.ios.deployments + metrics.platforms.android.deployments}</p>
          <p className="text-sm text-gray-600">Деплои</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{Math.round(metrics.automation.timeSaved / 60)}h</p>
          <p className="text-sm text-gray-600">Сэкономлено времени</p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Платформы</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.platforms.ios.builds}</p>
                <p className="text-sm text-gray-600">iOS сборки</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.platforms.android.builds}</p>
                <p className="text-sm text-gray-600">Android сборки</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Автоматизация</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.automation.automatedTasks}</p>
                <p className="text-sm text-gray-600">Автоматизированные задачи</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.automation.manualTasks}</p>
                <p className="text-sm text-gray-600">Ручные задачи</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент App Center интеграции
const AppCenterIntegration: React.FC<{
  metrics: AppCenterMetrics;
}> = ({ metrics }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Cloud className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">App Center</h3>
            <p className="text-sm text-gray-600">Microsoft App Center</p>
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
          <p className="text-2xl font-bold text-green-600">{metrics.builds.successfulBuilds}</p>
          <p className="text-sm text-gray-600">Успешные сборки</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{metrics.tests.passedTests}</p>
          <p className="text-sm text-gray-600">Пройденные тесты</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{metrics.crashes.crashRate}%</p>
          <p className="text-sm text-gray-600">Частота крашей</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{metrics.analytics.activeUsers.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Активные пользователи</p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Тестирование</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.tests.testCoverage}%</p>
                <p className="text-sm text-gray-600">Покрытие тестами</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.tests.failedTests}</p>
                <p className="text-sm text-gray-600">Проваленные тесты</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Аналитика</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.analytics.sessions.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Сессии</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.analytics.retention}%</p>
                <p className="text-sm text-gray-600">Удержание</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Главный компонент CI/CD интеграции
const CICDIntegration: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);
  
  // Моковые данные для демонстрации
  const githubActionsMetrics: GitHubActionsMetrics = {
    workflows: {
      totalRuns: 1250,
      successfulRuns: 1180,
      failedRuns: 70,
      averageRunTime: 180
    },
    builds: {
      totalBuilds: 850,
      successfulBuilds: 800,
      failedBuilds: 50,
      averageBuildTime: 120
    },
    deployments: {
      totalDeployments: 150,
      successfulDeployments: 140,
      failedDeployments: 10,
      averageDeploymentTime: 300
    },
    security: {
      vulnerabilities: 3,
      securityScans: 45,
      dependencyUpdates: 12,
      securityAlerts: 2
    }
  };
  
  const fastlaneMetrics: FastlaneMetrics = {
    lanes: {
      totalLanes: 200,
      successfulLanes: 185,
      failedLanes: 15,
      averageLaneTime: 240
    },
    platforms: {
      ios: {
        builds: 120,
        deployments: 45,
        screenshots: 30
      },
      android: {
        builds: 100,
        deployments: 40,
        screenshots: 25
      }
    },
    automation: {
      automatedTasks: 85,
      manualTasks: 15,
      timeSaved: 480
    }
  };
  
  const appCenterMetrics: AppCenterMetrics = {
    builds: {
      totalBuilds: 300,
      successfulBuilds: 280,
      failedBuilds: 20,
      averageBuildTime: 90
    },
    tests: {
      totalTests: 1500,
      passedTests: 1420,
      failedTests: 80,
      testCoverage: 78
    },
    crashes: {
      totalCrashes: 25,
      uniqueCrashes: 15,
      affectedUsers: 120,
      crashRate: 0.3
    },
    analytics: {
      activeUsers: 15420,
      sessions: 28450,
      retention: 65,
      engagement: 78
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };
  
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen" data-testid="cicd-integration">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CI/CD интеграции</h1>
          <p className="text-gray-600 mt-1">GitHub Actions, Fastlane, App Center</p>
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
          title="Успешные workflow"
          value={githubActionsMetrics.workflows.successfulRuns}
          change={12.5}
          icon={Github}
          color="bg-gray-800"
          description="GitHub Actions"
        />
        <MetricCard
          title="Автоматизированные задачи"
          value={fastlaneMetrics.automation.automatedTasks}
          change={8.3}
          icon={Zap}
          color="bg-green-500"
          description="Fastlane"
        />
        <MetricCard
          title="Пройденные тесты"
          value={appCenterMetrics.tests.passedTests}
          change={5.7}
          icon={TestTube}
          color="bg-blue-500"
          description="App Center"
        />
        <MetricCard
          title="Сэкономлено времени"
          value={`${Math.round(fastlaneMetrics.automation.timeSaved / 60)}h`}
          change={15.2}
          icon={Clock}
          color="bg-purple-500"
          description="Автоматизация"
        />
      </div>
      
      {/* Детальные интеграции */}
      <div className="space-y-6">
        <GitHubActionsIntegration metrics={githubActionsMetrics} />
        <FastlaneIntegration metrics={fastlaneMetrics} />
        <AppCenterIntegration metrics={appCenterMetrics} />
      </div>
    </div>
  );
};

export default CICDIntegration;
