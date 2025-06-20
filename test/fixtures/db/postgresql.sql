-- PostgreSQL test schema
CREATE TABLE member (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test data
INSERT INTO member (id, name, email, joined) VALUES
('a', 'name1', 'test1@example.com', '2023-01-18 00:00:00'),
('b', 'name2', 'test2@example.com', '2022-07-27 00:00:00'); 