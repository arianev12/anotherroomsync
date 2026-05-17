# RoomSync Database Schema

**Database Name:** `roomsync_db`

---

## Database Overview

The RoomSync database is designed to manage a comprehensive dormitory and student housing platform with the following core entities:

- **Users** - Student, Owner, Admin roles
- **Dormitories** - Housing facilities  
- **Rooms** - Individual units within dormitories
- **Tenants** - Current occupants in rooms
- **Transactions/Payments** - Payment history and ledger
- **Bookings/Reservations** - Room reservation requests
- **Amenities** - Facility features
- **Ratings/Reviews** - User feedback
- **Maintenance** - Facility and maintenance requests
- **Admin Operations** - Approvals, verifications, documentation

---

## Table Structures

### 1. **users** Table
Stores all user accounts (Students, Owners, Admins)

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| user_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| role | ENUM('student', 'owner', 'admin') | NOT NULL | User role |
| first_name | VARCHAR(100) | NOT NULL | First name |
| last_name | VARCHAR(100) | NOT NULL | Last name |
| phone | VARCHAR(20) | UNIQUE | Phone number |
| profile_picture_url | VARCHAR(500) | | URL to profile image |
| is_active | BOOLEAN | DEFAULT TRUE | Account active status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update |
| verified_at | TIMESTAMP | | Email verification timestamp |

**Indexes:**
- PRIMARY KEY (user_id)
- UNIQUE (email)
- UNIQUE (phone)
- INDEX (role)
- INDEX (created_at)

---

### 2. **student_profiles** Table
Extended profile for student users

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| student_profile_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique profile identifier |
| user_id | INT | FOREIGN KEY (users.user_id) | Reference to user |
| student_id_number | VARCHAR(50) | UNIQUE | University student ID |
| course | VARCHAR(100) | | Academic course/major |
| year_level | INT | | Current year (1-4) |
| university | VARCHAR(100) | | University/Institution name |
| gender | ENUM('Male', 'Female', 'Other') | | Gender |
| date_of_birth | DATE | | Date of birth |
| guardian_name | VARCHAR(100) | | Emergency contact name |
| guardian_phone | VARCHAR(20) | | Emergency contact phone |
| is_verified_student | BOOLEAN | DEFAULT FALSE | Student ID verification status |

**Foreign Keys:**
- FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE

**Indexes:**
- PRIMARY KEY (student_profile_id)
- UNIQUE (student_id_number)
- UNIQUE (user_id)
- INDEX (is_verified_student)

---

### 3. **owner_profiles** Table
Extended profile for owner/landlord users

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| owner_profile_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique profile identifier |
| user_id | INT | FOREIGN KEY (users.user_id) | Reference to user |
| business_name | VARCHAR(100) | | Business/Organization name |
| registration_number | VARCHAR(100) | UNIQUE | Business registration number |
| tax_id | VARCHAR(50) | | Tax identification number |
| id_type | VARCHAR(50) | | ID document type (passport, license, etc) |
| id_number | VARCHAR(100) | UNIQUE | ID document number |
| verification_status | ENUM('Pending', 'Verified', 'Rejected') | DEFAULT 'Pending' | Account verification status |
| verified_by_admin | INT | | Admin user_id who verified |
| verified_at | TIMESTAMP | | Verification timestamp |
| total_dormitories | INT | DEFAULT 0 | Total dormitories owned |
| total_rooms | INT | DEFAULT 0 | Total rooms managed |
| years_in_business | INT | | Years operating |
| business_address | VARCHAR(255) | | Business office address |

**Foreign Keys:**
- FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
- FOREIGN KEY (verified_by_admin) REFERENCES users(user_id)

**Indexes:**
- PRIMARY KEY (owner_profile_id)
- UNIQUE (user_id)
- UNIQUE (registration_number)
- UNIQUE (id_number)
- INDEX (verification_status)

---

