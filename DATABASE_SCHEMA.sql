-- ============================================
-- RoomSync Database Creation Script
-- Database: roomsync_db
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS roomsync_db;
USE roomsync_db;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'owner', 'admin') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    profile_picture_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at),
    INDEX idx_phone (phone)
);

-- ============================================
-- 2. STUDENT PROFILES TABLE
-- ============================================
CREATE TABLE student_profiles (
    student_profile_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    student_id_number VARCHAR(50) UNIQUE NOT NULL,
    course VARCHAR(100),
    year_level INT CHECK (year_level >= 1 AND year_level <= 4),
    university VARCHAR(100),
    gender ENUM('Male', 'Female', 'Other'),
    date_of_birth DATE,
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(20),
    is_verified_student BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id_number),
    INDEX idx_verified (is_verified_student)
);

-- ============================================
-- 3. OWNER PROFILES TABLE
-- ============================================
CREATE TABLE owner_profiles (
    owner_profile_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    business_name VARCHAR(100),
    registration_number VARCHAR(100) UNIQUE,
    tax_id VARCHAR(50),
    id_type VARCHAR(50),
    id_number VARCHAR(100) UNIQUE,
    verification_status ENUM('Pending', 'Verified', 'Rejected') DEFAULT 'Pending',
    verified_by_admin INT,
    verified_at TIMESTAMP NULL,
    total_dormitories INT DEFAULT 0,
    total_rooms INT DEFAULT 0,
    years_in_business INT,
    business_address VARCHAR(255),
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by_admin) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_registration (registration_number),
    INDEX idx_verification_status (verification_status)
);

-- ============================================
-- 4. DORMITORIES TABLE
-- ============================================
CREATE TABLE dormitories (
    dormitory_id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    full_address VARCHAR(255) NOT NULL,
    barangay VARCHAR(100),
    city_municipality VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    email VARCHAR(100),
    total_capacity INT NOT NULL,
    total_rooms INT NOT NULL,
    occupied_rooms INT DEFAULT 0,
    available_rooms INT DEFAULT 0,
    base_price DECIMAL(10, 2) NOT NULL,
    status ENUM('Active', 'Inactive', 'Full', 'Maintenance') DEFAULT 'Active',
    registration_status ENUM('Pending', 'Verified', 'Rejected') DEFAULT 'Pending',
    registration_number VARCHAR(100) UNIQUE,
    verified_by_admin INT,
    verified_at TIMESTAMP NULL,
    established_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    images_json JSON,
    
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by_admin) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_owner (owner_id),
    INDEX idx_city (city_municipality),
    INDEX idx_status (status),
    INDEX idx_registration_status (registration_status),
    INDEX idx_registration_number (registration_number),
    INDEX idx_coordinates (latitude, longitude)
);

-- ============================================
-- 5. AMENITIES TABLE
-- ============================================
CREATE TABLE amenities (
    amenity_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    icon_url VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_name (name),
    INDEX idx_category (category)
);

-- Insert Common Amenities
INSERT INTO amenities (name, category, description) VALUES
('WiFi', 'Connectivity', 'High-speed internet access'),
('Aircon', 'Comfort', 'Air conditioning units'),
('Study Area', 'Facilities', 'Dedicated study space'),
('Laundry', 'Facilities', 'Laundry area or service'),
('24/7 Security', 'Security', 'Round-the-clock security'),
('CCTV', 'Security', 'Closed-circuit television'),
('Gym', 'Recreation', 'Fitness gym facility'),
('Common Kitchen', 'Facilities', 'Shared kitchen area'),
('Hot Water', 'Comfort', 'Hot water supply'),
('Water Supply', 'Utilities', 'Water supply system'),
('Rooftop Lounge', 'Recreation', 'Rooftop common area'),
('Study Lounge', 'Facilities', 'Study and relaxation space'),
('Parking', 'Facilities', 'Vehicle parking'),
('Pool', 'Recreation', 'Swimming pool'),
('Fan Rooms', 'Comfort', 'Rooms with fans');

-- ============================================
-- 6. DORMITORY AMENITIES (Junction Table)
-- ============================================
CREATE TABLE dormitory_amenities (
    dormitory_amenity_id INT PRIMARY KEY AUTO_INCREMENT,
    dormitory_id INT NOT NULL,
    amenity_id INT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (dormitory_id) REFERENCES dormitories(dormitory_id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id) ON DELETE CASCADE,
    UNIQUE KEY unique_dorm_amenity (dormitory_id, amenity_id),
    INDEX idx_dormitory (dormitory_id)
);

