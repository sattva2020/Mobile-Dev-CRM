import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  GitCommit,
  Tag,
  Package,
  Download,
  Upload,
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
  Zap,
  Settings,
  RefreshCw,
  BarChart3,
  PieChart,
  Layers,
  Terminal,
  FileText,
  CheckCircle,
  AlertTriangle,
  Bug,
  Shield,
  Code,
  Wrench
} from 'lucide-react';

// Интерфейсы для управления версиями
interface SemanticVersioning {
  current: {
    version: string;
    major: number;
    minor: number;
    patch: number;
    prerelease?: string;
    build?: string;
  };
  history: Array<{
    version: string;
    date: Date;
    type: 'major' | 'minor' | 'patch' | 'prerelease';
    changes: number;
    author: string;
  }>;
  next: {
    suggestedVersion: string;
    breakingChanges: number;
    newFeatures: number;
    bugFixes: number;
  };
}

interface ReleaseManagement {
  releases: {
    total: number;
    published: number;
    draft: number;
    scheduled: number;
  };
  channels: {
    stable: number;
    beta: number;
    alpha: number;
    canary: number;
  };
  deployment: {
    environments: Array<{
      name: string;
      status: 'deployed' | 'pending' | 'failed';
      version: string;
      date: Date;
    }>;
    rollbacks: number;
    successRate: number;
  };
}

