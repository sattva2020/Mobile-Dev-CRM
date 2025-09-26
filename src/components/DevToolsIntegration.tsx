import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Code,
  Shield,
  Bug,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Star,
  TrendingUp,
  Activity,
  Database,
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
  GitBranch,
  Zap,
  Settings,
  RefreshCw,
  BarChart3,
  PieChart,
  Layers,
  Terminal,
  FileText,
  GitCommit,
  Tag,
  Package,
  Download,
  Upload
} from 'lucide-react';

// Интерфейсы для инструментов разработки
interface SonarQubeMetrics {
  quality: {
    qualityGate: 'PASSED' | 'FAILED' | 'WARNING';
    reliability: number;
    security: number;
    maintainability: number;
    coverage: number;
  };
  issues: {
    bugs: number;
    vulnerabilities: number;
    codeSmells: number;
    hotspots: number;
  };
  complexity: {
    cognitiveComplexity: number;
    cyclomaticComplexity: number;
    technicalDebt: number;
    duplications: number;
  };
  coverage: {
    lineCoverage: number;
    branchCoverage: number;
    uncoveredLines: number;
    uncoveredBranches: number;
  };
}

interface ESLintMetrics {
  rules: {
    totalRules: number;
    enabledRules: number;
    disabledRules: number;
    customRules: number;
  };
  violations: {
    errors: number;
    warnings: number;
    info: number;
    fixable: number;
  };
  performance: {
    averageTime: number;
    slowestFiles: Array<{ file: string; time: number }>;
    totalTime: number;
  };
  fixes: {
    autoFixes: number;
    manualFixes: number;
    totalFixes: number;
  };
}

