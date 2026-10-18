import type { Locator, Page } from '@playwright/test';

export class ClientSummaryPage {
  private readonly page: Page;

  // Locators
  private readonly summaryTab: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.summaryTab = page.getByRole('tab', { name: 'Summary', exact: true });
  }

  /**
   * Verifies that the client's Summary navigation is visible.
   * @returns true when the Summary tab is visible
   */
  async isSummaryTabVisible(): Promise<boolean> {
    await this.summaryTab.waitFor({ state: 'visible' });
    return this.summaryTab.isVisible();
  }
}