interface GitMetrics {
  commits: {
    total: number;
    recent: number;
    authors: number;
    averagePerDay: number;
  };
  branches: {
    total: number;
    active: number;
    merged: number;
    deleted: number;
  };
  pullRequests: {
    total: number;
    open: number;
    merged: number;
    closed: number;
  };
  codeReview: {
    averageReviewTime: number;
    reviewsCompleted: number;
    reviewsPending: number;
    approvalRate: number;
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

// Компонент Semantic Versioning
const SemanticVersioningSection: React.FC<{
  versioning: SemanticVersioning;
}> = ({ versioning }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Tag className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Semantic Versioning</h3>
            <p className="text-sm text-gray-600">Управление версиями</p>
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
          <p className="text-2xl font-bold text-blue-600">{versioning.current.version}</p>
          <p className="text-sm text-gray-600">Текущая версия</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{versioning.history.length}</p>
          <p className="text-sm text-gray-600">Всего релизов</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{versioning.next.breakingChanges}</p>
          <p className="text-sm text-gray-600">Breaking changes</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{versioning.next.suggestedVersion}</p>
          <p className="text-sm text-gray-600">Следующая версия</p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">История версий</h4>
            <div className="space-y-2">
              {versioning.history.slice(0, 5).map((release, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900">{release.version}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      release.type === 'major' ? 'bg-red-100 text-red-800' :
                      release.type === 'minor' ? 'bg-blue-100 text-blue-800' :
                      release.type === 'patch' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {release.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{release.changes} изменений</p>
                    <p className="text-xs text-gray-500">{release.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Следующий релиз</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{versioning.next.newFeatures}</p>
                <p className="text-sm text-gray-600">Новые функции</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{versioning.next.bugFixes}</p>
                <p className="text-sm text-gray-600">Исправления</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{versioning.next.breakingChanges}</p>
                <p className="text-sm text-gray-600">Breaking changes</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент Release Management
const ReleaseManagementSection: React.FC<{
  releaseManagement: ReleaseManagement;
}> = ({ releaseManagement }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-500 rounded-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Release Management</h3>
            <p className="text-sm text-gray-600">Управление релизами</p>
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
          <p className="text-2xl font-bold text-blue-600">{releaseManagement.releases.published}</p>
          <p className="text-sm text-gray-600">Опубликованные</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{releaseManagement.releases.draft}</p>
          <p className="text-sm text-gray-600">Черновики</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{releaseManagement.deployment.successRate}%</p>
          <p className="text-sm text-gray-600">Успешность деплоя</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{releaseManagement.channels.stable}</p>
          <p className="text-sm text-gray-600">Stable канал</p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Каналы релизов</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{releaseManagement.channels.beta}</p>
                <p className="text-sm text-gray-600">Beta</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{releaseManagement.channels.alpha}</p>
                <p className="text-sm text-gray-600">Alpha</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Окружения</h4>
            <div className="space-y-2">
              {releaseManagement.deployment.environments.map((env, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      env.status === 'deployed' ? 'bg-green-500' :
                      env.status === 'pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-900">{env.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{env.version}</p>
                    <p className="text-xs text-gray-500">{env.date.toLocaleDateString()}</p>
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

// Компонент Git метрик
const GitMetricsSection: React.FC<{
  gitMetrics: GitMetrics;
}> = ({ gitMetrics }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-800 rounded-lg">
            <GitBranch className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Git метрики</h3>
            <p className="text-sm text-gray-600">Статистика Git репозитория</p>
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
          <p className="text-2xl font-bold text-blue-600">{gitMetrics.commits.total}</p>
          <p className="text-sm text-gray-600">Всего коммитов</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{gitMetrics.branches.active}</p>
          <p className="text-sm text-gray-600">Активные ветки</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{gitMetrics.pullRequests.open}</p>
          <p className="text-sm text-gray-600">Открытые PR</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{gitMetrics.codeReview.approvalRate}%</p>
          <p className="text-sm text-gray-600">Одобрение PR</p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Активность</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{gitMetrics.commits.averagePerDay}</p>
                <p className="text-sm text-gray-600">Коммитов в день</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{gitMetrics.commits.authors}</p>
                <p className="text-sm text-gray-600">Авторов</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Code Review</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{Math.round(gitMetrics.codeReview.averageReviewTime / 60)}m</p>
                <p className="text-sm text-gray-600">Среднее время ревью</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{gitMetrics.codeReview.reviewsPending}</p>
                <p className="text-sm text-gray-600">Ожидающие ревью</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Главный компонент управления версиями
const VersionManagement: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);
  
  // Моковые данные для демонстрации
  const semanticVersioning: SemanticVersioning = {
    current: {
      version: '2.1.4',
      major: 2,
      minor: 1,
      patch: 4
    },
    history: [
      { version: '2.1.4', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), type: 'patch', changes: 8, author: 'Developer A' },
      { version: '2.1.3', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), type: 'patch', changes: 12, author: 'Developer B' },
      { version: '2.1.0', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), type: 'minor', changes: 25, author: 'Developer A' },
      { version: '2.0.0', date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), type: 'major', changes: 45, author: 'Developer C' },
      { version: '1.5.2', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), type: 'patch', changes: 6, author: 'Developer B' }
    ],
    next: {
      suggestedVersion: '2.2.0',
      breakingChanges: 0,
      newFeatures: 8,
      bugFixes: 3
    }
  };
  
  const releaseManagement: ReleaseManagement = {
    releases: {
      total: 25,
      published: 20,
      draft: 3,
      scheduled: 2
    },
    channels: {
      stable: 20,
      beta: 3,
      alpha: 1,
      canary: 1
    },
    deployment: {
      environments: [
        { name: 'Production', status: 'deployed', version: '2.1.4', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { name: 'Staging', status: 'deployed', version: '2.2.0-beta', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        { name: 'Development', status: 'deployed', version: '2.2.0-alpha', date: new Date(Date.now() - 6 * 60 * 60 * 1000) }
      ],
      rollbacks: 2,
      successRate: 95
    }
  };
  
  const gitMetrics: GitMetrics = {
    commits: {
      total: 1250,
      recent: 45,
      authors: 8,
      averagePerDay: 12
    },
    branches: {
      total: 45,
      active: 12,
      merged: 28,
      deleted: 5
    },
    pullRequests: {
      total: 180,
      open: 8,
      merged: 165,
      closed: 7
    },
    codeReview: {
      averageReviewTime: 240,
      reviewsCompleted: 165,
      reviewsPending: 8,
      approvalRate: 92
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };
  
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen" data-testid="version-management">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управление версиями</h1>
          <p className="text-gray-600 mt-1">Semantic versioning, Release management, Git метрики</p>
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
          title="Текущая версия"
          value={semanticVersioning.current.version}
          change={5.2}
          icon={Tag}
          color="bg-blue-500"
          description="Semantic versioning"
        />
        <MetricCard
          title="Опубликованные релизы"
          value={releaseManagement.releases.published}
          change={12.5}
          icon={Package}
          color="bg-green-500"
          description="Release management"
        />
        <MetricCard
          title="Всего коммитов"
          value={gitMetrics.commits.total.toLocaleString()}
          change={8.3}
          icon={GitCommit}
          color="bg-gray-800"
          description="Git метрики"
        />
        <MetricCard
          title="Успешность деплоя"
          value={`${releaseManagement.deployment.successRate}%`}
          change={2.1}
          icon={CheckCircle}
          color="bg-purple-500"
          description="Deployment"
        />
      </div>
      
      {/* Детальные секции */}
      <div className="space-y-6">
        <SemanticVersioningSection versioning={semanticVersioning} />
        <ReleaseManagementSection releaseManagement={releaseManagement} />
        <GitMetricsSection gitMetrics={gitMetrics} />
      </div>
    </div>
  );
};

export default VersionManagement;
