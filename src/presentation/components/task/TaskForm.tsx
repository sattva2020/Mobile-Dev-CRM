import React, { useState } from 'react';
import { CreateTaskDto } from '../../../application/dto/CreateTaskDto';
import { CreateTaskDtoValidator } from '../../../application/dto/CreateTaskDto';

/**
 * TaskForm - Компонент для создания задачи
 * Следует принципам Clean Architecture
 * Презентационный слой
 */
interface TaskFormProps {
  onSubmit: (dto: CreateTaskDto) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  loading = false,
  error = null
}) => {
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    assignee: '',
    labels: [],
    estimatedHours: 0
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleInputChange = (field: keyof CreateTaskDto, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Очищаем ошибки валидации при изменении
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    const errors = CreateTaskDtoValidator.validate(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await onSubmit(formData);
      // Сброс формы после успешного создания
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        assignee: '',
        labels: [],
        estimatedHours: 0
      });
      setValidationErrors([]);
    } catch (error) {
      // Ошибка обрабатывается в родительском компоненте
    }
  };

  const addLabel = () => {
    const newLabel = prompt('Введите метку:');
    if (newLabel && newLabel.trim()) {
      handleInputChange('labels', [...(formData.labels || []), newLabel.trim()]);
    }
  };

  const removeLabel = (index: number) => {
    const newLabels = (formData.labels || []).filter((_, i) => i !== index);
    handleInputChange('labels', newLabels);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <ul className="list-disc list-inside">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Название задачи *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Введите название задачи"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Описание *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Введите описание задачи"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Приоритет *
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value as any)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
            <option value="urgent">Срочный</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Категория *
          </label>
          <input
            type="text"
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите категорию"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">
          Исполнитель *
        </label>
        <input
          type="text"
          id="assignee"
          value={formData.assignee}
          onChange={(e) => handleInputChange('assignee', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Введите исполнителя"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Метки
        </label>
        <div className="mt-1 flex flex-wrap gap-2">
          {(formData.labels || []).map((label, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {label}
              <button
                type="button"
                onClick={() => removeLabel(index)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={addLabel}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            + Добавить метку
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Срок выполнения
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            value={formData.dueDate || ''}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">
            Оценка времени (часы)
          </label>
          <input
            type="number"
            id="estimatedHours"
            value={formData.estimatedHours}
            onChange={(e) => handleInputChange('estimatedHours', parseInt(e.target.value) || 0)}
            min="0"
            max="1000"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setFormData({
            title: '',
            description: '',
            priority: 'medium',
            category: '',
            assignee: '',
            labels: [],
            estimatedHours: 0
          })}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Очистить
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Создание...' : 'Создать задачу'}
        </button>
      </div>
    </form>
  );
};
