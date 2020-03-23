DROP TABLE IF EXISTS albums CASCADE;

CREATE TABLE albums (
    id SERIAL,
    user_id INT REFERENCES users(id) NOT NULL,
    artist VARCHAR NOT NULL CHECK (artist != ''),
    album_name VARCHAR NOT NULL CHECK (album_name != ''),
    album_id INT,
    image VARCHAR,
    url VARCHAR NOT NULL CHECK (url != ''),
    country VARCHAR NOT NULL CHECK (country != ''),
    error BOOLEAN DEFAULT false,
    PRIMARY KEY (album_id, country),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
