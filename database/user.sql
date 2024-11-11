/* Create database if it does not exist */
CREATE DATABASE IF NOT EXISTS users_auth;

USE users_auth;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
)

-- Register a new user (insert username, email, and hashed password)
INSERT INTO users (username, email, password_hash)
VALUES ('', '', '');

-- Check if the username and hashed password match a record in the database
SELECT * FROM users
WHERE username = '' AND password_hash = '';
