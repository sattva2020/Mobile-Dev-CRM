import React, { useState, useEffect } from 'react';
import { 
  Figma, 
  Download, 
  Upload, 
  RefreshCw, 
  Settings, 
  Eye, 
  Code, 
  Image, 
  FileText, 
  Palette,
  Layers,
  Smartphone,
  Monitor,
  Tablet,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap
} from 'lucide-react';

interface FigmaFile {
  id: string;
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  pages: FigmaPage[];
}

interface FigmaPage {
  id: string;
  name: string;
  frames: FigmaFrame[];
}

interface FigmaFrame {
  id: string;
  name: string;
  type: 'screen' | 'component' | 'flow';
  device: 'mobile' | 'tablet' | 'desktop';
  thumbnailUrl: string;
  components: FigmaComponent[];
}

interface FigmaComponent {
  id: string;
  name: string;
  type: 'button' | 'input' | 'card' | 'navigation' | 'modal' | 'other';
  properties: {
    width: number;
    height: number;
    x: number;
    y: number;
    fill: string;
    stroke: string;
    borderRadius: number;
  };
  code?: string;
}

interface FigmaProject {
  id: string;
  name: string;
  description: string;
  files: FigmaFile[];
  lastSync: string;
  status: 'connected' | 'disconnected' | 'syncing';
}

