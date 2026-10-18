/**
 * Covers customer login, logout, and Client Management using the shared page fixtures.
 */
import path from 'node:path';
import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';
import { Helper } from '../../utils/helper';

type LoginDataRow = {
  testName: string;
  email: string;
  password: string;
  expected: string;
};

const loginData: LoginDataRow[] = DataProvider.readCsv(
  path.resolve(process.cwd(), 'testdata', 'opencart_logindata.csv'),
) as LoginDataRow[];
const invalidLoginData = loginData.filter((row) => row.expected.toLowerCase() === 'failure');

if (invalidLoginData.length === 0) {
  throw new Error('The login CSV must contain at least one failure test case.');
}

test.describe('Sedgwick web scenarios', () => {
  // These scenarios use the same configured account, so login/logout must not overlap.
  test.describe.configure({ mode: 'serial' });

  test('Valid customer login @master @sanity @regression @web', async ({ loginPage, dashboardPage }) => {
    const { username, password } = await Helper.getLoginDetails();

    await test.step('1) Open the application, accept cookies, and verify the login page', async () => {
      await loginPage.acceptAllCookies();
      expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
    });

    await test.step('2) Enter valid credentials and click BEGIN', async () => {
      await loginPage.login(username, password);
    });

    await test.step('3) Verify successful authentication and account navigation', async () => {
      expect(await dashboardPage.isDashboardPageDisplayed()).toBeTruthy();
      await dashboardPage.waitForAuthenticatedNavigation();
      expect(await dashboardPage.isAuthenticatedNavigationVisible()).toBeTruthy();
    });

    console.log('✅ Valid customer login completed successfully!');
  });

  for (const data of invalidLoginData) {
    test(`${data.testName} rejects invalid credentials @master @regression @datadriven @web`, async ({
      loginPage,
      dashboardPage,
    }) => {
      await test.step('1) Open the application, accept cookies, and verify the login page', async () => {
        await loginPage.acceptAllCookies();
        expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
      });

      await test.step('2) Submit the invalid credentials from the CSV test data', async () => {
        await loginPage.login(data.email, data.password);
      });

      await test.step('3) Verify the expected login error and confirm the user is not authenticated', async () => {
        const errorMessage = await loginPage.getLoginErrorText();
        expect(errorMessage).toContain('Following 2 error(s) were found');
        expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
        expect(await dashboardPage.isAuthenticatedNavigationVisible()).toBeFalsy();
      });

      console.log(`✅ ${data.testName} rejection completed successfully!`);
    });
  }

  test('Customer logout @master @sanity @regression @web', async ({ loginPage, dashboardPage }) => {
    const { username, password } = await Helper.getLoginDetails();

    await test.step('1) Open the application, accept cookies, and verify the login page', async () => {
      await loginPage.acceptAllCookies();
      expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
    });

    await test.step('2) Log in with valid customer credentials', async () => {
      await loginPage.login(username, password);
    });

    await test.step('3) Verify authentication and click Logout in the header navigation', async () => {
      expect(await dashboardPage.isDashboardPageDisplayed()).toBeTruthy();
      await dashboardPage.waitForAuthenticatedNavigation();
      expect(await dashboardPage.isAuthenticatedNavigationVisible()).toBeTruthy();
      await dashboardPage.logout();
    });

    await test.step('4) Verify the Login title is displayed after logout', async () => {
      expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
    });

    console.log('✅ Customer logout completed successfully!');
  });

  test('Search and open a client from Client Management @master @regression @end-to-end @web', async ({
    loginPage,
    dashboardPage,
    clientManagementPage,
    clientSummaryPage,
  }) => {
    const { username, password } = await Helper.getLoginDetails();
    const { clientId, clientName } = Helper.getClientDetails();

    await test.step('1) Open the application, accept cookies, and verify the login page', async () => {
      await loginPage.acceptAllCookies();
      expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
    });

    await test.step('2) Log in and verify successful authentication', async () => {
      await loginPage.login(username, password);
      expect(await dashboardPage.isDashboardPageDisplayed()).toBeTruthy();
      await dashboardPage.waitForAuthenticatedNavigation();
      expect(await dashboardPage.isAuthenticatedNavigationVisible()).toBeTruthy();
    });

    await test.step('3) Open Client Management and verify the Clients view', async () => {
      await dashboardPage.openClientManagement();
      expect(await clientManagementPage.isClientsViewDisplayed()).toBeTruthy();
    });

    await test.step('4) Search for the client and verify the expected result', async () => {
      await clientManagementPage.searchClients(clientId);
      expect(await clientManagementPage.isClientVisible(clientName)).toBeTruthy();
    });

    await test.step('5) Open the client and verify the Summary navigation', async () => {
      await clientManagementPage.openClientSummary(clientName);
      expect(await clientSummaryPage.isSummaryTabVisible()).toBeTruthy();
    });

    console.log('✅ Client Management search completed successfully!');
  });
});
