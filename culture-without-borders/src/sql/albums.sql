DROP TABLE IF EXISTS albums CASCADE;

CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) NOT NULL,
    artist VARCHAR NOT NULL CHECK (artist != ''),
    album_name VARCHAR NOT NULL CHECK (album_name != ''),
    image VARCHAR,
    url VARCHAR NOT NULL CHECK (url != ''),
    country VARCHAR NOT NULL UNIQUE CHECK (country != ''),
    error BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
