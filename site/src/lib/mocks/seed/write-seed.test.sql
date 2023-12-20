INSERT INTO everything ("array", "int", "jsonb", "real", "text") VALUES
('{1,2}', 2, '{"a":{"b":1}}'::jsonb, 12.4, 'hello'),
('{}', 2, '{"array":[]}'::jsonb, 12.4, null);