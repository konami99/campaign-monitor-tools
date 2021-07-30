import { DateTime } from "luxon";

export default interface Campaign {
  clientName: string
  dateScheduled: string
  scheduledTimeZone: string
  campaignID: string
  name: string
  subject?: string
  fromName?: string
  fromEmail?: string
  replyTo?: string
  dateCreated?: Date
  previewURL?: string
  previewTextURL?: string
  numberOfRecipients?: number
  timezoneOffset?: string
  dateScheduledObject?: DateTime
  localDateScheduledObject?: DateTime
}