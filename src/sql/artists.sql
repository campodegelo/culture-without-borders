DROP TABLE IF EXISTS artists CASCADE;

CREATE TABLE artists (
    id SERIAL,
    user_id INT REFERENCES users(id) NOT NULL,
    artist_name VARCHAR NOT NULL CHECK (artist_name != ''),
    artist_id INT,
    image VARCHAR,
    url VARCHAR NOT NULL CHECK (url != ''),
    country VARCHAR NOT NULL CHECK (country != ''),
    error BOOLEAN DEFAULT false,
    PRIMARY KEY (artist_id, country),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
