import React from 'react';
import { useApp } from '../context/AppContext';
import { Notification } from '../context/AppContext';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Target,
  Zap,
  Shield,
  Eye,
  TestTube,
  Bot,
  Github,
  FileText,
  Plus,
  Network,
  Smartphone
} from 'lucide-react';

// Компонент карточки статистики
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: { value: number; label: string };
}> = ({ title, value, icon, color, trend }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className={`h-4 w-4 ${trend.value >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-sm ml-1 ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

// Компонент графика прогресса
const ProgressChart: React.FC<{
  data: { label: string; value: number; color: string }[];
  title: string;
}> = ({ data, title }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-medium text-gray-900">{item.value}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${item.color}`}
              style={{ width: `${item.value}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Компонент недавних задач
const RecentTasks: React.FC = () => {
  const { state } = useApp();
  const recentTasks = state.tasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Недавние задачи</h3>
      <div className="space-y-3">
        {recentTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Нет задач</p>
        ) : (
          recentTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                    {task.status === 'todo' ? 'К выполнению' : 
                     task.status === 'in-progress' ? 'В работе' :
                     task.status === 'review' ? 'На проверке' : 'Выполнено'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'critical' ? 'Критично' :
                     task.priority === 'high' ? 'Высокий' :
                     task.priority === 'medium' ? 'Средний' : 'Низкий'}
                  </span>
                </div>
              </div>
              {task.githubUrl && (
                <a
                  href={task.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  GitHub →
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Компонент уведомлений
const Notifications: React.FC = () => {
  const { state, actions } = useApp();
  const unreadNotifications = state.notifications.filter(n => !n.read);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <BarChart3 className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Уведомления</h3>
        {unreadNotifications.length > 0 && (
          <button
            onClick={actions.clearNotifications}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Очистить все
          </button>
        )}
      </div>
      <div className="space-y-3">
        {unreadNotifications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Нет новых уведомлений</p>
        ) : (
          unreadNotifications.slice(0, 3).map((notification) => (
            <div
              key={notification.id}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              {getNotificationIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(notification.createdAt).toLocaleString('ru-RU')}
                </p>
              </div>
              <button
                onClick={() => actions.markNotificationRead(notification.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Главный компонент дашборда
const Dashboard: React.FC = () => {
  const { state } = useApp();

  // Вычисляем статистику по категориям
  const categoryStats = [
    { label: 'Безопасность', value: Math.round((state.tasks.filter(t => t.category === 'security').length / Math.max(state.tasks.length, 1)) * 100), color: 'bg-red-500' },
    { label: 'Производительность', value: Math.round((state.tasks.filter(t => t.category === 'performance').length / Math.max(state.tasks.length, 1)) * 100), color: 'bg-blue-500' },
    { label: 'Доступность', value: Math.round((state.tasks.filter(t => t.category === 'accessibility').length / Math.max(state.tasks.length, 1)) * 100), color: 'bg-green-500' },
    { label: 'Тестирование', value: Math.round((state.tasks.filter(t => t.category === 'testing').length / Math.max(state.tasks.length, 1)) * 100), color: 'bg-yellow-500' },
    { label: 'Документация', value: Math.round((state.tasks.filter(t => t.category === 'documentation').length / Math.max(state.tasks.length, 1)) * 100), color: 'bg-purple-500' },
  ];

  // Вычисляем статистику по статусам
  const statusStats = [
    { label: 'Выполнено', value: Math.round((state.stats.completedTasks / Math.max(state.stats.totalTasks, 1)) * 100), color: 'bg-green-500' },
    { label: 'В работе', value: Math.round((state.stats.inProgressTasks / Math.max(state.stats.totalTasks, 1)) * 100), color: 'bg-blue-500' },
    { label: 'Просрочено', value: Math.round((state.stats.overdueTasks / Math.max(state.stats.totalTasks, 1)) * 100), color: 'bg-red-500' },
  ];

  return (
    <div data-testid="dashboard-root" className="p-6 space-y-6">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Дашборд проекта</h1>
        <p className="text-gray-600 mt-1">Обзор прогресса разработки AI-Fitness Coach 360</p>
      </div>

      {/* Основная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Всего задач"
          value={state.stats.totalTasks}
          icon={<Target className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Выполнено"
          value={state.stats.completedTasks}
          icon={<CheckCircle className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="В работе"
          value={state.stats.inProgressTasks}
          icon={<Clock className="h-6 w-6 text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Просрочено"
          value={state.stats.overdueTasks}
          icon={<AlertTriangle className="h-6 w-6 text-white" />}
          color="bg-red-500"
        />
      </div>

      {/* Графики и детальная информация */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart data={statusStats} title="Прогресс по статусам" />
        <ProgressChart data={categoryStats} title="Распределение по категориям" />
      </div>

      {/* Нижняя секция */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTasks />
        <Notifications />
      </div>

            {/* Быстрые действия */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => window.location.href = '#requirements'}
                  className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <span className="text-indigo-800 font-medium">Управление требованиями</span>
                </button>
                <button 
                  onClick={() => window.location.href = '#architecture'}
                  className="flex items-center space-x-3 p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors"
                >
                  <Network className="h-5 w-5 text-cyan-600" />
                  <span className="text-cyan-800 font-medium">Архитектура проекта</span>
                </button>
                <button 
                  onClick={() => window.location.href = '#screens'}
                  className="flex items-center space-x-3 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                >
                  <Smartphone className="h-5 w-5 text-pink-600" />
                  <span className="text-pink-800 font-medium">Экранная карта</span>
                </button>
                <button 
                  onClick={() => window.location.href = '#kanban'}
                  className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <Target className="h-5 w-5 text-orange-600" />
                  <span className="text-orange-800 font-medium">Канбан доски</span>
                </button>
                <button 
                  onClick={() => window.location.href = '#github'}
                  className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">Синхронизировать с GitHub</span>
                </button>
                <button 
                  onClick={() => window.location.href = '#testing'}
                  className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-medium">Запустить аудит безопасности</span>
                </button>
                <button 
                  onClick={() => window.location.href = '#testing'}
                  className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <TestTube className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-800 font-medium">Запустить тесты</span>
                </button>
                <button 
                  onClick={() => window.location.href = '#ai'}
                  className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <Bot className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">AI Анализ</span>
                </button>
              </div>
            </div>

      {/* Статус интеграций */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Статус интеграций</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Github className={`h-5 w-5 ${state.githubService ? 'text-green-500' : 'text-gray-400'}`} />
              <div>
                <h4 className="font-medium text-gray-900">GitHub</h4>
                <p className="text-sm text-gray-500">
                  {state.githubService ? 'Подключен' : 'Не подключен'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '#github'}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {state.githubService ? 'Управление' : 'Настроить'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bot className={`h-5 w-5 ${state.aiService ? 'text-blue-500' : 'text-gray-400'}`} />
              <div>
                <h4 className="font-medium text-gray-900">AI Assistant</h4>
                <p className="text-sm text-gray-500">
                  {state.aiService ? 'Активен' : 'Не настроен'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '#ai'}
              className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              {state.aiService ? 'Аналитика' : 'Настроить'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;