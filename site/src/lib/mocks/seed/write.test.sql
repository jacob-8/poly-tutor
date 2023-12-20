INSERT INTO everything ("text", "real", "int", "array", "jsonb") VALUES
('hello', 12.4, 2, '{1,2}', '{"a":{"b":1}}'::jsonb),
(null, 12.4, 2, '{}', '{"array":[]}'::jsonb);