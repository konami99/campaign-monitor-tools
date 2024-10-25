import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

export default class SsmService {
  public static async getParameter(name: string): Promise<string> {
    const command = new GetParameterCommand({
      Name: name,
      WithDecryption: true, // Set to true if the parameter is encrypted
    });

    const result = await this.ssm().send(command);
    return result.Parameter.Value;
  }

  private static ssm(): SSMClient {
    return new SSMClient({ region: 'us-west-2' });
  }
}