import { Task } from '../../domain/entities/Task';
import { TaskId } from '../../domain/value-objects/TaskId';
import { TaskRepository } from '../../domain/repositories/TaskRepository';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * SupabaseTaskRepository - Реализация TaskRepository для Supabase
 * Следует принципам Clean Architecture
 * Инфраструктурный слой
 */
export class SupabaseTaskRepository implements TaskRepository {
  private supabase: SupabaseClient;

  constructor(
    supabaseUrl: string,
    supabaseAnonKey: string
  ) {
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  async save(task: Task): Promise<void> {
    const data = task.toPersistence();
    
    const { error } = await this.supabase
      .from('tasks')
      .upsert(data);

    if (error) {
      throw new Error(`Failed to save task: ${error.message}`);
    }
  }

  async findById(id: TaskId): Promise<Task | null> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('id', id.getValue())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to find task: ${error.message}`);
    }

    return Task.fromPersistence(data);
  }

  async findAll(): Promise<Task[]> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to find tasks: ${error.message}`);
    }

    return data.map(item => Task.fromPersistence(item));
  }

  async findByStatus(status: string): Promise<Task[]> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to find tasks by status: ${error.message}`);
    }

    return data.map(item => Task.fromPersistence(item));
  }

  async findByPriority(priority: string): Promise<Task[]> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('priority', priority)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to find tasks by priority: ${error.message}`);
    }

    return data.map(item => Task.fromPersistence(item));
  }

  async findByCategory(category: string): Promise<Task[]> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to find tasks by category: ${error.message}`);
    }

    return data.map(item => Task.fromPersistence(item));
  }

  async findByAssignee(assignee: string): Promise<Task[]> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('assignee', assignee)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to find tasks by assignee: ${error.message}`);
    }

    return data.map(item => Task.fromPersistence(item));
  }

  async findOverdue(): Promise<Task[]> {
    const now = new Date().toISOString();
    
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .lt('due_date', now)
      .not('status', 'in', ['done', 'cancelled'])
      .order('due_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to find overdue tasks: ${error.message}`);
    }

    return data.map(item => Task.fromPersistence(item));
  }

  async findDueSoon(): Promise<Task[]> {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .gte('due_date', now.toISOString())
      .lte('due_date', threeDaysFromNow.toISOString())
      .not('status', 'in', ['done', 'cancelled'])
      .order('due_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to find due soon tasks: ${error.message}`);
    }

    return data.map(item => Task.fromPersistence(item));
  }

  async search(query: string): Promise<Task[]> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to search tasks: ${error.message}`);
    }

    return data.map(item => Task.fromPersistence(item));
  }

  async delete(id: TaskId): Promise<void> {
    const { error } = await this.supabase
      .from('tasks')
      .delete()
      .eq('id', id.getValue());

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }

  async exists(id: TaskId): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('id')
      .eq('id', id.getValue())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return false; // Not found
      }
      throw new Error(`Failed to check task existence: ${error.message}`);
    }

    return !!data;
  }

  async countByStatus(status: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('status', status);

    if (error) {
      throw new Error(`Failed to count tasks by status: ${error.message}`);
    }

    return count || 0;
  }

  async getStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byCategory: Record<string, number>;
    overdue: number;
    dueSoon: number;
  }> {
    // Получаем общее количество
    const { count: total, error: totalError } = await this.supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      throw new Error(`Failed to get total count: ${totalError.message}`);
    }

    // Получаем статистику по статусам
    const { data: statusData, error: statusError } = await this.supabase
      .from('tasks')
      .select('status')
      .not('status', 'is', null);

    if (statusError) {
      throw new Error(`Failed to get status stats: ${statusError.message}`);
    }

    const byStatus = statusData.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Получаем статистику по приоритетам
    const { data: priorityData, error: priorityError } = await this.supabase
      .from('tasks')
      .select('priority')
      .not('priority', 'is', null);

    if (priorityError) {
      throw new Error(`Failed to get priority stats: ${priorityError.message}`);
    }

    const byPriority = priorityData.reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Получаем статистику по категориям
    const { data: categoryData, error: categoryError } = await this.supabase
      .from('tasks')
      .select('category')
      .not('category', 'is', null);

    if (categoryError) {
      throw new Error(`Failed to get category stats: ${categoryError.message}`);
    }

    const byCategory = categoryData.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Получаем просроченные задачи
    const overdueTasks = await this.findOverdue();
    const dueSoonTasks = await this.findDueSoon();

    return {
      total: total || 0,
      byStatus,
      byPriority,
      byCategory,
      overdue: overdueTasks.length,
      dueSoon: dueSoonTasks.length
    };
  }
}
