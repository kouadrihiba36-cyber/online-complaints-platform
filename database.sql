CREATE DATABASE complaints_db;

USE complaints_db;

CREATE TABLE complaints (
id INT AUTO_INCREMENT PRIMARY KEY,
fullname VARCHAR(255),
nin VARCHAR(18),
phone VARCHAR(20),
email VARCHAR(255),
commune VARCHAR(100),
address TEXT,
category VARCHAR(100),
priority VARCHAR(50),
subject VARCHAR(255),
description TEXT,
file_name TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
