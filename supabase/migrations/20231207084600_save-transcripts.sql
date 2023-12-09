-- CREATE TYPE captions_source AS ENUM ('youtube', 'whisper-api', 'manual', 'GPT3.5-revised');

CREATE TYPE language as ENUM('en', 'zh');

CREATE TABLE youtubes (
  id text not null unique primary key, -- same as youtube video id
  title text not null,
  duration_seconds real null,
  "language" language not null,
  thumbnail_url text null,
  channel_id text not null,
  channel_title text not null,
  channel_thumbnail_url text not null,
  created_by uuid not null references auth.users not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  transcripts jsonb, -- an array of transcripts that has the captions split into chapters, paragraphs, sentences; and captions source - then each sentence get's it's own machine translations
  summaries jsonb -- array of summaries which include the timestamps for what they summarize, and a title of that section if the timestamp isn't for the whole show - so the timestamp determines what portion it's a summary of. This will let us revise transcripts without losing summaries.
);

ALTER TABLE youtubes ENABLE ROW LEVEL SECURITY;
