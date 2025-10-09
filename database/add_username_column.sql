-- Add username column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Add comment
COMMENT ON COLUMN profiles.username IS 'Unique username for the user';
