DROP TABLE IF EXISTS authors CASCADE;

CREATE TABLE authors (
    id SERIAL,
    user_id INT REFERENCES users(id) NOT NULL,
    author VARCHAR NOT NULL CHECK (author != ''),
    image VARCHAR,
    url VARCHAR NOT NULL CHECK (url != ''),
    country VARCHAR NOT NULL CHECK (country != ''),
    error BOOLEAN DEFAULT false,
    PRIMARY KEY (author, country),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
