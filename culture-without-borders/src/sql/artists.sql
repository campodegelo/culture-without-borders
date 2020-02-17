DROP TABLE IF EXISTS artists CASCADE;

CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) NOT NULL,
    artist VARCHAR NOT NULL CHECK (artist != ''),
    image VARCHAR,
    url VARCHAR NOT NULL CHECK (url != ''),
    country VARCHAR NOT NULL UNIQUE CHECK (country != ''),
    error BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
