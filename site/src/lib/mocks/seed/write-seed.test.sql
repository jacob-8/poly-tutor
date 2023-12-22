INSERT INTO everything ("array", "boolean", "int", "jsonb", "real", "text") VALUES
('{1,2}', true, 2, '{"a":{"b":1}}'::jsonb, 12.4, 'hello'),
('{}', false, 0, '{"array":[]}'::jsonb, 12.4, ''),
(null, null, null, null, null, null);