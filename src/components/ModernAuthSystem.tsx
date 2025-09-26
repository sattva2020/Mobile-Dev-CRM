import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  Settings, 
  LogOut,
  Shield,
  Key,
  AlertTriangle,
  Loader,
  User,
  Sparkles,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Code,
  Database,
  Palette,
  Bot,
  Github,
  Figma
} from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'developer' | 'viewer';
  createdAt: string;
  lastLogin: string;
  preferences: {
    theme: 'light' | 'dark';
    language: 'ru' | 'en';
    notifications: boolean;
  };
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
  loading: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  members: string[];
  createdAt: string;
  lastAccessed: string;
  status: 'active' | 'archived' | 'deleted';
  settings: {
    theme: string;
    notifications: boolean;
    integrations: {
      github: boolean;
      figma: boolean;
      supabase: boolean;
    };
  };
}

const ModernAuthSystem: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load auth state from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('auth-state');
    const savedProject = localStorage.getItem('current-project');
    const savedProjects = localStorage.getItem('user-projects');
    
    if (savedAuth) {
      const auth = JSON.parse(savedAuth);
      setAuthState(auth);
    }
    
    if (savedProject) {
      setCurrentProject(JSON.parse(savedProject));
    }
    
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    
    setAuthState(prev => ({ ...prev, loading: false }));
  }, []);

  // Save auth state to localStorage
  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem('auth-state', JSON.stringify(authState));
    }
  }, [authState]);

  // Save current project to localStorage
  useEffect(() => {
    if (currentProject) {
      localStorage.setItem('current-project', JSON.stringify(currentProject));
    }
  }, [currentProject]);

  // Save projects to localStorage
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('user-projects', JSON.stringify(projects));
    }
  }, [projects]);

  // Generate sample data
  const generateSampleData = () => {
    const sampleUser: UserData = {
      id: 'user-1',
      email: 'developer@example.com',
      name: 'Иван Разработчик',
      avatar: '/api/placeholder/40/40',
      role: 'developer',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      preferences: {
        theme: 'light',
        language: 'ru',
        notifications: true
      }
    };

    const sampleProjects: Project[] = [
      {
        id: 'project-1',
        name: 'AI-Fitness Coach 360',
        description: 'Мобильное приложение для фитнеса с AI',
        owner: 'user-1',
        members: ['user-1'],
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        status: 'active',
        settings: {
          theme: 'blue',
          notifications: true,
          integrations: {
            github: true,
            figma: true,
            supabase: true
          }
        }
      },
      {
        id: 'project-2',
        name: 'E-commerce Platform',
        description: 'Платформа для интернет-магазина',
        owner: 'user-1',
        members: ['user-1'],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        lastAccessed: new Date(Date.now() - 3600000).toISOString(),
        status: 'active',
        settings: {
          theme: 'green',
          notifications: false,
          integrations: {
            github: true,
            figma: false,
            supabase: true
          }
        }
      }
    ];

    setAuthState({
      isAuthenticated: true,
      user: sampleUser,
      token: 'sample-jwt-token',
      loading: false
    });
    setProjects(sampleProjects);
    setCurrentProject(sampleProjects[0]);
  };

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate sample data for demo
      generateSampleData();
      
      setShowLogin(false);
    } catch (error) {
      setError('Ошибка входа. Проверьте данные.');
    } finally {
      setIsLoading(false);
    }
  };

  // Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate sample data for demo
      generateSampleData();
      
      setShowRegister(false);
    } catch (error) {
      setError('Ошибка регистрации. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false
    });
    setCurrentProject(null);
    setProjects([]);
    localStorage.removeItem('auth-state');
    localStorage.removeItem('current-project');
    localStorage.removeItem('user-projects');
  };

  // Switch project
  const switchProject = (project: Project) => {
    setCurrentProject(project);
    setShowProjectSelector(false);
    // Update last accessed
    setProjects(prev => prev.map(p => 
      p.id === project.id 
        ? { ...p, lastAccessed: new Date().toISOString() }
        : p
    ));
  };

  // Create new project
  const createNewProject = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: 'Новый проект',
      description: 'Описание нового проекта',
      owner: authState.user?.id || '',
      members: [authState.user?.id || ''],
      createdAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      status: 'active',
      settings: {
        theme: 'blue',
        notifications: true,
        integrations: {
          github: false,
          figma: false,
          supabase: false
        }
      }
    };
    
    setProjects(prev => [newProject, ...prev]);
    setCurrentProject(newProject);
    setShowProjectSelector(false);
  };

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600 animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 mx-auto">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Mobile Dev CRM
              </h1>
              <p className="text-gray-600 text-lg">Система управления разработкой</p>
              <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>AI Powered</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-blue-500" />
                  <span>Modern UI</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4 text-green-500" />
                  <span>Cloud Ready</span>
                </div>
              </div>
            </div>

            {/* Login Form */}
            {showLogin && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Добро пожаловать!</h2>
                  <p className="text-gray-600">Войдите в свой аккаунт</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email адрес
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                        placeholder="developer@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Пароль
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isLoading ? (
                      <Loader className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <LogIn className="h-5 w-5 mr-2" />
                    )}
                    Войти в систему
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setShowLogin(false);
                      setShowRegister(true);
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Нет аккаунта? Зарегистрироваться
                  </button>
                </div>
              </div>
            )}

            {/* Register Form */}
            {showRegister && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Создать аккаунт</h2>
                  <p className="text-gray-600">Присоединяйтесь к нашей платформе</p>
                </div>
                
                <form onSubmit={handleRegister} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Полное имя
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                        placeholder="Иван Разработчик"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email адрес
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                        placeholder="developer@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Пароль
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Подтвердите пароль
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isLoading ? (
                      <Loader className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <UserPlus className="h-5 w-5 mr-2" />
                    )}
                    Создать аккаунт
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setShowRegister(false);
                      setShowLogin(true);
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Уже есть аккаунт? Войти
                  </button>
                </div>
              </div>
            )}

            {/* Default buttons */}
            {!showLogin && !showRegister && (
              <div className="space-y-4">
                <button
                  onClick={() => setShowLogin(true)}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                >
                  <LogIn className="h-5 w-5 mr-3 group-hover:translate-x-1 transition-transform" />
                  Войти в систему
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => setShowRegister(true)}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                >
                  <UserPlus className="h-5 w-5 mr-3 group-hover:translate-x-1 transition-transform" />
                  Создать аккаунт
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={generateSampleData}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                >
                  <Key className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" />
                  Демо режим
                  <Sparkles className="h-4 w-4 ml-2 group-hover:animate-pulse" />
                </button>
              </div>
            )}

            {/* Features */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Powered</h3>
                <p className="text-sm text-gray-600">Умная аналитика и рекомендации</p>
              </div>
              
              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Developer First</h3>
                <p className="text-sm text-gray-600">Инструменты для разработчиков</p>
              </div>
              
              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Cloud Ready</h3>
                <p className="text-sm text-gray-600">Готово к облачному развертыванию</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Project selector
  if (showProjectSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-6xl w-full space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Выберите проект
              </h2>
              <p className="text-gray-600 text-lg">Переключитесь на нужный проект</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div
                  key={project.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 group"
                  onClick={() => switchProject(project)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${
                      project.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Последний доступ: {new Date(project.lastAccessed).toLocaleDateString()}</span>
                    <span>{project.members.length} участников</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {project.settings.integrations.github && (
                      <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                        <Github className="h-4 w-4 text-white" />
                      </div>
                    )}
                    {project.settings.integrations.figma && (
                      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Figma className="h-4 w-4 text-white" />
                      </div>
                    )}
                    {project.settings.integrations.supabase && (
                      <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <Database className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Create new project */}
              <div
                className="bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300 p-6 cursor-pointer hover:border-blue-400 hover:bg-white/70 transition-all duration-200 transform hover:-translate-y-1 group"
                onClick={createNewProject}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-200">
                    <UserPlus className="h-8 w-8 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Создать проект</h3>
                  <p className="text-gray-600">Начать новый проект</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowProjectSelector(false)}
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main app with auth
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mobile Dev CRM</h1>
                <p className="text-sm text-gray-600">{currentProject?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Project switcher */}
              <button
                onClick={() => setShowProjectSelector(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-medium"
              >
                <Settings className="h-4 w-4" />
                <span>Сменить проект</span>
              </button>
              
              {/* User menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{authState.user?.name}</p>
                  <p className="text-xs text-gray-600 capitalize">{authState.user?.role}</p>
                </div>
                <button
                  onClick={() => setShowProfile(true)}
                  className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <User className="h-5 w-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Добро пожаловать!
            </h2>
            <p className="text-gray-600 text-lg">
              Вы вошли в систему как <strong className="text-blue-600">{authState.user?.name}</strong> в проекте <strong className="text-purple-600">{currentProject?.name}</strong>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-blue-900 text-lg">Текущий проект</h3>
              </div>
              <p className="text-blue-800 font-semibold mb-2">{currentProject?.name}</p>
              <p className="text-sm text-blue-700">{currentProject?.description}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-green-900 text-lg">Роль</h3>
              </div>
              <p className="text-green-800 font-semibold mb-2 capitalize">{authState.user?.role}</p>
              <p className="text-sm text-green-700">Уровень доступа</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                  <Database className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-purple-900 text-lg">Проекты</h3>
              </div>
              <p className="text-purple-800 font-semibold mb-2">{projects.length} проектов</p>
              <p className="text-sm text-purple-700">Доступно для работы</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernAuthSystem;
