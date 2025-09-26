import React, { useState, useEffect, useCallback } from 'react';
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
import dagre from 'dagre';
import { 
  Plus, 
  Download, 
  Upload, 
  Eye, 
  EyeOff,
  RefreshCw,
  Trash2,
  Target,
  Zap,
  Database,
  Smartphone,
  Globe
} from 'lucide-react';

import 'reactflow/dist/style.css';

// Типы узлов архитектуры
interface ArchitectureNode {
  id: string;
  type: 'feature' | 'capability' | 'component' | 'screen' | 'api';
  name: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed' | 'blocked';
  priority: 'critical' | 'high' | 'medium' | 'low';
  dependencies: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Кастомные типы узлов
const nodeTypes: NodeTypes = {
  feature: FeatureNode,
  capability: CapabilityNode,
  component: ComponentNode,
  screen: ScreenNode,
  api: ApiNode,
};

// Компонент узла Feature
function FeatureNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className={`px-4 py-2 rounded-lg border-2 min-w-[200px] ${
      selected ? 'border-blue-500 bg-blue-50' : 'border-green-500 bg-green-50'
    }`}>
      <div className="flex items-center space-x-2 mb-2">
        <Target className="h-4 w-4 text-green-600" />
        <span className="font-semibold text-green-800">Feature</span>
        <span className={`px-2 py-1 text-xs rounded-full ${
          data.status === 'completed' ? 'bg-green-100 text-green-800' :
          data.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
          data.status === 'blocked' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {data.status}
        </span>
      </div>
      <h3 className="font-medium text-gray-900 mb-1">{data.name}</h3>
      <p className="text-sm text-gray-600">{data.description}</p>
      {data.tags && data.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
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

// Компонент узла Capability
function CapabilityNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className={`px-4 py-2 rounded-lg border-2 min-w-[200px] ${
      selected ? 'border-blue-500 bg-blue-50' : 'border-blue-500 bg-blue-50'
    }`}>
      <div className="flex items-center space-x-2 mb-2">
        <Zap className="h-4 w-4 text-blue-600" />
        <span className="font-semibold text-blue-800">Capability</span>
        <span className={`px-2 py-1 text-xs rounded-full ${
          data.status === 'completed' ? 'bg-green-100 text-green-800' :
          data.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
          data.status === 'blocked' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {data.status}
        </span>
      </div>
      <h3 className="font-medium text-gray-900 mb-1">{data.name}</h3>
      <p className="text-sm text-gray-600">{data.description}</p>
    </div>
  );
}

// Компонент узла Component
function ComponentNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className={`px-4 py-2 rounded-lg border-2 min-w-[200px] ${
      selected ? 'border-blue-500 bg-blue-50' : 'border-purple-500 bg-purple-50'
    }`}>
      <div className="flex items-center space-x-2 mb-2">
        <Database className="h-4 w-4 text-purple-600" />
        <span className="font-semibold text-purple-800">Component</span>
        <span className={`px-2 py-1 text-xs rounded-full ${
          data.status === 'completed' ? 'bg-green-100 text-green-800' :
          data.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
          data.status === 'blocked' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {data.status}
        </span>
      </div>
      <h3 className="font-medium text-gray-900 mb-1">{data.name}</h3>
      <p className="text-sm text-gray-600">{data.description}</p>
    </div>
  );
}

// Компонент узла Screen
function ScreenNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className={`px-4 py-2 rounded-lg border-2 min-w-[200px] ${
      selected ? 'border-blue-500 bg-blue-50' : 'border-orange-500 bg-orange-50'
    }`}>
      <div className="flex items-center space-x-2 mb-2">
        <Smartphone className="h-4 w-4 text-orange-600" />
        <span className="font-semibold text-orange-800">Screen</span>
        <span className={`px-2 py-1 text-xs rounded-full ${
          data.status === 'completed' ? 'bg-green-100 text-green-800' :
          data.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
          data.status === 'blocked' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {data.status}
        </span>
      </div>
      <h3 className="font-medium text-gray-900 mb-1">{data.name}</h3>
      <p className="text-sm text-gray-600">{data.description}</p>
    </div>
  );
}

// Компонент узла API
function ApiNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className={`px-4 py-2 rounded-lg border-2 min-w-[200px] ${
      selected ? 'border-blue-500 bg-blue-50' : 'border-indigo-500 bg-indigo-50'
    }`}>
      <div className="flex items-center space-x-2 mb-2">
        <Globe className="h-4 w-4 text-indigo-600" />
        <span className="font-semibold text-indigo-800">API</span>
        <span className={`px-2 py-1 text-xs rounded-full ${
          data.status === 'completed' ? 'bg-green-100 text-green-800' :
          data.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
          data.status === 'blocked' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {data.status}
        </span>
      </div>
      <h3 className="font-medium text-gray-900 mb-1">{data.name}</h3>
      <p className="text-sm text-gray-600">{data.description}</p>
    </div>
  );
}

// Функция для автоматического размещения узлов
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 50 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 100 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 100,
        y: nodeWithPosition.y - 50,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const ArchitectureMindMap: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [layoutDirection, setLayoutDirection] = useState<'TB' | 'BT' | 'LR' | 'RL'>('TB');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showAddNode, setShowAddNode] = useState(false);

  // Загрузка данных из localStorage
  useEffect(() => {
    const savedNodes = localStorage.getItem('architecture-nodes');
    const savedEdges = localStorage.getItem('architecture-edges');
    
    if (savedNodes && savedEdges) {
      const parsedNodes = JSON.parse(savedNodes);
      const parsedEdges = JSON.parse(savedEdges);
      setNodes(parsedNodes);
      setEdges(parsedEdges);
    } else {
      // Инициализация с базовыми узлами для AI-Fitness Coach 360
      const initialNodes: Node[] = [
        {
          id: '1',
          type: 'feature',
          position: { x: 250, y: 50 },
          data: {
            name: 'Pose Recognition',
            description: 'Real-time pose detection and analysis',
            status: 'in-progress',
            priority: 'critical',
            tags: ['AI', 'Computer Vision', 'Real-time']
          }
        },
        {
          id: '2',
          type: 'capability',
          position: { x: 100, y: 200 },
          data: {
            name: 'Exercise Analysis',
            description: 'Analyze exercise form and provide feedback',
            status: 'planned',
            priority: 'high',
            tags: ['AI', 'Analysis']
          }
        },
        {
          id: '3',
          type: 'capability',
          position: { x: 400, y: 200 },
          data: {
            name: 'Personalized Workouts',
            description: 'Generate custom workout plans',
            status: 'planned',
            priority: 'high',
            tags: ['AI', 'Personalization']
          }
        },
        {
          id: '4',
          type: 'component',
          position: { x: 50, y: 350 },
          data: {
            name: 'Camera Module',
            description: 'Camera integration and frame processing',
            status: 'completed',
            priority: 'critical',
            tags: ['Camera', 'Vision']
          }
        },
        {
          id: '5',
          type: 'component',
          position: { x: 250, y: 350 },
          data: {
            name: 'ML Pipeline',
            description: 'Machine learning model pipeline',
            status: 'in-progress',
            priority: 'critical',
            tags: ['ML', 'AI']
          }
        },
        {
          id: '6',
          type: 'screen',
          position: { x: 450, y: 350 },
          data: {
            name: 'Workout Screen',
            description: 'Main workout interface',
            status: 'planned',
            priority: 'high',
            tags: ['UI', 'Workout']
          }
        }
      ];

      const initialEdges: Edge[] = [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
        { id: 'e1-3', source: '1', target: '3', type: 'smoothstep' },
        { id: 'e2-4', source: '2', target: '4', type: 'smoothstep' },
        { id: 'e2-5', source: '2', target: '5', type: 'smoothstep' },
        { id: 'e3-6', source: '3', target: '6', type: 'smoothstep' },
        { id: 'e5-6', source: '5', target: '6', type: 'smoothstep' }
      ];

      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [setNodes, setEdges]);

  // Сохранение данных в localStorage
  useEffect(() => {
    localStorage.setItem('architecture-nodes', JSON.stringify(nodes));
    localStorage.setItem('architecture-edges', JSON.stringify(edges));
  }, [nodes, edges]);

  // Автоматическое размещение узлов
  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, layoutDirection);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [nodes, edges, layoutDirection, setNodes, setEdges]);

  // Добавление нового узла
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Добавление нового узла
  const addNode = (type: ArchitectureNode['type']) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        name: `New ${type}`,
        description: `Description for new ${type}`,
        status: 'planned',
        priority: 'medium',
        tags: []
      }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Удаление узла
  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  // Экспорт архитектуры
  const exportArchitecture = () => {
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
    a.download = 'architecture-mindmap.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Импорт архитектуры
  const importArchitecture = (event: React.ChangeEvent<HTMLInputElement>) => {
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
          console.error('Error importing architecture:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50">
      {/* Панель управления */}
      <Panel position="top-left" className="bg-white shadow-lg rounded-lg p-4 m-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">Архитектура проекта</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddNode(!showAddNode)}
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Добавить
            </button>
            <button
              onClick={onLayout}
              className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Авторазмещение
            </button>
            <button
              onClick={exportArchitecture}
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
                onChange={importArchitecture}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Панель добавления узлов */}
        {showAddNode && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Добавить узел:</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => addNode('feature')}
                className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
              >
                Feature
              </button>
              <button
                onClick={() => addNode('capability')}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                Capability
              </button>
              <button
                onClick={() => addNode('component')}
                className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
              >
                Component
              </button>
              <button
                onClick={() => addNode('screen')}
                className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded hover:bg-orange-200"
              >
                Screen
              </button>
              <button
                onClick={() => addNode('api')}
                className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200"
              >
                API
              </button>
            </div>
          </div>
        )}

        {/* Настройки */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Направление:</label>
            <select
              value={layoutDirection}
              onChange={(e) => setLayoutDirection(e.target.value as any)}
              className="px-2 py-1 text-sm border border-gray-300 rounded"
            >
              <option value="TB">Сверху вниз</option>
              <option value="BT">Снизу вверх</option>
              <option value="LR">Слева направо</option>
              <option value="RL">Справа налево</option>
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

      {/* Панель выбранного узла */}
      {selectedNode && (
        <Panel position="top-right" className="bg-white shadow-lg rounded-lg p-4 m-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Свойства узла</h3>
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
            <div className="flex space-x-2">
              <button
                onClick={() => deleteNode(selectedNode.id)}
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
        nodes={nodes}
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

export default ArchitectureMindMap;
