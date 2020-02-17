DROP TABLE IF EXISTS books CASCADE;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) NOT NULL,
    author VARCHAR NOT NULL CHECK (author != ''),
    book_name VARCHAR NOT NULL CHECK (book_name != ''),
    image VARCHAR,
    url VARCHAR NOT NULL CHECK (url != ''),
    country VARCHAR NOT NULL UNIQUE CHECK (country != ''),
    error BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
