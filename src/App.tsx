import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import TaskBoard from './components/TaskBoard';
import Settings from './components/Settings';
import GitHubIntegration from './components/GitHubIntegration';
import AIAnalytics from './components/AIAnalytics';
import TestingPanel from './components/TestingPanel';
import RequirementsManager from './components/RequirementsManager';
import EnhancedKanban from './components/EnhancedKanban';
import ArchitectureMindMap from './components/ArchitectureMindMap';
import ScreenMap from './components/ScreenMap';
import ExtendedMetrics from './components/ExtendedMetrics';
import AILaboratory from './components/AILaboratory';
import FigmaIntegration from './components/FigmaIntegration';
import SupabaseManager from './components/SupabaseManager';
import BeautifulAuthSystem from './components/BeautifulAuthSystem';
import ImprovedNavigation from './components/ImprovedNavigation';
import ProjectManager from './components/ProjectManager';
import {
  LayoutDashboard,
  Kanban,
  Settings as SettingsIcon,
  Bell,
  Github,
  Bot,
  Menu,
  X,
  TestTube,
  FileText,
  Target,
  Network,
  Smartphone,
  TrendingUp,
  MessageSquare,
  Palette,
  Database,
  FolderOpen
} from 'lucide-react';

// Компонент навигации
const Navigation: React.FC = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { id: 'projects', label: 'Проекты', icon: FolderOpen },
    { id: 'requirements', label: 'Требования', icon: FileText },
    { id: 'architecture', label: 'Архитектура', icon: Network },
    { id: 'screens', label: 'Экраны', icon: Smartphone },
    { id: 'kanban', label: 'Канбан', icon: Target },
    { id: 'tasks', label: 'Задачи', icon: Kanban },
    { id: 'github', label: 'GitHub', icon: Github },
    { id: 'ai', label: 'AI Аналитика', icon: Bot },
    { id: 'ai-lab', label: 'AI Лаборатория', icon: MessageSquare },
    { id: 'metrics', label: 'Метрики', icon: TrendingUp },
    { id: 'figma', label: 'Figma', icon: Palette },
    { id: 'supabase', label: 'Supabase', icon: Database },
    { id: 'testing', label: 'Тестирование', icon: TestTube },
    { id: 'settings', label: 'Настройки', icon: SettingsIcon },
  ];

  const unreadNotifications = state.notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Мобильное меню */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Mobile Dev CRM</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Боковая панель */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Логотип */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CRM</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Mobile Dev CRM</h1>
                <p className="text-xs text-gray-500">AI-Fitness Coach 360</p>
              </div>
            </div>
          </div>

          {/* Навигация */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Статус интеграций */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-3">
            <div className="flex items-center space-x-3">
              <Github className={`h-4 w-4 ${state.githubService ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={`text-sm ${state.githubService ? 'text-green-600' : 'text-gray-500'}`}>
                GitHub {state.githubService ? 'подключен' : 'не подключен'}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Bot className={`h-4 w-4 ${state.aiService ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-sm ${state.aiService ? 'text-blue-600' : 'text-gray-500'}`}>
                AI {state.aiService ? 'активен' : 'не настроен'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="lg:ml-64 flex-1 min-h-screen bg-gray-50">
        {/* Верхняя панель */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            
            <div className="flex items-center space-x-4">
              {/* Уведомления */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              {/* Информация о проекте */}
              <div className="text-sm text-gray-500">
                <span className="font-medium">{state.settings.github.repository.owner}</span>
                <span className="mx-1">/</span>
                <span>{state.settings.github.repository.name}</span>
              </div>
            </div>
          </div>
        </div>

               {/* Контент */}
               <main className="flex-1">
                 {activeTab === 'dashboard' && <Dashboard />}
                 {activeTab === 'projects' && <ProjectManager />}
                 {activeTab === 'requirements' && <RequirementsManager />}
                 {activeTab === 'architecture' && <ArchitectureMindMap />}
                 {activeTab === 'screens' && <ScreenMap />}
                 {activeTab === 'kanban' && <EnhancedKanban />}
                 {activeTab === 'tasks' && <TaskBoard />}
                 {activeTab === 'github' && <GitHubIntegration />}
                 {activeTab === 'ai' && <AIAnalytics />}
                 {activeTab === 'ai-lab' && <AILaboratory />}
                 {activeTab === 'metrics' && <ExtendedMetrics />}
                 {activeTab === 'figma' && <FigmaIntegration />}
                 {activeTab === 'supabase' && <SupabaseManager />}
                 {activeTab === 'testing' && <TestingPanel />}
                 {activeTab === 'settings' && <Settings />}
               </main>
      </div>

      {/* Затемнение для мобильного меню */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

// Главный компонент приложения
const AppContent: React.FC = () => {
  const { state } = useApp();
  const { state: authState } = useAuth();

  useEffect(() => {
    // Загружаем тестовые данные при первом запуске
    if (state.tasks.length === 0) {
      // Здесь можно загрузить данные из localStorage или API
      console.log('Загружаем тестовые данные...');
    }
  }, [state.tasks.length]);

  if (state.loading || authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не авторизован, показываем систему авторизации
  if (!authState.isAuthenticated) {
    return <BeautifulAuthSystem />;
  }

  // Если пользователь авторизован, показываем основное приложение
  return <ImprovedNavigation />;
};

// Главный компонент с провайдерами
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <div className="min-h-screen bg-gray-50">
          <AppContent />
        </div>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;