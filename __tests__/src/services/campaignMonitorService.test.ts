import { DateTime } from "luxon";
import Campaign from '../../../src/models/campaign';
import campaignMonitorService from '../../../src/services/campaignMonitorService';

describe('campaignFilter', () => {
  const campaigns: Campaign[] = [
    {
      clientName: 'client1',
      dateScheduled: 'date1',
      scheduledTimeZone: 'tz1',
      campaignID: 'id1',
      name: 'name1',
      numberOfRecipients: 23000
    },
    {
      clientName: 'client2',
      dateScheduled: 'date2',
      scheduledTimeZone: 'tz2',
      campaignID: 'id2',
      name: 'name2',
      numberOfRecipients: 1000
    },
    {
      clientName: 'client3',
      dateScheduled: 'date3',
      scheduledTimeZone: 'tz3',
      campaignID: 'id3',
      name: 'name3',
      numberOfRecipients: 1001
    }
  ];

  it('filters out campaigns that are lower than threshold', async () => {
    expect(campaigns.filter(campaignMonitorService.campaignFilter)).toEqual([
      {
        clientName: 'client1',
        dateScheduled: 'date1',
        scheduledTimeZone: 'tz1',
        campaignID: 'id1',
        name: 'name1',
        numberOfRecipients: 23000
      },
      {
        clientName: 'client3',
        dateScheduled: 'date3',
        scheduledTimeZone: 'tz3',
        campaignID: 'id3',
        name: 'name3',
        numberOfRecipients: 1001
      }
    ])
  });
});

describe('sortCampaigns', () => {
  const campaigns: Campaign[] = [
    {
      clientName: 'client1',
      dateScheduled: 'date1',
      scheduledTimeZone: 'tz1',
      campaignID: 'id1',
      name: 'name1',
      numberOfRecipients: 23000,
      dateScheduledObject: DateTime.fromISO('2021-07-25T13:00:00')
    },
    {
      clientName: 'client2',
      dateScheduled: 'date2',
      scheduledTimeZone: 'tz2',
      campaignID: 'id2',
      name: 'name2',
      numberOfRecipients: 1000,
      dateScheduledObject: DateTime.fromISO('2021-07-26T13:00:00')
    },
    {
      clientName: 'client3',
      dateScheduled: 'date3',
      scheduledTimeZone: 'tz3',
      campaignID: 'id3',
      name: 'name3',
      numberOfRecipients: 1001,
      dateScheduledObject: DateTime.fromISO('2021-07-27T13:00:00')
    }
  ];

  it('sorts campaigns from latest to oldest', () =>{
    expect(campaigns.sort(campaignMonitorService.sortCampaigns)).toEqual([
      {
        clientName: 'client3',
        dateScheduled: 'date3',
        scheduledTimeZone: 'tz3',
        campaignID: 'id3',
        name: 'name3',
        numberOfRecipients: 1001,
        dateScheduledObject: DateTime.fromISO('2021-07-27T13:00:00')
      },
      {
        clientName: 'client2',
        dateScheduled: 'date2',
        scheduledTimeZone: 'tz2',
        campaignID: 'id2',
        name: 'name2',
        numberOfRecipients: 1000,
        dateScheduledObject: DateTime.fromISO('2021-07-26T13:00:00')
      },
      {
        clientName: 'client1',
        dateScheduled: 'date1',
        scheduledTimeZone: 'tz1',
        campaignID: 'id1',
        name: 'name1',
        numberOfRecipients: 23000,
        dateScheduledObject: DateTime.fromISO('2021-07-25T13:00:00')
      }
    ]);
  });
});