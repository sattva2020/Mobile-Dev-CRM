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
  User
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

const AuthSystem: React.FC = () => {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Mobile Dev CRM</h2>
            <p className="text-gray-600">Система управления разработкой</p>
          </div>

          {/* Login Form */}
          {showLogin && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Вход в систему</h3>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="developer@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <LogIn className="h-4 w-4 mr-2" />
                  )}
                  Войти
                </button>
              </form>
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Нет аккаунта? Зарегистрироваться
                </button>
              </div>
            </div>
          )}

          {/* Register Form */}
          {showRegister && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Регистрация</h3>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Иван Разработчик"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="developer@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Подтвердите пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                {error && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  Зарегистрироваться
                </button>
              </form>
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm"
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
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Войти
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Зарегистрироваться
              </button>
              <button
                onClick={generateSampleData}
                className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                <Key className="h-4 w-4 mr-2" />
                Демо режим
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Project selector
  if (showProjectSelector) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Выберите проект</h2>
            <p className="text-gray-600">Переключитесь на нужный проект</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => switchProject(project)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <div className={`w-3 h-3 rounded-full ${
                    project.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                </div>
                <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Последний доступ: {new Date(project.lastAccessed).toLocaleDateString()}</span>
                  <span>{project.members.length} участников</span>
                </div>
              </div>
            ))}
            
            {/* Create new project */}
            <div
              className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-6 cursor-pointer hover:border-blue-400 transition-colors"
              onClick={createNewProject}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Создать проект</h3>
                <p className="text-gray-600 text-sm">Начать новый проект</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowProjectSelector(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main app with auth
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Mobile Dev CRM</h1>
                <p className="text-sm text-gray-600">{currentProject?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Project switcher */}
              <button
                onClick={() => setShowProjectSelector(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
              >
                <Settings className="h-4 w-4" />
                <span>Сменить проект</span>
              </button>
              
              {/* User menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{authState.user?.name}</p>
                  <p className="text-xs text-gray-600">{authState.user?.role}</p>
                </div>
                <button
                  onClick={() => setShowProfile(true)}
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700"
                >
                  <User className="h-4 w-4" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Добро пожаловать!</h2>
          <p className="text-gray-600 mb-6">
            Вы вошли в систему как <strong>{authState.user?.name}</strong> в проекте <strong>{currentProject?.name}</strong>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Текущий проект</h3>
              <p className="text-blue-700">{currentProject?.name}</p>
              <p className="text-sm text-blue-600">{currentProject?.description}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Роль</h3>
              <p className="text-green-700 capitalize">{authState.user?.role}</p>
              <p className="text-sm text-green-600">Уровень доступа</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Проекты</h3>
              <p className="text-purple-700">{projects.length} проектов</p>
              <p className="text-sm text-purple-600">Доступно для работы</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSystem;
