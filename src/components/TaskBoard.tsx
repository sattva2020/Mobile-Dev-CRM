import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Notification } from '../context/AppContext';
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

// Компонент задачи
const TaskCard: React.FC<{
  task: any;
  onEdit: (task: any) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: string) => void;
}> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-gray-300 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'performance': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'accessibility': return <Eye className="h-4 w-4 text-green-500" />;
      case 'testing': return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default: return <Tag className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'security': return 'Безопасность';
      case 'performance': return 'Производительность';
      case 'accessibility': return 'Доступность';
      case 'testing': return 'Тестирование';
      case 'documentation': return 'Документация';
      default: return 'Другое';
    }
  };

  return (
    <div className={`border-l-4 ${getPriorityColor(task.priority)} bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{task.title}</h3>
          <p className="text-gray-600 text-xs line-clamp-2">{task.description}</p>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <Edit className="h-3 w-3" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-600 rounded"
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
          {task.estimatedTime && (
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{task.estimatedTime}ч</span>
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
    </div>
  );
};

// Компонент колонки
const TaskColumn: React.FC<{
  title: string;
  status: string;
  tasks: any[];
  onEdit: (task: any) => void;
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
  onSave: (task: any) => void;
  task?: any;
}> = ({ isOpen, onClose, onSave, task }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    category: task?.category || 'other',
    labels: task?.labels || [],
    assignee: task?.assignee || '',
    estimatedTime: task?.estimatedTime || '',
    dueDate: task?.dueDate || '',
  });

  const [newLabel, setNewLabel] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = {
      ...formData,
      estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : undefined,
      dueDate: formData.dueDate || undefined,
      labels: formData.labels.filter((label: string) => label.trim() !== ''),
    };
    onSave(taskData);
  };

  const addLabel = () => {
    if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
      setFormData({ ...formData, labels: [...formData.labels, newLabel.trim()] });
      setNewLabel('');
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setFormData({
      ...formData,
      labels: formData.labels.filter((label: string) => label !== labelToRemove),
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
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статус
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                  <option value="critical">Критический</option>
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
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Срок выполнения
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
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
                {formData.labels.map((label: string, index: number) => (
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

// Главный компонент доски задач
const TaskBoard: React.FC = () => {
  const { state, actions } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [filter, setFilter] = useState({
    search: '',
    category: '',
    priority: '',
    assignee: '',
  });

  // Фильтрация задач
  const filteredTasks = state.tasks.filter((task) => {
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
    todo: filteredTasks.filter(task => task.status === 'todo'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    review: filteredTasks.filter(task => task.status === 'review'),
    done: filteredTasks.filter(task => task.status === 'done'),
  };

  const handleAddTask = (status: string) => {
    setEditingTask({ status });
    setIsModalOpen(true);
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: any) => {
    if (editingTask && editingTask.id) {
      // Редактирование существующей задачи
      actions.updateTask(editingTask.id, taskData);
    } else {
      // Создание новой задачи
      actions.addTask(taskData);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      actions.deleteTask(taskId);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    actions.updateTask(taskId, { status: newStatus as 'todo' | 'in-progress' | 'review' | 'done' });
  };

  return (
    <div className="p-6">
      {/* Заголовок и фильтры */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Доска задач</h1>
          <button
            onClick={() => handleAddTask('todo')}
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
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
                <option value="critical">Критический</option>
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
          status="todo"
          tasks={tasksByStatus.todo}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onAddTask={handleAddTask}
        />
        <TaskColumn
          title="В работе"
          status="in-progress"
          tasks={tasksByStatus['in-progress']}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onAddTask={handleAddTask}
        />
        <TaskColumn
          title="На проверке"
          status="review"
          tasks={tasksByStatus.review}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onAddTask={handleAddTask}
        />
        <TaskColumn
          title="Выполнено"
          status="done"
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
        task={editingTask}
      />
    </div>
  );
};

export default TaskBoard;