### 4. **dormitories** Table
Main dormitory/housing facility records

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| dormitory_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique dormitory identifier |
| owner_id | INT | FOREIGN KEY (users.user_id) | Owner/manager reference |
| name | VARCHAR(150) | NOT NULL | Dormitory name |
| description | TEXT | | Detailed description |
| location | VARCHAR(100) | | Location/area name |
| full_address | VARCHAR(255) | NOT NULL | Complete street address |
| barangay | VARCHAR(100) | | Barangay/village name |
| city_municipality | VARCHAR(100) | | City/municipality |
| province | VARCHAR(100) | | Province name |
| postal_code | VARCHAR(20) | | Postal code |
| latitude | DECIMAL(10, 8) | | GPS latitude |
| longitude | DECIMAL(11, 8) | | GPS longitude |
| phone | VARCHAR(20) | | Contact phone |
| email | VARCHAR(100) | | Contact email |
| total_capacity | INT | NOT NULL | Total bed capacity |
| total_rooms | INT | NOT NULL | Total number of rooms |
| occupied_rooms | INT | DEFAULT 0 | Currently occupied rooms |
| available_rooms | INT | DEFAULT 0 | Currently available rooms |
| base_price | DECIMAL(10, 2) | NOT NULL | Base monthly rent price |
| status | ENUM('Active', 'Inactive', 'Full', 'Maintenance') | DEFAULT 'Active' | Current status |
| registration_status | ENUM('Pending', 'Verified', 'Rejected') | DEFAULT 'Pending' | Admin verification status |
| registration_number | VARCHAR(100) | UNIQUE | Government registration number |
| verified_by_admin | INT | | Admin user_id who verified |
| verified_at | TIMESTAMP | | Verification timestamp |
| established_date | DATE | | When dormitory was established |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update |
| images_json | JSON | | JSON array of image URLs |

**Foreign Keys:**
- FOREIGN KEY (owner_id) REFERENCES users(user_id)
- FOREIGN KEY (verified_by_admin) REFERENCES users(user_id)

**Indexes:**
- PRIMARY KEY (dormitory_id)
- FOREIGN KEY (owner_id)
- UNIQUE (registration_number)
- INDEX (city_municipality)
- INDEX (status)
- INDEX (registration_status)
- SPATIAL INDEX (location_coordinates) ON POINT(latitude, longitude)

---

### 5. **amenities** Table
Master list of available amenities/features

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| amenity_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique amenity identifier |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Amenity name |
| category | VARCHAR(50) | | Category (Facility, Security, Comfort, etc) |
| icon_url | VARCHAR(255) | | Icon/image URL |
| description | TEXT | | Detailed description |
| is_active | BOOLEAN | DEFAULT TRUE | Amenity available status |

**Indexes:**
- PRIMARY KEY (amenity_id)
- UNIQUE (name)
- INDEX (category)

**Sample Data:**
- WiFi, Aircon, Study Area, Laundry, 24/7 Security, CCTV, Gym, Common Kitchen, Hot Water, Water Supply, Rooftop Lounge, Study Lounge, Parking, Pool, Fan Rooms

---

### 6. **dormitory_amenities** Table
Junction table linking dormitories to amenities (Many-to-Many)

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| dormitory_amenity_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique record identifier |
| dormitory_id | INT | FOREIGN KEY (dormitories.dormitory_id) | Reference to dormitory |
| amenity_id | INT | FOREIGN KEY (amenities.amenity_id) | Reference to amenity |
| is_available | BOOLEAN | DEFAULT TRUE | Current availability |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |

**Foreign Keys:**
- FOREIGN KEY (dormitory_id) REFERENCES dormitories(dormitory_id) ON DELETE CASCADE
- FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id) ON DELETE CASCADE

**Indexes:**
- PRIMARY KEY (dormitory_amenity_id)
- UNIQUE (dormitory_id, amenity_id)
- FOREIGN KEY (dormitory_id)
- FOREIGN KEY (amenity_id)

---

### 7. **rooms** Table
Individual room/bed space records

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| room_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique room identifier |
| dormitory_id | INT | FOREIGN KEY (dormitories.dormitory_id) | Parent dormitory |
| room_number | VARCHAR(50) | NOT NULL | Room/unit number |
| floor_number | INT | | Floor level |
| room_type | ENUM('Single', 'Double', 'Dormitory', 'Suite') | | Room type classification |
| capacity | INT | NOT NULL | Maximum occupants |
| current_occupancy | INT | DEFAULT 0 | Current occupants |
| available_slots | INT | DEFAULT 0 | Available bed spaces |
| monthly_rent | DECIMAL(10, 2) | NOT NULL | Monthly rental price |
| room_status | ENUM('Available', 'Occupied', 'Reserved', 'Maintenance', 'Closed') | DEFAULT 'Available' | Current status |
| description | TEXT | | Room description/features |
| image_url | VARCHAR(500) | | Main room image URL |
| virtual_tour_url | VARCHAR(500) | | Virtual tour/walkthrough URL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update |
| images_json | JSON | | JSON array of additional images |

