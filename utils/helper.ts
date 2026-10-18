import dotenv from 'dotenv';

dotenv.config();

export class Helper {
  static async getLoginDetails(): Promise<{
    username: string;
    password: string;
  }> {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be configured.');
    }

    return {
      username,
      password,
    };
  }

  static getClientDetails(): { clientId: string; clientName: string } {
    return {
      clientId: '2807',
      clientName: "LOWE'S COMPANIES, INC",
    };
  }
}
