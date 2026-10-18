# OpenCart Frontend Store – Web Test Scenarios

**Application URL:** `https://intake-qa1.sedgwick.com/`

Implement these scenarios following the framework conventions defined in `playwright-mcp-context.md`.

---

# 1. Valid Login Flow

Validate successful customer login.

1. Open the application.
2. Navigate to WEB_APP_URL from ev file.
3. Click on Accept All Cookies Dialog
4. Verify that the login page is displayed.
5. Enter valid customer credentials from env file: ADMIN_USERNAME and ADMIN_PASSWORD
6. Click on BEGIN button.
7. Verify successful authentication.
8. Verify that the account dashboard or appropriate authenticated account navigation is visible.

## Expected Result

Valid credentials are accepted and the customer reaches the authenticated My Account area.

---

# 2. Valid and Invalid Login Flow

Verify login failure with invalid customer credentials.

1. Open the application.
2. Navigate to WEB_APP_URL from ev file.
3. Click on Accept All Cookies Dialog
4. Enter credentials from test data given in testdata/..csv file using 'parse-csv'
4. Click on BEGIN button.
5. Validate Login details failed: Error message should contain "Following 2 error(s) were found"
6. Verify the appropriate warning/error message.
7. Verify that the customer is not authenticated.


## Expected Result

The invalid login is rejected and the expected error message should containg the message described in step 5

---

# 3. Logout Flow

Validate customer logout.

1. Open the application.
2. Navigate to WEB_APP_URL from ev file.
3. Click on Accept All Cookies Dialog
4. Log in using valid customer credentials from env file: ADMIN_USERNAME and ADMIN_PASSWORD
5. Verify that authentication succeeds.
6. Navigate to the header navigation bar.
7. Click **Logout**.
8. Verify "Login" title is displayed


## Expected Result

The customer is logged out successfully

---

# 4. Go to Client Management

Validate product search.

1. Open the application.
2. Navigate to WEB_APP_URL from ev file.
3. Click on Accept All Cookies Dialog
4. Verify that the login page is displayed.
5. Enter valid customer credentials from env file: ADMIN_USERNAME and ADMIN_PASSWORD
6. Click on BEGIN button.
7. Verify successful authentication.
8. Verify that the account dashboard or appropriate authenticated account navigation is visible.
9. Validate that in th left Menu exists "Client Management" option
10. CLick on "Client Management"
11. Validate Text/Title "Clients" is visible
12. In "Filter Results" search for client "2807"
13. Validate Text "LOWE'S COMPANIES, INC" is visible 
14. Click in href link from the same row to edit Client
15. Validate text "Summary" is visible in the clientNavigation bar

## Expected Result

The search returns the expected Client and user enters to Client Configuration

