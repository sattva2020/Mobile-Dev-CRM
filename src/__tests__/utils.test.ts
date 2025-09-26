import {
  formatDate,
  formatDateTime,
  isOverdue,
  getTimeUntilDue,
  getPriorityLabel,
  getPriorityColor,
  getStatusLabel,
  getStatusColor,
  getCategoryLabel,
  getCategoryIcon,
  truncateText,
  capitalizeFirst,
  slugify,
  groupBy,
  sortBy,
  uniqueBy,
  deepClone,
  omit,
  pick,
  validateEmail,
  validateUrl,
  validateRequired,
  formatFileSize,
  getFileExtension,
  debounce,
  throttle,
  getErrorMessage,
  generateId,
  generateShortId,
} from '../utils';

describe('Date utilities', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-17T12:00:00Z');
    const formatted = formatDate(date);
    expect(formatted).toContain('17');
    expect(formatted).toContain('января');
    expect(formatted).toContain('2024');
  });

  it('formats date time correctly', () => {
    const date = new Date('2024-01-17T12:00:00Z');
    const formatted = formatDateTime(date);
    expect(formatted).toContain('17');
    expect(formatted).toContain('янв');
    expect(formatted).toContain('2024');
  });

  it('detects overdue dates', () => {
    const pastDate = new Date(Date.now() - 86400000).toISOString(); // 1 day ago
    const futureDate = new Date(Date.now() + 86400000).toISOString(); // 1 day from now
    
    expect(isOverdue(pastDate)).toBe(true);
    expect(isOverdue(futureDate)).toBe(false);
  });

  it('calculates time until due', () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString(); // 1 day from now
    const timeUntilDue = getTimeUntilDue(futureDate);
    
    expect(timeUntilDue).toContain('1 дн.');
  });
});

describe('Priority utilities', () => {
  it('returns correct priority labels', () => {
    expect(getPriorityLabel('low')).toBe('Низкий');
    expect(getPriorityLabel('medium')).toBe('Средний');
    expect(getPriorityLabel('high')).toBe('Высокий');
    expect(getPriorityLabel('critical')).toBe('Критический');
  });

  it('returns correct priority colors', () => {
    expect(getPriorityColor('low')).toBe('bg-gray-100 text-gray-800');
    expect(getPriorityColor('medium')).toBe('bg-yellow-100 text-yellow-800');
    expect(getPriorityColor('high')).toBe('bg-orange-100 text-orange-800');
    expect(getPriorityColor('critical')).toBe('bg-red-100 text-red-800');
  });
});

describe('Status utilities', () => {
  it('returns correct status labels', () => {
    expect(getStatusLabel('todo')).toBe('К выполнению');
    expect(getStatusLabel('in-progress')).toBe('В работе');
    expect(getStatusLabel('review')).toBe('На проверке');
    expect(getStatusLabel('done')).toBe('Выполнено');
  });

  it('returns correct status colors', () => {
    expect(getStatusColor('todo')).toBe('bg-gray-100 text-gray-800');
    expect(getStatusColor('in-progress')).toBe('bg-blue-100 text-blue-800');
    expect(getStatusColor('review')).toBe('bg-yellow-100 text-yellow-800');
    expect(getStatusColor('done')).toBe('bg-green-100 text-green-800');
  });
});

describe('Category utilities', () => {
  it('returns correct category labels', () => {
    expect(getCategoryLabel('security')).toBe('Безопасность');
    expect(getCategoryLabel('performance')).toBe('Производительность');
    expect(getCategoryLabel('accessibility')).toBe('Доступность');
    expect(getCategoryLabel('testing')).toBe('Тестирование');
    expect(getCategoryLabel('documentation')).toBe('Документация');
    expect(getCategoryLabel('other')).toBe('Другое');
  });

  it('returns correct category icons', () => {
    expect(getCategoryIcon('security')).toBe('🔒');
    expect(getCategoryIcon('performance')).toBe('⚡');
    expect(getCategoryIcon('accessibility')).toBe('♿');
    expect(getCategoryIcon('testing')).toBe('🧪');
    expect(getCategoryIcon('documentation')).toBe('📚');
    expect(getCategoryIcon('other')).toBe('📋');
  });
});

describe('Text utilities', () => {
  it('truncates text correctly', () => {
    const longText = 'This is a very long text that should be truncated';
    const truncated = truncateText(longText, 20);
    
    expect(truncated).toBe('This is a very lo...');
    expect(truncateText('Short', 20)).toBe('Short');
  });

  it('capitalizes first letter', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
    expect(capitalizeFirst('HELLO')).toBe('HELLO');
    expect(capitalizeFirst('')).toBe('');
  });

  it('creates slug from text', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('Test @#$%')).toBe('test');
    expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
  });
});

