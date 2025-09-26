import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Types for our database schema
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Requirement {
  id: string;
  project_id: string;
  title: string;
  description: string;
  category: 'functional' | 'non_functional' | 'technical' | 'design';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'approved' | 'in_progress' | 'completed';
  version: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  requirement_id?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'feature' | 'bug' | 'performance' | 'security' | 'accessibility' | 'technical';
  assignee?: string;
  labels?: string[];
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  progress: number;
  github_issue_id?: number;
  github_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ArchitectureNode {
  id: string;
  project_id: string;
  type: 'feature' | 'capability' | 'component' | 'screen' | 'api';
  name: string;
  description?: string;
  status: string;
  priority: string;
  tags?: string[];
  position_x?: number;
  position_y?: number;
  created_at: string;
  updated_at: string;
}

export interface ScreenNode {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  category: 'auth' | 'main' | 'workout' | 'profile' | 'settings' | 'onboarding';
  status: 'designed' | 'in_development' | 'completed' | 'testing';
  priority: string;
  thumbnail_url?: string;
  position_x?: number;
  position_y?: number;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  project_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export class SupabaseService {
  private supabase: SupabaseClient;
  private projectId: string;

  constructor(
    url: string = process.env.REACT_APP_SUPABASE_URL || 'http://localhost:3000',
    anonKey: string = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
    projectId: string = '550e8400-e29b-41d4-a716-446655440000'
  ) {
    this.supabase = createClient(url, anonKey);
    this.projectId = projectId;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const { data, error } = await this.supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Requirements
  async getRequirements(): Promise<Requirement[]> {
    const { data, error } = await this.supabase
      .from('requirements')
      .select('*')
      .eq('project_id', this.projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createRequirement(requirement: Omit<Requirement, 'id' | 'created_at' | 'updated_at'>): Promise<Requirement> {
    const { data, error } = await this.supabase
      .from('requirements')
      .insert({ ...requirement, project_id: this.projectId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateRequirement(id: string, updates: Partial<Requirement>): Promise<Requirement> {
    const { data, error } = await this.supabase
      .from('requirements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteRequirement(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('requirements')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('project_id', this.projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const { data, error } = await this.supabase
      .from('tasks')
      .insert({ ...task, project_id: this.projectId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await this.supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteTask(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Architecture Nodes
  async getArchitectureNodes(): Promise<ArchitectureNode[]> {
    const { data, error } = await this.supabase
      .from('architecture_nodes')
      .select('*')
      .eq('project_id', this.projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createArchitectureNode(node: Omit<ArchitectureNode, 'id' | 'created_at' | 'updated_at'>): Promise<ArchitectureNode> {
    const { data, error } = await this.supabase
      .from('architecture_nodes')
      .insert({ ...node, project_id: this.projectId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateArchitectureNode(id: string, updates: Partial<ArchitectureNode>): Promise<ArchitectureNode> {
    const { data, error } = await this.supabase
      .from('architecture_nodes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteArchitectureNode(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('architecture_nodes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Screen Nodes
  async getScreenNodes(): Promise<ScreenNode[]> {
    const { data, error } = await this.supabase
      .from('screen_nodes')
      .select('*')
      .eq('project_id', this.projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createScreenNode(node: Omit<ScreenNode, 'id' | 'created_at' | 'updated_at'>): Promise<ScreenNode> {
    const { data, error } = await this.supabase
      .from('screen_nodes')
      .insert({ ...node, project_id: this.projectId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateScreenNode(id: string, updates: Partial<ScreenNode>): Promise<ScreenNode> {
    const { data, error } = await this.supabase
      .from('screen_nodes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteScreenNode(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('screen_nodes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('project_id', this.projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    const { data, error } = await this.supabase
      .from('notifications')
      .insert({ ...notification, project_id: this.projectId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    
    if (error) throw error;
  }

  // Real-time subscriptions
  subscribeToTasks(callback: (payload: any) => void) {
    return this.supabase
      .channel('tasks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks', filter: `project_id=eq.${this.projectId}` },
        callback
      )
      .subscribe();
  }

  subscribeToRequirements(callback: (payload: any) => void) {
    return this.supabase
      .channel('requirements')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'requirements', filter: `project_id=eq.${this.projectId}` },
        callback
      )
      .subscribe();
  }

  subscribeToNotifications(callback: (payload: any) => void) {
    return this.supabase
      .channel('notifications')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notifications', filter: `project_id=eq.${this.projectId}` },
        callback
      )
      .subscribe();
  }

  // Analytics and metrics
  async getProjectMetrics() {
    const [tasksResult, requirementsResult, notificationsResult] = await Promise.all([
      this.supabase
        .from('tasks')
        .select('status, priority, category')
        .eq('project_id', this.projectId),
      this.supabase
        .from('requirements')
        .select('status, priority, category')
        .eq('project_id', this.projectId),
      this.supabase
        .from('notifications')
        .select('read, type')
        .eq('project_id', this.projectId)
    ]);

    if (tasksResult.error) throw tasksResult.error;
    if (requirementsResult.error) throw requirementsResult.error;
    if (notificationsResult.error) throw notificationsResult.error;

    const tasks = tasksResult.data || [];
    const requirements = requirementsResult.data || [];
    const notifications = notificationsResult.data || [];

    return {
      tasks: {
        total: tasks.length,
        byStatus: tasks.reduce((acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byPriority: tasks.reduce((acc, task) => {
          acc[task.priority] = (acc[task.priority] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byCategory: tasks.reduce((acc, task) => {
          acc[task.category] = (acc[task.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      },
      requirements: {
        total: requirements.length,
        byStatus: requirements.reduce((acc, req) => {
          acc[req.status] = (acc[req.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byPriority: requirements.reduce((acc, req) => {
          acc[req.priority] = (acc[req.priority] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      },
      notifications: {
        total: notifications.length,
        unread: notifications.filter(n => !n.read).length,
        byType: notifications.reduce((acc, notif) => {
          acc[notif.type] = (acc[notif.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }
    };
  }

  // Migration from LocalStorage
  async migrateFromLocalStorage() {
    try {
      // Get data from localStorage
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const requirements = JSON.parse(localStorage.getItem('requirements') || '[]');
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');

      // Migrate tasks
      for (const task of tasks) {
        await this.createTask({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          category: task.category,
          assignee: task.assignee,
          labels: task.labels,
          due_date: task.dueDate,
          estimated_hours: task.estimatedHours,
          actual_hours: task.actualHours,
          progress: task.progress || 0,
          github_issue_id: task.githubIssueId,
          github_url: task.githubUrl,
          project_id: 'default' // Добавляем обязательное поле project_id
        });
      }

      // Migrate requirements
      for (const req of requirements) {
        await this.createRequirement({
          title: req.title,
          description: req.description,
          category: req.category,
          priority: req.priority,
          status: req.status,
          version: req.version || 1,
          project_id: 'default' // Добавляем обязательное поле project_id
        });
      }

      // Migrate notifications
      for (const notif of notifications) {
        await this.createNotification({
          title: notif.title,
          message: notif.message,
          type: notif.type,
          read: notif.read,
          project_id: 'default' // Добавляем обязательное поле project_id
        });
      }

      console.log('Migration completed successfully!');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }
}

export default SupabaseService;
