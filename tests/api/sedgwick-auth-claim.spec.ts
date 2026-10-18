/**
 * Covers Sedgwick authentication, claim creation, and claim submission.
 */
import path from 'node:path';
import Ajv from 'ajv';
import { test, expect, type APIRequestContext } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config({ override: true });

type AuthResponse = {
  Token: string | null;
  Validations: {
    UserName?: {
      Message: string;
    };
    [key: string]: unknown;
  };
  Warnings: Record<string, unknown>;
  IsValid: boolean;
};

type CreateClaimResponse = {
  RedirectUrl: string;
  AsyncProcessing: unknown;
  Type: string;
  State: string;
  IntakeInstanceId: string;
  ConfirmationNumber: string;
  IncidentNumber: string;
  Validations: Record<string, unknown>;
  Warnings: Record<string, unknown>;
  IsValid: boolean;
};

type SubmitClaimResponse = {
  IncidentNumber: string;
};

const apiBaseUrl = process.env.API_BASE_URL;
if (!apiBaseUrl) {
  throw new Error('API_BASE_URL must be configured.');
}

const API_BASE_URL = apiBaseUrl.endsWith('/') ? apiBaseUrl : `${apiBaseUrl}/`;
const Schemas = {
  auth: DataProvider.readJson(path.resolve(process.cwd(), 'api', 'schemas', 'auth_Schema.json')),
  create: DataProvider.readJson(path.resolve(process.cwd(), 'api', 'schemas', 'create_Schema.json')),
  submit: DataProvider.readJson(path.resolve(process.cwd(), 'api', 'schemas', 'submit_Schema.json')),
  authResponse: DataProvider.readJson(
    path.resolve(process.cwd(), 'api', 'schemas', 'auth_response_schema.json'),
  ),
  createClaimResponse: DataProvider.readJson(
    path.resolve(process.cwd(), 'api', 'schemas', 'create_claim_response_schema.json'),
  ),
};
const ajv = new Ajv();
const validateAuthResponse = ajv.compile<AuthResponse>(Schemas.authResponse);
const validateCreateClaimResponse = ajv.compile<CreateClaimResponse>(Schemas.createClaimResponse);

function getEndpoint(route: string): string {
  return new URL(route, API_BASE_URL).toString();
}

function getRequiredValue(value: string | undefined, name: string): string {
  if (!value?.trim()) {
    throw new Error(`${name} must be configured.`);
  }

  return value;
}

function getAuthToken(responseBody: AuthResponse): string {
  const token = responseBody.Token;
  expect(token, 'A successful login must return a token string.').toEqual(expect.any(String));
  expect(token, 'The authentication token must not be empty.').not.toBe('');

  if (typeof token !== 'string' || token.length === 0) {
    throw new Error('The authentication response did not contain a usable token.');
  }

  return token;
}

async function loginAndGetToken(request: APIRequestContext): Promise<string> {
  const { username, password } = await RandomDataUtil.authLogin();
  const loginRequestBody = {
    ...Schemas.auth,
    username: getRequiredValue(username, 'USERNAME'),
    password: getRequiredValue(password, 'PASSWORD'),
  };
  const response = await request.post(getEndpoint(Routes.AUTH_LOGIN), {
    data: loginRequestBody,
  });

  expect(response.status(), 'Valid credentials should return HTTP 200.').toBe(200);

  const responseBody = (await response.json()) as AuthResponse;
  const matchesSchema = validateAuthResponse(responseBody);
  expect(
    matchesSchema,
    `Login response should match the authentication schema: ${JSON.stringify(validateAuthResponse.errors)}`,
  ).toBeTruthy();
  expect(responseBody.IsValid, 'The API should authenticate the request.').toBe(true);

  return getAuthToken(responseBody);
}

test.describe('Sedgwick authentication and claim API @api', () => {
  test('POST - Successful login returns an authentication token @master @sanity @api', async ({
    request,
  }) => {
    const token = await loginAndGetToken(request);
    expect(token, 'A successful login should return a non-empty token.').not.toBe('');
  });

  test('POST - Invalid login returns the expected credential error @master @regression @api', async ({
    request,
  }) => {
    const authRequestBody = {
      ...Schemas.auth,
      username: RandomDataUtil.getUserName(),
      password: RandomDataUtil.getPassword(),
    };

    const response = await request.post(getEndpoint(Routes.AUTH_LOGIN), {
      data: authRequestBody,
    });

    expect(response.status(), 'Invalid credentials should return HTTP 400.').toBe(400);

    const responseBody = (await response.json()) as AuthResponse;
    const isValidResponse = validateAuthResponse(responseBody);
    expect(
      isValidResponse,
      `Login error response should match the authentication schema: ${JSON.stringify(validateAuthResponse.errors)}`,
    ).toBeTruthy();
    expect(responseBody.IsValid, 'The API should mark invalid credentials as invalid.').toBe(false);
    expect(responseBody.Token, 'Invalid credentials must not return an authentication token.').toBeNull();
    expect(
      responseBody.Validations.UserName?.Message,
      'The API should explain that the credentials are invalid.',
    ).toBe('Invalid credential.');
  });

  test('POST - Create claim returns a redirect URL @master @regression @end-to-end @api', async ({
    request,
  }) => {
    const token = await loginAndGetToken(request);

    const { clientKey: configuredClientKey, intakeKey: configuredIntakeKey } =
      await RandomDataUtil.createIntake();
    const createClaimRequestBody = {
      ...Schemas.create,
      ClientKey: getRequiredValue(configuredClientKey, 'CLIENT_KEY'),
      IntakeKey: getRequiredValue(configuredIntakeKey, 'INTAKE_KEY'),
    };
    const claimResponse = await request.post(getEndpoint(Routes.POST_CREATE_CLAIM), {
      data: createClaimRequestBody,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(claimResponse.status(), 'A valid claim request should return HTTP 200.').toBe(200);

    const claimResponseBody = (await claimResponse.json()) as CreateClaimResponse;
    const isValidClaimResponse = validateCreateClaimResponse(claimResponseBody);
    expect(
      isValidClaimResponse,
      `Claim response should match the create-claim schema: ${JSON.stringify(validateCreateClaimResponse.errors)}`,
    ).toBeTruthy();
    expect(claimResponseBody.IsValid, 'The API should mark the claim request as valid.').toBe(true);
    expect(() => new URL(claimResponseBody.RedirectUrl), 'The claim redirect must be a valid URL.').not.toThrow();

    console.log(`Generated claim URL: ${claimResponseBody.RedirectUrl}`);
  });

  test('POST - Submit claim returns an incident number @master @regression @end-to-end @api', async ({
    request,
  }) => {
    const token = await loginAndGetToken(request);

    const submitResponse = await request.post(getEndpoint(Routes.POST_SUBMIT_CLAIM), {
      data: Schemas.submit,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(submitResponse.status(), 'A valid claim submission should return HTTP 200.').toBe(200);

    const submitResponseBody = (await submitResponse.json()) as SubmitClaimResponse;
    expect(
      submitResponseBody.IncidentNumber,
      'The submitted claim response should contain a non-empty IncidentNumber.',
    ).toEqual(expect.any(String));
    expect(
      submitResponseBody.IncidentNumber,
      'The submitted claim response should contain a non-empty IncidentNumber.',
    ).not.toBe('');

    console.log(`IncidentNumber: ${submitResponseBody.IncidentNumber}`);
  });
});
