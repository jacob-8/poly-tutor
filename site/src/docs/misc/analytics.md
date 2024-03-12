## Tracking expenses

Google Cloud expenses are daily exported to BigQuery. Then using the Connected Sheets feature these are automatically pulled into a pivot table that aggregrates expenses by month. Looks like BigQuery may only keep 60 days in history in free mode so may need to copy the monthly totals into static rows.

## Tracking usage

- Google Analytics is setup to auto-export to BigQuery. This will also be using the Connected Sheets feature to pull data in.
- The vast majority of usage tracking is database analytics, run on a daily schedule.
