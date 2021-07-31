import { DateTime } from "luxon";
import Campaign from '../../../src/models/campaign';
import campaignMonitorService from '../../../src/services/campaignMonitorService';
import axios from 'axios';
import ssmService from '../../../src/services/SsmService';

jest.mock('axios');

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

describe('getClients', () => {
  it('gets clients', async () => {
    ssmService.getParameter = jest.fn().mockResolvedValue('key12345');
    axios.create = jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue({
        data: 'data123'
      }),
    });
    
    expect(await campaignMonitorService.getClients()).toEqual('data123');
  });
});

describe('getScheduledCampaigns', () => {
  it('gets scheduled campaigns', async () => {
    const clientID = 'id123';
    ssmService.getParameter = jest.fn().mockResolvedValue('key12345');
    axios.create = jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue({
        data: 'data456'
      }),
    });
    
    expect(await campaignMonitorService.getScheduledCampaigns(clientID)).toEqual('data456');
  });
});

describe('getCampaignDetails', () => {
  it('gets scheduled campaigns', async () => {
    const campaignID = 'id123';
    ssmService.getParameter = jest.fn().mockResolvedValue('key12345');
    axios.create = jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue({
        data: 'data000'
      }),
    });
    
    expect(await campaignMonitorService.getCampaignDetails(campaignID)).toEqual('data000');
  });
});

describe('serializeCampaigns', () => {
  it('gets scheduled campaigns', async () => {
    const campaigns: Campaign[] = [
      {
        clientName: 'client1',
        dateScheduled: 'date1',
        scheduledTimeZone: 'tz1',
        campaignID: 'id1',
        name: 'name1',
        numberOfRecipients: 23000,
        localDateScheduledObject: DateTime.fromISO('2021-07-25T13:00:00')
      },
      {
        clientName: 'client2',
        dateScheduled: 'date2',
        scheduledTimeZone: 'tz2',
        campaignID: 'id2',
        name: 'name2',
        numberOfRecipients: 1000,
        localDateScheduledObject: DateTime.fromISO('2021-07-26T13:00:00')
      },
      {
        clientName: 'client3',
        dateScheduled: 'date3',
        scheduledTimeZone: 'tz3',
        campaignID: 'id3',
        name: 'name3',
        numberOfRecipients: 1001,
        localDateScheduledObject: DateTime.fromISO('2021-07-27T13:00:00')
      }
    ];

    const expectedResult = "\
client1\n\
2021-07-25T13:00:00.000+10:00\n\
name1\n\
23000\n\n\
client2\n\
2021-07-26T13:00:00.000+10:00\n\
name2\n\
1000\n\n\
client3\n\
2021-07-27T13:00:00.000+10:00\n\
name3\n\
1001\n\n\
";

    expect(await campaignMonitorService.serializeCampaigns(campaigns)).toEqual(expectedResult);
  });
});

describe('toCampaignObject', () => {
  const client = {
    clientID: 'id123',
    name: 'client1'
  }
  const campaigns = [
    {
      ScheduledTimeZone: '(GMT+10:00) Canberra, Melbourne, Sydney',
      DateScheduled: '2021-07-19 12:30:00',
      CampaignID: '78034b9198c7f3d62d1c3148191dc633',
      Name: 'DJ21 - F2F 4 - Has Raised - 19.07.21'
    },
    {
      ScheduledTimeZone: '(GMT+10:00) Canberra, Melbourne, Sydney',
      DateScheduled: '2021-07-18 10:00:00',
      CampaignID: '78034b9198c7f3d62d1c3148191dc911',
      Name: 'DJ20 - F2F 4 - Has Raised - 19.07.21'
    },
    {
      ScheduledTimeZone: '(GMT+10:00) Canberra, Melbourne, Sydney',
      DateScheduled: '2021-07-17 02:30:00',
      CampaignID: '78034b9198c7f3d62d1c3148191dc456',
      Name: 'DJ19 - F2F 4 - Has Raised - 19.07.21'
    },
  ]

  it('converts to campaign objects', async () => {
    expect(campaignMonitorService.toCampaignObject(client, campaigns)).toEqual([
      {
        "campaignID": "78034b9198c7f3d62d1c3148191dc633",
        "clientName": "client1",
        "dateScheduled": "2021-07-19 12:30:00",
        "dateScheduledObject": DateTime.fromISO("2021-07-19T12:30:00+10:00", { setZone: true }),
        "localDateScheduledObject": DateTime.fromISO("2021-07-19T12:30:00+10:00", { setZone: true }).setZone('UTC+10'),
        "name": "DJ21 - F2F 4 - Has Raised - 19.07.21",
        "scheduledTimeZone": "(GMT+10:00) Canberra, Melbourne, Sydney",
        "timezoneOffset": "+10:00"
      },
      {
        "campaignID": "78034b9198c7f3d62d1c3148191dc911",
        "clientName": "client1",
        "dateScheduled": "2021-07-18 10:00:00",
        "dateScheduledObject": DateTime.fromISO("2021-07-18T10:00:00+10:00", { setZone: true }),
        "localDateScheduledObject": DateTime.fromISO("2021-07-18T10:00:00+10:00", { setZone: true }).setZone('UTC+10'),
        "name": "DJ20 - F2F 4 - Has Raised - 19.07.21",
        "scheduledTimeZone": "(GMT+10:00) Canberra, Melbourne, Sydney",
        "timezoneOffset": "+10:00"
      },
      {
        "campaignID": "78034b9198c7f3d62d1c3148191dc456",
        "clientName": "client1",
        "dateScheduled": "2021-07-17 02:30:00",
        "dateScheduledObject": DateTime.fromISO("2021-07-17T02:30:00+10:00", { setZone: true }),
        "localDateScheduledObject": DateTime.fromISO("2021-07-17T02:30:00+10:00", { setZone: true }).setZone('UTC+10'),
        "name": "DJ19 - F2F 4 - Has Raised - 19.07.21",
        "scheduledTimeZone": "(GMT+10:00) Canberra, Melbourne, Sydney",
        "timezoneOffset": "+10:00"
      }
    ]);
  })
});