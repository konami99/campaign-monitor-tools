import { Handler, Context } from 'aws-lambda';
import Client from './models/client';
import Campaign from './models/campaign';
import slackService from './services/slackService';
import campaignMonitorService from './services/campaignMonitorService';

export const getScheduledCampaigns: Handler = async (_event: any, _context: Context) => {
  const response = await campaignMonitorService.getClients();

  var clients: Client[] = [];
  response.forEach(element => {
    clients.push({ clientID: element.ClientID, name: element.Name });
  });
  
  var campaigns: Campaign[] = [];
  for (const client of clients) {
    const clientCampaigns = await campaignMonitorService.getScheduledCampaigns(client.clientID);
    campaigns = campaigns.concat(campaignMonitorService.toCampaignObject(client, clientCampaigns));
  }
  /*
  {
    dateScheduled: '2021-07-19 12:30:00',
    scheduledTimeZone: '(GMT+10:00) Canberra, Melbourne, Sydney',
    campaignID: '78034b9198c7f3d62d1c3148191dc633',
    name: 'DJ21 - F2F 4 - Has Raised - 19.07.21'
  },
  */
  for (const campaign of campaigns) {
    const response = await campaignMonitorService.getCampaignDetails(campaign.campaignID);
    campaign.numberOfRecipients = response.Recipients;
  }

  const campaignsOverThreshold = campaigns.filter(campaignMonitorService.campaignFilter);
  campaignsOverThreshold.sort(campaignMonitorService.sortCampaigns);
  
  await slackService.post(
    campaignMonitorService.serializeCampaigns(campaignsOverThreshold)
  );
  
  return {
    statusCode: 200,
  };
};

