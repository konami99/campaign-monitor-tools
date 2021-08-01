import { SSM } from 'aws-sdk';

export default class SsmService {
  public static async getParameter(name: string): Promise<string> {
    const result = await this.ssm().getParameter({ Name: name, WithDecryption: true }).promise();
    return result.Parameter.Value;
  }

  private static ssm(): SSM {
    return new SSM({ region: 'us-west-2' });
  }
}