DROP TABLE IF EXISTS books CASCADE;

CREATE TABLE books (
    id SERIAL,
    user_id INT REFERENCES users(id) NOT NULL,
    author VARCHAR NOT NULL CHECK (author != ''),
    book_name VARCHAR NOT NULL CHECK (book_name != ''),
    book_id INT NOT NULL,
    image VARCHAR,
    country VARCHAR NOT NULL CHECK (country != ''),
    error BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (book_id, country)
);
