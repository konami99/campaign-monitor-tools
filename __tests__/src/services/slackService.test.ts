import slackService from '../../../src/services/slackService';

jest.mock('aws-sdk', () => {
  return {
    SSM: jest.fn(() => {
      return {
        getParameter: () => {
          return {
            promise: () => {
              return new Promise((resolve, _reject) => {
                resolve({
                  Parameter: {
                    Value: '12345'
                  }
                })
              });
            }
          }
        }
      };
    }),
  }
});

describe('slackWebhookPathAP', () => {
  it('gets value from Parameter Store', async () => {
    await expect(slackService.slackWebhookPathAP()).resolves.toEqual('12345');
  });
});