-- ============================================
-- 7. ROOMS TABLE
-- ============================================
CREATE TABLE rooms (
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    dormitory_id INT NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    floor_number INT,
    room_type ENUM('Single', 'Double', 'Dormitory', 'Suite') DEFAULT 'Dormitory',
    capacity INT NOT NULL,
    current_occupancy INT DEFAULT 0,
    available_slots INT DEFAULT 0,
    monthly_rent DECIMAL(10, 2) NOT NULL,
    room_status ENUM('Available', 'Occupied', 'Reserved', 'Maintenance', 'Closed') DEFAULT 'Available',
    description TEXT,
    image_url VARCHAR(500),
    virtual_tour_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    images_json JSON,
    
    FOREIGN KEY (dormitory_id) REFERENCES dormitories(dormitory_id) ON DELETE CASCADE,
    UNIQUE KEY unique_room_number (room_number, dormitory_id),
    INDEX idx_dormitory (dormitory_id),
    INDEX idx_room_status (room_status),
    INDEX idx_dorm_status (dormitory_id, room_status)
);

-- ============================================
-- 8. TENANTS TABLE
-- ============================================
CREATE TABLE tenants (
    tenant_id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,
    user_id INT,
    name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    course VARCHAR(100),
    year_level INT,
    profile_image_url VARCHAR(255),
    study_habits VARCHAR(100),
    sleep_schedule VARCHAR(100),
    cleanliness_level VARCHAR(50),
    move_in_date DATE NOT NULL,
    move_out_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_room (room_id),
    INDEX idx_user (user_id),
    INDEX idx_active (is_active),
    INDEX idx_move_in (move_in_date)
);

-- ============================================
-- 9. BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,
    student_id INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    desired_move_in_date DATE NOT NULL,
    desired_move_out_date DATE,
    booking_status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
    approved_by_owner INT,
    approved_at TIMESTAMP NULL,
    number_of_months INT,
    total_amount DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by_owner) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_room (room_id),
    INDEX idx_student (student_id),
    INDEX idx_status (booking_status),
    INDEX idx_move_in_date (desired_move_in_date)
);

-- ============================================
-- 10. TRANSACTIONS TABLE
-- ============================================
CREATE TABLE transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    room_id INT NOT NULL,
    student_id INT NOT NULL,
    owner_id INT NOT NULL,
    transaction_type ENUM('Rent Payment', 'Deposit', 'Refund', 'Maintenance Fee', 'Late Fee') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('Cash', 'Bank Transfer', 'GCash', 'Check', 'Online', 'On-site') NOT NULL,
    payment_status ENUM('Pending', 'Completed', 'Failed', 'Cancelled') DEFAULT 'Pending',
    reference_code VARCHAR(100) UNIQUE,
    paid_at TIMESTAMP NULL,
    due_date DATE,
    month_covered DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE SET NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_reference (reference_code),
    INDEX idx_booking (booking_id),
    INDEX idx_student (student_id),
    INDEX idx_owner (owner_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_month_covered (month_covered)
);

-- ============================================
-- 11. TENANT LEDGER TABLE
-- ============================================
CREATE TABLE tenant_ledger (
    ledger_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    room_id INT NOT NULL,
    month DATE NOT NULL,
    rent_due DECIMAL(10, 2) NOT NULL,
    rent_paid DECIMAL(10, 2) DEFAULT 0,
    balance DECIMAL(10, 2),
    status ENUM('Pending', 'Partial', 'Paid', 'Overdue') DEFAULT 'Pending',
    payment_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
    UNIQUE KEY unique_tenant_month (tenant_id, month),
    INDEX idx_month (month),
    INDEX idx_status (status),
    INDEX idx_tenant_month (tenant_id, month)
);