**Foreign Keys:**
- FOREIGN KEY (dormitory_id) REFERENCES dormitories(dormitory_id) ON DELETE CASCADE

**Indexes:**
- PRIMARY KEY (room_id)
- FOREIGN KEY (dormitory_id)
- INDEX (room_number, dormitory_id) - Composite
- INDEX (room_status)
- INDEX (dormitory_id, room_status)

---

### 8. **tenants** Table
Current tenant/occupant records for rooms

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| tenant_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique tenant identifier |
| room_id | INT | FOREIGN KEY (rooms.room_id) | Room occupied |
| user_id | INT | FOREIGN KEY (users.user_id) | Reference to user (if registered) |
| name | VARCHAR(100) | NOT NULL | Full name |
| gender | ENUM('Male', 'Female', 'Other') | | Gender |
| course | VARCHAR(100) | | Academic course |
| year_level | INT | | Year level (1-4) |
| profile_image_url | VARCHAR(255) | | Profile image URL |
| study_habits | VARCHAR(100) | | Study preferences (Quiet, Moderate, Group Study, etc) |
| sleep_schedule | VARCHAR(100) | | Sleep schedule preference (Early Bird, Night Owl, Flexible, etc) |
| cleanliness_level | VARCHAR(50) | | Cleanliness preference (Clean, Very Clean, Moderate, etc) |
| move_in_date | DATE | NOT NULL | Date tenant moved in |
| move_out_date | DATE | | Expected/actual move-out date |
| is_active | BOOLEAN | DEFAULT TRUE | Current occupancy status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update |

**Foreign Keys:**
- FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
- FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL

**Indexes:**
- PRIMARY KEY (tenant_id)
- FOREIGN KEY (room_id)
- FOREIGN KEY (user_id)
- INDEX (is_active)
- INDEX (room_id, is_active)
- INDEX (move_in_date)
- INDEX (move_out_date)

---

### 9. **bookings** Table
Room reservation and booking requests

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| booking_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique booking identifier |
| room_id | INT | FOREIGN KEY (rooms.room_id) | Room being booked |
| student_id | INT | FOREIGN KEY (users.user_id) | Student making booking |
| booking_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When booking was made |
| desired_move_in_date | DATE | NOT NULL | Preferred move-in date |
| desired_move_out_date | DATE | | Expected move-out date |
| booking_status | ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') | DEFAULT 'Pending' | Booking status |
| approved_by_owner | INT | | Owner user_id who approved |
| approved_at | TIMESTAMP | | Approval timestamp |
| number_of_months | INT | | Rental duration in months |
| total_amount | DECIMAL(10, 2) | | Total booking amount |
| notes | TEXT | | Additional booking notes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update |

**Foreign Keys:**
- FOREIGN KEY (room_id) REFERENCES rooms(room_id)
- FOREIGN KEY (student_id) REFERENCES users(user_id)
- FOREIGN KEY (approved_by_owner) REFERENCES users(user_id)

**Indexes:**
- PRIMARY KEY (booking_id)
- FOREIGN KEY (room_id)
- FOREIGN KEY (student_id)
- INDEX (booking_status)
- INDEX (desired_move_in_date)
- INDEX (student_id, booking_status)

---

### 10. **transactions** Table
Payment and financial transaction records

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| transaction_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique transaction identifier |
| booking_id | INT | FOREIGN KEY (bookings.booking_id) | Associated booking |
| room_id | INT | FOREIGN KEY (rooms.room_id) | Room reference |
| student_id | INT | FOREIGN KEY (users.user_id) | Student making payment |
| owner_id | INT | FOREIGN KEY (users.user_id) | Owner receiving payment |
| transaction_type | ENUM('Rent Payment', 'Deposit', 'Refund', 'Maintenance Fee', 'Late Fee') | | Type of transaction |
| amount | DECIMAL(10, 2) | NOT NULL | Transaction amount |
| payment_method | ENUM('Cash', 'Bank Transfer', 'GCash', 'Check', 'Online', 'On-site') | | Payment method |
| payment_status | ENUM('Pending', 'Completed', 'Failed', 'Cancelled') | DEFAULT 'Pending' | Payment status |
| reference_code | VARCHAR(100) | UNIQUE | Payment reference/receipt number |
| paid_at | TIMESTAMP | | Payment completion timestamp |
| due_date | DATE | | Payment due date |
| month_covered | DATE | | Which month/period is this payment for |
| notes | TEXT | | Transaction notes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update |

