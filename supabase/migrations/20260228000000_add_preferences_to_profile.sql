-- Add preferences column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{
  "theme": "system",
  "accentColor": "#0f172a",
  "density": "comfortable",
  "currency": "USD",
  "firstDayOfWeek": 1,
  "sidebarCollapsed": false,
  "showAnimations": true
}'::JSONB;

-- Update existing profiles with default preferences if null
UPDATE public.profiles 
SET preferences = '{
  "theme": "system",
  "accentColor": "#0f172a",
  "density": "comfortable",
  "currency": "USD",
  "firstDayOfWeek": 1,
  "sidebarCollapsed": false,
  "showAnimations": true
}'::JSONB
WHERE preferences IS NULL;
