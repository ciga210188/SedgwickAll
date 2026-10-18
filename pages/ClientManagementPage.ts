import type { Locator, Page } from '@playwright/test';

export class ClientManagementPage {
  private readonly page: Page;

  // Locators
  private readonly clientsTab: Locator;
  private readonly filterResultsInput: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.clientsTab = page.getByRole('tab', { name: 'Clients', exact: true });
    this.filterResultsInput = page.getByRole('searchbox', { name: 'Filter Results' });
  }

  /**
   * Verifies that the Clients view is displayed.
   * @returns true when the Clients tab is visible
   */
  async isClientsViewDisplayed(): Promise<boolean> {
    await this.clientsTab.waitFor({ state: 'visible' });
    return this.clientsTab.isVisible();
  }

  /**
   * Filters clients by the supplied search value.
   * @param searchValue - Client identifier or name
   */
  async searchClients(searchValue: string): Promise<void> {
    await this.filterResultsInput.fill(searchValue);
  }

  /**
   * Verifies that a matching client is visible in the results.
   * @param clientName - Expected client name
   * @returns true when the client name appears in a result cell
   */
  async isClientVisible(clientName: string): Promise<boolean> {
    const clientCell = this.page.getByRole('cell', { name: clientName, exact: true });
    await clientCell.waitFor({ state: 'visible' });
    return clientCell.isVisible();
  }

  /**
   * Opens the matching client's summary page.
   * @param clientName - Client name identifying the result row
   */
  async openClientSummary(clientName: string): Promise<void> {
    try {
      await this.page
        .getByRole('row')
        .filter({ hasText: clientName })
        .getByRole('link')
        .click();
    } catch (error) {
      console.log(`Unable to open the summary for ${clientName}: ${error}`);
      throw error;
    }
  }
}
