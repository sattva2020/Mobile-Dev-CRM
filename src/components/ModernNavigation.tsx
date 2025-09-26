import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Dashboard from './Dashboard';
import TaskBoard from './TaskBoard';
import Settings from './Settings';
import GitHubIntegration from './GitHubIntegration';
import AIAnalytics from './AIAnalytics';
import TestingPanel from './TestingPanel';
import RequirementsManager from './RequirementsManager';
import EnhancedKanban from './EnhancedKanban';
import ArchitectureMindMap from './ArchitectureMindMap';
import ScreenMap from './ScreenMap';
import ExtendedMetrics from './ExtendedMetrics';
import AILaboratory from './AILaboratory';
import FigmaIntegration from './FigmaIntegration';
import SupabaseManager from './SupabaseManager';
import ProjectManager from './ProjectManager';
import {
  LayoutDashboard,
  Kanban,
  Settings as SettingsIcon,
  Bell,
  Github,
  Bot,
  Menu,
  X,
  BarChart3,
  TestTube,
  FileText,
  Target,
  Network,
  Smartphone,
  TrendingUp,
  MessageSquare,
  Palette,
  Database,
  FolderOpen,
  User,
  Sparkles,
  Zap,
  Star,
  ChevronRight,
  Search,
  Plus,
  Filter,
  Grid3X3,
  Activity,
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
  Monitor,
  Smartphone as Phone,
  Tablet
} from 'lucide-react';

const ModernNavigation: React.FC = () => {
  const { state } = useApp();
  const { state: authState } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Дашборд', 
      icon: LayoutDashboard,
      color: 'from-blue-500 to-blue-600',
      description: 'Обзор проекта'
    },
    { 
      id: 'projects', 
      label: 'Проекты', 
      icon: FolderOpen,
      color: 'from-green-500 to-green-600',
      description: 'Управление проектами'
    },
    { 
      id: 'requirements', 
      label: 'Требования', 
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      description: 'Анализ требований'
    },
    { 
      id: 'architecture', 
      label: 'Архитектура', 
      icon: Network,
      color: 'from-orange-500 to-orange-600',
      description: 'Архитектурные решения'
    },
    { 
      id: 'screens', 
      label: 'Экраны', 
      icon: Smartphone,
      color: 'from-pink-500 to-pink-600',
      description: 'Карта экранов'
    },
    { 
      id: 'kanban', 
      label: 'Канбан', 
      icon: Target,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Канбан доска'
    },
    { 
      id: 'tasks', 
      label: 'Задачи', 
      icon: Kanban,
      color: 'from-teal-500 to-teal-600',
      description: 'Управление задачами'
    },
    { 
      id: 'github', 
      label: 'GitHub', 
      icon: Github,
      color: 'from-gray-700 to-gray-800',
      description: 'Интеграция с GitHub'
    },
    { 
      id: 'ai', 
      label: 'AI Аналитика', 
      icon: Bot,
      color: 'from-cyan-500 to-cyan-600',
      description: 'AI аналитика'
    },
    { 
      id: 'ai-lab', 
      label: 'AI Лаборатория', 
      icon: MessageSquare,
      color: 'from-violet-500 to-violet-600',
      description: 'AI эксперименты'
    },
    { 
      id: 'metrics', 
      label: 'Метрики', 
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      description: 'Аналитика и метрики'
    },
    { 
      id: 'figma', 
      label: 'Figma', 
      icon: Palette,
      color: 'from-rose-500 to-rose-600',
      description: 'Интеграция с Figma'
    },
    { 
      id: 'supabase', 
      label: 'Supabase', 
      icon: Database,
      color: 'from-lime-500 to-lime-600',
      description: 'Управление базой данных'
    },
    { 
      id: 'testing', 
      label: 'Тестирование', 
      icon: TestTube,
      color: 'from-amber-500 to-amber-600',
      description: 'Тестирование и QA'
    },
    { 
      id: 'settings', 
      label: 'Настройки', 
      icon: SettingsIcon,
      color: 'from-slate-500 to-slate-600',
      description: 'Настройки системы'
    },
  ];

  const unreadNotifications = state.notifications.filter(n => !n.read).length;
  const filteredTabs = tabs.filter(tab => 
    tab.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tab.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Mobile Dev CRM</h1>
              <p className="text-xs text-gray-500">AI-Fitness Coach 360</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={darkMode ? 'Отключить тёмную тему' : 'Включить тёмную тему'}
              type="button"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={sidebarOpen ? 'Закрыть меню' : 'Открыть меню'}
              type="button"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mobile Dev CRM</h1>
                <p className="text-sm text-gray-500">AI-Fitness Coach 360</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
            {filteredTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isActive 
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg` 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">{tab.label}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{tab.description}</p>
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Status */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className={`w-3 h-3 rounded-full ${state.githubService ? 'bg-green-500' : 'bg-gray-400'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">GitHub</p>
                <p className="text-xs text-gray-500">{state.githubService ? 'Подключен' : 'Не подключен'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className={`w-3 h-3 rounded-full ${state.aiService ? 'bg-blue-500' : 'bg-gray-400'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">AI Service</p>
                <p className="text-xs text-gray-500">{state.aiService ? 'Активен' : 'Не настроен'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-80 flex-1 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Top bar */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span>•</span>
                <span>{tabs.find(t => t.id === activeTab)?.description}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Quick actions */}
              <div className="hidden md:flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Создать" type="button">
                  <Plus className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Фильтр" type="button">
                  <Filter className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Изменить вид" type="button">
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Открыть уведомления" type="button">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              {/* Project info */}
              <div className="hidden md:flex items-center space-x-3 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">{state.settings.github.repository.owner}</span>
                <span>/</span>
                <span>{state.settings.github.repository.name}</span>
              </div>
              
              {/* Theme toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={darkMode ? 'Отключить тёмную тему' : 'Включить тёмную тему'}
                type="button"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
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
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ModernNavigation;
