import React, { useState } from 'react';
import { 
  FolderPlus, 
  Users, 
  BarChart3, 
  Archive, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock,
  Database,
  Github,
  Figma
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProjectManager: React.FC = () => {
  const { state, actions } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });
  const [editProject, setEditProject] = useState({
    name: '',
    description: ''
  });

  // Create new project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject.name.trim()) {
      actions.createProject(newProject.name, newProject.description);
      setNewProject({ name: '', description: '' });
      setShowCreateForm(false);
    }
  };

  // Edit project
  const handleEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject && editProject.name.trim()) {
      actions.updateProject(editingProject, {
        name: editProject.name,
        description: editProject.description
      });
      setEditingProject(null);
      setEditProject({ name: '', description: '' });
      setShowEditForm(false);
    }
  };

  // Start editing
  const startEditing = (projectId: string) => {
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
      setEditingProject(projectId);
      setEditProject({
        name: project.name,
        description: project.description
      });
      setShowEditForm(true);
    }
  };

  // Archive project
  const archiveProject = (projectId: string) => {
    actions.updateProject(projectId, { status: 'archived' });
  };

  // Delete project
  const deleteProject = (projectId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      actions.updateProject(projectId, { status: 'deleted' });
    }
  };

  // Switch to project
  const switchToProject = (projectId: string) => {
    actions.switchProject(projectId);
  };

  // Get project statistics
  const getProjectStats = (project: any) => {
    return {
      tasks: Math.floor(Math.random() * 50) + 10,
      completed: Math.floor(Math.random() * 30) + 5,
      members: project.members.length,
      lastActivity: new Date(project.lastAccessed).toLocaleDateString()
    };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление проектами</h1>
          <p className="text-gray-600">Создавайте и управляйте проектами</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FolderPlus className="h-4 w-4 mr-2" />
          Создать проект
        </button>
      </div>

      {/* Current Project Info */}
      {state.currentProject && (
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Текущий проект</h3>
              <p className="text-blue-700">{state.currentProject.name}</p>
              <p className="text-sm text-blue-600">{state.currentProject.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm text-blue-600">Активен</span>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.projects
          .filter(project => project.status === 'active')
          .map(project => {
            const stats = getProjectStats(project);
            const isCurrent = state.currentProject?.id === project.id;
            
            return (
              <div
                key={project.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow ${
                  isCurrent ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => switchToProject(project.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(project.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        archiveProject(project.id);
                      }}
                      className="p-1 text-gray-400 hover:text-orange-600"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.tasks}</div>
                    <div className="text-xs text-gray-600">Задач</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    <div className="text-xs text-gray-600">Завершено</div>
                  </div>
                </div>

                {/* Integrations */}
                <div className="flex items-center space-x-2 mb-4">
                  {project.settings.integrations.github && (
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Github className="h-4 w-4" />
                      <span className="text-xs">GitHub</span>
                    </div>
                  )}
                  {project.settings.integrations.figma && (
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Figma className="h-4 w-4" />
                      <span className="text-xs">Figma</span>
                    </div>
                  )}
                  {project.settings.integrations.supabase && (
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Database className="h-4 w-4" />
                      <span className="text-xs">Supabase</span>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{stats.members}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{stats.lastActivity}</span>
                  </div>
                </div>

                {isCurrent && (
                  <div className="mt-3 flex items-center space-x-1 text-blue-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Текущий проект</span>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Archived Projects */}
      {state.projects.filter(p => p.status === 'archived').length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Архивные проекты</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.projects
              .filter(project => project.status === 'archived')
              .map(project => (
                <div
                  key={project.id}
                  className="bg-gray-50 rounded-lg border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Archive className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-orange-600">Архив</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Создан: {new Date(project.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => actions.updateProject(project.id, { status: 'active' })}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Восстановить
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Создать проект</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название проекта
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Название проекта"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Описание проекта"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Редактировать проект</h3>
            <form onSubmit={handleEditProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название проекта
                </label>
                <input
                  type="text"
                  value={editProject.name}
                  onChange={(e) => setEditProject(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  value={editProject.description}
                  onChange={(e) => setEditProject(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
