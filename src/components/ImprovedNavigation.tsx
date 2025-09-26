import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import ImprovedDashboard from './ImprovedDashboard';
import MobileAnalyticsDashboard from './MobileAnalyticsDashboard';
import AndroidIntegration from './AndroidIntegration';
import IOSIntegration from './IOSIntegration';
import CICDIntegration from './CICDIntegration';
import DevToolsIntegration from './DevToolsIntegration';
import VersionManagement from './VersionManagement';
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
  darkMode: boolean;
}> = ({ notifications, unreadCount, onMarkAsRead, darkMode }) => {
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
        className={`relative p-2 text-gray-400 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
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
        <div className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} z-50`}>
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Уведомления</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Нет новых уведомлений
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => onMarkAsRead(notification.id)}
                  className={`p-4 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} cursor-pointer ${
                    !notification.read ? darkMode ? 'bg-blue-900' : 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {notification.title}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                        {notification.message}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-400'} mt-1`}>
                        {notification.time || 'Время не указано'}
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
  darkMode: boolean;
}> = ({ user, onLogout, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-3 p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.role}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-56 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} z-50`}>
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
          </div>
          <div className="p-2">
            <button className={`w-full flex items-center space-x-3 px-3 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-lg`}>
              <UserCircle className="h-4 w-4" />
              <span>Профиль</span>
            </button>
            <button className={`w-full flex items-center space-x-3 px-3 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-lg`}>
              <SettingsIcon className="h-4 w-4" />
              <span>Настройки</span>
            </button>
            <hr className="my-2" />
            <button
              onClick={onLogout}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-sm ${darkMode ? 'text-red-400 hover:bg-red-900' : 'text-red-600 hover:bg-red-50'} rounded-lg`}
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
  const { state, dispatch } = useApp();
  const { state: authState, actions: authActions } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(state.settings.theme === 'dark');

  // Синхронизация темы с настройками
  useEffect(() => {
    setDarkMode(state.settings.theme === 'dark');
  }, [state.settings.theme]);

  // Применение темы к документу
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Стили для темной и светлой темы
  const themeStyles = {
    container: darkMode ? 'bg-gray-900' : 'bg-gray-50',
    sidebar: darkMode ? 'bg-gray-800' : 'bg-white',
    header: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: {
      primary: darkMode ? 'text-white' : 'text-gray-900',
      secondary: darkMode ? 'text-gray-300' : 'text-gray-700',
      muted: darkMode ? 'text-gray-400' : 'text-gray-500'
    },
    button: {
      hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
      active: darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
    },
    border: darkMode ? 'border-gray-700' : 'border-gray-200'
  };

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
        },
        {
          id: 'mobile-analytics',
          label: 'Мобильная аналитика',
          icon: Smartphone,
          description: 'Расширенная аналитика для мобильной разработки',
          color: 'text-indigo-600'
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
        },
        {
          id: 'android-integration',
          label: 'Android интеграция',
          icon: Smartphone,
          description: 'Firebase, Google Play Console, Android Studio',
          color: 'text-green-600'
        },
        {
          id: 'ios-integration',
          label: 'iOS интеграция',
          icon: Smartphone,
          description: 'App Store Connect, Xcode, TestFlight',
          color: 'text-blue-600'
        },
        {
          id: 'cicd-integration',
          label: 'CI/CD интеграции',
          icon: GitBranch,
          description: 'GitHub Actions, Fastlane, App Center',
          color: 'text-purple-600'
        }
      ]
    },
    {
      title: 'Инструменты разработки',
      items: [
        {
          id: 'dev-tools',
          label: 'Инструменты разработки',
          icon: Wrench,
          description: 'SonarQube, ESLint, Sentry',
          color: 'text-orange-600'
        },
        {
          id: 'version-management',
          label: 'Управление версиями',
          icon: GitBranch,
          description: 'Semantic versioning, Release management',
          color: 'text-purple-600'
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
      case 'opportunities':
        return <div className="p-6">Анализ возможностей продаж - в разработке</div>;
      case 'contacts':
        return <div className="p-6">Управление контактами - в разработке</div>;
      case 'companies':
        return <div className="p-6">Управление компаниями - в разработке</div>;
      case 'tasks':
        return <div className="p-6">Управление задачами - в разработке</div>;
      case 'calendar':
        return <div className="p-6">Календарь - в разработке</div>;
      case 'communications':
        return <div className="p-6">История коммуникаций - в разработке</div>;
      case 'reports':
        return <div className="p-6">Отчёты - в разработке</div>;
      case 'metrics':
        return <div className="p-6">Метрики и KPI - в разработке</div>;
      case 'mobile-analytics':
        return <MobileAnalyticsDashboard />;
      case 'android-integration':
        return <AndroidIntegration />;
      case 'ios-integration':
        return <IOSIntegration />;
      case 'cicd-integration':
        return <CICDIntegration />;
      case 'dev-tools':
        return <DevToolsIntegration />;
      case 'version-management':
        return <VersionManagement />;
      case 'email':
        return <div className="p-6">Интеграция с Email - в разработке</div>;
      case 'phone':
        return <div className="p-6">Телефония - в разработке</div>;
      case 'github':
        return <div className="p-6">Интеграция с GitHub - в разработке</div>;
      case 'settings':
        return <div className="p-6">Настройки - в разработке</div>;
      default:
        return <ImprovedDashboard />;
    }
  };

  return (
    <div className={`flex h-screen ${themeStyles.container}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 ${themeStyles.sidebar} shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className={`flex items-center justify-between h-16 px-6 border-b ${themeStyles.border}`}>
          <h1 className={`text-xl font-bold ${themeStyles.text.primary}`}>CRM System</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden p-2 rounded-md text-gray-400 ${themeStyles.button.hover}`}
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
                <h3 className={`px-3 py-2 text-xs font-semibold ${themeStyles.text.muted} uppercase tracking-wider`}>
                  {section.title}
                </h3>
                <div className="space-y-1 mt-2">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === item.id
                          ? themeStyles.button.active
                          : `${themeStyles.text.secondary} ${themeStyles.button.hover}`
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      <span className="flex-1 text-left">{item.label}</span>
                    </button>
                  ))}
                </div>
                {sectionIndex < navigationSections.length - 1 && (
                  <hr className={`my-4 ${themeStyles.border}`} />
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className={`${themeStyles.header} shadow-sm px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`lg:hidden p-2 rounded-md text-gray-400 ${themeStyles.button.hover}`}
                aria-label="Открыть меню"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h2 className={`text-lg font-semibold ${themeStyles.text.primary}`}>
                {navigationSections
                  .flatMap(section => section.items)
                  .find(item => item.id === activeTab)?.label || 'Дашборд'}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Быстрые действия */}
              <button className={`p-2 text-gray-400 ${themeStyles.button.hover} rounded-lg transition-colors`} aria-label="Быстрые действия">
                <Plus className="h-5 w-5" />
              </button>

              {/* Уведомления */}
              <NotificationCenter
                notifications={state.notifications.map(n => ({
                  id: n.id,
                  type: n.type,
                  title: n.title,
                  message: n.message,
                  time: new Date(n.createdAt).toLocaleString('ru-RU'),
                  read: n.read
                }))}
                unreadCount={state.notifications.filter(n => !n.read).length}
                onMarkAsRead={(id) => {
                  dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
                }}
                darkMode={darkMode}
              />

              {/* Переключатель темы */}
              <button
                onClick={() => {
                  const newTheme = darkMode ? 'light' : 'dark';
                  setDarkMode(!darkMode);
                  dispatch({
                    type: 'UPDATE_SETTINGS',
                    payload: { theme: newTheme }
                  });
                }}
                className={`p-2 text-gray-400 ${themeStyles.button.hover} rounded-lg transition-colors`}
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
                darkMode={darkMode}
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={`flex-1 overflow-auto ${themeStyles.container}`}>
          {renderContent()}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className={`fixed inset-0 ${darkMode ? 'bg-black bg-opacity-70' : 'bg-black bg-opacity-50'} z-40 lg:hidden`}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ImprovedNavigation;
