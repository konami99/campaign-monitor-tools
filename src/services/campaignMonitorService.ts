import axios from 'axios';
import { DateTime } from 'luxon';
import Campaign from '../models/campaign';
import Client from '../models/client';
import ssmService from './SsmService';

export default class CampaignMonitorService {
  public static campaignFilter(campaign: Campaign) {
    return campaign.numberOfRecipients > 1000;
  }

  public static sortCampaigns(campaign1: Campaign, campaign2: Campaign) {
    if (campaign1.dateScheduledObject < campaign2.dateScheduledObject) return -1;
    return 1;
  }

  private static baseURL() {
    return 'https://api.createsend.com';
  }

  public static async getClients() {
    const apiKey = await ssmService.getParameter('CAMPAIGN_MONITOR_ADMIN_API_KEY');
    const result = await axios
                    .create({
                      baseURL: this.baseURL(),
                      headers: { 'Authorization': `Basic ${apiKey}` }
                    })
                    .get('/api/v3.2/clients.json');
    return result.data;
  }

  public static async getScheduledCampaigns(clientID: string) {
    const apiKey = await ssmService.getParameter('CAMPAIGN_MONITOR_ADMIN_API_KEY');
    const result = await axios
                    .create({
                      baseURL: this.baseURL(),
                      headers: { 'Authorization': `Basic ${apiKey}` }
                    })
                    .get(`/api/v3.2/clients/${clientID}/scheduled.json`);
    return result.data;
  }

  public static async getCampaignDetails(campaignID: string) {
    const apiKey = await await ssmService.getParameter('CAMPAIGN_MONITOR_ADMIN_API_KEY');
    const result = await axios
                    .create({
                      baseURL: this.baseURL(),
                      headers: { 'Authorization': `Basic ${apiKey}` }
                    })
                    .get(`/api/v3.2/campaigns/${campaignID}/summary.json`);
    return result.data;
  }

  public static serializeCampaigns(campaigns: Campaign[]): string {
    return campaigns.reduce((accumulator, currentCampaign) => {
      return accumulator += `${currentCampaign.clientName}\n` +
                            `${currentCampaign.localDateScheduledObject.toString()}\n` +
                            `${currentCampaign.name}\n` +
                            `${currentCampaign.numberOfRecipients}\n\n`;
    }, '');
  
  }

  public static toCampaignObject(client: Client, campaigns: any): Campaign[] {
    return campaigns.reduce((accumulator: Campaign[], currentCampaign: any) => {
      const gmt = currentCampaign.ScheduledTimeZone.match(/\(GMT(.*)\)/);
      const timezoneOffset = gmt[1];
      const datetime = currentCampaign.DateScheduled.match(/(.*)\s(.*)/);
      const date = datetime[1];
      const time = datetime[2];
      const isoTime = `${date}T${time}${timezoneOffset}`;
      const dateTimeObject = DateTime.fromISO(isoTime, { setZone: true });
      const localdateTimeObject = dateTimeObject.setZone('UTC+10');
      accumulator.push(
        {
          clientName: client.name,
          dateScheduled: currentCampaign.DateScheduled,
          scheduledTimeZone: currentCampaign.ScheduledTimeZone,
          campaignID: currentCampaign.CampaignID,
          name: currentCampaign.Name,
          timezoneOffset: timezoneOffset,
          dateScheduledObject: dateTimeObject,
          localDateScheduledObject: localdateTimeObject
        } as Campaign
      )
      return accumulator;
    }, []);
  }
}