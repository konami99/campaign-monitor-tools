import { getScheduledCampaigns } from '../../src/handler';
import slackService from '../../src/services/slackService';
import campaignMonitorService from '../../src/services/campaignMonitorService';
import axios from 'axios';

jest.mock('axios');

describe('no clients', () => {
  test('pass a message of "no campaigns" to slack', async () => {
    const postMock = jest.fn();
    campaignMonitorService.getClients = jest.fn().mockResolvedValue([]);
    slackService.slackWebhookPathAP = jest.fn().mockResolvedValue('/services/pathToAPEndpoint');
    axios.create = jest.fn().mockReturnValue({
      post: postMock
    });

    const event = {};
    const context: any = null;
    const callback = jest.fn();
    await getScheduledCampaigns(event, context, callback);

    expect(postMock).toHaveBeenCalledWith(
      "/services/pathToAPEndpoint",
      {
        "blocks": [
          {
            "text": {
              "text": "```No scheduled campaigns (lower threshold: 1,000)\n```",
              "type": "mrkdwn"
            },
            "type": "section"
          }
        ]
      }
    );
  });
});