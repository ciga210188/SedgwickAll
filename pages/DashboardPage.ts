import type { Locator, Page } from '@playwright/test';

export class DashboardPage {
  private readonly page: Page;

  // Locators
  private readonly logoutControl: Locator;
  private readonly sidebarToggle: Locator;
  private readonly clientManagementLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.logoutControl = page.locator('#header-navbar').getByText('Logout', { exact: true });
    this.sidebarToggle = page.locator('a.button-collapse');
    this.clientManagementLink = page.getByText('Client Management', { exact: true });
  }

  /**
   * Verifies that the dashboard page is displayed.
   * @returns true when the page title is Dashboard
   */
  async isDashboardPageDisplayed(): Promise<boolean> {
    await this.page.waitForURL(/\/Dashboard(?:[?#]|$)/, { waitUntil: 'domcontentloaded' });
    return (await this.page.title()) === 'Dashboard';
  }

  /**
   * Verifies that authenticated navigation is visible.
   * @returns true when the logout control is visible
   */
  async isAuthenticatedNavigationVisible(): Promise<boolean> {
    return this.logoutControl.isVisible();
  }

  /**
   * Waits for the authenticated header navigation to appear.
   */
  async waitForAuthenticatedNavigation(): Promise<void> {
    await this.logoutControl.waitFor({ state: 'visible' });
  }

  /**
   * Opens Client Management from the collapsed dashboard sidebar.
   */
  async openClientManagement(): Promise<void> {
    try {
      await this.sidebarToggle.click();
      await this.clientManagementLink.click();
    } catch (error) {
      console.log(`Unable to open Client Management: ${error}`);
      throw error;
    }
  }

  /**
   * Logs out through the authenticated header navigation.
   */
  async logout(): Promise<void> {
    await this.logoutControl.click();
  }
}
