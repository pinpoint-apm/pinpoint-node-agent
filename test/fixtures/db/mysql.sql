CREATE TABLE IF NOT EXISTS USER
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
)