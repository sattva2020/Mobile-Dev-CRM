import { getStatusColor, getPriorityColor, formatDate } from '../../utils';

describe('Utility Functions', () => {
  describe('getStatusColor', () => {
    it('returns correct color for "todo" status', () => {
      expect(getStatusColor('todo')).toBe('bg-gray-100 text-gray-800');
    });

    it('returns correct color for "in-progress" status', () => {
      expect(getStatusColor('in-progress')).toBe('bg-blue-100 text-blue-800');
    });

    it('returns correct color for "done" status', () => {
      expect(getStatusColor('done')).toBe('bg-green-100 text-green-800');
    });

    it('returns default color for unknown status', () => {
      // @ts-ignore for testing invalid input
      expect(getStatusColor('unknown')).toBe('bg-gray-100 text-gray-800');
    });
  });

  describe('getPriorityColor', () => {
    it('returns correct color for "low" priority', () => {
      expect(getPriorityColor('low')).toBe('text-green-600');
    });

    it('returns correct color for "medium" priority', () => {
      expect(getPriorityColor('medium')).toBe('text-yellow-600');
    });

    it('returns correct color for "high" priority', () => {
      expect(getPriorityColor('high')).toBe('text-orange-600');
    });

    it('returns correct color for "critical" priority', () => {
      expect(getPriorityColor('critical')).toBe('text-red-600');
    });

    it('returns default color for unknown priority', () => {
      // @ts-ignore for testing invalid input
      expect(getPriorityColor('unknown')).toBe('text-gray-600');
    });
  });

  describe('formatDate', () => {
    it('formats a valid date string correctly', () => {
      const dateString = '2024-01-17T12:00:00Z';
      expect(formatDate(dateString)).toBe('17.01.2024');
    });

    it('returns "N/A" for an undefined date string', () => {
      expect(formatDate(undefined)).toBe('N/A');
    });

    it('returns "N/A" for an empty date string', () => {
      expect(formatDate('')).toBe('N/A');
    });

    it('handles invalid date strings gracefully', () => {
      const invalidDateString = 'not-a-date';
      const formatted = formatDate(invalidDateString);
      expect(formatted).toBe('N/A');
    });

    it('formats date with custom format', () => {
      const dateString = '2024-01-17T12:00:00Z';
      expect(formatDate(dateString, 'MM/dd/yyyy')).toBe('01/17/2024');
    });

    it('formats date with time', () => {
      const dateString = '2024-01-17T12:00:00Z';
      expect(formatDate(dateString, 'dd.MM.yyyy HH:mm')).toBe('17.01.2024 12:00');
    });
  });
});
