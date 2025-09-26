import { TaskId } from '../../../domain/value-objects/TaskId';

describe('TaskId Value Object', () => {
  describe('Creation', () => {
    it('should create TaskId with valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const taskId = new TaskId(validUuid);
      
      expect(taskId.getValue()).toBe(validUuid);
    });

    it('should throw error for empty ID', () => {
      expect(() => {
        new TaskId('');
      }).toThrow('TaskId cannot be empty');
    });

    it('should throw error for invalid UUID format', () => {
      expect(() => {
        new TaskId('invalid-uuid');
      }).toThrow('TaskId must be a valid UUID');
    });

    it('should generate valid UUID', () => {
      const taskId = TaskId.generate();
      const uuid = taskId.getValue();
      
      // Check UUID v4 format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(uuid)).toBe(true);
    });
  });

  describe('Equality', () => {
    it('should be equal to same TaskId', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const taskId1 = new TaskId(uuid);
      const taskId2 = new TaskId(uuid);
      
      expect(taskId1.equals(taskId2)).toBe(true);
    });

    it('should not be equal to different TaskId', () => {
      const taskId1 = new TaskId('123e4567-e89b-12d3-a456-426614174000');
      const taskId2 = new TaskId('987fcdeb-51a2-43d1-b789-123456789abc');
      
      expect(taskId1.equals(taskId2)).toBe(false);
    });
  });

  describe('String representation', () => {
    it('should return UUID as string', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const taskId = new TaskId(uuid);
      
      expect(taskId.toString()).toBe(uuid);
    });
  });
});