describe('Array utilities', () => {
  const testArray = [
    { id: 1, category: 'A', value: 10 },
    { id: 2, category: 'B', value: 20 },
    { id: 3, category: 'A', value: 30 },
  ];

  it('groups array by key', () => {
    const grouped = groupBy(testArray, 'category');
    
    expect(grouped.A).toHaveLength(2);
    expect(grouped.B).toHaveLength(1);
    expect(grouped.A[0].id).toBe(1);
    expect(grouped.A[1].id).toBe(3);
  });

  it('sorts array by key', () => {
    const sorted = sortBy(testArray, 'value', 'asc');
    
    expect(sorted[0].value).toBe(10);
    expect(sorted[1].value).toBe(20);
    expect(sorted[2].value).toBe(30);
  });

  it('removes duplicates by key', () => {
    const withDuplicates = [
      { id: 1, category: 'A' },
      { id: 2, category: 'B' },
      { id: 3, category: 'A' },
    ];
    
    const unique = uniqueBy(withDuplicates, 'category');
    
    expect(unique).toHaveLength(2);
    expect(unique[0].category).toBe('A');
    expect(unique[1].category).toBe('B');
  });
});

describe('Object utilities', () => {
  const testObject = { a: 1, b: 2, c: 3 };

  it('deep clones object', () => {
    const cloned = deepClone(testObject);
    
    expect(cloned).toEqual(testObject);
    expect(cloned).not.toBe(testObject);
  });

  it('omits specified keys', () => {
    const omitted = omit(testObject, ['b']);
    
    expect(omitted).toEqual({ a: 1, c: 3 });
    expect(omitted).not.toHaveProperty('b');
  });

  it('picks specified keys', () => {
    const picked = pick(testObject, ['a', 'c']);
    
    expect(picked).toEqual({ a: 1, c: 3 });
    expect(picked).not.toHaveProperty('b');
  });
});

describe('Validation utilities', () => {
  it('validates email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  it('validates URLs', () => {
    expect(validateUrl('https://example.com')).toBe(true);
    expect(validateUrl('http://example.com')).toBe(true);
    expect(validateUrl('invalid-url')).toBe(false);
    expect(validateUrl('')).toBe(false);
  });

  it('validates required fields', () => {
    expect(validateRequired('test')).toBe(true);
    expect(validateRequired('')).toBe(false);
    expect(validateRequired([])).toBe(false);
    expect(validateRequired([1, 2, 3])).toBe(true);
    expect(validateRequired(null)).toBe(false);
    expect(validateRequired(undefined)).toBe(false);
  });
});

describe('File utilities', () => {
  it('formats file sizes', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(1073741824)).toBe('1 GB');
  });

  it('gets file extensions', () => {
    expect(getFileExtension('file.txt')).toBe('txt');
    expect(getFileExtension('image.jpg')).toBe('jpg');
    expect(getFileExtension('noextension')).toBe('');
  });
});

describe('Performance utilities', () => {
  it('debounces function calls', (done) => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);
    
    debouncedFn();
    debouncedFn();
    debouncedFn();
    
    setTimeout(() => {
      expect(mockFn).toHaveBeenCalledTimes(1);
      done();
    }, 150);
  });

  it('throttles function calls', (done) => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);
    
    throttledFn();
    throttledFn();
    throttledFn();
    
    setTimeout(() => {
      expect(mockFn).toHaveBeenCalledTimes(1);
      done();
    }, 150);
  });
});

describe('Error utilities', () => {
  it('extracts error messages', () => {
    expect(getErrorMessage(new Error('Test error'))).toBe('Test error');
    expect(getErrorMessage('String error')).toBe('String error');
    expect(getErrorMessage({})).toBe('Произошла неизвестная ошибка');
  });
});

describe('ID generation utilities', () => {
  it('generates unique IDs', () => {
    const id1 = generateId('test');
    const id2 = generateId('test');
    
    expect(id1).toMatch(/^test-\d+-[a-z0-9]+$/);
    expect(id2).toMatch(/^test-\d+-[a-z0-9]+$/);
    expect(id1).not.toBe(id2);
  });

  it('generates short IDs', () => {
    const id1 = generateShortId();
    const id2 = generateShortId();
    
    expect(id1).toMatch(/^[a-z0-9]{9}$/);
    expect(id2).toMatch(/^[a-z0-9]{9}$/);
    expect(id1).not.toBe(id2);
  });
});