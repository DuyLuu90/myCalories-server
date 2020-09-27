CREATE TABLE IF NOT EXISTS meals(
    id SERIAL PRIMARY KEY,
    userId INTEGER references caloriecounter_users(id) ON DELETE CASCADE NOT NULL,
    dateofmeal DATE NOT NULL,
    alldaycalories INTEGER,
    breakfast_food TEXT,
    breakfast_calories INTEGER,
    lunch_food TEXT,
    lunch_calories INTEGER,
    dinner_food TEXT,
    dinner_calories INTEGER,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
    date_modified TIMESTAMPTZ
);