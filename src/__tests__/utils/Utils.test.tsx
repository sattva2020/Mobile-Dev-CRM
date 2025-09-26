import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { formatDate, formatTime, getStatusColor, getPriorityColor, getCategoryColor, getStatusIcon, getPriorityIcon, getCategoryIcon, truncateText, generateId, validateEmail, validateUrl } from '../../utils';

describe('Utility Functions', () => {
  describe('Date and Time Utilities', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-17T12:00:00Z');
      expect(formatDate(date)).toBe('17.01.2024');
    });

    it('formats time correctly', () => {
      const date = new Date('2024-01-17T12:30:45Z');
      expect(formatTime(date)).toBe('12:30:45');
    });

    it('handles invalid date', () => {
      expect(formatDate(new Date('invalid'))).toBe('Invalid Date');
    });

    it('handles null date', () => {
      expect(formatDate(null)).toBe('N/A');
    });

    it('handles undefined date', () => {
      expect(formatDate(undefined)).toBe('N/A');
    });
  });

  describe('Status and Priority Utilities', () => {
    it('returns correct status color', () => {
      expect(getStatusColor('todo')).toBe('bg-gray-100 text-gray-800');
      expect(getStatusColor('in-progress')).toBe('bg-blue-100 text-blue-800');
      expect(getStatusColor('done')).toBe('bg-green-100 text-green-800');
    });

    it('returns correct priority color', () => {
      expect(getPriorityColor('low')).toBe('bg-gray-100 text-gray-800');
      expect(getPriorityColor('medium')).toBe('bg-yellow-100 text-yellow-800');
      expect(getPriorityColor('high')).toBe('bg-orange-100 text-orange-800');
      expect(getPriorityColor('critical')).toBe('bg-red-100 text-red-800');
    });

    it('returns correct category color', () => {
      expect(getCategoryColor('bug')).toBe('bg-red-100 text-red-800');
      expect(getCategoryColor('feature')).toBe('bg-green-100 text-green-800');
      expect(getCategoryColor('enhancement')).toBe('bg-blue-100 text-blue-800');
      expect(getCategoryColor('documentation')).toBe('bg-purple-100 text-purple-800');
    });

    it('returns correct status icon', () => {
      expect(getStatusIcon('todo')).toBe('⏳');
      expect(getStatusIcon('in-progress')).toBe('🔄');
      expect(getStatusIcon('done')).toBe('✅');
    });

    it('returns correct priority icon', () => {
      expect(getPriorityIcon('low')).toBe('🟢');
      expect(getPriorityIcon('medium')).toBe('🟡');
      expect(getPriorityIcon('high')).toBe('🟠');
      expect(getPriorityIcon('critical')).toBe('🔴');
    });

    it('returns correct category icon', () => {
      expect(getCategoryIcon('bug')).toBe('🐛');
      expect(getCategoryIcon('feature')).toBe('✨');
      expect(getCategoryIcon('enhancement')).toBe('⚡');
      expect(getCategoryIcon('documentation')).toBe('📚');
    });
  });

  describe('Text Utilities', () => {
    it('truncates text correctly', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
      expect(truncateText('Hello', 5)).toBe('Hello');
      expect(truncateText('Hello World', 20)).toBe('Hello World');
    });
  });

  describe('ID Generation', () => {
    it('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^[a-z0-9]{8}$/);
    });
  });

  describe('Validation Utilities', () => {
    it('validates email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });

    it('validates URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://example.com')).toBe(true);
      expect(validateUrl('invalid-url')).toBe(false);
    });
  });
});