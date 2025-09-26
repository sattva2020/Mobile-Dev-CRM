import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  RefreshCw, 
  Download, 
  Upload, 
  Settings, 
  Zap, 
  Brain, 
  MessageSquare, 
  Lightbulb,
  Target,
  BarChart3,
  Code,
  FileText,
  Play,
  Pause,
  Square
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'code' | 'analysis' | 'suggestion';
  metadata?: {
    tokens?: number;
    model?: string;
    confidence?: number;
  };
}

interface AISession {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  context?: {
    projectId?: string;
    sprintId?: string;
    focus?: string;
  };
}

const AILaboratory: React.FC = () => {
  const [sessions, setSessions] = useState<AISession[]>([]);
  const [currentSession, setCurrentSession] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [settings, setSettings] = useState({
    model: 'grok-4-fast',
    temperature: 0.7,
    maxTokens: 2000,
    contextWindow: 10
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('ai-laboratory-sessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt)
      }));
      setSessions(parsedSessions);
      if (parsedSessions.length > 0) {
        setCurrentSession(parsedSessions[0].id);
      }
    } else {
      // Create default session
      createNewSession('AI Анализ проекта');
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('ai-laboratory-sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, currentSession]);

  // Create new session
  const createNewSession = (name: string) => {
    const newSession: AISession = {
      id: `session-${Date.now()}`,
      name,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      context: {
        projectId: '550e8400-e29b-41d4-a716-446655440000',
        focus: 'project-analysis'
      }
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession.id);
  };

  // Get current session data
  const currentSessionData = sessions.find(session => session.id === currentSession);

  // Send message to AI
  const sendMessage = async () => {
    if (!message.trim() || !currentSessionData) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    // Add user message
    const updatedSessions = sessions.map(session => 
      session.id === currentSession 
        ? { ...session, messages: [...session.messages, userMessage], updatedAt: new Date() }
        : session
    );
    setSessions(updatedSessions);
    setMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simulate AI response with Grok-4 Fast
      const aiResponse = await simulateAIResponse(message.trim(), currentSessionData);
      
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        type: aiResponse.type,
        metadata: aiResponse.metadata
      };

      // Add assistant message
      const finalSessions = updatedSessions.map(session => 
        session.id === currentSession 
          ? { ...session, messages: [...session.messages, assistantMessage], updatedAt: new Date() }
          : session
      );
      setSessions(finalSessions);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Simulate AI response
  const simulateAIResponse = async (userMessage: string, session: AISession): Promise<ChatMessage> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const responses = [
      {
        content: `Анализирую ваш запрос: "${userMessage}"\n\n**Анализ проекта AI-Fitness Coach 360:**\n\n1. **Архитектура**: React Native + Expo с TypeScript\n2. **Backend**: Supabase с PostgreSQL\n3. **AI**: xAI Grok-4 Fast через OpenRouter\n4. **Состояние**: В разработке, 75% готовности\n\n**Рекомендации:**\n- Оптимизировать производительность камеры\n- Добавить офлайн режим\n- Улучшить UX для пожилых пользователей`,
        type: 'analysis' as const,
        metadata: { tokens: 150, model: 'grok-4-fast', confidence: 0.92 }
      },
      {
        content: `**Код-решение для вашего запроса:**\n\n\`\`\`typescript\n// Оптимизация производительности камеры\nconst optimizedCameraConfig = {\n  quality: 0.8,\n  maxWidth: 1920,\n  maxHeight: 1080,\n  skipProcessing: true\n};\n\n// Использование в VisionCamera\nconst camera = useCameraDevices();\nconst device = camera.back;\n\nconst frameProcessor = useFrameProcessor((frame) => {\n  'worklet';\n  // Обработка кадра с оптимизацией\n  runOnJS(processFrame)(frame);\n}, []);\n\`\`\`\n\nЭто решение улучшит производительность на 30-40%.`,
        type: 'code' as const,
        metadata: { tokens: 200, model: 'grok-4-fast', confidence: 0.88 }
      },
      {
        content: `**Предложения по улучшению проекта:**\n\n🎯 **Приоритет 1 (Критично):**\n- Реализовать кэширование данных\n- Добавить обработку ошибок сети\n- Оптимизировать размер бандла\n\n🚀 **Приоритет 2 (Важно):**\n- Добавить темную тему\n- Реализовать push-уведомления\n- Улучшить анимации\n\n💡 **Приоритет 3 (Желательно):**\n- Добавить социальные функции\n- Реализовать геймификацию\n- Интеграция с фитнес-трекерами`,
        type: 'suggestion' as const,
        metadata: { tokens: 180, model: 'grok-4-fast', confidence: 0.85 }
      }
    ];

    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'assistant',
      content: selectedResponse.content,
      timestamp: new Date(),
      type: selectedResponse.type,
      metadata: selectedResponse.metadata
    };
  };

  // Export session
  const exportSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const data = {
      session,
      exportedAt: new Date().toISOString(),
      settings
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-session-${session.name.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Clear session
  const clearSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSession === sessionId) {
      setCurrentSession(sessions.length > 1 ? sessions[0].id : '');
    }
  };

  // Quick actions
  const quickActions = [
    { label: 'Анализ архитектуры', prompt: 'Проанализируй архитектуру проекта и предложи улучшения' },
    { label: 'Оптимизация производительности', prompt: 'Как оптимизировать производительность приложения?' },
    { label: 'UX/UI рекомендации', prompt: 'Дай рекомендации по улучшению пользовательского опыта' },
    { label: 'Безопасность', prompt: 'Проверь безопасность кода и предложи улучшения' },
    { label: 'Тестирование', prompt: 'Составь план тестирования для мобильного приложения' },
    { label: 'Документация', prompt: 'Помоги создать техническую документацию' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Bot className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Лаборатория</h2>
              <p className="text-sm text-gray-600">Grok-4 Fast</p>
            </div>
          </div>
        </div>

        {/* Sessions */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Сессии</h3>
            <button
              onClick={() => createNewSession(`Сессия ${sessions.length + 1}`)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              + Новая
            </button>
          </div>
          
          <div className="space-y-2">
            {sessions.map(session => (
              <div
                key={session.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  currentSession === session.id 
                    ? 'bg-blue-50 border-blue-200 border' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentSession(session.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session.messages.length} сообщений
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportSession(session.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Download className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSession(session.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Square className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Быстрые действия</h3>
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setMessage(action.prompt)}
                className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {currentSessionData?.name || 'Выберите сессию'}
              </h3>
              <p className="text-sm text-gray-600">
                {currentSessionData?.messages.length || 0} сообщений
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Brain className="h-4 w-4" />
                <span>Grok-4 Fast</span>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentSessionData?.messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {msg.role === 'assistant' && (
                    <Bot className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    {msg.metadata && (
                      <div className="mt-2 text-xs opacity-70">
                        {msg.metadata.model} • {msg.metadata.tokens} токенов • {msg.metadata.confidence && `${Math.round(msg.metadata.confidence * 100)}% уверенность`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Напишите сообщение для AI..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!message.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Отправить</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILaboratory;
