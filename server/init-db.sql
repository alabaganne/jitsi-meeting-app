-- Jitsi Meet Database Initialization Script
-- Run this script to set up the MySQL database
-- Usage: mysql -u root -p < init-db.sql

-- Create database
DROP DATABASE IF EXISTS jitsi_meet;
CREATE DATABASE jitsi_meet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jitsi_meet;

-- Users table
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Meetings table
CREATE TABLE meeting (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    room_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    organizer_id INT NOT NULL,
    scheduled_at TIMESTAMP NULL,
    duration INT DEFAULT 60 COMMENT 'Duration in minutes',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES user(id) ON DELETE CASCADE,
    INDEX idx_organizer (organizer_id),
    INDEX idx_room_name (room_name),
    INDEX idx_scheduled_at (scheduled_at)
) ENGINE=InnoDB;

-- Meeting invitees table
CREATE TABLE invitee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meeting_id VARCHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL,
    FOREIGN KEY (meeting_id) REFERENCES meeting(id) ON DELETE CASCADE,
    UNIQUE KEY unique_meeting_invitee (meeting_id, email),
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Session tokens table (optional - for token blacklisting)
CREATE TABLE session (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB;

-- Meeting recordings table (optional - for future use)
CREATE TABLE recording (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meeting_id VARCHAR(36) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    duration INT COMMENT 'Duration in seconds',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meeting_id) REFERENCES meeting(id) ON DELETE CASCADE,
    INDEX idx_meeting (meeting_id)
) ENGINE=InnoDB;

-- Insert sample data (optional - for testing)
-- Uncomment the following lines to add test data

-- INSERT INTO user (name, username, email, password) VALUES
-- ('John Doe', 'johndoe', 'john@example.com', '$2a$10$hashedpassword'),
-- ('Jane Smith', 'janesmith', 'jane@example.com', '$2a$10$hashedpassword');

-- INSERT INTO meeting (id, name, room_name, description, organizer_id, scheduled_at, duration) VALUES
-- ('550e8400-e29b-41d4-a716-446655440000', 'Team Standup', 'jitsi-abc123', 'Daily team sync', 1, DATE_ADD(NOW(), INTERVAL 1 DAY), 30),
-- ('550e8400-e29b-41d4-a716-446655440001', 'Project Review', 'jitsi-def456', 'Weekly project review', 1, DATE_ADD(NOW(), INTERVAL 3 DAY), 60);

COMMIT;
