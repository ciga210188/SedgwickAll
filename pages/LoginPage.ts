import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;

  // Locators
  private readonly loginHeading: Locator;
  private readonly acceptAllCookiesButton: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly beginButton: Locator;
  private readonly loginError: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.loginHeading = page.getByRole('heading', { name: 'Login', exact: true });
    this.acceptAllCookiesButton = page.getByRole('button', { name: 'Accept All Cookies', exact: true });
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.beginButton = page.getByRole('button', { name: 'BEGIN', exact: true });
    this.loginError = page.getByRole('alert');
  }

  /**
   * Accepts the application's cookie consent dialog.
   */
  async acceptAllCookies(): Promise<void> {
    await this.acceptAllCookiesButton.click();
  }

  /**
   * Verifies that the login page is displayed.
   * @returns true when the login heading is visible
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    await this.loginHeading.waitFor({ state: 'visible' });
    return this.loginHeading.isVisible();
  }

  /**
   * Submits the supplied credentials.
   * @param username - Account username
   * @param password - Account password
   */
  async login(username: string, password: string): Promise<void> {
    try {
      await this.usernameInput.fill(username);
      await this.passwordInput.fill(password);
      await this.beginButton.click();
    } catch (error) {
      console.log(`Unable to submit login credentials: ${error}`);
      throw error;
    }
  }

  /**
   * Reads the validation message displayed after a failed login.
   * @returns The visible login alert text
   */
  async getLoginErrorText(): Promise<string> {
    return this.loginError.innerText();
  }
}
