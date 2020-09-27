CREATE TABLE IF NOT EXISTS meals(
    id SERIAL PRIMARY KEY,
    userId INTEGER references caloriecounter_users(id) ON DELETE CASCADE NOT NULL,    
    alldaycalories TEXT,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
    date_modified TIMESTAMPTZ
);