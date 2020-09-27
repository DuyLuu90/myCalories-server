CREATE TABLE IF NOT EXISTS caloriecounter_users(
  id SERIAL PRIMARY KEY,
  user_name TEXT UNIQUE,  
  full_name TEXT NOT NULL,
  isAdmin BOOLEAN DEFAULT false,  
  age TEXT NOT NULL,
  height TEXT NOT NULL,
  weight TEXT NOT NULL,
  gender TEXT,
  profile_pic TEXT,
  password TEXT NOT NULL,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_modified TIMESTAMPTZ
);