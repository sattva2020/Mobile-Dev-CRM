import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Notification } from '../context/AppContext';
import { 
  Github, 
  Bot, 
  Bell, 
  Palette, 
  Globe,
  Save,
  TestTube,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

// Компонент секции настроек
const SettingsSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center space-x-3 mb-6">
      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
);

// Компонент переключателя
const Toggle: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description?: string;
}> = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <h3 className="text-sm font-medium text-gray-900">{label}</h3>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      aria-label={`${label}: ${enabled ? 'включено' : 'выключено'}`}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

// Компонент поля ввода
const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'password' | 'number';
  placeholder?: string;
  description?: string;
  required?: boolean;
}> = ({ label, value, onChange, type = 'text', placeholder, description, required }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type === 'password' && !showPassword ? 'password' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={required}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
};

// Компонент селекта
const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  description?: string;
}> = ({ label, value, onChange, options, description }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {description && (
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    )}
  </div>
);

// Компонент статуса подключения
const ConnectionStatus: React.FC<{
  isConnected: boolean;
  service: string;
  onTest: () => void;
  onConnect: () => void;
}> = ({ isConnected, service, onTest, onConnect }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      {isConnected ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-500" />
      )}
      <div>
        <p className="font-medium text-gray-900">{service}</p>
        <p className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? 'Подключен' : 'Не подключен'}
        </p>
      </div>
    </div>
    <div className="flex space-x-2">
      <button
        onClick={onTest}
        aria-label={`Протестировать подключение к ${service}`}
        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
      >
        Тест
      </button>
      <button
        onClick={onConnect}
        aria-label={`${isConnected ? 'Отключить' : 'Подключить'} ${service}`}
        className={`px-3 py-1 text-sm rounded ${
          isConnected
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-red-100 text-red-700 hover:bg-red-200'
        }`}
      >
        {isConnected ? 'Отключить' : 'Подключить'}
      </button>
    </div>
  </div>
);

