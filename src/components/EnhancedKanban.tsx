import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Filter, 
  Search, 
  User,
  MoreHorizontal,
  Edit3,
  Clock,
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3,
  Settings
} from 'lucide-react';

interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  color: string;
  tasks: any[];
  limit?: number;
}

interface KanbanBoard {
  id: string;
  name: string;
  description: string;
  columns: KanbanColumn[];
  filters: {
    assignee?: string;
    priority?: string;
    category?: string;
    dueDate?: string;
  };
  settings: {
    showTaskCount: boolean;
    showAssignee: boolean;
    showDueDate: boolean;
    showPriority: boolean;
    autoArchive: boolean;
  };
}

const EnhancedKanban: React.FC = () => {
  const { state, actions } = useApp();
  const [boards, setBoards] = useState<KanbanBoard[]>([]);
  const [activeBoard, setActiveBoard] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [showAddBoard, setShowAddBoard] = useState(false);

  // Инициализация досок
  useEffect(() => {
    const savedBoards = localStorage.getItem('kanban-boards');
    if (savedBoards) {
      const parsedBoards = JSON.parse(savedBoards);
      setBoards(parsedBoards);
      if (parsedBoards.length > 0) {
        setActiveBoard(parsedBoards[0].id);
      }
    } else {
      // Создаем стандартную доску
      const defaultBoard: KanbanBoard = {
        id: 'default-board',
        name: 'Основная доска',
        description: 'Основная канбан доска для управления задачами',
        columns: [
          {
            id: 'todo',
            title: 'К выполнению',
            status: 'todo',
            color: 'bg-gray-100',
            tasks: []
          },
          {
            id: 'in-progress',
            title: 'В работе',
            status: 'in-progress',
            color: 'bg-blue-100',
            tasks: []
          },
          {
            id: 'review',
            title: 'На проверке',
            status: 'review',
            color: 'bg-yellow-100',
            tasks: []
          },
          {
            id: 'done',
            title: 'Выполнено',
            status: 'done',
            color: 'bg-green-100',
            tasks: []
          }
        ],
        filters: {},
        settings: {
          showTaskCount: true,
          showAssignee: true,
          showDueDate: true,
          showPriority: true,
          autoArchive: false
        }
      };
      
      setBoards([defaultBoard]);
      setActiveBoard(defaultBoard.id);
      localStorage.setItem('kanban-boards', JSON.stringify([defaultBoard]));
    }
  }, []);

  // Обновление задач в досках
  useEffect(() => {
    if (boards.length > 0 && activeBoard) {
      const updatedBoards = boards.map(board => {
        if (board.id === activeBoard) {
          const updatedColumns = board.columns.map(column => ({
            ...column,
            tasks: state.tasks.filter(task => task.status === column.status)
          }));
          return { ...board, columns: updatedColumns };
        }
        return board;
      });
      setBoards(updatedBoards);
    }
  }, [state.tasks, activeBoard, boards]);

  // Сохранение досок
  const saveBoards = (newBoards: KanbanBoard[]) => {
    setBoards(newBoards);
    localStorage.setItem('kanban-boards', JSON.stringify(newBoards));
  };

  // Создание новой доски
  const createBoard = (name: string, description: string) => {
    const newBoard: KanbanBoard = {
      id: `board-${Date.now()}`,
      name,
      description,
      columns: [
        {
          id: 'todo',
          title: 'К выполнению',
          status: 'todo',
          color: 'bg-gray-100',
          tasks: []
        },
        {
          id: 'in-progress',
          title: 'В работе',
          status: 'in-progress',
          color: 'bg-blue-100',
          tasks: []
        },
        {
          id: 'review',
          title: 'На проверке',
          status: 'review',
          color: 'bg-yellow-100',
          tasks: []
        },
        {
          id: 'done',
          title: 'Выполнено',
          status: 'done',
          color: 'bg-green-100',
          tasks: []
        }
      ],
      filters: {},
      settings: {
        showTaskCount: true,
        showAssignee: true,
        showDueDate: true,
        showPriority: true,
        autoArchive: false
      }
    };
    
    const updatedBoards = [...boards, newBoard];
    saveBoards(updatedBoards);
    setActiveBoard(newBoard.id);
  };

  // Перемещение задачи
  const moveTask = (taskId: string, newStatus: string) => {
    actions.updateTask(taskId, { status: newStatus as 'todo' | 'in-progress' | 'review' | 'done' });
  };

  // Фильтрация задач
  const getFilteredTasks = (tasks: any[]) => {
    const currentBoard = boards.find(b => b.id === activeBoard);
    if (!currentBoard) return tasks;

    let filtered = tasks;

    // Поиск
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтры
    if (currentBoard.filters.assignee) {
      filtered = filtered.filter(task => task.assignee === currentBoard.filters.assignee);
    }
    if (currentBoard.filters.priority) {
      filtered = filtered.filter(task => task.priority === currentBoard.filters.priority);
    }
    if (currentBoard.filters.category) {
      filtered = filtered.filter(task => task.category === currentBoard.filters.category);
    }

    return filtered;
  };

  // Получение цвета приоритета
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Получение цвета статуса (удалено, так как не используется)

  // Проверка просроченности
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const currentBoard = boards.find(b => b.id === activeBoard);

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
            Канбан доски
          </h1>
          <p className="text-gray-600 mt-1">Управление задачами с помощью канбан досок</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddBoard(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Новая доска
          </button>
          <button
            onClick={() => console.log('Настройки пока не реализованы')}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Settings className="h-4 w-4 mr-2" />
            Настройки
          </button>
        </div>
      </div>

      {/* Переключение досок */}
      {boards.length > 1 && (
        <div className="flex space-x-2">
          {boards.map((board) => (
            <button
              key={board.id}
              onClick={() => setActiveBoard(board.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeBoard === board.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {board.name}
            </button>
          ))}
        </div>
      )}

      {/* Фильтры и поиск */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск задач..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <Filter className="h-4 w-4 mr-2" />
          Фильтры
        </button>
      </div>

      {/* Расширенные фильтры */}
      {showFilters && currentBoard && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Исполнитель</label>
              <select
                value={currentBoard.filters.assignee || ''}
                onChange={(e) => {
                  const updatedBoards = boards.map(b => 
                    b.id === activeBoard 
                      ? { ...b, filters: { ...b.filters, assignee: e.target.value || undefined } }
                      : b
                  );
                  saveBoards(updatedBoards);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Все исполнители</option>
                <option value="user1">Пользователь 1</option>
                <option value="user2">Пользователь 2</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Приоритет</label>
              <select
                value={currentBoard.filters.priority || ''}
                onChange={(e) => {
                  const updatedBoards = boards.map(b => 
                    b.id === activeBoard 
                      ? { ...b, filters: { ...b.filters, priority: e.target.value || undefined } }
                      : b
                  );
                  saveBoards(updatedBoards);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Все приоритеты</option>
                <option value="critical">Критично</option>
                <option value="high">Высокий</option>
                <option value="medium">Средний</option>
                <option value="low">Низкий</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
              <select
                value={currentBoard.filters.category || ''}
                onChange={(e) => {
                  const updatedBoards = boards.map(b => 
                    b.id === activeBoard 
                      ? { ...b, filters: { ...b.filters, category: e.target.value || undefined } }
                      : b
                  );
                  saveBoards(updatedBoards);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Все категории</option>
                <option value="feature">Функции</option>
                <option value="bug">Ошибки</option>
                <option value="performance">Производительность</option>
                <option value="security">Безопасность</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Срок</label>
              <select
                value={currentBoard.filters.dueDate || ''}
                onChange={(e) => {
                  const updatedBoards = boards.map(b => 
                    b.id === activeBoard 
                      ? { ...b, filters: { ...b.filters, dueDate: e.target.value || undefined } }
                      : b
                  );
                  saveBoards(updatedBoards);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Все сроки</option>
                <option value="overdue">Просроченные</option>
                <option value="today">Сегодня</option>
                <option value="week">Эта неделя</option>
                <option value="month">Этот месяц</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Канбан доска */}
      {currentBoard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentBoard.columns.map((column) => {
            const filteredTasks = getFilteredTasks(column.tasks);
            
            return (
              <div key={column.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Заголовок колонки */}
                <div className={`p-4 rounded-t-lg ${column.color}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{column.title}</h3>
                    <div className="flex items-center space-x-2">
                      {currentBoard.settings.showTaskCount && (
                        <span className="bg-white bg-opacity-50 px-2 py-1 rounded-full text-sm font-medium">
                          {filteredTasks.length}
                        </span>
                      )}
                      {column.limit && (
                        <span className="text-xs text-gray-600">
                          {filteredTasks.length}/{column.limit}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Задачи */}
                <div className="p-4 space-y-3 min-h-[400px]">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Нет задач</p>
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-move"
                        draggable
                        onDragStart={(e) => {
                          setDraggedTask(task);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedTask && draggedTask.id !== task.id) {
                            moveTask(draggedTask.id, column.status);
                          }
                          setDraggedTask(null);
                        }}
                      >
                        {/* Заголовок задачи */}
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                            {task.title}
                          </h4>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Описание */}
                        {task.description && (
                          <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Метаданные */}
                        <div className="space-y-2">
                          {/* Приоритет */}
                          {currentBoard.settings.showPriority && (
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
                                {task.priority === 'critical' ? 'Критично' :
                                 task.priority === 'high' ? 'Высокий' :
                                 task.priority === 'medium' ? 'Средний' : 'Низкий'}
                              </span>
                            </div>
                          )}

                          {/* Исполнитель */}
                          {currentBoard.settings.showAssignee && task.assignee && (
                            <div className="flex items-center space-x-2">
                              <User className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{task.assignee}</span>
                            </div>
                          )}

                          {/* Срок */}
                          {currentBoard.settings.showDueDate && task.dueDate && (
                            <div className="flex items-center space-x-2">
                              <Clock className={`h-3 w-3 ${isOverdue(task.dueDate) ? 'text-red-500' : 'text-gray-400'}`} />
                              <span className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-600'}`}>
                                {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                                {isOverdue(task.dueDate) && (
                                  <AlertTriangle className="h-3 w-3 inline ml-1 text-red-500" />
                                )}
                              </span>
                            </div>
                          )}

                          {/* Теги */}
                          {task.labels && task.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {task.labels.slice(0, 3).map((label: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                >
                                  {label}
                                </span>
                              ))}
                              {task.labels.length > 3 && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                  +{task.labels.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Действия */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => actions.updateTask(task.id, { status: 'done' })}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Завершить"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {/* Открыть модальное окно редактирования */}}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Редактировать"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          {task.githubUrl && (
                            <a
                              href={task.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              GitHub →
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Добавить задачу */}
                <div className="p-4 border-t border-gray-100">
                  <button
                    onClick={() => {/* Открыть модальное окно создания задачи */}}
                    className="w-full flex items-center justify-center space-x-2 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">Добавить задачу</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Модальное окно создания доски */}
      {showAddBoard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Создать новую доску</h2>
              <button
                onClick={() => setShowAddBoard(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              createBoard(
                formData.get('name') as string,
                formData.get('description') as string
              );
              setShowAddBoard(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                  <input
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddBoard(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedKanban;
