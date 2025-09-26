import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel,
  NodeTypes,
} from 'reactflow';
import { 
  Plus, 
  Download, 
  Upload, 
  Eye, 
  EyeOff,
  Trash2,
  Smartphone,
  ArrowRight,
  Users,
  Settings as SettingsIcon,
  Home,
  User,
  Play
} from 'lucide-react';

import 'reactflow/dist/style.css';

// Типы экранов
interface ScreenNode {
  id: string;
  type: 'screen';
  name: string;
  description: string;
  category: 'auth' | 'main' | 'workout' | 'profile' | 'settings' | 'onboarding';
  status: 'designed' | 'in-development' | 'completed' | 'testing';
  priority: 'critical' | 'high' | 'medium' | 'low';
  flows: string[];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

// Кастомные типы узлов для экранов
const nodeTypes: NodeTypes = {
  screen: ScreenNodeComponent,
  flow: FlowNodeComponent,
};

// Компонент экрана
function ScreenNodeComponent({ data, selected }: { data: any; selected: boolean }) {
  const getIcon = (category: string) => {
    switch (category) {
      case 'auth': return <User className="h-5 w-5" />;
      case 'main': return <Home className="h-5 w-5" />;
      case 'workout': return <Play className="h-5 w-5" />;
      case 'profile': return <User className="h-5 w-5" />;
      case 'settings': return <SettingsIcon className="h-5 w-5" />;
      case 'onboarding': return <Users className="h-5 w-5" />;
      default: return <Smartphone className="h-5 w-5" />;
    }
  };

  const getColor = (category: string) => {
    switch (category) {
      case 'auth': return 'border-red-500 bg-red-50';
      case 'main': return 'border-blue-500 bg-blue-50';
      case 'workout': return 'border-green-500 bg-green-50';
      case 'profile': return 'border-purple-500 bg-purple-50';
      case 'settings': return 'border-gray-500 bg-gray-50';
      case 'onboarding': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className={`px-4 py-3 rounded-lg border-2 min-w-[200px] max-w-[250px] ${
      selected ? 'border-blue-500 bg-blue-50' : getColor(data.category)
    }`}>
      {/* Заголовок экрана */}
      <div className="flex items-center space-x-2 mb-2">
        {getIcon(data.category)}
        <span className="font-semibold text-gray-800 capitalize">{data.category}</span>
        <span className={`px-2 py-1 text-xs rounded-full ${
          data.status === 'completed' ? 'bg-green-100 text-green-800' :
          data.status === 'in-development' ? 'bg-blue-100 text-blue-800' :
          data.status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {data.status === 'designed' ? 'Дизайн' :
           data.status === 'in-development' ? 'Разработка' :
           data.status === 'completed' ? 'Готово' : 'Тестирование'}
        </span>
      </div>

      {/* Название экрана */}
      <h3 className="font-medium text-gray-900 mb-1">{data.name}</h3>
      
      {/* Описание */}
      <p className="text-sm text-gray-600 mb-2">{data.description}</p>

      {/* Превью экрана */}
      {data.thumbnail ? (
        <div className="w-full h-20 bg-gray-100 rounded border mb-2 flex items-center justify-center">
          <img 
            src={data.thumbnail} 
            alt={data.name}
            className="w-full h-full object-cover rounded"
          />
        </div>
      ) : (
        <div className="w-full h-20 bg-gray-100 rounded border mb-2 flex items-center justify-center">
          <Smartphone className="h-8 w-8 text-gray-400" />
        </div>
      )}

      {/* Теги */}
      {data.tags && data.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {data.tags.map((tag: string, index: number) => (
            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Компонент потока
function FlowNodeComponent({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className={`px-3 py-2 rounded-lg border-2 min-w-[120px] ${
      selected ? 'border-blue-500 bg-blue-50' : 'border-orange-500 bg-orange-50'
    }`}>
      <div className="flex items-center space-x-2">
        <ArrowRight className="h-4 w-4 text-orange-600" />
        <span className="font-medium text-orange-800">{data.name}</span>
      </div>
    </div>
  );
}

const ScreenMap: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showAddScreen, setShowAddScreen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Загрузка данных из localStorage
  useEffect(() => {
    const savedNodes = localStorage.getItem('screen-nodes');
    const savedEdges = localStorage.getItem('screen-edges');
    
    if (savedNodes && savedEdges) {
      const parsedNodes = JSON.parse(savedNodes);
      const parsedEdges = JSON.parse(savedEdges);
      setNodes(parsedNodes);
      setEdges(parsedEdges);
    } else {
      // Инициализация с базовыми экранами для AI-Fitness Coach 360
      const initialNodes: Node[] = [
        {
          id: '1',
          type: 'screen',
          position: { x: 100, y: 100 },
          data: {
            name: 'Onboarding',
            description: 'Welcome and setup screens',
            category: 'onboarding',
            status: 'completed',
            priority: 'critical',
            tags: ['Welcome', 'Setup', 'Tutorial']
          }
        },
        {
          id: '2',
          type: 'screen',
          position: { x: 400, y: 100 },
          data: {
            name: 'Login',
            description: 'User authentication',
            category: 'auth',
            status: 'completed',
            priority: 'critical',
            tags: ['Auth', 'Login', 'Security']
          }
        },
        {
          id: '3',
          type: 'screen',
          position: { x: 700, y: 100 },
          data: {
            name: 'Home',
            description: 'Main dashboard',
            category: 'main',
            status: 'in-development',
            priority: 'high',
            tags: ['Dashboard', 'Overview', 'Navigation']
          }
        },
        {
          id: '4',
          type: 'screen',
          position: { x: 100, y: 300 },
          data: {
            name: 'Workout Live',
            description: 'Real-time workout with pose detection',
            category: 'workout',
            status: 'in-development',
            priority: 'critical',
            tags: ['Workout', 'Pose Detection', 'Real-time']
          }
        },
        {
          id: '5',
          type: 'screen',
          position: { x: 400, y: 300 },
          data: {
            name: 'Workout History',
            description: 'Past workout sessions',
            category: 'workout',
            status: 'designed',
            priority: 'medium',
            tags: ['History', 'Progress', 'Analytics']
          }
        },
        {
          id: '6',
          type: 'screen',
          position: { x: 700, y: 300 },
          data: {
            name: 'Profile',
            description: 'User profile and settings',
            category: 'profile',
            status: 'designed',
            priority: 'medium',
            tags: ['Profile', 'Settings', 'User']
          }
        },
        {
          id: '7',
          type: 'screen',
          position: { x: 100, y: 500 },
          data: {
            name: 'Settings',
            description: 'App configuration',
            category: 'settings',
            status: 'designed',
            priority: 'low',
            tags: ['Settings', 'Configuration', 'Preferences']
          }
        }
      ];

      const initialEdges: Edge[] = [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', label: 'Complete Setup' },
        { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', label: 'Login Success' },
        { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', label: 'Start Workout' },
        { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', label: 'Workout Complete' },
        { id: 'e3-6', source: '3', target: '6', type: 'smoothstep', label: 'View Profile' },
        { id: 'e6-7', source: '6', target: '7', type: 'smoothstep', label: 'Open Settings' }
      ];

      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [setNodes, setEdges]);

  // Сохранение данных в localStorage
  useEffect(() => {
    localStorage.setItem('screen-nodes', JSON.stringify(nodes));
    localStorage.setItem('screen-edges', JSON.stringify(edges));
  }, [nodes, edges]);

  // Фильтрация узлов по категории
  const filteredNodes = useMemo(() => {
    if (filterCategory === 'all') return nodes;
    return nodes.filter(node => node.data.category === filterCategory);
  }, [nodes, filterCategory]);

  // Добавление нового экрана
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addScreen = (category: ScreenNode['category']) => {
    const newScreen: Node = {
      id: `${Date.now()}`,
      type: 'screen',
      position: { x: Math.random() * 600 + 100, y: Math.random() * 400 + 100 },
      data: {
        name: `New ${category}`,
        description: `Description for new ${category} screen`,
        category,
        status: 'designed',
        priority: 'medium',
        tags: []
      }
    };
    setNodes((nds) => [...nds, newScreen]);
  };

  // Удаление экрана
  const deleteScreen = (screenId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== screenId));
    setEdges((eds) => eds.filter((edge) => edge.source !== screenId && edge.target !== screenId));
  };

  // Экспорт экранной карты
  const exportScreenMap = () => {
    const data = {
      nodes,
      edges,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0'
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screen-map.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Импорт экранной карты
  const importScreenMap = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.nodes && data.edges) {
            setNodes(data.nodes);
            setEdges(data.edges);
          }
        } catch (error) {
          console.error('Error importing screen map:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  // Загрузка превью экрана
  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>, nodeId: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const thumbnail = e.target?.result as string;
        setNodes((nds) => nds.map((node) => 
          node.id === nodeId 
            ? { ...node, data: { ...node.data, thumbnail } }
            : node
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50">
      {/* Панель управления */}
      <Panel position="top-left" className="bg-white shadow-lg rounded-lg p-4 m-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">Экранная карта</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddScreen(!showAddScreen)}
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Добавить экран
            </button>
            <button
              onClick={exportScreenMap}
              className="flex items-center px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              <Download className="h-4 w-4 mr-1" />
              Экспорт
            </button>
            <label className="flex items-center px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer">
              <Upload className="h-4 w-4 mr-1" />
              Импорт
              <input
                type="file"
                accept=".json"
                onChange={importScreenMap}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Панель добавления экранов */}
        {showAddScreen && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Добавить экран:</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => addScreen('auth')}
                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                Auth
              </button>
              <button
                onClick={() => addScreen('main')}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                Main
              </button>
              <button
                onClick={() => addScreen('workout')}
                className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
              >
                Workout
              </button>
              <button
                onClick={() => addScreen('profile')}
                className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
              >
                Profile
              </button>
              <button
                onClick={() => addScreen('settings')}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                Settings
              </button>
              <button
                onClick={() => addScreen('onboarding')}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
              >
                Onboarding
              </button>
            </div>
          </div>
        )}

        {/* Фильтры */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Категория:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2 py-1 text-sm border border-gray-300 rounded"
            >
              <option value="all">Все</option>
              <option value="auth">Auth</option>
              <option value="main">Main</option>
              <option value="workout">Workout</option>
              <option value="profile">Profile</option>
              <option value="settings">Settings</option>
              <option value="onboarding">Onboarding</option>
            </select>
          </div>
          <button
            onClick={() => setShowMiniMap(!showMiniMap)}
            className="flex items-center px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            {showMiniMap ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {showMiniMap ? 'Скрыть' : 'Показать'} карту
          </button>
        </div>
      </Panel>

      {/* Панель выбранного экрана */}
      {selectedNode && (
        <Panel position="top-right" className="bg-white shadow-lg rounded-lg p-4 m-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Свойства экрана</h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
              <input
                type="text"
                value={selectedNode.data.name}
                onChange={(e) => {
                  setNodes((nds) => nds.map((node) => 
                    node.id === selectedNode.id 
                      ? { ...node, data: { ...node.data, name: e.target.value } }
                      : node
                  ));
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
              <textarea
                value={selectedNode.data.description}
                onChange={(e) => {
                  setNodes((nds) => nds.map((node) => 
                    node.id === selectedNode.id 
                      ? { ...node, data: { ...node.data, description: e.target.value } }
                      : node
                  ));
                }}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
              <select
                value={selectedNode.data.status}
                onChange={(e) => {
                  setNodes((nds) => nds.map((node) => 
                    node.id === selectedNode.id 
                      ? { ...node, data: { ...node.data, status: e.target.value } }
                      : node
                  ));
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="designed">Дизайн</option>
                <option value="in-development">Разработка</option>
                <option value="completed">Готово</option>
                <option value="testing">Тестирование</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Превью экрана</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleThumbnailUpload(e, selectedNode.id)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => deleteScreen(selectedNode.id)}
                className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Удалить
              </button>
            </div>
          </div>
        </Panel>
      )}

      {/* React Flow */}
      <ReactFlow
        nodes={filteredNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(event, node) => setSelectedNode(node)}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        {showMiniMap && <MiniMap />}
      </ReactFlow>
    </div>
  );
};

export default ScreenMap;
