import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from 'lucide-react';
import { Notification } from './AppContext';

// Types
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

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
  currentProject: Project | null;
  projects: Project[];
  loading: boolean;
}

interface AuthContextType {
  state: AuthState;
  actions: {
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    switchProject: (projectId: string) => void;
    createProject: (name: string, description: string) => void;
    updateUser: (updates: Partial<UserData>) => void;
    updateProject: (projectId: string, updates: Partial<Project>) => void;
    setLoading: (loading: boolean) => void;
  };
}

// Action types
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: UserData; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_CURRENT_PROJECT'; payload: Project }
  | { type: 'UPDATE_USER'; payload: Partial<UserData> }
  | { type: 'UPDATE_PROJECT'; payload: { projectId: string; updates: Partial<Project> } }
  | { type: 'CREATE_PROJECT'; payload: Project };

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  currentProject: null,
  projects: [],
  loading: true
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        currentProject: null,
        projects: [],
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload
      };
    case 'SET_CURRENT_PROJECT':
      return {
        ...state,
        currentProject: action.payload
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.projectId
            ? { ...project, ...action.payload.updates }
            : project
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { ...state.currentProject, ...action.payload.updates }
          : state.currentProject
      };
    case 'CREATE_PROJECT':
      return {
        ...state,
        projects: [action.payload, ...state.projects],
        currentProject: action.payload
      };
    default:
      return state;
  }
};

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load auth state from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('auth-state');
    const savedProject = localStorage.getItem('current-project');
    const savedProjects = localStorage.getItem('user-projects');
    
    if (savedAuth) {
      const auth = JSON.parse(savedAuth);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: auth.user, token: auth.token } });
    }
    
    if (savedProject) {
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: JSON.parse(savedProject) });
    }
    
    if (savedProjects) {
      dispatch({ type: 'SET_PROJECTS', payload: JSON.parse(savedProjects) });
    }
    
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  // Save auth state to localStorage
  useEffect(() => {
    if (state.isAuthenticated) {
      localStorage.setItem('auth-state', JSON.stringify({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token
      }));
    }
  }, [state.isAuthenticated, state.user, state.token]);

  // Save current project to localStorage
  useEffect(() => {
    if (state.currentProject) {
      localStorage.setItem('current-project', JSON.stringify(state.currentProject));
    }
  }, [state.currentProject]);

  // Save projects to localStorage
  useEffect(() => {
    if (state.projects.length > 0) {
      localStorage.setItem('user-projects', JSON.stringify(state.projects));
    }
  }, [state.projects]);

  // Actions
  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate sample user for demo
      const user: UserData = {
        id: 'user-1',
        email,
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
      
      const token = 'sample-jwt-token';
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      
      // Generate sample projects if none exist
      if (state.projects.length === 0) {
        const sampleProjects: Project[] = [
          {
            id: 'project-1',
            name: 'AI-Fitness Coach 360',
            description: 'Мобильное приложение для фитнеса с AI',
            owner: user.id,
            members: [user.id],
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
          }
        ];
        
        dispatch({ type: 'SET_PROJECTS', payload: sampleProjects });
        dispatch({ type: 'SET_CURRENT_PROJECT', payload: sampleProjects[0] });
      }
    } catch (error) {
      throw new Error('Ошибка входа. Проверьте данные.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate sample user for demo
      const user: UserData = {
        id: `user-${Date.now()}`,
        email,
        name,
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
      
      const token = 'sample-jwt-token';
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } catch (error) {
      throw new Error('Ошибка регистрации. Попробуйте снова.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('auth-state');
    localStorage.removeItem('current-project');
    localStorage.removeItem('user-projects');
  };

  const switchProject = (projectId: string) => {
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
      
      // Update last accessed
      dispatch({
        type: 'UPDATE_PROJECT',
        payload: {
          projectId,
          updates: { lastAccessed: new Date().toISOString() }
        }
      });
    }
  };

  const createProject = (name: string, description: string) => {
    if (!state.user) return;
    
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name,
      description,
      owner: state.user.id,
      members: [state.user.id],
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
    
    dispatch({ type: 'CREATE_PROJECT', payload: newProject });
  };

  const updateUser = (updates: Partial<UserData>) => {
    dispatch({ type: 'UPDATE_USER', payload: updates });
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { projectId, updates } });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const value: AuthContextType = {
    state,
    actions: {
      login,
      register,
      logout,
      switchProject,
      createProject,
      updateUser,
      updateProject,
      setLoading
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
