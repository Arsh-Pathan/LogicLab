-- ============================================================
-- LogicLab — Seed Data
-- ============================================================

-- Tags
INSERT INTO public.tags (name, description, color) VALUES
  ('combinational', 'Combinational logic circuits', '#3b82f6'),
  ('sequential', 'Sequential logic circuits with memory', '#8b5cf6'),
  ('arithmetic', 'Arithmetic and math circuits', '#f59e0b'),
  ('beginner', 'Suitable for beginners', '#22c55e'),
  ('intermediate', 'Intermediate difficulty', '#f97316'),
  ('advanced', 'Advanced circuits', '#ef4444'),
  ('alu', 'Arithmetic Logic Unit designs', '#06b6d4'),
  ('counter', 'Counter circuits', '#ec4899'),
  ('memory', 'Memory and register circuits', '#a855f7'),
  ('decoder', 'Decoder and encoder circuits', '#14b8a6')
ON CONFLICT (name) DO NOTHING;

-- Badges
INSERT INTO public.badges (name, description, icon, criteria) VALUES
  ('First Circuit', 'Created your first circuit', 'zap', '{"circuits_created": 1}'),
  ('Builder', 'Created 10 circuits', 'cpu', '{"circuits_created": 10}'),
  ('IC Designer', 'Created your first custom IC', 'package', '{"ics_created": 1}'),
  ('Community Star', 'Received 10 stars on a circuit', 'star', '{"stars_received": 10}'),
  ('Contributor', 'Published 5 circuits to the community', 'globe', '{"circuits_published": 5}'),
  ('Logic Master', 'Completed all beginner lessons', 'award', '{"lessons_completed": "all_beginner"}')
ON CONFLICT (name) DO NOTHING;
