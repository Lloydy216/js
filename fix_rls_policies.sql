-- Fix RLS policies for the existing leaderboard table
-- This will allow anonymous users to read and insert data

-- Enable Row Level Security (if not already enabled)
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations" ON public.leaderboard;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.leaderboard;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.leaderboard;

-- Create separate policies for read and insert operations
CREATE POLICY "Enable read access for all users" ON public.leaderboard
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.leaderboard
  FOR INSERT WITH CHECK (true);

-- Test insert to verify policies work
INSERT INTO public.leaderboard (username, player_name, score) 
VALUES ('Test Player', 'Test Player', 100); 