// Главный компонент настроек
const Settings: React.FC = () => {
  const { state, actions } = useApp();
  const [settings, setSettings] = useState(state.settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  // Отслеживаем изменения
  React.useEffect(() => {
    const hasChanged = JSON.stringify(settings) !== JSON.stringify(state.settings);
    setHasChanges(hasChanged);
  }, [settings, state.settings]);

  const handleSave = () => {
    actions.updateSettings(settings);
    setHasChanges(false);
    actions.addNotification({
      type: 'success',
      title: 'Настройки сохранены',
      message: 'Все изменения успешно применены',
      source: 'system',
      read: false,
    });
  };

  const handleReset = () => {
    setSettings(state.settings);
    setHasChanges(false);
  };

  const testConnection = async (service: string) => {
    setTestingConnection(service);
    
    // Симуляция тестирования подключения
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (service === 'github') {
      actions.setGitHubService(!state.githubService);
    } else if (service === 'ai') {
      actions.setAIService(!state.aiService);
    }
    
    setTestingConnection(null);
    
    actions.addNotification({
      type: 'success',
      title: `Подключение к ${service} протестировано`,
      message: 'Соединение работает корректно',
      source: 'system',
      read: false,
    });
  };

  const toggleConnection = (service: string) => {
    if (service === 'github') {
      actions.setGitHubService(!state.githubService);
    } else if (service === 'ai') {
      actions.setAIService(!state.aiService);
    }
    
    actions.addNotification({
      type: 'info',
      title: `${service} ${state.githubService ? 'отключен' : 'подключен'}`,
      message: `Сервис ${service} ${state.githubService ? 'отключен' : 'подключен'}`,
      source: 'system',
      read: false,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
        <p className="text-gray-600 mt-1">Управление конфигурацией системы и интеграциями</p>
      </div>

      {/* GitHub настройки */}
      <SettingsSection
        title="GitHub интеграция"
        icon={<Github className="h-5 w-5" />}
      >
        <div className="space-y-6">
          <ConnectionStatus
            isConnected={state.githubService}
            service="GitHub API"
            onTest={() => testConnection('github')}
            onConnect={() => toggleConnection('github')}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Personal Access Token"
              value={settings.github.token || ''}
              onChange={(value) => setSettings({
                ...settings,
                github: { ...settings.github, token: value }
              })}
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              description="Токен для доступа к GitHub API"
            />
            
            <div className="space-y-4">
              <InputField
                label="Владелец репозитория"
                value={settings.github.repository.owner}
                onChange={(value) => setSettings({
                  ...settings,
                  github: {
                    ...settings.github,
                    repository: { ...settings.github.repository, owner: value }
                  }
                })}
                placeholder="username"
                description="Имя пользователя или организации"
              />
              
              <InputField
                label="Название репозитория"
                value={settings.github.repository.name}
                onChange={(value) => setSettings({
                  ...settings,
                  github: {
                    ...settings.github,
                    repository: { ...settings.github.repository, name: value }
                  }
                })}
                placeholder="repository-name"
                description="Название репозитория"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Toggle
              enabled={settings.github.autoSync}
              onChange={(enabled) => setSettings({
                ...settings,
                github: { ...settings.github, autoSync: enabled }
              })}
              label="Автоматическая синхронизация"
              description="Автоматически синхронизировать задачи с GitHub Issues"
            />
            
            {settings.github.autoSync && (
              <InputField
                label="Интервал синхронизации (минуты)"
                value={settings.github.syncInterval.toString()}
                onChange={(value) => setSettings({
                  ...settings,
                  github: { ...settings.github, syncInterval: parseInt(value) || 30 }
                })}
                type="number"
                placeholder="30"
                description="Как часто синхронизировать с GitHub"
              />
            )}
          </div>
        </div>
      </SettingsSection>

      {/* AI настройки */}
      <SettingsSection
        title="AI интеграция"
        icon={<Bot className="h-5 w-5" />}
      >
        <div className="space-y-6">
          <ConnectionStatus
            isConnected={state.aiService}
            service="AI Assistant (Grok-4-Fast)"
            onTest={() => testConnection('ai')}
            onConnect={() => toggleConnection('ai')}
          />
          
          <div className="space-y-4">
            <Toggle
              enabled={settings.ai.enabled}
              onChange={(enabled) => setSettings({
                ...settings,
                ai: { ...settings.ai, enabled }
              })}
              label="Включить AI помощника"
              description="Использовать AI для автоматических предложений и анализа"
            />
            
            {settings.ai.enabled && (
              <>
                <InputField
                  label="API ключ OpenRouter"
                  value={settings.ai.apiKey || ''}
                  onChange={(value) => setSettings({
                    ...settings,
                    ai: { ...settings.ai, apiKey: value }
                  })}
                  type="password"
                  placeholder="sk-or-xxxxxxxxxxxxxxxxxxxx"
                  description="API ключ для доступа к OpenRouter"
                />
                
                <SelectField
                  label="AI модель"
                  value={settings.ai.model}
                  onChange={(value) => setSettings({
                    ...settings,
                    ai: { ...settings.ai, model: value }
                  })}
                  options={[
                    { value: 'grok-4-fast', label: 'Grok-4-Fast (рекомендуется)' },
                    { value: 'gpt-4', label: 'GPT-4' },
                    { value: 'claude-3', label: 'Claude-3' },
                  ]}
                  description="Модель AI для анализа и предложений"
                />
                
                <Toggle
                  enabled={settings.ai.autoSuggestions}
                  onChange={(enabled) => setSettings({
                    ...settings,
                    ai: { ...settings.ai, autoSuggestions: enabled }
                  })}
                  label="Автоматические предложения"
                  description="AI автоматически предлагает улучшения для задач"
                />
              </>
            )}
          </div>
        </div>
      </SettingsSection>

      {/* Уведомления */}
      <SettingsSection
        title="Уведомления"
        icon={<Bell className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <Toggle
            enabled={settings.notifications.enabled}
            onChange={(enabled) => setSettings({
              ...settings,
              notifications: { ...settings.notifications, enabled }
            })}
            label="Включить уведомления"
            description="Показывать уведомления о событиях системы"
          />
          
          {settings.notifications.enabled && (
            <>
              <Toggle
                enabled={settings.notifications.sound}
                onChange={(enabled) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, sound: enabled }
                })}
                label="Звуковые уведомления"
                description="Воспроизводить звук при получении уведомлений"
              />
              
              <Toggle
                enabled={settings.notifications.desktop}
                onChange={(enabled) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, desktop: enabled }
                })}
                label="Desktop уведомления"
                description="Показывать уведомления в системном трее"
              />
            </>
          )}
        </div>
      </SettingsSection>

      {/* Внешний вид */}
      <SettingsSection
        title="Внешний вид"
        icon={<Palette className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <SelectField
            label="Тема"
            value={settings.theme}
            onChange={(value) => setSettings({
              ...settings,
              theme: value as 'light' | 'dark'
            })}
            options={[
              { value: 'light', label: 'Светлая' },
              { value: 'dark', label: 'Темная' },
            ]}
            description="Цветовая схема интерфейса"
          />
          
          <SelectField
            label="Язык"
            value={settings.language}
            onChange={(value) => setSettings({
              ...settings,
              language: value as 'ru' | 'en'
            })}
            options={[
              { value: 'ru', label: 'Русский' },
              { value: 'en', label: 'English' },
            ]}
            description="Язык интерфейса"
          />
        </div>
      </SettingsSection>

      {/* Кнопки действий */}
      {hasChanges && (
        <div className="flex justify-end space-x-3 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Отменить изменения
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            <span>Сохранить изменения</span>
          </button>
        </div>
      )}

      {/* Информация о системе */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о системе</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Версия приложения:</span>
            <span className="ml-2 font-medium">1.0.0</span>
          </div>
          <div>
            <span className="text-gray-600">Последняя синхронизация:</span>
            <span className="ml-2 font-medium">
              {state.lastSync ? new Date(state.lastSync).toLocaleString('ru-RU') : 'Никогда'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Всего задач:</span>
            <span className="ml-2 font-medium">{state.stats.totalTasks}</span>
          </div>
          <div>
            <span className="text-gray-600">Выполнено задач:</span>
            <span className="ml-2 font-medium">{state.stats.completedTasks}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;