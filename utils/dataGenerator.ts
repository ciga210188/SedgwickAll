import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config();

export async function getAPIDetails(): Promise<{
  username: string | undefined;
  password: string | undefined;
  clientkey: string | undefined;
  intakekey: string | undefined;
}> {
  return {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    clientkey: process.env.CLIENT_KEY,
    intakekey: process.env.INTAKE_KEY,
  };
}

export class RandomDataUtil {
  static getCallerFirstName(): string {
    return faker.person.firstName();
  }

  static getCallerLastName(): string {
    return faker.person.lastName();
  }

  static getUserName(): string {
    return faker.internet.username();
  }

  static getPassword(): string {
    return faker.internet.password();
  }

  static async authLogin() {
    const apiDetails = await getAPIDetails();

    return {
      username: apiDetails.username,
      password: apiDetails.password,
    };
  }

  static async createIntake() {
    const apiDetails = await getAPIDetails();

    return {
      clientKey: apiDetails.clientkey,
      intakeKey: apiDetails.intakekey,
    };
  }
}
