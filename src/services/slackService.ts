import ssmService from './SsmService';

export default class slackService {
  public static baseURL(): string {
    return 'https://hooks.slack.com';
  }

  public static slackWebhookPathAP() {
    return ssmService.getParameter('SLACK_WEBHOOK_PATH_AP');
  }
}