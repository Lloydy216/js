# Supabase Setup for Breakout Game Leaderboard

## Database Table Setup

You need to create a table in your Supabase database to store the leaderboard scores.

### 1. Go to your Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Select your project: `nitmyysukscyscazoloa`

### 2. Create the Leaderboard Table

In the Supabase dashboard:

1. Go to **Table Editor**
2. Click **"New Table"**
3. Create a table with the following settings:

**Table Name:** `leaderboard`

**Columns:**
- `id` (type: `int8`, primary key, auto-increment)
- `player_name` (type: `text`, not null)
- `score` (type: `int8`, not null)
- `created_at` (type: `timestamptz`, default: `now()`)

### 3. SQL Command (Alternative)

You can also run this SQL in the SQL Editor:

```sql
CREATE TABLE leaderboard (
  id BIGSERIAL PRIMARY KEY,
  player_name TEXT NOT NULL,
  score BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for anonymous access)
CREATE POLICY "Allow all operations" ON leaderboard
  FOR ALL USING (true);
```

### 4. Test the Integration

After setting up the table:

1. Open your game in a browser
2. Play the game and get a score
3. Enter your name and click "Save Score"
4. Check if the score appears in the leaderboard
5. Verify the score is saved in your Supabase dashboard under the `leaderboard` table

## Features Added

- ✅ **Cloud Storage**: Scores are now stored in Supabase database instead of localStorage
- ✅ **Global Leaderboard**: All players can see the same leaderboard
- ✅ **Real-time Updates**: Leaderboard updates automatically
- ✅ **Error Handling**: Proper error messages if saving fails
- ✅ **Loading States**: Button shows "Saving..." while processing
- ✅ **Medals**: Top 3 scores get gold, silver, and bronze medals
- ✅ **Validation**: Ensures player name is entered before saving

## Troubleshooting

If you encounter issues:

1. **Check Browser Console**: Look for error messages
2. **Verify Table Name**: Ensure the table is named exactly `leaderboard`
3. **Check RLS Policies**: Make sure the table allows anonymous access
4. **Network Issues**: Ensure your internet connection is stable

The game will now save scores to your Supabase database and display a global leaderboard! 