const FigmaIntegration: React.FC = () => {
  const [projects, setProjects] = useState<FigmaProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedFrame, setSelectedFrame] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    token: '',
    teamId: '',
    autoSync: true,
    syncInterval: 300000, // 5 minutes
    exportFormats: ['png', 'svg', 'code']
  });

  // Load data from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('figma-projects');
    const savedSettings = localStorage.getItem('figma-settings');
    
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('figma-projects', JSON.stringify(projects));
    }
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('figma-settings', JSON.stringify(settings));
  }, [settings]);

  // Generate sample data
  const generateSampleData = () => {
    const sampleProjects: FigmaProject[] = [
      {
        id: 'project-1',
        name: 'AI-Fitness Coach 360',
        description: 'Main design system and screens',
        files: [
          {
            id: 'file-1',
            name: 'Design System',
            lastModified: '2024-01-15T10:30:00Z',
            thumbnailUrl: '/api/placeholder/300/200',
            version: 'v2.1.0',
            pages: [
              {
                id: 'page-1',
                name: 'Components',
                frames: [
                  {
                    id: 'frame-1',
                    name: 'Button Primary',
                    type: 'component',
                    device: 'mobile',
                    thumbnailUrl: '/api/placeholder/150/100',
                    components: [
                      {
                        id: 'comp-1',
                        name: 'Button',
                        type: 'button',
                        properties: {
                          width: 120,
                          height: 44,
                          x: 0,
                          y: 0,
                          fill: '#3B82F6',
                          stroke: '#3B82F6',
                          borderRadius: 8
                        },
                        code: `// React Native Button Component
const Button = ({ title, onPress, variant = 'primary' }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant]
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};`
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'file-2',
            name: 'Screens',
            lastModified: '2024-01-14T15:45:00Z',
            thumbnailUrl: '/api/placeholder/300/200',
            version: 'v1.3.0',
            pages: [
              {
                id: 'page-2',
                name: 'App Screens',
                frames: [
                  {
                    id: 'frame-2',
                    name: 'Login Screen',
                    type: 'screen',
                    device: 'mobile',
                    thumbnailUrl: '/api/placeholder/150/100',
                    components: [
                      {
                        id: 'comp-2',
                        name: 'Login Form',
                        type: 'input',
                        properties: {
                          width: 300,
                          height: 200,
                          x: 0,
                          y: 0,
                          fill: '#FFFFFF',
                          stroke: '#E5E7EB',
                          borderRadius: 12
                        }
                      }
                    ]
                  },
                  {
                    id: 'frame-3',
                    name: 'Workout Screen',
                    type: 'screen',
                    device: 'mobile',
                    thumbnailUrl: '/api/placeholder/150/100',
                    components: [
                      {
                        id: 'comp-3',
                        name: 'Workout Card',
                        type: 'card',
                        properties: {
                          width: 350,
                          height: 150,
                          x: 0,
                          y: 0,
                          fill: '#F8FAFC',
                          stroke: '#E2E8F0',
                          borderRadius: 16
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        lastSync: new Date().toISOString(),
        status: 'connected'
      }
    ];

    setProjects(sampleProjects);
    if (sampleProjects.length > 0) {
      setSelectedProject(sampleProjects[0].id);
    }
  };

  // Connect to Figma
  const connectToFigma = async () => {
    if (!settings.token || !settings.teamId) {
      alert('Пожалуйста, введите Figma Token и Team ID');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate sample data if no projects exist
      if (projects.length === 0) {
        generateSampleData();
      }
      
      // Update project status
      setProjects(prev => prev.map(project => ({
        ...project,
        status: 'connected' as const,
        lastSync: new Date().toISOString()
      })));
      
    } catch (error) {
      console.error('Error connecting to Figma:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync project
  const syncProject = async (projectId: string) => {
    setIsLoading(true);
    try {
      // Simulate sync
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, lastSync: new Date().toISOString(), status: 'connected' as const }
          : project
      ));
      
    } catch (error) {
      console.error('Error syncing project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Export component code
  const exportComponentCode = (component: FigmaComponent) => {
    if (!component.code) return;
    
    const blob = new Blob([component.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${component.name}.tsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get selected project data
  const selectedProjectData = projects.find(p => p.id === selectedProject);
  const selectedFileData = selectedProjectData?.files.find(f => f.id === selectedFile);
  const selectedFrameData = selectedFileData?.pages.flatMap(p => p.frames).find(f => f.id === selectedFrame);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Figma Integration</h1>
          <p className="text-gray-600">Импорт дизайнов и генерация кода</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => connectToFigma()}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Figma className="h-4 w-4 mr-2" />
            {isLoading ? 'Подключение...' : 'Подключить'}
          </button>
          <button
            onClick={() => generateSampleData()}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Загрузить примеры
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Настройки подключения</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Figma Token
            </label>
            <input
              type="password"
              value={settings.token}
              onChange={(e) => setSettings(prev => ({ ...prev, token: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="figd_xxxxxxxxxxxxxxxxxxxxxxxx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team ID
            </label>
            <input
              type="text"
              value={settings.teamId}
              onChange={(e) => setSettings(prev => ({ ...prev, teamId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="1234567890"
            />
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Проекты</h3>
          <div className="space-y-3">
            {projects.map(project => (
              <div
                key={project.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedProject === project.id 
                    ? 'bg-blue-50 border-blue-200 border' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedProject(project.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-600">{project.files.length} файлов</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      project.status === 'connected' ? 'bg-green-500' : 
                      project.status === 'syncing' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        syncProject(project.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Files List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Файлы</h3>
          {selectedProjectData ? (
            <div className="space-y-3">
              {selectedProjectData.files.map(file => (
                <div
                  key={file.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedFile === file.id 
                      ? 'bg-blue-50 border-blue-200 border' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedFile(file.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <FileText className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{file.name}</h4>
                      <p className="text-sm text-gray-600">v{file.version}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Выберите проект</p>
          )}
        </div>

        {/* Frames List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Экраны/Компоненты</h3>
          {selectedFileData ? (
            <div className="space-y-3">
              {selectedFileData.pages.flatMap(page => page.frames).map(frame => (
                <div
                  key={frame.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedFrame === frame.id 
                      ? 'bg-blue-50 border-blue-200 border' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedFrame(frame.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                      {frame.device === 'mobile' ? <Smartphone className="h-4 w-4" /> :
                       frame.device === 'tablet' ? <Tablet className="h-4 w-4" /> :
                       <Monitor className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{frame.name}</h4>
                      <p className="text-sm text-gray-600">{frame.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Выберите файл</p>
          )}
        </div>
      </div>

      {/* Frame Details */}
      {selectedFrameData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{selectedFrameData.name}</h3>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="h-4 w-4 mr-1" />
                Экспорт
              </button>
              <button className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Code className="h-4 w-4 mr-1" />
                Генерировать код
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Предварительный просмотр</h4>
              <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                <div className="text-center">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Предварительный просмотр</p>
                  <p className="text-sm text-gray-500">Размер: {selectedFrameData.components[0]?.properties.width || 300}x{selectedFrameData.components[0]?.properties.height || 200}</p>
                </div>
              </div>
            </div>

            {/* Components */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Компоненты</h4>
              <div className="space-y-3">
                {selectedFrameData.components.map(component => (
                  <div key={component.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">{component.name}</h5>
                        <p className="text-sm text-gray-600">{component.type}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => exportComponentCode(component)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Code className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {component.code && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono overflow-x-auto">
                        {component.code.split('\n')[0]}...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <Figma className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Проекты</h3>
              <p className="text-2xl font-bold text-blue-600">{projects.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Файлы</h3>
              <p className="text-2xl font-bold text-green-600">
                {projects.reduce((sum, project) => sum + project.files.length, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <Layers className="h-8 w-8 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Компоненты</h3>
              <p className="text-2xl font-bold text-purple-600">
                {projects.reduce((sum, project) => 
                  sum + project.files.reduce((fileSum, file) => 
                    fileSum + file.pages.reduce((pageSum, page) => 
                      pageSum + page.frames.reduce((frameSum, frame) => 
                        frameSum + frame.components.length, 0), 0), 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <Zap className="h-8 w-8 text-orange-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Синхронизация</h3>
              <p className="text-sm text-orange-600">
                {projects.filter(p => p.status === 'connected').length}/{projects.length} активны
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FigmaIntegration;