interface SentryMetrics {
  errors: {
    totalErrors: number;
    uniqueErrors: number;
    resolvedErrors: number;
    unresolvedErrors: number;
  };
  performance: {
    averageResponseTime: number;
    slowestTransactions: Array<{ name: string; time: number }>;
    throughput: number;
  };
  releases: {
    totalReleases: number;
    activeReleases: number;
    crashFreeUsers: number;
    adoptionRate: number;
  };
  alerts: {
    totalAlerts: number;
    activeAlerts: number;
    resolvedAlerts: number;
    criticalAlerts: number;
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

// Компонент SonarQube интеграции
const SonarQubeIntegration: React.FC<{
  metrics: SonarQubeMetrics;
}> = ({ metrics }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getQualityGateColor = (status: string) => {
    switch (status) {
      case 'PASSED': return 'text-green-600';
      case 'FAILED': return 'text-red-600';
      case 'WARNING': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">SonarQube</h3>
            <p className="text-sm text-gray-600">Анализ качества кода</p>
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
          <p className={`text-2xl font-bold ${getQualityGateColor(metrics.quality.qualityGate)}`}>
            {metrics.quality.qualityGate}
          </p>
          <p className="text-sm text-gray-600">Quality Gate</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{metrics.quality.coverage}%</p>
          <p className="text-sm text-gray-600">Покрытие</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{metrics.issues.bugs}</p>
          <p className="text-sm text-gray-600">Баги</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{metrics.issues.vulnerabilities}</p>
          <p className="text-sm text-gray-600">Уязвимости</p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Качество кода</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.quality.reliability}/10</p>
                <p className="text-sm text-gray-600">Надежность</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.quality.security}/10</p>
                <p className="text-sm text-gray-600">Безопасность</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Сложность</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.complexity.cognitiveComplexity}</p>
                <p className="text-sm text-gray-600">Когнитивная сложность</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{Math.round(metrics.complexity.technicalDebt / 60)}h</p>
                <p className="text-sm text-gray-600">Техдолг</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент ESLint интеграции
const ESLintIntegration: React.FC<{
  metrics: ESLintMetrics;
}> = ({ metrics }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-500 rounded-lg">
            <Code className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">ESLint</h3>
            <p className="text-sm text-gray-600">Линтинг JavaScript/TypeScript</p>
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
          <p className="text-2xl font-bold text-green-600">{metrics.rules.enabledRules}</p>
          <p className="text-sm text-gray-600">Активные правила</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{metrics.violations.errors}</p>
          <p className="text-sm text-gray-600">Ошибки</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{metrics.violations.warnings}</p>
          <p className="text-sm text-gray-600">Предупреждения</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{metrics.fixes.autoFixes}</p>
          <p className="text-sm text-gray-600">Автоисправления</p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Производительность</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.performance.averageTime}ms</p>
                <p className="text-sm text-gray-600">Среднее время</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{Math.round(metrics.performance.totalTime / 1000)}s</p>
                <p className="text-sm text-gray-600">Общее время</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Медленные файлы</h4>
            <div className="space-y-2">
              {metrics.performance.slowestFiles.slice(0, 3).map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700 truncate flex-1">{file.file}</span>
                  <span className="text-sm text-gray-600">{file.time}ms</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент Sentry интеграции
const SentryIntegration: React.FC<{
  metrics: SentryMetrics;
}> = ({ metrics }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-500 rounded-lg">
            <Bug className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sentry</h3>
            <p className="text-sm text-gray-600">Мониторинг ошибок и производительности</p>
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
          <p className="text-2xl font-bold text-red-600">{metrics.errors.totalErrors}</p>
          <p className="text-sm text-gray-600">Всего ошибок</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{metrics.errors.resolvedErrors}</p>
          <p className="text-sm text-gray-600">Решенные</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{metrics.releases.crashFreeUsers}%</p>
          <p className="text-sm text-gray-600">Без крашей</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{metrics.alerts.activeAlerts}</p>
          <p className="text-sm text-gray-600">Активные алерты</p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Производительность</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.performance.averageResponseTime}ms</p>
                <p className="text-sm text-gray-600">Среднее время ответа</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.performance.throughput}/s</p>
                <p className="text-sm text-gray-600">Пропускная способность</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Релизы</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.releases.totalReleases}</p>
                <p className="text-sm text-gray-600">Всего релизов</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{metrics.releases.adoptionRate}%</p>
                <p className="text-sm text-gray-600">Принятие</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Главный компонент инструментов разработки
const DevToolsIntegration: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);
  
  // Моковые данные для демонстрации
  const sonarQubeMetrics: SonarQubeMetrics = {
    quality: {
      qualityGate: 'PASSED',
      reliability: 8.5,
      security: 9.2,
      maintainability: 7.8,
      coverage: 78
    },
    issues: {
      bugs: 12,
      vulnerabilities: 3,
      codeSmells: 45,
      hotspots: 2
    },
    complexity: {
      cognitiveComplexity: 15.2,
      cyclomaticComplexity: 8.7,
      technicalDebt: 120,
      duplications: 5.2
    },
    coverage: {
      lineCoverage: 78,
      branchCoverage: 65,
      uncoveredLines: 125,
      uncoveredBranches: 45
    }
  };
  
  const eslintMetrics: ESLintMetrics = {
    rules: {
      totalRules: 150,
      enabledRules: 120,
      disabledRules: 30,
      customRules: 5
    },
    violations: {
      errors: 8,
      warnings: 25,
      info: 12,
      fixable: 15
    },
    performance: {
      averageTime: 250,
      slowestFiles: [
        { file: 'src/components/App.tsx', time: 1200 },
        { file: 'src/utils/helpers.ts', time: 800 },
        { file: 'src/context/AppContext.tsx', time: 600 }
      ],
      totalTime: 4500
    },
    fixes: {
      autoFixes: 15,
      manualFixes: 8,
      totalFixes: 23
    }
  };
  
  const sentryMetrics: SentryMetrics = {
    errors: {
      totalErrors: 45,
      uniqueErrors: 12,
      resolvedErrors: 35,
      unresolvedErrors: 10
    },
    performance: {
      averageResponseTime: 180,
      slowestTransactions: [
        { name: 'GET /api/users', time: 1200 },
        { name: 'POST /api/auth/login', time: 800 },
        { name: 'GET /api/dashboard', time: 600 }
      ],
      throughput: 150
    },
    releases: {
      totalReleases: 25,
      activeReleases: 3,
      crashFreeUsers: 98.5,
      adoptionRate: 85
    },
    alerts: {
      totalAlerts: 15,
      activeAlerts: 3,
      resolvedAlerts: 12,
      criticalAlerts: 1
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };
  
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen" data-testid="dev-tools-integration">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Инструменты разработки</h1>
          <p className="text-gray-600 mt-1">SonarQube, ESLint, Sentry</p>
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
          title="Quality Gate"
          value={sonarQubeMetrics.quality.qualityGate}
          change={5.2}
          icon={Shield}
          color="bg-blue-500"
          description="SonarQube"
        />
        <MetricCard
          title="ESLint ошибки"
          value={eslintMetrics.violations.errors}
          change={-12.5}
          icon={Code}
          color="bg-yellow-500"
          description="ESLint"
        />
        <MetricCard
          title="Sentry ошибки"
          value={sentryMetrics.errors.totalErrors}
          change={-8.3}
          icon={Bug}
          color="bg-red-500"
          description="Sentry"
        />
        <MetricCard
          title="Покрытие тестами"
          value={`${sonarQubeMetrics.quality.coverage}%`}
          change={15.7}
          icon={CheckCircle}
          color="bg-green-500"
          description="SonarQube"
        />
      </div>
      
      {/* Детальные интеграции */}
      <div className="space-y-6">
        <SonarQubeIntegration metrics={sonarQubeMetrics} />
        <ESLintIntegration metrics={eslintMetrics} />
        <SentryIntegration metrics={sentryMetrics} />
      </div>
    </div>
  );
};

export default DevToolsIntegration;
