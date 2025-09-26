import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Code,
  TestTube,
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  HardDrive,
  Memory,
  Smartphone,
  Monitor,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Target,
  Calendar,
  Users,
  GitBranch,
  Download,
  RefreshCw,
  Settings,
  Eye,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Shield,
  Bug,
  Wrench,
  Database,
  Cloud,
  Smartphone as MobileIcon,
  Laptop,
  Server
} from 'lucide-react';

// Интерфейсы для типизации
interface CodeMetrics {
  linesOfCode: number;
  testCoverage: number;
  complexity: number;
  technicalDebt: number;
  filesCount: number;
  functionsCount: number;
  classesCount: number;
}

interface PerformanceMetrics {
  buildTime: number;
  bundleSize: number;
  memoryUsage: number;
  crashRate: number;
  startupTime: number;
  networkRequests: number;
  cacheHitRate: number;
}

interface QualityMetrics {
  bugsCount: number;
  securityIssues: number;
  accessibilityScore: number;
  userRating: number;
  performanceScore: number;
  maintainabilityScore: number;
  reliabilityScore: number;
}

interface PredictiveAnalytics {
  deliveryPredictions: {
    estimatedCompletion: Date;
    confidenceLevel: number;
    riskFactors: string[];
    milestones: Array<{
      name: string;
      date: Date;
      status: 'completed' | 'in-progress' | 'pending';
    }>;
  };
  resourcePredictions: {
    estimatedHours: number;
    teamCapacity: number;
    bottleneckPeriods: Date[];
    workloadDistribution: Array<{
      member: string;
      workload: number;
      capacity: number;
    }>;
  };
  qualityPredictions: {
    expectedBugs: number;
    performanceScore: number;
    userSatisfaction: number;
    technicalDebtGrowth: number;
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

// Компонент мини-графика
const MiniChart: React.FC<{
  data: number[];
  color: string;
  height?: number;
  title?: string;
}> = ({ data, color, height = 60, title }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  return (
    <div className="w-full">
      {title && <p className="text-sm text-gray-600 mb-2">{title}</p>}
      <div className="flex items-end space-x-1" style={{ height }}>
        {data.map((value, index) => {
          const percentage = range > 0 ? ((value - min) / range) * 100 : 50;
          return (
            <div
              key={index}
              className={`${color} rounded-t`}
              style={{
                height: `${Math.max(percentage, 10)}%`,
                width: `${100 / data.length}%`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// Компонент прогнозной аналитики
const PredictiveAnalytics: React.FC<{
  analytics: PredictiveAnalytics;
}> = ({ analytics }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Прогнозная аналитика</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {analytics.deliveryPredictions.estimatedCompletion.toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">Ожидаемое завершение</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {analytics.deliveryPredictions.confidenceLevel}%
          </p>
          <p className="text-sm text-gray-600">Уровень уверенности</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">
            {analytics.resourcePredictions.estimatedHours}h
          </p>
          <p className="text-sm text-gray-600">Ожидаемые часы</p>
        </div>
      </div>
      
      {expanded && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Факторы риска</h4>
            <div className="flex flex-wrap gap-2">
              {analytics.deliveryPredictions.riskFactors.map((risk, index) => (
                <span key={index} className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                  {risk}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Распределение нагрузки</h4>
            <div className="space-y-2">
              {analytics.resourcePredictions.workloadDistribution.map((member, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{member.member}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(member.workload / member.capacity) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {Math.round((member.workload / member.capacity) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент метрик разработки
const CodeMetricsSection: React.FC<{
  metrics: CodeMetrics;
}> = ({ metrics }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Метрики разработки</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{metrics.linesOfCode.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Строк кода</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{metrics.testCoverage}%</p>
          <p className="text-sm text-gray-600">Покрытие тестами</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{metrics.complexity}</p>
          <p className="text-sm text-gray-600">Сложность</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{metrics.technicalDebt}h</p>
          <p className="text-sm text-gray-600">Техдолг</p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{metrics.filesCount}</p>
            <p className="text-sm text-gray-600">Файлов</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{metrics.functionsCount}</p>
            <p className="text-sm text-gray-600">Функций</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{metrics.classesCount}</p>
            <p className="text-sm text-gray-600">Классов</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент метрик производительности
const PerformanceMetricsSection: React.FC<{
  metrics: PerformanceMetrics;
}> = ({ metrics }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Метрики производительности</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{metrics.buildTime}s</p>
          <p className="text-sm text-gray-600">Время сборки</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{metrics.bundleSize}MB</p>
          <p className="text-sm text-gray-600">Размер бандла</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{metrics.memoryUsage}MB</p>
          <p className="text-sm text-gray-600">Использование памяти</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{metrics.crashRate}%</p>
          <p className="text-sm text-gray-600">Частота крашей</p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{metrics.startupTime}ms</p>
            <p className="text-sm text-gray-600">Время запуска</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{metrics.networkRequests}</p>
            <p className="text-sm text-gray-600">Сетевые запросы</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{metrics.cacheHitRate}%</p>
            <p className="text-sm text-gray-600">Попадания в кэш</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент метрик качества
const QualityMetricsSection: React.FC<{
  metrics: QualityMetrics;
}> = ({ metrics }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Метрики качества</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{metrics.bugsCount}</p>
          <p className="text-sm text-gray-600">Баги</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{metrics.securityIssues}</p>
          <p className="text-sm text-gray-600">Проблемы безопасности</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{metrics.accessibilityScore}/10</p>
          <p className="text-sm text-gray-600">Доступность</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{metrics.userRating}/5</p>
          <p className="text-sm text-gray-600">Рейтинг пользователей</p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{metrics.performanceScore}/10</p>
            <p className="text-sm text-gray-600">Производительность</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{metrics.maintainabilityScore}/10</p>
            <p className="text-sm text-gray-600">Поддерживаемость</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{metrics.reliabilityScore}/10</p>
            <p className="text-sm text-gray-600">Надежность</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Главный компонент дашборда мобильной аналитики
const MobileAnalyticsDashboard: React.FC = () => {
  const { state } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);
  
  // Моковые данные для демонстрации
  const codeMetrics: CodeMetrics = {
    linesOfCode: 15420,
    testCoverage: 78,
    complexity: 12.5,
    technicalDebt: 24,
    filesCount: 156,
    functionsCount: 342,
    classesCount: 89
  };
  
  const performanceMetrics: PerformanceMetrics = {
    buildTime: 45,
    bundleSize: 12.5,
    memoryUsage: 85,
    crashRate: 0.2,
    startupTime: 1200,
    networkRequests: 15,
    cacheHitRate: 92
  };
  
  const qualityMetrics: QualityMetrics = {
    bugsCount: 3,
    securityIssues: 1,
    accessibilityScore: 8.5,
    userRating: 4.2,
    performanceScore: 7.8,
    maintainabilityScore: 8.1,
    reliabilityScore: 7.9
  };
  
  const predictiveAnalytics: PredictiveAnalytics = {
    deliveryPredictions: {
      estimatedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      confidenceLevel: 85,
      riskFactors: ['Сложность интеграции', 'Недостаток ресурсов', 'Изменения требований'],
      milestones: [
        { name: 'MVP', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), status: 'in-progress' },
        { name: 'Beta', date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), status: 'pending' },
        { name: 'Release', date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), status: 'pending' }
      ]
    },
    resourcePredictions: {
      estimatedHours: 240,
      teamCapacity: 80,
      bottleneckPeriods: [new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)],
      workloadDistribution: [
        { member: 'Frontend', workload: 60, capacity: 80 },
        { member: 'Backend', workload: 45, capacity: 60 },
        { member: 'Mobile', workload: 70, capacity: 80 },
        { member: 'QA', workload: 30, capacity: 40 }
      ]
    },
    qualityPredictions: {
      expectedBugs: 5,
      performanceScore: 8.2,
      userSatisfaction: 4.5,
      technicalDebtGrowth: 15
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    // Симуляция обновления данных
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };
  
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen" data-testid="mobile-analytics-dashboard">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Мобильная аналитика</h1>
          <p className="text-gray-600 mt-1">Расширенная аналитика для разработки мобильных приложений</p>
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
          title="Строк кода"
          value={codeMetrics.linesOfCode.toLocaleString()}
          change={12.5}
          icon={Code}
          color="bg-blue-500"
          description="Общее количество строк кода"
        />
        <MetricCard
          title="Покрытие тестами"
          value={`${codeMetrics.testCoverage}%`}
          change={5.2}
          icon={TestTube}
          color="bg-green-500"
          description="Процент покрытия тестами"
        />
        <MetricCard
          title="Время сборки"
          value={`${performanceMetrics.buildTime}s`}
          change={-8.3}
          icon={Zap}
          color="bg-orange-500"
          description="Среднее время сборки"
        />
        <MetricCard
          title="Размер бандла"
          value={`${performanceMetrics.bundleSize}MB`}
          change={-2.1}
          icon={HardDrive}
          color="bg-purple-500"
          description="Размер итогового бандла"
        />
      </div>
      
      {/* Детальные метрики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CodeMetricsSection metrics={codeMetrics} />
        <PerformanceMetricsSection metrics={performanceMetrics} />
      </div>
      
      {/* Метрики качества и прогнозная аналитика */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QualityMetricsSection metrics={qualityMetrics} />
        <PredictiveAnalytics analytics={predictiveAnalytics} />
      </div>
      
      {/* Дополнительная информация */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Тренды производительности</h3>
          <MiniChart
            data={[45, 42, 38, 41, 39, 36, 35]}
            color="bg-blue-500"
            title="Время сборки (секунды)"
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Использование памяти</h3>
          <MiniChart
            data={[85, 82, 88, 90, 87, 85, 83]}
            color="bg-green-500"
            title="Память (MB)"
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Качество кода</h3>
          <MiniChart
            data={[7.8, 8.1, 8.3, 8.0, 8.2, 8.4, 8.5]}
            color="bg-purple-500"
            title="Оценка качества"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileAnalyticsDashboard;
