import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar,
  Users,
  Clock,
  Zap,
  Download,
  RefreshCw,
  Filter,
  Settings
} from 'lucide-react';

// Types for metrics
interface SprintData {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  totalStoryPoints: number;
  completedStoryPoints: number;
  remainingStoryPoints: number;
  teamVelocity: number;
  burndownData: BurndownPoint[];
  cfdData: CFDPoint[];
}

interface BurndownPoint {
  date: string;
  ideal: number;
  actual: number;
  remaining: number;
}

interface CFDPoint {
  date: string;
  todo: number;
  inProgress: number;
  review: number;
  done: number;
}

interface VelocityData {
  sprint: string;
  planned: number;
  completed: number;
  velocity: number;
}

const ExtendedMetrics: React.FC = () => {
  const [sprints, setSprints] = useState<SprintData[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<string>('');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [isLoading, setIsLoading] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedSprints = localStorage.getItem('extended-metrics-sprints');
    if (savedSprints) {
      const parsedSprints = JSON.parse(savedSprints);
      setSprints(parsedSprints);
      if (parsedSprints.length > 0) {
        setSelectedSprint(parsedSprints[0].id);
      }
    } else {
      // Generate sample data
      generateSampleData();
    }
  }, []);

  // Generate sample data
  const generateSampleData = () => {
    const sampleSprints: SprintData[] = [
      {
        id: 'sprint-1',
        name: 'Sprint 1 - MVP Features',
        startDate: '2024-01-01',
        endDate: '2024-01-14',
        totalStoryPoints: 100,
        completedStoryPoints: 85,
        remainingStoryPoints: 15,
        teamVelocity: 42.5,
        burndownData: generateBurndownData(100, 14),
        cfdData: generateCFDData(14)
      },
      {
        id: 'sprint-2',
        name: 'Sprint 2 - AI Integration',
        startDate: '2024-01-15',
        endDate: '2024-01-28',
        totalStoryPoints: 120,
        completedStoryPoints: 95,
        remainingStoryPoints: 25,
        teamVelocity: 47.5,
        burndownData: generateBurndownData(120, 14),
        cfdData: generateCFDData(14)
      },
      {
        id: 'sprint-3',
        name: 'Sprint 3 - Testing & Polish',
        startDate: '2024-01-29',
        endDate: '2024-02-11',
        totalStoryPoints: 80,
        completedStoryPoints: 75,
        remainingStoryPoints: 5,
        teamVelocity: 37.5,
        burndownData: generateBurndownData(80, 14),
        cfdData: generateCFDData(14)
      }
    ];

    setSprints(sampleSprints);
    setSelectedSprint(sampleSprints[0].id);
    localStorage.setItem('extended-metrics-sprints', JSON.stringify(sampleSprints));
  };

  // Generate burndown data
  const generateBurndownData = (totalPoints: number, days: number): BurndownPoint[] => {
    const data: BurndownPoint[] = [];
    const dailyIdeal = totalPoints / days;
    
    for (let i = 0; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      const ideal = Math.max(0, totalPoints - (dailyIdeal * i));
      const actual = Math.max(0, totalPoints - (dailyIdeal * i * (0.8 + Math.random() * 0.4)));
      const remaining = Math.max(0, totalPoints - (dailyIdeal * i * (0.7 + Math.random() * 0.6)));
      
      data.push({
        date: date.toISOString().split('T')[0],
        ideal,
        actual,
        remaining
      });
    }
    
    return data;
  };

  // Generate CFD data
  const generateCFDData = (days: number): CFDPoint[] => {
    const data: CFDPoint[] = [];
    let todo = 100;
    let inProgress = 0;
    let review = 0;
    let done = 0;
    
    for (let i = 0; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      // Simulate work progression
      if (i > 0) {
        const movedToProgress = Math.min(5, todo);
        const movedToReview = Math.min(3, inProgress);
        const movedToDone = Math.min(4, review);
        
        todo -= movedToProgress;
        inProgress += movedToProgress - movedToReview;
        review += movedToReview - movedToDone;
        done += movedToDone;
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        todo,
        inProgress,
        review,
        done
      });
    }
    
    return data;
  };

  // Get selected sprint data
  const selectedSprintData = useMemo(() => {
    return sprints.find(sprint => sprint.id === selectedSprint);
  }, [sprints, selectedSprint]);

  // Calculate velocity trends
  const velocityTrends = useMemo(() => {
    if (sprints.length < 2) return null;
    
    const velocities = sprints.map(sprint => sprint.teamVelocity);
    const avgVelocity = velocities.reduce((sum, vel) => sum + vel, 0) / velocities.length;
    const trend = velocities[velocities.length - 1] - velocities[0];
    
    return {
      average: avgVelocity,
      trend,
      isImproving: trend > 0
    };
  }, [sprints]);

  // Export metrics
  const exportMetrics = () => {
    const data = {
      sprints,
      selectedSprint: selectedSprintData,
      velocityTrends,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metrics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Refresh data
  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Расширенные метрики</h1>
          <p className="text-gray-600">Burndown, CFD, Velocity и аналитика</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Обновить
          </button>
          <button
            onClick={exportMetrics}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Sprint Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Выбор спринта</h3>
        <div className="flex items-center space-x-4">
          <select
            value={selectedSprint}
            onChange={(e) => setSelectedSprint(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {sprints.map(sprint => (
              <option key={sprint.id} value={sprint.id}>
                {sprint.name}
              </option>
            ))}
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="quarter">Квартал</option>
          </select>
        </div>
      </div>

      {/* Sprint Overview */}
      {selectedSprintData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Story Points</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {selectedSprintData.completedStoryPoints}/{selectedSprintData.totalStoryPoints}
                </p>
                <p className="text-sm text-gray-600">
                  {Math.round((selectedSprintData.completedStoryPoints / selectedSprintData.totalStoryPoints) * 100)}% завершено
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Velocity</h3>
                <p className="text-2xl font-bold text-green-600">
                  {selectedSprintData.teamVelocity}
                </p>
                <p className="text-sm text-gray-600">Story points/день</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Осталось</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {selectedSprintData.remainingStoryPoints}
                </p>
                <p className="text-sm text-gray-600">Story points</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Период</h3>
                <p className="text-sm font-medium text-purple-600">
                  {new Date(selectedSprintData.startDate).toLocaleDateString()} - {new Date(selectedSprintData.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  {Math.ceil((new Date(selectedSprintData.endDate).getTime() - new Date(selectedSprintData.startDate).getTime()) / (1000 * 60 * 60 * 24))} дней
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Burndown Chart */}
      {selectedSprintData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Burndown Chart</h3>
          <div className="h-64 flex items-end space-x-1">
            {selectedSprintData.burndownData.map((point, index) => (
              <div key={index} className="flex flex-col items-center space-y-1">
                <div className="w-8 bg-red-200 rounded-t" style={{ height: `${(point.ideal / selectedSprintData.totalStoryPoints) * 200}px` }}>
                  <div className="w-full bg-red-500 rounded-t" style={{ height: '100%' }} />
                </div>
                <div className="w-8 bg-blue-200 rounded-t" style={{ height: `${(point.actual / selectedSprintData.totalStoryPoints) * 200}px` }}>
                  <div className="w-full bg-blue-500 rounded-t" style={{ height: '100%' }} />
                </div>
                <div className="text-xs text-gray-600">
                  {new Date(point.date).getDate()}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span className="text-sm text-gray-600">Идеальный</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span className="text-sm text-gray-600">Фактический</span>
            </div>
          </div>
        </div>
      )}

      {/* CFD Chart */}
      {selectedSprintData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cumulative Flow Diagram (CFD)</h3>
          <div className="h-64 flex items-end space-x-1">
            {selectedSprintData.cfdData.map((point, index) => (
              <div key={index} className="flex flex-col items-center space-y-1">
                <div className="w-8 bg-gray-200 rounded-t" style={{ height: `${(point.todo / 100) * 200}px` }}>
                  <div className="w-full bg-gray-500 rounded-t" style={{ height: '100%' }} />
                </div>
                <div className="w-8 bg-yellow-200 rounded-t" style={{ height: `${(point.inProgress / 100) * 200}px` }}>
                  <div className="w-full bg-yellow-500 rounded-t" style={{ height: '100%' }} />
                </div>
                <div className="w-8 bg-blue-200 rounded-t" style={{ height: `${(point.review / 100) * 200}px` }}>
                  <div className="w-full bg-blue-500 rounded-t" style={{ height: '100%' }} />
                </div>
                <div className="w-8 bg-green-200 rounded-t" style={{ height: `${(point.done / 100) * 200}px` }}>
                  <div className="w-full bg-green-500 rounded-t" style={{ height: '100%' }} />
                </div>
                <div className="text-xs text-gray-600">
                  {new Date(point.date).getDate()}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-500 rounded" />
              <span className="text-sm text-gray-600">To Do</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded" />
              <span className="text-sm text-gray-600">In Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span className="text-sm text-gray-600">Review</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-sm text-gray-600">Done</span>
            </div>
          </div>
        </div>
      )}

      {/* Velocity Trends */}
      {velocityTrends && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Velocity Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{velocityTrends.average.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Средняя скорость</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${velocityTrends.isImproving ? 'text-green-600' : 'text-red-600'}`}>
                {velocityTrends.trend > 0 ? '+' : ''}{velocityTrends.trend.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Тренд</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {velocityTrends.isImproving ? '📈' : '📉'}
              </div>
              <div className="text-sm text-gray-600">
                {velocityTrends.isImproving ? 'Улучшается' : 'Снижается'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sprint History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">История спринтов</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Спринт</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Story Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Velocity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Завершено</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Период</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sprints.map(sprint => (
                <tr key={sprint.id} className={selectedSprint === sprint.id ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sprint.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sprint.completedStoryPoints}/{sprint.totalStoryPoints}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sprint.teamVelocity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.round((sprint.completedStoryPoints / sprint.totalStoryPoints) * 100)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExtendedMetrics;