**Foreign Keys:**
- FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE SET NULL
- FOREIGN KEY (room_id) REFERENCES rooms(room_id)
- FOREIGN KEY (student_id) REFERENCES users(user_id)
- FOREIGN KEY (owner_id) REFERENCES users(user_id)

**Indexes:**
- PRIMARY KEY (transaction_id)
- UNIQUE (reference_code)
- FOREIGN KEY (booking_id)
- FOREIGN KEY (room_id)
- FOREIGN KEY (student_id)
- FOREIGN KEY (owner_id)
- INDEX (payment_status)
- INDEX (transaction_type)
- INDEX (paid_at)
- INDEX (month_covered)
- INDEX (student_id, payment_status)

---

### 11. **tenant_ledger** Table
Payment history and ledger for each tenant

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| ledger_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique ledger identifier |
| tenant_id | INT | FOREIGN KEY (tenants.tenant_id) | Tenant reference |
| room_id | INT | FOREIGN KEY (rooms.room_id) | Room reference |
| month | DATE | | Month of the ledger entry |
| rent_due | DECIMAL(10, 2) | NOT NULL | Rent amount due |
| rent_paid | DECIMAL(10, 2) | DEFAULT 0 | Amount paid |
| balance | DECIMAL(10, 2) | | Outstanding balance |
| status | ENUM('Pending', 'Partial', 'Paid', 'Overdue') | DEFAULT 'Pending' | Payment status |
| payment_date | DATE | | Date of payment |
| notes | TEXT | | Additional notes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |

**Foreign Keys:**
- FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE
- FOREIGN KEY (room_id) REFERENCES rooms(room_id)

**Indexes:**
- PRIMARY KEY (ledger_id)
- FOREIGN KEY (tenant_id)
- FOREIGN KEY (room_id)
- INDEX (month)
- INDEX (status)
- INDEX (tenant_id, month)

---

### 12. **maintenance_requests** Table
Maintenance and facility request tracking

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| maintenance_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique request identifier |
| dormitory_id | INT | FOREIGN KEY (dormitories.dormitory_id) | Dormitory location |
| room_id | INT | FOREIGN KEY (rooms.room_id) | Specific room (if applicable) |
| reported_by | INT | FOREIGN KEY (users.user_id) | User who reported |
| assigned_to | INT | FOREIGN KEY (users.user_id) | Staff/worker assigned |
| category | ENUM('Electrical', 'Plumbing', 'General Repair', 'Cleaning', 'Security', 'Other') | | Issue category |
| title | VARCHAR(150) | NOT NULL | Issue title |
| description | TEXT | NOT NULL | Detailed description |
| urgency | ENUM('Low', 'Medium', 'High', 'Emergency') | DEFAULT 'Medium' | Urgency level |
| status | ENUM('Open', 'In Progress', 'Completed', 'Cancelled') | DEFAULT 'Open' | Current status |
| reported_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Report timestamp |
| completed_at | TIMESTAMP | | Completion timestamp |
| notes | TEXT | | Additional work notes |
| estimated_cost | DECIMAL(10, 2) | | Estimated repair cost |
| actual_cost | DECIMAL(10, 2) | | Actual cost incurred |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |

**Foreign Keys:**
- FOREIGN KEY (dormitory_id) REFERENCES dormitories(dormitory_id)
- FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE SET NULL
- FOREIGN KEY (reported_by) REFERENCES users(user_id)
- FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL

**Indexes:**
- PRIMARY KEY (maintenance_id)
- FOREIGN KEY (dormitory_id)
- FOREIGN KEY (room_id)
- FOREIGN KEY (reported_by)
- FOREIGN KEY (assigned_to)
- INDEX (status)
- INDEX (urgency)
- INDEX (reported_at)

---

