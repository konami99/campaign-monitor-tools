# campaign-monitor-tools
A cron job that pulls email schedules from Campaign Monitor, and post them to Slack.

Example:

<img width="680" alt="Screen Shot 2022-07-18 at 8 23 13 pm" src="https://user-images.githubusercontent.com/166879/179492823-a59013d3-4707-4a83-a2cf-ae102c4a6fda.png">

Change deployment region and pulling frequency in `serverless.yml`.

# Environment Variables
Two env vars are needed
```
//cron job uses this key to pull email schedules
CAMPAIGN_MONITOR_ADMIN_API_KEY=

//slack channel to post to
SLACK_WEBHOOK_PATH_AP=

```

# Pushing to AWS
```
npm install
serveress deploy
```
