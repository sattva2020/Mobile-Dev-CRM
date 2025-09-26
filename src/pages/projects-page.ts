import { Page } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * 🎭 ProjectsPage for OnlyTests Approach
 * Страница управления проектами в OnlyTests подходе
 */

export class ProjectsPage extends BasePage {
  // Локаторы
  private get newProjectButton() { 
    return this.page.getByRole('button', { name: 'New Project' }); 
  }
  
  private get projectNameInput() { 
    return this.page.getByLabel('Project Name'); 
  }
  
  private get projectDescriptionInput() { 
    return this.page.getByLabel('Description'); 
  }
  
  private get prioritySelect() { 
    return this.page.getByRole('combobox', { name: 'Priority' }); 
  }
  
  private get saveProjectButton() { 
    return this.page.getByRole('button', { name: 'Save Project' }); 
  }
  
  private get analyzeWithAIButton() { 
    return this.page.getByRole('button', { name: 'Analyze with AI' }); 
  }

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async navigate(): Promise<void> {
    await super.navigate('/projects');
  }

  async createProject(name: string, description: string, priority: string = 'medium'): Promise<void> {
    await this.newProjectButton.click();
    await this.projectNameInput.fill(name);
    await this.projectDescriptionInput.fill(description);
    await this.prioritySelect.selectOption(priority);
    await this.saveProjectButton.click();
  }

  async createProjectWithAI(name: string, description: string, priority: string = 'high'): Promise<void> {
    await this.newProjectButton.click();
    await this.projectNameInput.fill(name);
    await this.projectDescriptionInput.fill(description);
    await this.prioritySelect.selectOption(priority);
    
    // AI анализ
    await this.analyzeWithAIButton.click();
    await this.page.waitForSelector('[data-testid="ai-analysis-complete"]', { timeout: 15000 });
    
    await this.saveProjectButton.click();
  }

  async getProjectByName(name: string): Promise<boolean> {
    try {
      await this.page.getByText(name).waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async deleteProject(name: string): Promise<void> {
    await this.page.getByText(name).click();
    await this.page.getByRole('button', { name: 'Delete Project' }).click();
    await this.page.getByRole('button', { name: 'Confirm Delete' }).click();
  }
}