### 13. **ratings_reviews** Table
User reviews and ratings for dormitories

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| review_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique review identifier |
| dormitory_id | INT | FOREIGN KEY (dormitories.dormitory_id) | Dormitory being reviewed |
| reviewer_id | INT | FOREIGN KEY (users.user_id) | Student reviewer |
| rating | INT | CHECK (rating >= 1 AND rating <= 5) | Star rating (1-5) |
| title | VARCHAR(150) | NOT NULL | Review title |
| comment | TEXT | | Review text |
| cleanliness_rating | INT | CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5) | Cleanliness score |
| safety_rating | INT | CHECK (safety_rating >= 1 AND safety_rating <= 5) | Safety score |
| value_rating | INT | CHECK (value_rating >= 1 AND value_rating <= 5) | Value for money score |
| amenities_rating | INT | CHECK (amenities_rating >= 1 AND amenities_rating <= 5) | Amenities score |
| owner_behavior_rating | INT | CHECK (owner_behavior_rating >= 1 AND owner_behavior_rating <= 5) | Owner/staff score |
| stay_duration_months | INT | | How long reviewer stayed |
| would_recommend | BOOLEAN | | Would recommend? |
| verified_tenant | BOOLEAN | DEFAULT FALSE | Is verified tenant |
| helpful_count | INT | DEFAULT 0 | Number of helpful votes |
| review_date | DATE | NOT NULL | Date of stay/review |
| posted_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When review was posted |
| is_approved | BOOLEAN | DEFAULT TRUE | Admin approval status |
| is_flagged | BOOLEAN | DEFAULT FALSE | Flagged for review |

**Foreign Keys:**
- FOREIGN KEY (dormitory_id) REFERENCES dormitories(dormitory_id)
- FOREIGN KEY (reviewer_id) REFERENCES users(user_id)

**Indexes:**
- PRIMARY KEY (review_id)
- FOREIGN KEY (dormitory_id)
- FOREIGN KEY (reviewer_id)
- INDEX (rating)
- INDEX (dormitory_id, rating)
- INDEX (posted_at)

---

### 14. **notifications** Table
System notifications for users

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| notification_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique notification identifier |
| user_id | INT | FOREIGN KEY (users.user_id) | Recipient user |
| title | VARCHAR(150) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification message |
| notification_type | ENUM('Booking', 'Payment', 'Maintenance', 'Review', 'System', 'Admin') | | Type of notification |
| related_entity_type | VARCHAR(50) | | Entity type (booking, room, dormitory, etc) |
| related_entity_id | INT | | Entity ID reference |
| is_read | BOOLEAN | DEFAULT FALSE | Read status |
| read_at | TIMESTAMP | | When notification was read |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| expires_at | TIMESTAMP | | Expiration timestamp |

**Foreign Keys:**
- FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE

**Indexes:**
- PRIMARY KEY (notification_id)
- FOREIGN KEY (user_id)
- INDEX (is_read)
- INDEX (user_id, is_read)
- INDEX (created_at)

---

### 15. **lease_contracts** Table
Digital lease/rental agreement records

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| lease_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique lease identifier |
| booking_id | INT | FOREIGN KEY (bookings.booking_id) | Associated booking |
| student_id | INT | FOREIGN KEY (users.user_id) | Tenant/student |
| owner_id | INT | FOREIGN KEY (users.user_id) | Owner/landlord |
| room_id | INT | FOREIGN KEY (rooms.room_id) | Room reference |
| start_date | DATE | NOT NULL | Lease start date |
| end_date | DATE | NOT NULL | Lease end date |
| monthly_rent | DECIMAL(10, 2) | NOT NULL | Monthly rent amount |
| security_deposit | DECIMAL(10, 2) | | Security deposit amount |
| terms_conditions | TEXT | | Lease terms and conditions |
| is_signed | BOOLEAN | DEFAULT FALSE | Digital signature status |
| student_signed_at | TIMESTAMP | | Student signature timestamp |
| owner_signed_at | TIMESTAMP | | Owner signature timestamp |
| lease_status | ENUM('Draft', 'Active', 'Expired', 'Terminated', 'Cancelled') | DEFAULT 'Draft' | Current status |
| document_url | VARCHAR(500) | | PDF/document URL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update |

**Foreign Keys:**
- FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
- FOREIGN KEY (student_id) REFERENCES users(user_id)
- FOREIGN KEY (owner_id) REFERENCES users(user_id)
- FOREIGN KEY (room_id) REFERENCES rooms(room_id)

