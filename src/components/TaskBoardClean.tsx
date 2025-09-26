import React, { useState, useEffect } from 'react';
import { useTask } from '../presentation/hooks/useTask';
import { CreateTaskDto } from '../application/dto/CreateTaskDto';
import { UpdateTaskDto } from '../application/dto/UpdateTaskDto';
import { TaskResponseDto } from '../application/dto/TaskResponseDto';
import { TaskStatusValue } from '../domain/value-objects/TaskStatus';
import { TaskPriorityValue } from '../domain/value-objects/TaskPriority';
import { CreateTaskUseCase } from '../application/use-cases/task/CreateTaskUseCase';
import { TaskRepository } from '../domain/repositories/TaskRepository';
import { 
  Plus, 
  Filter, 
  Search, 
  MoreVertical,
  Calendar,
  User,
  Tag,
  Clock,
  Github,
  Edit,
  Trash2,
  CheckCircle,
  Play,
  Eye,
  AlertCircle
} from 'lucide-react';

// Компонент задачи с новой архитектурой
const TaskCard: React.FC<{
  task: TaskResponseDto;
  onEdit: (task: TaskResponseDto) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: string) => void;
}> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-gray-300 bg-gray-50';
      default: return 'border-l-gray-300 bg-gray-50';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'security': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'performance': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'accessibility': return <Eye className="h-4 w-4 text-green-500" />;
      case 'testing': return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default: return <Tag className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case 'security': return 'Безопасность';
      case 'performance': return 'Производительность';
      case 'accessibility': return 'Доступность';
      case 'testing': return 'Тестирование';
      case 'documentation': return 'Документация';
      default: return 'Другое';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <AlertCircle className="h-4 w-4 text-gray-500" />;
      case 'in-progress': return <Play className="h-4 w-4 text-blue-500" />;
      case 'review': return <Eye className="h-4 w-4 text-yellow-500" />;
      case 'done': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className={`border-l-4 ${getPriorityColor(task.priority)} bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            {getStatusIcon(task.status)}
            <h3 className="font-semibold text-gray-900 text-sm">{task.title}</h3>
          </div>
          <p className="text-gray-600 text-xs line-clamp-2">{task.description}</p>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            title="Редактировать"
          >
            <Edit className="h-3 w-3" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-600 rounded"
            title="Удалить"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getCategoryIcon(task.category)}
          <span className="text-xs text-gray-600">{getCategoryLabel(task.category)}</span>
        </div>
        <div className="flex items-center space-x-2">
          {task.estimatedHours && task.estimatedHours > 0 && (
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{task.estimatedHours}ч</span>
            </div>
          )}
          {task.assignee && (
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{task.assignee}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {task.labels.map((label: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {label}
            </span>
          ))}
        </div>
        {task.githubUrl && (
          <a
            href={task.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
            title="Открыть в GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
        )}
      </div>

      {task.dueDate && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              До: {new Date(task.dueDate).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>
      )}

      {task.progress !== undefined && task.progress > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Прогресс</span>
            <span className="text-xs text-gray-500">{task.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент колонки
const TaskColumn: React.FC<{
  title: string;
  status: string;
  tasks: TaskResponseDto[];
  onEdit: (task: TaskResponseDto) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: string) => void;
  onAddTask: (status: string) => void;
}> = ({ title, status, tasks, onEdit, onDelete, onStatusChange, onAddTask }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <AlertCircle className="h-4 w-4" />;
      case 'in-progress': return <Play className="h-4 w-4" />;
      case 'review': return <Eye className="h-4 w-4" />;
      case 'done': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'text-gray-600';
      case 'in-progress': return 'text-blue-600';
      case 'review': return 'text-yellow-600';
      case 'done': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 min-h-[600px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={getStatusColor(status)}>
            {getStatusIcon(status)}
          </div>
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(status)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
          title="Добавить задачу"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Нет задач</p>
            <button
              onClick={() => onAddTask(status)}
              className="text-blue-600 hover:text-blue-800 text-sm mt-2"
            >
              Добавить задачу
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Модальное окно для создания/редактирования задачи
const TaskModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: CreateTaskDto | UpdateTaskDto) => void;
  task?: TaskResponseDto;
}> = ({ isOpen, onClose, onSave, task }) => {
  const [formData, setFormData] = useState<UpdateTaskDto>({
    title: task?.title || '',
    description: task?.description || '',
    status: (task?.status as 'todo' | 'in-progress' | 'review' | 'done' | 'cancelled') || 'todo',
    priority: (task?.priority as 'low' | 'medium' | 'high' | 'urgent') || 'medium',
    category: task?.category || 'other',
    labels: task?.labels || [],
    assignee: task?.assignee || '',
    estimatedHours: task?.estimatedHours || 0,
    dueDate: task?.dueDate || ''
  });

  const [newLabel, setNewLabel] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status as 'todo' | 'in-progress' | 'review' | 'done' | 'cancelled',
        priority: task.priority as 'low' | 'medium' | 'high' | 'urgent',
        category: task.category || 'other',
        labels: task.labels,
        assignee: task.assignee || '',
        estimatedHours: task.estimatedHours || 0,
        dueDate: task.dueDate || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        category: 'other',
        labels: [],
        assignee: '',
        estimatedHours: 0,
        dueDate: ''
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addLabel = () => {
    if (newLabel.trim() && !(formData.labels || []).includes(newLabel.trim())) {
      setFormData({ 
        ...formData, 
        labels: [...(formData.labels || []), newLabel.trim()] 
      });
      setNewLabel('');
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setFormData({
      ...formData,
      labels: (formData.labels || []).filter((label: string) => label !== labelToRemove),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {task ? 'Редактировать задачу' : 'Создать задачу'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Заголовок
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статус
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'todo' | 'in-progress' | 'review' | 'done' | 'cancelled' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todo">К выполнению</option>
                  <option value="in-progress">В работе</option>
                  <option value="review">На проверке</option>
                  <option value="done">Выполнено</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Приоритет
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                  <option value="urgent">Срочный</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="security">Безопасность</option>
                  <option value="performance">Производительность</option>
                  <option value="accessibility">Доступность</option>
                  <option value="testing">Тестирование</option>
                  <option value="documentation">Документация</option>
                  <option value="other">Другое</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Исполнитель
                </label>
                <input
                  type="text"
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Оценка времени (часы)
                </label>
                <input
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Срок выполнения
                </label>
                <input
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Метки
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(formData.labels || []).map((label: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center space-x-1"
                  >
                    <span>{label}</span>
                    <button
                      type="button"
                      onClick={() => removeLabel(label)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Добавить метку"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addLabel}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Добавить
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {task ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Mock TaskRepository для демонстрации
class MockTaskRepository implements TaskRepository {
  async save(task: any): Promise<void> {
    // Mock implementation
  }

  async findById(id: any): Promise<any> {
    return null;
  }

  async findAll(): Promise<any[]> {
    return [];
  }

  async findByStatus(status: string): Promise<any[]> {
    return [];
  }

  async findByPriority(priority: string): Promise<any[]> {
    return [];
  }

  async findByCategory(category: string): Promise<any[]> {
    return [];
  }

  async findByAssignee(assignee: string): Promise<any[]> {
    return [];
  }

  async findOverdue(): Promise<any[]> {
    return [];
  }

  async findDueSoon(): Promise<any[]> {
    return [];
  }

  async search(query: string): Promise<any[]> {
    return [];
  }

  async delete(id: any): Promise<void> {
    // Mock implementation
  }

  async exists(id: any): Promise<boolean> {
    return false;
  }

  async countByStatus(status: string): Promise<number> {
    return 0;
  }

  async getStats(): Promise<any> {
    return {
      total: 0,
      byStatus: {},
      byPriority: {},
      byCategory: {},
      overdue: 0,
      dueSoon: 0
    };
  }
}

// Главный компонент доски задач с Clean Architecture
const TaskBoardClean: React.FC = () => {
  const mockRepository = new MockTaskRepository();
  const createTaskUseCase = new CreateTaskUseCase(mockRepository);
  const { tasks, loading, error, createTask, refreshTasks, clearError } = useTask(createTaskUseCase);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskResponseDto | null>(null);
  const [filter, setFilter] = useState({
    search: '',
    category: '',
    priority: '',
    assignee: '',
  });

  // Фильтрация задач
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = !filter.search || 
      task.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      task.description.toLowerCase().includes(filter.search.toLowerCase());
    
    const matchesCategory = !filter.category || task.category === filter.category;
    const matchesPriority = !filter.priority || task.priority === filter.priority;
    const matchesAssignee = !filter.assignee || task.assignee === filter.assignee;

    return matchesSearch && matchesCategory && matchesPriority && matchesAssignee;
  });

  // Группировка задач по статусам
  const tasksByStatus = {
    todo: filteredTasks.filter(task => task.status === TaskStatusValue.TODO),
    'in-progress': filteredTasks.filter(task => task.status === TaskStatusValue.IN_PROGRESS),
    review: filteredTasks.filter(task => task.status === TaskStatusValue.REVIEW),
    done: filteredTasks.filter(task => task.status === TaskStatusValue.DONE),
  };

  const handleAddTask = (status: string) => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: TaskResponseDto) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: CreateTaskDto | UpdateTaskDto) => {
    try {
      if (editingTask) {
        // Редактирование существующей задачи
        // TODO: Implement updateTask
        console.log('Update task:', editingTask.id, taskData);
      } else {
        // Создание новой задачи
        await createTask(taskData as CreateTaskDto);
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        // TODO: Implement deleteTask
        console.log('Delete task:', taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      // TODO: Implement updateTask
      console.log('Update task status:', taskId, newStatus);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Загрузка задач...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">Ошибка загрузки задач: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Заголовок и фильтры */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Доска задач (Clean Architecture)</h1>
          <button
            onClick={() => handleAddTask(TaskStatusValue.TODO)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Новая задача</span>
          </button>
        </div>

        {/* Фильтры */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Поиск
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  placeholder="Поиск задач..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Категория
              </label>
              <select
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Все категории</option>
                <option value="security">Безопасность</option>
                <option value="performance">Производительность</option>
                <option value="accessibility">Доступность</option>
                <option value="testing">Тестирование</option>
                <option value="documentation">Документация</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Приоритет
              </label>
              <select
                value={filter.priority}
                onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Все приоритеты</option>
                <option value={TaskPriorityValue.LOW}>Низкий</option>
                <option value={TaskPriorityValue.MEDIUM}>Средний</option>
                <option value={TaskPriorityValue.HIGH}>Высокий</option>
                <option value={TaskPriorityValue.URGENT}>Срочный</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Исполнитель
              </label>
              <input
                type="text"
                value={filter.assignee}
                onChange={(e) => setFilter({ ...filter, assignee: e.target.value })}
                placeholder="Имя исполнителя"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Доска задач */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TaskColumn
          title="К выполнению"
          status={TaskStatusValue.TODO}
          tasks={tasksByStatus.todo}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onAddTask={handleAddTask}
        />
        <TaskColumn
          title="В работе"
          status={TaskStatusValue.IN_PROGRESS}
          tasks={tasksByStatus['in-progress']}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onAddTask={handleAddTask}
        />
        <TaskColumn
          title="На проверке"
          status={TaskStatusValue.REVIEW}
          tasks={tasksByStatus.review}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onAddTask={handleAddTask}
        />
        <TaskColumn
          title="Выполнено"
          status={TaskStatusValue.DONE}
          tasks={tasksByStatus.done}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onAddTask={handleAddTask}
        />
      </div>

      {/* Модальное окно */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask || undefined}
      />
    </div>
  );
};

export default TaskBoardClean;
