# FakeStore REST API – API Test Prompts

**Base URL:** `https://intake-qa1.sedgwick.com/api/`

## Common Requirements

For every prompt:

- Create a **Playwright API test using TypeScript**.
- Use the existing Playwright project/framework structure.
- Use Playwright's `request` fixture / APIRequestContext according to the existing project framework.
- Use the existing `Routes` constants when the project already defines them.
- Do not invent route names that are not present in the project.
- Keep request construction, response parsing, and assertions clear for beginners.
- Validate status codes, response structure, and important business fields.
- Add meaningful test and assertion messages.
- Avoid weak assertions such as checking only that a response exists.
- Use API response data as input to later operations in workflow tests.
- Keep independent tests independent; do not rely on another test's execution order unless the prompt explicitly requires a workflow.
- For CRUD tests, use deterministic test data and capture returned IDs.
- Where the API's behavior is not guaranteed by the supplied test material, validate the response contract rather than adding unsupported assumptions.

---

# Authentication

## 1. Successful Login

Create a Playwright API test using TypeScript to verify successful authentication.

1. Use `AUTH_LOGIN` from `Routes`.
2. Use auth Schema from `Schemas` 
3. Send a POST request with valid USERNAME and PASSWORD from env file.
4. Verify status code `200`.
5. Parse the JSON response.
6. Verify that `token` exists.
7. Verify that `token` is a non-empty string.

### Expected Result

Status `200` is returned and a non-empty authentication token is provided.

---

## 2. Invalid Login

Create a Playwright API test using TypeScript to verify authentication failure.

1. Use `AUTH_LOGIN` from `Routes`.
2. Use auth Schema from `Schemas` 
3. Add and Send fake values from dataGenerator: username and password.
4. Verify status code `400`.
5. Parse the response.
6. Verify the error message is:

`Invalid credential.`

### Expected Result

Status `400` is returned with the expected authentication error.

---

# Create Claim API

## 3. Create Claim

Create a Playwright API test using TypeScript to verify successful claim creation.

1. Use `AUTH_LOGIN` from `Routes`.
2. Use auth_Schema from `Schemas` 
3. Send a POST request with valid `USERNAME` and `PASSWORD` from env file.
4. Verify status code `200`.
5. Parse the JSON response.
6. Verify that `token` exists.
7. Verify that `token` is a non-empty string.
8. Use `POST_CREATE_CLAIM` from `Routes`.
9. Use create_Schema from `Schemas` 
10. Send a POST request with valid `CLIENT_KEY` and `INTAKE_KEY` from env file to the schema
11. Verify status code `200`.
12. Parse the JSON response.
13. Print in Console url generated in response

### Expected Result

Status `200` is returned and a url is generated to start a claim

---

# Submit Claim API

## 4. Submit Claim

Create a Playwright API test using TypeScript to verify successful claim creation.

1. Use `AUTH_LOGIN` from `Routes`.
2. Use auth_Schema from `Schemas` 
3. Send a POST request with valid `USERNAME` and `PASSWORD` from env file.
4. Verify status code `200`.
5. Parse the JSON response.
6. Verify that `token` exists.
7. Verify that `token` is a non-empty string.
8. Use `POST_SUBMIT_CLAIM` from `Routes`.
9. Use submit Schema from `Schemas` as it is in the file
10. Send the requets
11. Verify status code `200`.
12. Parse the JSON response.
13. Print "IncidentNumber" in console

### Expected Result

Status `200` is returned and claim is successfully generated