**Indexes:**
- PRIMARY KEY (lease_id)
- UNIQUE (booking_id)
- FOREIGN KEY (student_id)
- FOREIGN KEY (owner_id)
- FOREIGN KEY (room_id)
- INDEX (start_date)
- INDEX (end_date)
- INDEX (lease_status)

---

### 16. **admin_logs** Table
Administrative actions and audit trail

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| log_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique log identifier |
| admin_id | INT | FOREIGN KEY (users.user_id) | Admin user |
| action | VARCHAR(100) | NOT NULL | Action performed |
| entity_type | VARCHAR(50) | | Entity type affected (Owner, Dormitory, Student, etc) |
| entity_id | INT | | Entity ID affected |
| old_value | JSON | | Previous value (for updates) |
| new_value | JSON | | New value (for updates) |
| description | TEXT | | Detailed description |
| ip_address | VARCHAR(45) | | Admin IP address |
| user_agent | VARCHAR(500) | | Browser/device info |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Action timestamp |

**Foreign Keys:**
- FOREIGN KEY (admin_id) REFERENCES users(user_id)

**Indexes:**
- PRIMARY KEY (log_id)
- FOREIGN KEY (admin_id)
- INDEX (action)
- INDEX (entity_type, entity_id)
- INDEX (created_at)

---

### 17. **dormitory_documents** Table
Store uploaded documents for verification

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| document_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique document identifier |
| dormitory_id | INT | FOREIGN KEY (dormitories.dormitory_id) | Related dormitory |
| owner_id | INT | FOREIGN KEY (users.user_id) | Document owner |
| document_type | VARCHAR(100) | | Type (Registration, License, Tax, Permit, etc) |
| file_name | VARCHAR(255) | NOT NULL | Original file name |
| file_path | VARCHAR(500) | NOT NULL | Server file path |
| file_size | INT | | File size in bytes |
| mime_type | VARCHAR(50) | | File MIME type |
| is_approved | BOOLEAN | DEFAULT FALSE | Approval status |
| approved_by | INT | | Admin user_id who approved |
| verified_at | TIMESTAMP | | Verification timestamp |
| uploaded_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Upload timestamp |
| expires_at | DATE | | Document expiration date |

**Foreign Keys:**
- FOREIGN KEY (dormitory_id) REFERENCES dormitories(dormitory_id)
- FOREIGN KEY (owner_id) REFERENCES users(user_id)
- FOREIGN KEY (approved_by) REFERENCES users(user_id)

**Indexes:**
- PRIMARY KEY (document_id)
- FOREIGN KEY (dormitory_id)
- FOREIGN KEY (owner_id)
- INDEX (document_type)
- INDEX (is_approved)

---

## Key Relationships

```
Users (1) -----> (Many) Student_Profiles
       (1) -----> (Many) Owner_Profiles
       (1) -----> (Many) Dormitories (as owner)
       (1) -----> (Many) Bookings (as student)
       (1) -----> (Many) Transactions (as student/owner)
       (1) -----> (Many) Tenants (as user reference)
       (1) -----> (Many) Maintenance_Requests (as reporter/assignee)
       (1) -----> (Many) Ratings_Reviews (as reviewer)
       (1) -----> (Many) Notifications

Dormitories (1) -----> (Many) Rooms
           (1) -----> (Many) Tenants
           (1) -----> (Many) Amenities (via Dormitory_Amenities)
           (1) -----> (Many) Bookings
           (1) -----> (Many) Ratings_Reviews
           (1) -----> (Many) Maintenance_Requests
           (1) -----> (Many) Dormitory_Documents

Rooms (1) -----> (Many) Tenants
    (1) -----> (Many) Bookings
    (1) -----> (Many) Transactions
    (1) -----> (Many) Tenant_Ledger
    (1) -----> (Many) Maintenance_Requests

Bookings (1) -----> (Many) Transactions
       (1) -----> (1) Lease_Contracts
       (1) -----> (Many) Tenant_Ledger

Tenants (1) -----> (Many) Tenant_Ledger

Amenities (Many) -----> (Many) Dormitories (via Dormitory_Amenities)
```

---

## SQL Creation Script

See `DATABASE_SCHEMA.sql` for the complete CREATE TABLE statements with all constraints, indexes, and sample data.