-- ============================================
-- 12. MAINTENANCE REQUESTS TABLE
-- ============================================
CREATE TABLE maintenance_requests (
    maintenance_id INT PRIMARY KEY AUTO_INCREMENT,
    dormitory_id INT NOT NULL,
    room_id INT,
    reported_by INT NOT NULL,
    assigned_to INT,
    category ENUM('Electrical', 'Plumbing', 'General Repair', 'Cleaning', 'Security', 'Other') NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    urgency ENUM('Low', 'Medium', 'High', 'Emergency') DEFAULT 'Medium',
    status ENUM('Open', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Open',
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    notes TEXT,
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (dormitory_id) REFERENCES dormitories(dormitory_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE SET NULL,
    FOREIGN KEY (reported_by) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_dormitory (dormitory_id),
    INDEX idx_status (status),
    INDEX idx_urgency (urgency)
);

-- ============================================
-- 13. RATINGS AND REVIEWS TABLE
-- ============================================
CREATE TABLE ratings_reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    dormitory_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(150) NOT NULL,
    comment TEXT,
    cleanliness_rating INT CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    safety_rating INT CHECK (safety_rating >= 1 AND safety_rating <= 5),
    value_rating INT CHECK (value_rating >= 1 AND value_rating <= 5),
    amenities_rating INT CHECK (amenities_rating >= 1 AND amenities_rating <= 5),
    owner_behavior_rating INT CHECK (owner_behavior_rating >= 1 AND owner_behavior_rating <= 5),
    stay_duration_months INT,
    would_recommend BOOLEAN,
    verified_tenant BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    review_date DATE NOT NULL,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT TRUE,
    is_flagged BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (dormitory_id) REFERENCES dormitories(dormitory_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_dormitory (dormitory_id),
    INDEX idx_rating (rating),
    INDEX idx_dorm_rating (dormitory_id, rating),
    INDEX idx_posted (posted_at)
);

-- ============================================
-- 14. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('Booking', 'Payment', 'Maintenance', 'Review', 'System', 'Admin') NOT NULL,
    related_entity_type VARCHAR(50),
    related_entity_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_user_read (user_id, is_read)
);

-- ============================================
-- 15. LEASE CONTRACTS TABLE
-- ============================================
CREATE TABLE lease_contracts (
    lease_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    student_id INT NOT NULL,
    owner_id INT NOT NULL,
    room_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent DECIMAL(10, 2) NOT NULL,
    security_deposit DECIMAL(10, 2),
    terms_conditions TEXT,
    is_signed BOOLEAN DEFAULT FALSE,
    student_signed_at TIMESTAMP NULL,
    owner_signed_at TIMESTAMP NULL,
    lease_status ENUM('Draft', 'Active', 'Expired', 'Terminated', 'Cancelled') DEFAULT 'Draft',
    document_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
    UNIQUE KEY unique_booking_lease (booking_id),
    INDEX idx_student (student_id),
    INDEX idx_owner (owner_id),
    INDEX idx_lease_status (lease_status)
);

-- ============================================
-- 16. ADMIN LOGS TABLE
-- ============================================
CREATE TABLE admin_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    old_value JSON,
    new_value JSON,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_admin (admin_id),
    INDEX idx_action (action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
);

-- ============================================
-- 17. DORMITORY DOCUMENTS TABLE
-- ============================================
CREATE TABLE dormitory_documents (
    document_id INT PRIMARY KEY AUTO_INCREMENT,
    dormitory_id INT NOT NULL,
    owner_id INT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(50),
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INT,
    verified_at TIMESTAMP NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATE,
    
    FOREIGN KEY (dormitory_id) REFERENCES dormitories(dormitory_id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_dormitory (dormitory_id),
    INDEX idx_owner (owner_id),
    INDEX idx_document_type (document_type),
    INDEX idx_approved (is_approved)
);

-- ============================================
-- CREATE ADMIN USER (Default)
-- ============================================
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active, verified_at)
VALUES ('admin@roomsync.com', '$2y$10$admin_password_hash', 'admin', 'Admin', 'User', '09000000000', TRUE, NOW());

-- ============================================
-- CREATE SAMPLE OWNER USER
-- ============================================
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active, verified_at)
VALUES ('owner@roomsync.com', '$2y$10$owner_password_hash', 'owner', 'Maria', 'Santos', '09111111111', TRUE, NOW());

-- Get the owner user_id for reference
SET @owner_id = LAST_INSERT_ID();

-- ============================================
-- CREATE SAMPLE OWNER PROFILE
-- ============================================
INSERT INTO owner_profiles (user_id, business_name, registration_number, tax_id, id_type, id_number, verification_status, verified_by_admin, verified_at, years_in_business, business_address)
VALUES (@owner_id, 'Santos Boarding House', 'BLGF-2024-001', 'TIN123456789', 'Driver License', 'DL987654321', 'Verified', 1, NOW(), 5, 'Bucana, Nasugbu, Batangas');

-- ============================================
-- CREATE SAMPLE DORMITORY
-- ============================================
INSERT INTO dormitories (owner_id, name, description, location, full_address, barangay, city_municipality, province, postal_code, latitude, longitude, phone, email, total_capacity, total_rooms, base_price, status, registration_status, registration_number, verified_by_admin, verified_at, established_date)
VALUES (@owner_id, 'Arasof Student Lodge', 'Walking distance to BatStateU Arasof Campus. Clean, safe dormitory with WiFi and 24/7 security.', 'Bucana, Nasugbu', 'Purok 3, Barangay Bucana, Nasugbu, Batangas', 'Bucana', 'Nasugbu', 'Batangas', '4200', 14.0711, 120.6328, '09123456789', 'info@arasof.com', 8, 2, 2500, 'Active', 'Verified', 'BLGF-2024-001', 1, NOW(), '2024-01-15');

SET @dorm_id = LAST_INSERT_ID();

-- ============================================
-- ADD AMENITIES TO SAMPLE DORMITORY
-- ============================================
INSERT INTO dormitory_amenities (dormitory_id, amenity_id) SELECT @dorm_id, amenity_id FROM amenities WHERE name IN ('WiFi', 'Study Area', '24/7 Security', 'Water Supply', 'Common Kitchen');

-- ============================================
-- CREATE SAMPLE ROOMS
-- ============================================
INSERT INTO rooms (dormitory_id, room_number, floor_number, room_type, capacity, available_slots, monthly_rent, room_status)
VALUES 
(@dorm_id, '101', 1, 'Dormitory', 6, 2, 2500, 'Available'),
(@dorm_id, '102', 1, 'Double', 2, 1, 2000, 'Available');

-- ============================================
-- DATABASE SETUP COMPLETE
-- ============================================
-- Verify tables created
SHOW TABLES;

-- Check structure of key tables
-- DESCRIBE users;
-- DESCRIBE dormitories;
-- DESCRIBE rooms;
-- DESCRIBE transactions;
