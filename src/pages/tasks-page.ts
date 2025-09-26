import { Page } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * 🎭 TasksPage for OnlyTests Approach
 * Страница управления задачами в OnlyTests подходе
 */

export class TasksPage extends BasePage {
  // Локаторы
  private get newTaskButton() { 
    return this.page.getByRole('button', { name: 'New Task' }); 
  }
  
  private get taskTitleInput() { 
    return this.page.getByLabel('Task Title'); 
  }
  
  private get taskDescriptionInput() { 
    return this.page.getByLabel('Description'); 
  }
  
  private get prioritySelect() { 
    return this.page.getByRole('combobox', { name: 'Priority' }); 
  }
  
  private get saveTaskButton() { 
    return this.page.getByRole('button', { name: 'Save Task' }); 
  }
  
  private get getAIRecommendationsButton() { 
    return this.page.getByRole('button', { name: 'Get AI Recommendations' }); 
  }

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async navigate(): Promise<void> {
    await super.navigate('/tasks');
  }

  async createTask(title: string, description: string, priority: string = 'medium'): Promise<void> {
    await this.newTaskButton.click();
    await this.taskTitleInput.fill(title);
    await this.taskDescriptionInput.fill(description);
    await this.prioritySelect.selectOption(priority);
    await this.saveTaskButton.click();
  }

  async createTaskWithAI(title: string, description: string, priority: string = 'high'): Promise<void> {
    await this.newTaskButton.click();
    await this.taskTitleInput.fill(title);
    await this.taskDescriptionInput.fill(description);
    await this.prioritySelect.selectOption(priority);
    
    // AI рекомендации
    await this.getAIRecommendationsButton.click();
    await this.page.waitForSelector('[data-testid="ai-recommendations-complete"]', { timeout: 15000 });
    
    await this.saveTaskButton.click();
  }

  async getTaskByTitle(title: string): Promise<boolean> {
    try {
      await this.page.getByText(title).waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async updateTaskStatus(title: string, status: string): Promise<void> {
    await this.page.getByText(title).click();
    await this.page.getByRole('combobox', { name: 'Status' }).selectOption(status);
    await this.page.getByRole('button', { name: 'Update Task' }).click();
  }
}
