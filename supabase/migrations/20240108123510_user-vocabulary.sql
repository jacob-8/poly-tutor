CREATE TABLE word_updates (
  id uuid primary key default uuid_generate_v4(), -- can be generated by client via uuidv4 so users can create status updates even when offline
  word text not null,
  "language" language not null,
  "status" int not null,
  views int not null,
  created_by uuid references auth.users not null default auth.uid(),
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE word_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can add word updates"
ON word_updates FOR INSERT
TO authenticated
WITH CHECK ( auth.uid() = created_by );

CREATE POLICY "users can view status of their own words"
ON word_updates FOR SELECT
TO authenticated
USING ( auth.uid() = created_by );

CREATE VIEW user_vocabulary AS
SELECT
  "language",
  jsonb_object_agg(
    latest_updates.word,
    jsonb_build_object(
      'status', latest_updates."status",
      'views', latest_updates.views,
      'updated_at', latest_updates.created_at
    )
  ) AS vocabulary
FROM (
  SELECT DISTINCT ON (word) word, "language", "status", views, created_at
  FROM word_updates
  ORDER BY word, created_at DESC
) AS latest_updates
GROUP BY "language";
