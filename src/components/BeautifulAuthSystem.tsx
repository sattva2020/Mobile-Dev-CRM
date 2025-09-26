import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
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
  ArrowRight,
  CheckCircle,
  Code,
  Database,
  Bot,
  Github,
  Figma,
  Heart,
  Rocket,
  Award
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

const BeautifulAuthSystem: React.FC = () => {
  const { actions } = useAuth();
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
  const [success, setSuccess] = useState<string | null>(null);

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

    // Сигнализируем глобальному контексту об авторизации, чтобы отрендерить навигацию
    try { actions.login(sampleUser.email, 'demo-password'); } catch {}
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
    setSuccess(null);

    try {
      await actions.login(loginForm.email, loginForm.password);
      setSuccess('Успешный вход в систему!');
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
    setSuccess(null);

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    if (registerForm.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      setIsLoading(false);
      return;
    }

    try {
      await actions.register(registerForm.name, registerForm.email, registerForm.password);
      setSuccess('Аккаунт успешно создан!');
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-purple-300/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-purple-400 animate-pulse" />
          </div>
          <p className="text-purple-100 font-bold text-2xl mb-6">Загрузка...</p>
          <div className="flex items-center justify-center space-x-3">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Modern Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`
          }}
        ></div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4 lg:p-8">
          <div className="w-full max-w-4xl lg:max-w-6xl xl:grid xl:grid-cols-2 xl:gap-12">
            {/* Header */}
            <div className="text-center mb-12 xl:col-span-1 xl:order-1">
              <div className="relative inline-block mb-8">
                <div className="w-28 h-28 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl mx-auto transform hover:scale-110 transition-all duration-500 animate-glow">
                  <Shield className="h-14 w-14 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-lg" style={{animationDelay: '0.5s'}}>
                  <Heart className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <h1 className="text-6xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
                Mobile Dev CRM
              </h1>
              <p className="text-purple-100 text-2xl font-light mb-8 tracking-wide">Система управления разработкой</p>
              
              <div className="flex items-center justify-center space-x-8 text-sm">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full shadow-xl border border-white/20">
                  <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
                  <span className="font-semibold text-white">AI Powered</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full shadow-xl border border-white/20">
                  <Rocket className="h-5 w-5 text-blue-400 animate-pulse" />
                  <span className="font-semibold text-white">Modern UI</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full shadow-xl border border-white/20">
                  <Award className="h-5 w-5 text-purple-400 animate-pulse" />
                  <span className="font-semibold text-white">Cloud Ready</span>
                </div>
              </div>
            </div>

            {/* Right column: forms and messages */}
            <div className="xl:col-span-1 xl:order-2 xl:sticky xl:top-16">
            {/* Success Message */}
            {success && (
              <div data-testid="success-message" className="mb-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6 animate-slide-down">
                <div className="flex items-center space-x-4">
                  <CheckCircle className="h-7 w-7 text-green-400" />
                  <span className="text-green-100 font-semibold text-lg">{success}</span>
                </div>
              </div>
            )}

            {/* Login Form */}
            {showLogin && (
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-10 transform hover:scale-105 transition-all duration-500 max-w-xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-bold text-white mb-4">Добро пожаловать!</h2>
                  <p className="text-purple-100 text-xl">Войдите в свой аккаунт</p>
                </div>
                
                <form data-testid="login-form" onSubmit={handleLogin} className="space-y-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-purple-100 mb-4">
                        Email адрес
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-300 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          data-testid="login-email"
                          type="email"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full pl-16 pr-5 py-5 border-2 border-purple-300/30 rounded-2xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 bg-white/10 backdrop-blur-xl transition-all duration-300 text-lg font-medium text-white placeholder-purple-200"
                          placeholder="developer@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-purple-100 mb-4">
                        Пароль
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-300 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          data-testid="login-password"
                          type={showPassword ? 'text' : 'password'}
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full pl-16 pr-16 py-5 border-2 border-purple-300/30 rounded-2xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 bg-white/10 backdrop-blur-xl transition-all duration-300 text-lg font-medium text-white placeholder-purple-200"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          data-testid="login-password-toggle"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-white/10"
                        >
                          {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="flex items-center space-x-4 text-red-300 text-sm bg-red-500/20 backdrop-blur-xl p-5 rounded-2xl border border-red-400/30 animate-shake">
                      <AlertTriangle className="h-6 w-6 flex-shrink-0" />
                      <span className="font-medium text-lg">{error}</span>
                    </div>
                  )}
                  
                  <button
                    data-testid="login-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-2xl hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-300 font-bold text-xl shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 active:translate-y-0 group"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="h-7 w-7 animate-spin mr-4" />
                        Вход в систему...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-7 w-7 mr-4" />
                        Войти в систему
                        <ArrowRight className="h-6 w-6 ml-4 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
                
                <div className="mt-10 text-center">
                  <button
                    onClick={() => {
                      setShowLogin(false);
                      setShowRegister(true);
                    }}
                    className="text-purple-200 hover:text-white font-bold text-xl transition-colors hover:underline"
                  >
                    Нет аккаунта? Создать новый
                  </button>
                </div>
              </div>
            )}

            {/* Register Form */}
            {showRegister && (
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-10 transform hover:scale-105 transition-all duration-500 max-w-xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-bold text-white mb-4">Создать аккаунт</h2>
                  <p className="text-purple-100 text-xl">Присоединяйтесь к нашей платформе</p>
                </div>
                
                <form data-testid="register-form" onSubmit={handleRegister} className="space-y-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-purple-100 mb-4">
                        Полное имя
                      </label>
                      <div className="relative group">
                        <User className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-300 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          data-testid="register-name"
                          type="text"
                          value={registerForm.name}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full pl-16 pr-5 py-5 border-2 border-purple-300/30 rounded-2xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 bg-white/10 backdrop-blur-xl transition-all duration-300 text-lg font-medium text-white placeholder-purple-200"
                          placeholder="Иван Разработчик"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-purple-100 mb-4">
                        Email адрес
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-300 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          data-testid="register-email"
                          type="email"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full pl-16 pr-5 py-5 border-2 border-purple-300/30 rounded-2xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 bg-white/10 backdrop-blur-xl transition-all duration-300 text-lg font-medium text-white placeholder-purple-200"
                          placeholder="developer@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-purple-100 mb-4">
                        Пароль
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-300 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          data-testid="register-password"
                          type={showPassword ? 'text' : 'password'}
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full pl-16 pr-16 py-5 border-2 border-purple-300/30 rounded-2xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 bg-white/10 backdrop-blur-xl transition-all duration-300 text-lg font-medium text-white placeholder-purple-200"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          data-testid="register-password-toggle"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-white/10"
                        >
                          {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-purple-100 mb-4">
                        Подтвердите пароль
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-300 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          data-testid="register-confirm"
                          type={showPassword ? 'text' : 'password'}
                          value={registerForm.confirmPassword}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full pl-16 pr-5 py-5 border-2 border-purple-300/30 rounded-2xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 bg-white/10 backdrop-blur-xl transition-all duration-300 text-lg font-medium text-white placeholder-purple-200"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="flex items-center space-x-4 text-red-300 text-sm bg-red-500/20 backdrop-blur-xl p-5 rounded-2xl border border-red-400/30 animate-shake">
                      <AlertTriangle className="h-6 w-6 flex-shrink-0" />
                      <span className="font-medium text-lg">{error}</span>
                    </div>
                  )}
                  
                  <button
                    data-testid="register-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-10 py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-2xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all duration-300 font-bold text-xl shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-2 active:translate-y-0 group"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="h-7 w-7 animate-spin mr-4" />
                        Создание аккаунта...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-7 w-7 mr-4" />
                        Создать аккаунт
                        <ArrowRight className="h-6 w-6 ml-4 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
                
                <div className="mt-10 text-center">
                  <button
                    onClick={() => {
                      setShowRegister(false);
                      setShowLogin(true);
                    }}
                    className="text-purple-200 hover:text-white font-bold text-xl transition-colors hover:underline"
                  >
                    Уже есть аккаунт? Войти
                  </button>
                </div>
              </div>
            )}

            {/* Default buttons */}
            {!showLogin && !showRegister && (
              <div className="space-y-6 max-w-xl mx-auto">
                <button
                  data-testid="btn-login"
                  onClick={() => setShowLogin(true)}
                  className="w-full flex items-center justify-center px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-2xl hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 transition-all duration-500 font-bold text-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-3 active:translate-y-0 group"
                >
                  <LogIn className="h-8 w-8 mr-6 group-hover:translate-x-2 transition-transform" />
                  Войти в систему
                  <ArrowRight className="h-6 w-6 ml-4 group-hover:translate-x-2 transition-transform" />
                </button>
                
                <button
                  data-testid="btn-register"
                  onClick={() => setShowRegister(true)}
                  className="w-full flex items-center justify-center px-12 py-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-2xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all duration-500 font-bold text-2xl shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-3 active:translate-y-0 group"
                >
                  <UserPlus className="h-8 w-8 mr-6 group-hover:translate-x-2 transition-transform" />
                  Создать аккаунт
                  <ArrowRight className="h-6 w-6 ml-4 group-hover:translate-x-2 transition-transform" />
                </button>
                
                <button
                  data-testid="btn-demo"
                  onClick={generateSampleData}
                  className="w-full flex items-center justify-center px-12 py-6 bg-gradient-to-r from-slate-600 via-gray-700 to-slate-800 text-white rounded-2xl hover:from-slate-700 hover:via-gray-800 hover:to-slate-900 transition-all duration-500 font-bold text-2xl shadow-2xl hover:shadow-slate-500/25 transform hover:-translate-y-3 active:translate-y-0 group"
                >
                  <Key className="h-8 w-8 mr-6 group-hover:rotate-12 transition-transform" />
                  Демо режим
                  <Sparkles className="h-6 w-6 ml-4 group-hover:animate-pulse" />
                </button>
              </div>
            )}

            </div>

            {/* Features (left column) */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 xl:col-span-1 xl:order-3">
              <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-white text-2xl mb-3">AI Powered</h3>
                <p className="text-purple-100 text-lg">Умная аналитика и рекомендации</p>
              </div>
              
              <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl hover:shadow-green-500/10 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Code className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-white text-2xl mb-3">Developer First</h3>
                <p className="text-purple-100 text-lg">Инструменты для разработчиков</p>
              </div>
              
              <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Database className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-white text-2xl mb-3">Cloud Ready</h3>
                <p className="text-purple-100 text-lg">Готово к облачному развертыванию</p>
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-6xl w-full space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Выберите проект
              </h2>
              <p className="text-gray-600 text-lg">Переключитесь на нужный проект</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div
                  key={project.id}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                  onClick={() => switchProject(project)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
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
                      <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                        <Github className="h-5 w-5 text-white" />
                      </div>
                    )}
                    {project.settings.integrations.figma && (
                      <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Figma className="h-5 w-5 text-white" />
                      </div>
                    )}
                    {project.settings.integrations.supabase && (
                      <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Database className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Create new project */}
              <div
                className="bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-300 p-6 cursor-pointer hover:border-indigo-400 hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-2 group"
                onClick={createNewProject}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:from-indigo-100 group-hover:to-indigo-200 transition-all duration-300">
                    <UserPlus className="h-10 w-10 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">Создать проект</h3>
                  <p className="text-gray-600">Начать новый проект</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowProjectSelector(false)}
                className="text-gray-600 hover:text-gray-800 font-bold text-lg transition-colors hover:underline"
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Shield className="h-7 w-7 text-white" />
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
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors font-medium"
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
                  className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <User className="h-6 w-6" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
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
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Добро пожаловать!
            </h2>
            <p className="text-gray-600 text-xl">
              Вы вошли в систему как <strong className="text-indigo-600">{authState.user?.name}</strong> в проекте <strong className="text-purple-600">{currentProject?.name}</strong>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-3xl p-6 border border-indigo-200 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-indigo-900 text-xl">Текущий проект</h3>
              </div>
              <p className="text-indigo-800 font-bold mb-2 text-lg">{currentProject?.name}</p>
              <p className="text-sm text-indigo-700">{currentProject?.description}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 border border-green-200 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-green-900 text-xl">Роль</h3>
              </div>
              <p className="text-green-800 font-bold mb-2 text-lg capitalize">{authState.user?.role}</p>
              <p className="text-sm text-green-700">Уровень доступа</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 border border-purple-200 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-purple-900 text-xl">Проекты</h3>
              </div>
              <p className="text-purple-800 font-bold mb-2 text-lg">{projects.length} проектов</p>
              <p className="text-sm text-purple-700">Доступно для работы</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeautifulAuthSystem;
