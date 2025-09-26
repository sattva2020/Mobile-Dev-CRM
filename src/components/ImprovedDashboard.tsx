import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Settings,
  Bell,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Building,
  UserPlus,
  Calendar as CalendarIcon,
  FileText,
  Network,
  Smartphone,
  Kanban,
  Github,
  Bot,
  Palette,
  Database,
  TestTube,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Search,
  X
} from 'lucide-react';

// Компонент карточки метрики
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<any>;
  color: string;
  description?: string;
}> = ({ title, value, change, icon: Icon, color, description }) => {
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
}> = ({ data, color, height = 40 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  return (
    <div className="flex items-end space-x-1" style={{ height }}>
      {data.map((value, index) => (
        <div
          key={index}
          className={`${color} rounded-t`}
          style={{
            width: '4px',
            height: `${((value - min) / range) * height}px`,
            minHeight: '2px'
          }}
        />
      ))}
    </div>
  );
};

// Компонент списка последних активностей
const RecentActivity: React.FC<{
  activities: Array<{
    id: string;
    type: 'lead' | 'deal' | 'task' | 'meeting' | 'call' | 'email';
    title: string;
    description: string;
    time: string;
    user: string;
    status: 'completed' | 'pending' | 'overdue';
  }>;
}> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lead': return <UserPlus className="h-4 w-4" />;
      case 'deal': return <Target className="h-4 w-4" />;
      case 'task': return <CheckCircle className="h-4 w-4" />;
      case 'meeting': return <CalendarIcon className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Последняя активность</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Показать все
        </button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                {getActivityIcon(activity.type)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {activity.title}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {activity.description}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-400">{activity.time}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400">{activity.user}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                {activity.status === 'completed' ? 'Выполнено' : 
                 activity.status === 'pending' ? 'В процессе' : 'Просрочено'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Компонент воронки продаж
const SalesFunnel: React.FC<{
  stages: Array<{
    name: string;
    count: number;
    percentage: number;
    color: string;
  }>;
}> = ({ stages }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Воронка продаж</h3>
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div key={index} className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{stage.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-900">{stage.count}</span>
                <span className="text-sm text-gray-500">({stage.percentage}%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${stage.color}`}
                style={{ width: `${stage.percentage}%` }}
              />
            </div>
            {index < stages.length - 1 && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Компонент быстрых действий
const QuickActions: React.FC<{
  onAction: (action: string) => void;
}> = ({ onAction }) => {
  const actions = [
    { id: 'new-lead', label: 'Новый лид', icon: UserPlus, color: 'bg-blue-500' },
    { id: 'new-deal', label: 'Новая сделка', icon: Target, color: 'bg-green-500' },
    { id: 'new-task', label: 'Новая задача', icon: CheckCircle, color: 'bg-purple-500' },
    { id: 'schedule-meeting', label: 'Встреча', icon: CalendarIcon, color: 'bg-orange-500' },
    { id: 'make-call', label: 'Звонок', icon: Phone, color: 'bg-red-500' },
    { id: 'send-email', label: 'Email', icon: Mail, color: 'bg-indigo-500' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Быстрые действия</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            className="flex flex-col items-center space-y-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Главный компонент улучшенного дашборда
const ImprovedDashboard: React.FC = () => {
  const { state } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  // Моковые данные для демонстрации
  const metrics = [
    {
      title: 'Всего лидов',
      value: '2,847',
      change: 12.5,
      icon: Users,
      color: 'bg-blue-500',
      description: 'Новых лидов за неделю'
    },
    {
      title: 'Активные сделки',
      value: '156',
      change: -2.3,
      icon: Target,
      color: 'bg-green-500',
      description: 'В работе'
    },
    {
      title: 'Конверсия',
      value: '24.8%',
      change: 5.7,
      icon: TrendingUp,
      color: 'bg-purple-500',
      description: 'Лиды в клиенты'
    },
    {
      title: 'Доход',
      value: '₽2.4М',
      change: 18.2,
      icon: DollarSign,
      color: 'bg-orange-500',
      description: 'За текущий месяц'
    }
  ];

  const activities = [
    {
      id: '1',
      type: 'lead' as const,
      title: 'Новый лид: ООО "ТехноПлюс"',
      description: 'Заинтересованы в корпоративном решении',
      time: '2 мин назад',
      user: 'Анна Иванова',
      status: 'pending' as const
    },
    {
      id: '2',
      type: 'deal' as const,
      title: 'Сделка "CRM для стартапа"',
      description: 'Переведена в статус "Переговоры"',
      time: '15 мин назад',
      user: 'Петр Сидоров',
      status: 'completed' as const
    },
    {
      id: '3',
      type: 'task' as const,
      title: 'Подготовить коммерческое предложение',
      description: 'Для клиента "Инновации+"',
      time: '1 час назад',
      user: 'Мария Козлова',
      status: 'overdue' as const
    },
    {
      id: '4',
      type: 'meeting' as const,
      title: 'Презентация продукта',
      description: 'Встреча с руководством "ГлобалТех"',
      time: '2 часа назад',
      user: 'Алексей Петров',
      status: 'completed' as const
    }
  ];

  const funnelStages = [
    { name: 'Лиды', count: 2847, percentage: 100, color: 'bg-blue-500' },
    { name: 'Квалификация', count: 1823, percentage: 64, color: 'bg-blue-400' },
    { name: 'Предложение', count: 1247, percentage: 44, color: 'bg-blue-300' },
    { name: 'Переговоры', count: 623, percentage: 22, color: 'bg-green-400' },
    { name: 'Закрытие', count: 156, percentage: 5.5, color: 'bg-green-500' }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Симуляция обновления данных
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleQuickAction = (action: string) => {
    console.log('Quick action:', action);
    // Здесь будет логика обработки быстрых действий
  };

  return (
    <div className="space-y-6" data-testid="dashboard-root">
      {/* Заголовок с фильтрами */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Дашборд CRM</h1>
          <p className="text-gray-600 mt-1">Обзор ключевых показателей и активностей</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Последние 7 дней</option>
            <option value="30d">Последние 30 дней</option>
            <option value="90d">Последние 90 дней</option>
            <option value="1y">Последний год</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            aria-label="Обновить данные"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            color={metric.color}
            description={metric.description}
          />
        ))}
      </div>

      {/* Контент в две колонки */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка */}
        <div className="lg:col-span-2 space-y-6">
          {/* Последняя активность */}
          <RecentActivity activities={activities} />
          
          {/* Воронка продаж */}
          <SalesFunnel stages={funnelStages} />
        </div>

        {/* Правая колонка */}
        <div className="space-y-6">
          {/* Быстрые действия */}
          <QuickActions onAction={handleQuickAction} />
          
          {/* Мини-графики */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Тренды</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Новые лиды</span>
                  <span className="text-sm text-green-600 font-medium">+12%</span>
                </div>
                <MiniChart 
                  data={[20, 25, 18, 30, 35, 28, 32]} 
                  color="bg-blue-500" 
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Закрытые сделки</span>
                  <span className="text-sm text-green-600 font-medium">+8%</span>
                </div>
                <MiniChart 
                  data={[5, 8, 6, 12, 10, 15, 18]} 
                  color="bg-green-500" 
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Доход</span>
                  <span className="text-sm text-green-600 font-medium">+15%</span>
                </div>
                <MiniChart 
                  data={[100, 120, 110, 140, 160, 150, 180]} 
                  color="bg-orange-500" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedDashboard;
