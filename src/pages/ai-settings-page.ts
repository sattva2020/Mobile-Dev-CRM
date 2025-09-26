import { Page } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * 🎭 AISettingsPage for OnlyTests Approach
 * Страница настроек AI в OnlyTests подходе
 */

export class AISettingsPage extends BasePage {
  // Локаторы
  private get testOpenRouterButton() { 
    return this.page.getByRole('button', { name: 'Test OpenRouter Connection' }); 
  }
  
  private get testLMStudioButton() { 
    return this.page.getByRole('button', { name: 'Test LM Studio Connection' }); 
  }
  
  private get testXAIButton() { 
    return this.page.getByRole('button', { name: 'Test xAI Connection' }); 
  }

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async navigate(): Promise<void> {
    await super.navigate('/ai-settings');
  }

  async testOpenRouterConnection(): Promise<boolean> {
    await this.testOpenRouterButton.click();
    try {
      await this.page.getByText('OpenRouter: Connected').waitFor({ timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async testLMStudioConnection(): Promise<boolean> {
    await this.testLMStudioButton.click();
    try {
      await this.page.getByText('LM Studio: Connected').waitFor({ timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async testXAIConnection(): Promise<boolean> {
    await this.testXAIButton.click();
    try {
      await this.page.getByText('xAI: Connected').waitFor({ timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async testAllAIServices(): Promise<{ openrouter: boolean; lmstudio: boolean; xai: boolean }> {
    const openrouter = await this.testOpenRouterConnection();
    const lmstudio = await this.testLMStudioConnection();
    const xai = await this.testXAIConnection();
    
    return { openrouter, lmstudio, xai };
  }
}
