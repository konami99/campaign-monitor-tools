import ssmService from './SsmService';
import axios from 'axios';

export default class slackService {
  public static baseURL(): string {
    return 'https://hooks.slack.com';
  }

  public static slackWebhookPathAP() {
    return ssmService.getParameter('SLACK_WEBHOOK_PATH_AP');
  }

  public static async post(message: string) {
    message = message || 'no campaigns';
    await axios
    .create({
      baseURL: this.baseURL(),
      headers: { 'Content-type':' application/json' }
    })
    .post(
      await this.slackWebhookPathAP(),
      {
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `\`\`\`${message}\`\`\``
            }
          }
        ]
      }
    )
  }
}