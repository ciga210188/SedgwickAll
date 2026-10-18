import { test as base } from '@playwright/test';
import dotenv from 'dotenv';
import { ClientManagementPage } from '../pages/ClientManagementPage';
import { ClientSummaryPage } from '../pages/ClientSummaryPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';

dotenv.config();

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  clientManagementPage: ClientManagementPage;
  clientSummaryPage: ClientSummaryPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    const appUrl = process.env.WEB_APP_URL;
    if (!appUrl) {
      throw new Error('WEB_APP_URL must be configured.');
    }

    await page.goto(appUrl, { waitUntil: 'domcontentloaded' });
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  clientManagementPage: async ({ page }, use) => {
    await use(new ClientManagementPage(page));
  },
  clientSummaryPage: async ({ page }, use) => {
    await use(new ClientSummaryPage(page));
  },
});

export { expect } from '@playwright/test';
