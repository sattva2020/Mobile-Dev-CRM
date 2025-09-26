import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import ImprovedDashboard from './ImprovedDashboard';
import {
  LayoutDashboard,
  Users,
  Target,
  Calendar,
  BarChart3,
  Settings as SettingsIcon,
  Bell,
  Search,
  Plus,
  Filter,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  User,
  Building,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Phone,
  Mail,
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
  Activity,
  Star,
  Zap,
  Shield,
  Globe,
  Code,
  Layers,
  Workflow,
  BarChart,
  Cpu,
  Cloud,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Rocket,
  Heart,
  Coffee,
  Moon,
  Sun,
  Smartphone as PhoneIcon,
  Tablet,
  LogOut,
  UserCircle
} from 'lucide-react';

// Компонент поиска
const SearchBar: React.FC<{
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
}> = ({ query, onQueryChange, onSearch }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder="Поиск по CRM..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

// Компонент уведомлений
const NotificationCenter: React.FC<{
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    time: string;
    read: boolean;
  }>;
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
}> = ({ notifications, unreadCount, onMarkAsRead }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label={`Уведомления${unreadCount > 0 ? ` (${unreadCount} новых)` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Уведомления</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Нет новых уведомлений
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => onMarkAsRead(notification.id)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент пользовательского меню
const UserMenu: React.FC<{
  user: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  onLogout: () => void;
}> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <div className="p-2">
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
              <UserCircle className="h-4 w-4" />
              <span>Профиль</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
              <SettingsIcon className="h-4 w-4" />
              <span>Настройки</span>
            </button>
            <hr className="my-2" />
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Главный компонент улучшенной навигации
const ImprovedNavigation: React.FC = () => {
  const { state } = useApp();
  const { state: authState, actions: authActions } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Структура навигации согласно принципам CRM
  const navigationSections = [
    {
      title: 'Главная',
      items: [
        {
          id: 'dashboard',
          label: 'Дашборд',
          icon: LayoutDashboard,
          description: 'Обзор ключевых показателей',
          color: 'text-blue-600'
        }
      ]
    },
    {
      title: 'Продажи',
      items: [
        {
          id: 'leads',
          label: 'Лиды',
          icon: Users,
          description: 'Управление потенциальными клиентами',
          color: 'text-green-600'
        },
        {
          id: 'deals',
          label: 'Сделки',
          icon: Target,
          description: 'Воронка продаж и сделки',
          color: 'text-purple-600'
        },
        {
          id: 'opportunities',
          label: 'Возможности',
          icon: TrendingUp,
          description: 'Анализ возможностей продаж',
          color: 'text-orange-600'
        }
      ]
    },
    {
      title: 'Клиенты',
      items: [
        {
          id: 'contacts',
          label: 'Контакты',
          icon: User,
          description: 'База контактов клиентов',
          color: 'text-indigo-600'
        },
        {
          id: 'companies',
          label: 'Компании',
          icon: Building,
          description: 'Информация о компаниях',
          color: 'text-cyan-600'
        }
      ]
    },
    {
      title: 'Активности',
      items: [
        {
          id: 'tasks',
          label: 'Задачи',
          icon: CheckCircle,
          description: 'Управление задачами',
          color: 'text-teal-600'
        },
        {
          id: 'calendar',
          label: 'Календарь',
          icon: Calendar,
          description: 'Планирование встреч',
          color: 'text-pink-600'
        },
        {
          id: 'communications',
          label: 'Коммуникации',
          icon: MessageSquare,
          description: 'История общения',
          color: 'text-red-600'
        }
      ]
    },
    {
      title: 'Аналитика',
      items: [
        {
          id: 'reports',
          label: 'Отчёты',
          icon: BarChart3,
          description: 'Аналитические отчёты',
          color: 'text-yellow-600'
        },
        {
          id: 'metrics',
          label: 'Метрики',
          icon: Activity,
          description: 'KPI и показатели',
          color: 'text-lime-600'
        }
      ]
    },
    {
      title: 'Интеграции',
      items: [
        {
          id: 'email',
          label: 'Email',
          icon: Mail,
          description: 'Интеграция с почтой',
          color: 'text-blue-600'
        },
        {
          id: 'phone',
          label: 'Телефония',
          icon: Phone,
          description: 'Система звонков',
          color: 'text-green-600'
        },
        {
          id: 'github',
          label: 'GitHub',
          icon: Github,
          description: 'Интеграция с GitHub',
          color: 'text-gray-700'
        }
      ]
    },
    {
      title: 'Настройки',
      items: [
        {
          id: 'settings',
          label: 'Настройки',
          icon: SettingsIcon,
          description: 'Конфигурация системы',
          color: 'text-gray-600'
        }
      ]
    }
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // Здесь будет логика поиска
  };

  const handleLogout = () => {
    authActions.logout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ImprovedDashboard />;
      case 'leads':
        return <div className="p-6">Управление лидами - в разработке</div>;
      case 'deals':
        return <div className="p-6">Управление сделками - в разработке</div>;
      case 'contacts':
        return <div className="p-6">Управление контактами - в разработке</div>;
      case 'companies':
        return <div className="p-6">Управление компаниями - в разработке</div>;
      case 'tasks':
        return <div className="p-6">Управление задачами - в разработке</div>;
      case 'calendar':
        return <div className="p-6">Календарь - в разработке</div>;
      case 'reports':
        return <div className="p-6">Отчёты - в разработке</div>;
      case 'settings':
        return <div className="p-6">Настройки - в разработке</div>;
      default:
        return <ImprovedDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">CRM System</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            aria-label="Закрыть меню"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          {/* Поиск */}
          <div className="px-6 mb-6">
            <SearchBar
              query={searchQuery}
              onQueryChange={setSearchQuery}
              onSearch={handleSearch}
            />
          </div>

          {/* Навигация */}
          <nav className="space-y-1">
            {navigationSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="px-6">
                <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
                <div className="space-y-1 mt-2">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      <span className="flex-1 text-left">{item.label}</span>
                    </button>
                  ))}
                </div>
                {sectionIndex < navigationSections.length - 1 && (
                  <hr className="my-4 border-gray-200" />
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                aria-label="Открыть меню"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {navigationSections
                  .flatMap(section => section.items)
                  .find(item => item.id === activeTab)?.label || 'Дашборд'}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Быстрые действия */}
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Быстрые действия">
                <Plus className="h-5 w-5" />
              </button>

              {/* Уведомления */}
              <NotificationCenter
                notifications={state.notifications}
                unreadCount={state.notifications.filter(n => !n.read).length}
                onMarkAsRead={(id) => {
                  // Логика отметки как прочитанное
                  console.log('Mark as read:', id);
                }}
              />

              {/* Переключатель темы */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={darkMode ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Пользовательское меню */}
              <UserMenu
                user={{
                  name: authState.user?.name || 'Пользователь',
                  email: authState.user?.email || 'user@example.com',
                  role: 'Менеджер по продажам'
                }}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ImprovedNavigation;
