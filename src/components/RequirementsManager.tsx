import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  History,
  CheckCircle
} from 'lucide-react';

interface Requirement {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'draft' | 'approved' | 'in-progress' | 'completed' | 'rejected';
  category: 'functional' | 'non-functional' | 'technical' | 'business';
  createdAt: string;
  updatedAt: string;
  author: string;
  version: number;
  dependencies: string[];
  acceptanceCriteria: string[];
}

interface RequirementsHistory {
  id: string;
  requirementId: string;
  action: 'created' | 'updated' | 'approved' | 'rejected' | 'completed';
  changes: string;
  author: string;
  timestamp: string;
}

const RequirementsManager: React.FC = () => {
  const { actions } = useApp();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'draft' | 'approved' | 'in-progress' | 'completed'>('all');

  // Загрузка требований из localStorage
  useEffect(() => {
    const savedRequirements = localStorage.getItem('requirements');
    if (savedRequirements) {
      setRequirements(JSON.parse(savedRequirements));
    } else {
      // Инициализация с базовыми требованиями для AI-Fitness Coach 360
      const initialRequirements: Requirement[] = [
        {
          id: 'req-001',
          title: 'Распознавание поз в реальном времени',
          description: 'Приложение должно распознавать позы пользователя в реальном времени с помощью камеры и предоставлять обратную связь по правильности выполнения упражнений.',
          priority: 'critical',
          status: 'approved',
          category: 'functional',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: 'Product Owner',
          version: 1,
          dependencies: [],
          acceptanceCriteria: [
            'Точность распознавания поз не менее 85%',
            'Задержка обработки не более 200мс',
            'Поддержка минимум 10 базовых упражнений',
            'Работа в условиях различного освещения'
          ]
        },
        {
          id: 'req-002',
          title: 'Персонализированные тренировки',
          description: 'Система должна создавать персонализированные тренировки на основе уровня подготовки пользователя, целей и предпочтений.',
          priority: 'high',
          status: 'approved',
          category: 'functional',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: 'Product Owner',
          version: 1,
          dependencies: ['req-001'],
          acceptanceCriteria: [
            'Алгоритм адаптации сложности',
            'Учет физических ограничений пользователя',
            'Прогрессивное увеличение нагрузки',
            'Возможность настройки целей'
          ]
        },
        {
          id: 'req-003',
          title: 'Производительность приложения',
          description: 'Приложение должно работать плавно на устройствах с минимальными техническими характеристиками.',
          priority: 'high',
          status: 'in-progress',
          category: 'non-functional',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: 'Tech Lead',
          version: 1,
          dependencies: [],
          acceptanceCriteria: [
            'FPS не менее 30 на устройствах с 3GB RAM',
            'Время запуска не более 3 секунд',
            'Потребление батареи не более 15% за час использования',
            'Размер приложения не более 100MB'
          ]
        }
      ];
      setRequirements(initialRequirements);
      localStorage.setItem('requirements', JSON.stringify(initialRequirements));
    }
  }, []);

  // Сохранение требований
  const saveRequirements = (newRequirements: Requirement[]) => {
    setRequirements(newRequirements);
    localStorage.setItem('requirements', JSON.stringify(newRequirements));
  };

  // Добавление нового требования
  const addRequirement = (requirement: Omit<Requirement, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
    const newRequirement: Requirement = {
      ...requirement,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };
    
    const updatedRequirements = [...requirements, newRequirement];
    saveRequirements(updatedRequirements);
    
    // Добавляем в историю
    addToHistory(newRequirement.id, 'created', 'Требование создано', newRequirement.author);
    
    // Генерируем задачи на основе нового требования
    generateTasksFromRequirement(newRequirement);
  };

  // Обновление требования
  const updateRequirement = (id: string, updates: Partial<Requirement>) => {
    const updatedRequirements = requirements.map(req => {
      if (req.id === id) {
        const updated = { ...req, ...updates, updatedAt: new Date().toISOString(), version: req.version + 1 };
        
        // Добавляем в историю
        addToHistory(id, 'updated', `Обновлено: ${Object.keys(updates).join(', ')}`, updated.author);
        
        // Генерируем новые задачи если изменились критические поля
        if (updates.description || updates.acceptanceCriteria) {
          generateTasksFromRequirement(updated);
        }
        
        return updated;
      }
      return req;
    });
    
    saveRequirements(updatedRequirements);
  };

  // Добавление в историю (упрощенная версия)
  const addToHistory = (requirementId: string, action: RequirementsHistory['action'], changes: string, author: string) => {
    // История пока не реализована полностью
    console.log('History entry:', { requirementId, action, changes, author });
  };

  // Генерация задач на основе требований
  const generateTasksFromRequirement = (requirement: Requirement) => {
    const tasks: any[] = [];
    
    // Создаем задачи для каждого критерия приемки
    requirement.acceptanceCriteria.forEach((criteria, index) => {
      const task = {
        id: `task-${Date.now()}-${index}`,
        title: `${requirement.title}: ${criteria}`,
        description: `Реализация критерия: ${criteria}\n\nТребование: ${requirement.description}`,
        status: 'todo' as const,
        priority: requirement.priority,
        category: requirement.category === 'functional' ? 'feature' : 
                 requirement.category === 'non-functional' ? 'performance' : 'technical',
        assignee: '',
        labels: [`requirement-${requirement.id}`, requirement.category],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        requirementId: requirement.id
      };
      
      tasks.push(task);
    });
    
    // Добавляем задачи в общий список
    tasks.forEach(task => {
      actions.addTask(task);
    });
  };

  // Фильтрация требований
  const filteredRequirements = requirements.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  // Получение цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Получение цвета приоритета
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            Управление требованиями
          </h1>
          <p className="text-gray-600 mt-1">Изначальная идея и требования к мобильному приложению</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => console.log('История пока не реализована')}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <History className="h-4 w-4 mr-2" />
            История
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить требование
          </button>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex space-x-2">
        {(['all', 'draft', 'approved', 'in-progress', 'completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'Все' :
             status === 'draft' ? 'Черновики' :
             status === 'approved' ? 'Утвержденные' :
             status === 'in-progress' ? 'В работе' : 'Завершенные'}
          </button>
        ))}
      </div>

      {/* Список требований */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequirements.map((requirement) => (
          <div key={requirement.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{requirement.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{requirement.description}</p>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(requirement.status)}`}>
                    {requirement.status === 'draft' ? 'Черновик' :
                     requirement.status === 'approved' ? 'Утверждено' :
                     requirement.status === 'in-progress' ? 'В работе' :
                     requirement.status === 'completed' ? 'Завершено' : 'Отклонено'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(requirement.priority)}`}>
                    {requirement.priority === 'critical' ? 'Критично' :
                     requirement.priority === 'high' ? 'Высокий' :
                     requirement.priority === 'medium' ? 'Средний' : 'Низкий'}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    v{requirement.version}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setEditingRequirement(requirement)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </div>

            {/* Критерии приемки */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Критерии приемки:</h4>
              <ul className="space-y-1">
                {requirement.acceptanceCriteria.map((criteria, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    {criteria}
                  </li>
                ))}
              </ul>
            </div>

            {/* Метаданные */}
            <div className="text-xs text-gray-500 border-t pt-3">
              <div className="flex justify-between">
                <span>Автор: {requirement.author}</span>
                <span>Обновлено: {new Date(requirement.updatedAt).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно редактирования */}
      {editingRequirement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Редактирование требования</h2>
              <button
                onClick={() => setEditingRequirement(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              updateRequirement(editingRequirement.id, {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                priority: formData.get('priority') as Requirement['priority'],
                status: formData.get('status') as Requirement['status'],
                category: formData.get('category') as Requirement['category'],
                acceptanceCriteria: (formData.get('acceptanceCriteria') as string).split('\n').filter(c => c.trim())
              });
              setEditingRequirement(null);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                  <input
                    name="title"
                    defaultValue={editingRequirement.title}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                  <textarea
                    name="description"
                    defaultValue={editingRequirement.description}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Приоритет</label>
                    <select
                      name="priority"
                      defaultValue={editingRequirement.priority}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="critical">Критично</option>
                      <option value="high">Высокий</option>
                      <option value="medium">Средний</option>
                      <option value="low">Низкий</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                    <select
                      name="status"
                      defaultValue={editingRequirement.status}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="draft">Черновик</option>
                      <option value="approved">Утверждено</option>
                      <option value="in-progress">В работе</option>
                      <option value="completed">Завершено</option>
                      <option value="rejected">Отклонено</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                  <select
                    name="category"
                    defaultValue={editingRequirement.category}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="functional">Функциональные</option>
                    <option value="non-functional">Нефункциональные</option>
                    <option value="technical">Технические</option>
                    <option value="business">Бизнес</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Критерии приемки (по одному на строку)</label>
                  <textarea
                    name="acceptanceCriteria"
                    defaultValue={editingRequirement.acceptanceCriteria.join('\n')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Критерий 1&#10;Критерий 2&#10;Критерий 3"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingRequirement(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно добавления */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Добавить требование</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addRequirement({
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                priority: formData.get('priority') as Requirement['priority'],
                status: 'draft',
                category: formData.get('category') as Requirement['category'],
                author: 'Current User',
                dependencies: [],
                acceptanceCriteria: (formData.get('acceptanceCriteria') as string).split('\n').filter(c => c.trim())
              });
              setShowAddForm(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                  <input
                    name="title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                  <textarea
                    name="description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Приоритет</label>
                    <select
                      name="priority"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="critical">Критично</option>
                      <option value="high">Высокий</option>
                      <option value="medium">Средний</option>
                      <option value="low">Низкий</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                    <select
                      name="category"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="functional">Функциональные</option>
                      <option value="non-functional">Нефункциональные</option>
                      <option value="technical">Технические</option>
                      <option value="business">Бизнес</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Критерии приемки (по одному на строку)</label>
                  <textarea
                    name="acceptanceCriteria"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Критерий 1&#10;Критерий 2&#10;Критерий 3"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequirementsManager;
