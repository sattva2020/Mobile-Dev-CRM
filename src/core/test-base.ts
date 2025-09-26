import { test as base } from '@playwright/test';
import { ProjectsPage } from '../pages/projects-page';
import { TasksPage } from '../pages/tasks-page';
import { AISettingsPage } from '../pages/ai-settings-page';
import { env } from '../config/environment';

/**
 * 🎭 Test Base with Fixtures for OnlyTests Approach
 * Базовые тесты с фикстурами для OnlyTests подхода
 */

type CRMFixtures = {
  projectsPage: ProjectsPage;
  tasksPage: TasksPage;
  aiSettingsPage: AISettingsPage;
};

export const test = base.extend<CRMFixtures>({
  projectsPage: async ({ page }, use) => {
    const projectsPage = new ProjectsPage(page, env.getBaseUrl());
    await use(projectsPage);
  },

  tasksPage: async ({ page }, use) => {
    const tasksPage = new TasksPage(page, env.getBaseUrl());
    await use(tasksPage);
  },

  aiSettingsPage: async ({ page }, use) => {
    const aiSettingsPage = new AISettingsPage(page, env.getBaseUrl());
    await use(aiSettingsPage);
  },
});

export { expect } from '@playwright/test';
