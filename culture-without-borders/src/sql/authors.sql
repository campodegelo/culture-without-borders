DROP TABLE IF EXISTS authors CASCADE;

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) NOT NULL,
    author VARCHAR NOT NULL CHECK (author != ''),
    image VARCHAR,
    url VARCHAR NOT NULL CHECK (url != ''),
    country VARCHAR NOT NULL UNIQUE CHECK (country != ''),
    error BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
