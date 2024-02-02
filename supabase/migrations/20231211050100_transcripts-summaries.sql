CREATE TABLE youtube_transcripts (
  id uuid primary key default uuid_generate_v4(),
  youtube_id text references youtubes(id) not null,
  sentences jsonb[] not null,
  source text not null,
  "description" text null, -- user added metadata, like what Whisper prompt was used, what GPT3.5 revision prompt was used
  created_by uuid references auth.users not null default auth.uid(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

ALTER TABLE youtube_transcripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can add youtube transcripts"
ON youtube_transcripts FOR INSERT
TO authenticated
WITH CHECK ( auth.uid() = created_by );

CREATE POLICY "anyone can view youtube transcripts"
ON youtube_transcripts FOR SELECT 
USING ( true );

CREATE POLICY "users can update their youtube transcripts" 
ON youtube_transcripts FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

CREATE TABLE youtube_summaries (
  id uuid primary key default uuid_generate_v4(),
  youtube_id text references youtubes(id) not null,
  title text null,
  sentences jsonb[] not null,
  source text not null,
  start_ms int not null,
  end_ms int not null,
  "description" text null, -- user added metadata, like what prompts were used
  created_by uuid references auth.users not null default auth.uid(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

ALTER TABLE youtube_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can add youtube summaries"
ON youtube_summaries FOR INSERT
TO authenticated
WITH CHECK ( auth.uid() = created_by );

CREATE POLICY "anyone can view youtube summaries"
ON youtube_summaries FOR SELECT 
USING ( true );

CREATE POLICY "users can update their youtube summaries" 
ON youtube_summaries FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);