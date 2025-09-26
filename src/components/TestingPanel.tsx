import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Notification } from '../context/AppContext';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  RefreshCw,
  Shield,
  Zap,
  Eye,
  Activity,
  Clock,
  Target,
  BarChart3,
  Download,
  Upload
} from 'lucide-react';

// Компонент результата теста
const TestResult: React.FC<{
  test: any;
  onRun: (testId: string) => void;
  onViewDetails: (testId: string) => void;
}> = ({ test, onRun, onViewDetails }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'skip': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default: return <TestTube className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'fail': return 'bg-red-100 text-red-800';
      case 'skip': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getStatusIcon(test.status)}
          <div>
            <h3 className="font-semibold text-gray-900">{test.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(test.status)}`}>
                {test.status === 'pass' ? 'Пройден' :
                 test.status === 'fail' ? 'Провален' :
                 test.status === 'skip' ? 'Пропущен' : 'Не запущен'}
              </span>
              <span className="text-xs text-gray-500">
                {test.duration}мс
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onRun(test.id)}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Запустить
          </button>
          <button
            onClick={() => onViewDetails(test.id)}
            className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Детали
          </button>
        </div>
      </div>
      
      {test.error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-800">Ошибка</span>
          </div>
          <p className="text-sm text-red-700">{test.error}</p>
        </div>
      )}
      
      {test.output && (
        <div className="bg-gray-50 border border-gray-200 rounded p-3">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Вывод</span>
          </div>
          <pre className="text-xs text-gray-600 whitespace-pre-wrap">{test.output}</pre>
        </div>
      )}
    </div>
  );
};

// Компонент статистики тестов
const TestStats: React.FC<{ stats: any }> = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center space-x-2 mb-2">
        <TestTube className="h-5 w-5 text-blue-500" />
        <span className="text-sm text-gray-600">Всего тестов</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
    </div>

    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center space-x-2 mb-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span className="text-sm text-gray-600">Пройдено</span>
      </div>
      <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
    </div>

    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center space-x-2 mb-2">
        <XCircle className="h-5 w-5 text-red-500" />
        <span className="text-sm text-gray-600">Провалено</span>
      </div>
      <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
    </div>

    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center space-x-2 mb-2">
        <Clock className="h-5 w-5 text-gray-500" />
        <span className="text-sm text-gray-600">Время</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{stats.duration}с</div>
    </div>
  </div>
);

// Компонент категории тестов
const TestCategory: React.FC<{
  category: string;
  tests: any[];
  onRunTest: (testId: string) => void;
  onViewDetails: (testId: string) => void;
  onRunCategory: (category: string) => void;
}> = ({ category, tests, onRunTest, onViewDetails, onRunCategory }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="h-5 w-5 text-red-500" />;
      case 'performance': return <Zap className="h-5 w-5 text-blue-500" />;
      case 'accessibility': return <Eye className="h-5 w-5 text-green-500" />;
      case 'integration': return <Activity className="h-5 w-5 text-purple-500" />;
      default: return <TestTube className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'security': return 'Безопасность';
      case 'performance': return 'Производительность';
      case 'accessibility': return 'Доступность';
      case 'integration': return 'Интеграция';
      default: return 'Общие';
    }
  };

  const categoryStats = {
    total: tests.length,
    passed: tests.filter(t => t.status === 'pass').length,
    failed: tests.filter(t => t.status === 'fail').length,
    skipped: tests.filter(t => t.status === 'skip').length,
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getCategoryIcon(category)}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {getCategoryLabel(category)}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{categoryStats.total} тестов</span>
                <span className="text-green-600">{categoryStats.passed} пройдено</span>
                <span className="text-red-600">{categoryStats.failed} провалено</span>
                <span className="text-yellow-600">{categoryStats.skipped} пропущено</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onRunCategory(category)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Play className="h-4 w-4" />
            <span>Запустить все</span>
          </button>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        {tests.map((test) => (
          <TestResult
            key={test.id}
            test={test}
            onRun={onRunTest}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};

// Главный компонент панели тестирования
const TestingPanel: React.FC = () => {
  const { state, actions } = useApp();
  const [testSuites, setTestSuites] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Моковые данные тестов
  useEffect(() => {
    const mockTests = [
      {
        id: 'test-1',
        name: 'Проверка SQL injection уязвимостей',
        category: 'security',
        status: 'pass',
        duration: 1250,
        output: 'Все проверки безопасности пройдены успешно',
      },
      {
        id: 'test-2',
        name: 'Тест производительности pose detection',
        category: 'performance',
        status: 'fail',
        duration: 3200,
        error: 'FPS ниже ожидаемого: 15 вместо 30',
        output: 'Обнаружены узкие места в алгоритме обработки',
      },
      {
        id: 'test-3',
        name: 'Проверка accessibility labels',
        category: 'accessibility',
        status: 'pass',
        duration: 800,
        output: 'Все элементы имеют корректные accessibility labels',
      },
      {
        id: 'test-4',
        name: 'Интеграция с GitHub API',
        category: 'integration',
        status: 'pass',
        duration: 1500,
        output: 'GitHub API интеграция работает корректно',
      },
      {
        id: 'test-5',
        name: 'Проверка безопасности данных',
        category: 'security',
        status: 'skip',
        duration: 0,
        output: 'Тест пропущен - требует настройки тестовой среды',
      },
      {
        id: 'test-6',
        name: 'Тест производительности камеры',
        category: 'performance',
        status: 'pass',
        duration: 2100,
        output: 'Камера работает с оптимальной производительностью',
      },
    ];

    setTestSuites(mockTests);
  }, []);

  const runTest = async (testId: string) => {
    setIsRunning(true);
    try {
      // Симуляция запуска теста
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Обновляем статус теста
      setTestSuites(prev => prev.map(test => 
        test.id === testId 
          ? { ...test, status: Math.random() > 0.3 ? 'pass' : 'fail', duration: Math.floor(Math.random() * 3000) + 500 }
          : test
      ));

        actions.addNotification({
          type: 'success',
          title: 'Тест завершен',
          message: 'Результат теста обновлен',
          source: 'system',
          read: false,
        });
    } catch (error) {
      actions.addNotification({
        type: 'error',
        title: 'Ошибка теста',
        message: 'Не удалось запустить тест',
        source: 'system',
        read: false,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runCategory = async (category: string) => {
    setIsRunning(true);
    try {
      const categoryTests = testSuites.filter(test => test.category === category);
      
      for (const test of categoryTests) {
        await runTest(test.id);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      actions.addNotification({
        type: 'success',
        title: 'Тесты категории завершены',
        message: `Выполнено ${categoryTests.length} тестов`,
        source: 'system',
        read: false,
      });
    } catch (error) {
      actions.addNotification({
        type: 'error',
        title: 'Ошибка выполнения тестов',
        message: 'Не удалось выполнить тесты категории',
        source: 'system',
        read: false,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    try {
      for (const test of testSuites) {
        await runTest(test.id);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      actions.addNotification({
        type: 'success',
        title: 'Все тесты завершены',
        message: `Выполнено ${testSuites.length} тестов`,
        source: 'system',
        read: false,
      });
    } catch (error) {
      actions.addNotification({
        type: 'error',
        title: 'Ошибка выполнения тестов',
        message: 'Не удалось выполнить все тесты',
        source: 'system',
        read: false,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const viewTestDetails = (testId: string) => {
    const test = testSuites.find(t => t.id === testId);
    if (test) {
      actions.addNotification({
        type: 'info',
        title: 'Детали теста',
        message: `Тест: ${test.name}\nСтатус: ${test.status}\nДлительность: ${test.duration}мс`,
        source: 'system',
        read: false,
      });
    }
  };

  const exportTestResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      total: testSuites.length,
      passed: testSuites.filter(t => t.status === 'pass').length,
      failed: testSuites.filter(t => t.status === 'fail').length,
      skipped: testSuites.filter(t => t.status === 'skip').length,
      tests: testSuites,
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-results-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    actions.addNotification({
      type: 'success',
      title: 'Результаты экспортированы',
      message: 'Файл с результатами тестов сохранен',
      source: 'system',
      read: false,
    });
  };

  const categories = ['all', 'security', 'performance', 'accessibility', 'integration'];
  const filteredTests = selectedCategory === 'all' 
    ? testSuites 
    : testSuites.filter(test => test.category === selectedCategory);

  const stats = {
    total: testSuites.length,
    passed: testSuites.filter(t => t.status === 'pass').length,
    failed: testSuites.filter(t => t.status === 'fail').length,
    skipped: testSuites.filter(t => t.status === 'skip').length,
    duration: testSuites.reduce((sum, test) => sum + test.duration, 0) / 1000,
  };

  const groupedTests = categories.slice(1).map(category => ({
    category,
    tests: testSuites.filter(test => test.category === category),
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Панель тестирования</h1>
          <p className="text-gray-600 mt-1">
            Управление тестами и проверка качества кода
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportTestResults}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Экспорт результатов
          </button>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Выполнение...' : 'Запустить все'}
          </button>
        </div>
      </div>

      {/* Статистика */}
      <TestStats stats={stats} />

      {/* Фильтры */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Категория:</span>
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-sm rounded-lg ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Все' :
                 category === 'security' ? 'Безопасность' :
                 category === 'performance' ? 'Производительность' :
                 category === 'accessibility' ? 'Доступность' :
                 category === 'integration' ? 'Интеграция' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Тесты по категориям */}
      {selectedCategory === 'all' ? (
        <div className="space-y-6">
          {groupedTests.map(({ category, tests }) => (
            <TestCategory
              key={category}
              category={category}
              tests={tests}
              onRunTest={runTest}
              onViewDetails={viewTestDetails}
              onRunCategory={runCategory}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTests.map((test) => (
            <TestResult
              key={test.id}
              test={test}
              onRun={runTest}
              onViewDetails={viewTestDetails}
            />
          ))}
        </div>
      )}

      {/* Быстрые действия */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => runCategory('security')}
            className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Shield className="h-5 w-5 text-red-600" />
            <span className="text-red-800 font-medium">Тесты безопасности</span>
          </button>
          <button
            onClick={() => runCategory('performance')}
            className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Zap className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Тесты производительности</span>
          </button>
          <button
            onClick={() => runCategory('accessibility')}
            className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Eye className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">Тесты доступности</span>
          </button>
          <button
            onClick={exportTestResults}
            className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Download className="h-5 w-5 text-gray-600" />
            <span className="text-gray-800 font-medium">Экспорт результатов</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestingPanel;
