# RoomSync Database Setup & Integration Guide

**Database Name:** `roomsync_db`  
**Last Updated:** May 17, 2026

---

## Quick Start

### 1. Create Database
```bash
# Option A: Using MySQL command line
mysql -u root -p < DATABASE_SCHEMA.sql

# Option B: Using PhpMyAdmin (XAMPP)
# 1. Open http://localhost/phpmyadmin
# 2. Click "Import" tab
# 3. Select "DATABASE_SCHEMA.sql"
# 4. Click "Go"
```

### 2. Verify Database Created
```sql
-- In MySQL console
USE roomsync_db;
SHOW TABLES;
-- Should display 17 tables
```

---

## Database Architecture Overview

### Core Entities (17 Tables)

**User Management:**
- `users` - All user accounts
- `student_profiles` - Student-specific data
- `owner_profiles` - Landlord/owner data

**Dormitory Management:**
- `dormitories` - Dormitory facilities
- `rooms` - Individual room units
- `amenities` - Available facility features
- `dormitory_amenities` - Links dormitories to amenities

**Occupancy Management:**
- `tenants` - Current room occupants
- `bookings` - Room reservations/requests
- `lease_contracts` - Digital rental agreements

**Financial Management:**
- `transactions` - All payments and fees
- `tenant_ledger` - Monthly rent tracking per tenant

**Operations:**
- `maintenance_requests` - Maintenance tickets
- `ratings_reviews` - User reviews and ratings
- `dormitory_documents` - Uploaded verification docs
- `admin_logs` - Administrative action audit trail
- `notifications` - User notifications

---

## Database Diagram (Entity Relationships)

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS (Core)                            │
│  user_id, email, role (student|owner|admin), ...               │
└────────────┬───────────────────────────────────┬────────────────┘
             │                                   │
             ├─────────────────────┐             │
             │                     │             │
    ┌────────▼──────────┐   ┌──────▼──────────┐  │
    │ STUDENT_PROFILES  │   │ OWNER_PROFILES  │  │
    └───────────────────┘   └─────────────────┘  │
                                                  │
                                    ┌─────────────▼─────────────────┐
                                    │    DORMITORIES (1 owner)      │
                                    │ dorm_id, name, location, ...  │
                                    └──┬──────────────────────────┬─┘
                                       │                          │
                    ┌──────────────────┼──────────────────┐      │
                    │                  │                  │      │
            ┌───────▼──────┐   ┌──────▼──────┐    ┌─────▼────────────┐
            │    ROOMS     │   │  AMENITIES  │    │ DORMITORY_       │
            │  room_id,    │   │ amenity_id, │    │ AMENITIES        │
            │  room_number │   │    name     │    └──────────────────┘
            └────┬─────────┘   └─────────────┘
                 │
        ┌────────┴──────────┬────────────┐
        │                   │            │
    ┌───▼─────┐   ┌────────▼──────┐  ┌─▼──────────┐
    │ TENANTS │   │   BOOKINGS    │  │ ROOMS-    │
    │(current)│   │ (reservation) │  │ FEATURES  │
    └─────────┘   └────┬──────────┘  └───────────┘
                       │
                   ┌───▼──────────────────┐
                   │ LEASE_CONTRACTS      │
                   │ (signed agreements)  │
                   └───────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   FINANCIAL FLOW                            │
│                                                              │
│  BOOKINGS → TRANSACTIONS → TENANT_LEDGER                   │
│            (payments)      (monthly tracking)               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  OPERATIONS & TRACKING                       │
│                                                              │
│  MAINTENANCE_REQUESTS | RATINGS_REVIEWS | ADMIN_LOGS       │
│  (facility tickets)   | (user feedback)  | (audit trail)   │
│                                                              │
│  NOTIFICATIONS | DORMITORY_DOCUMENTS                        │
│  (alerts)      | (verification docs)                        │
└──────────────────────────────────────────────────────────────┘
```

---

## Field Reference by Table

### USERS
```
user_id (PK)              INT           Unique identifier
email (UNIQUE)            VARCHAR(255)  Login email
password_hash             VARCHAR(255)  Encrypted password
role                      ENUM          'student', 'owner', 'admin'
first_name                VARCHAR(100)  First name
last_name                 VARCHAR(100)  Last name
phone (UNIQUE)            VARCHAR(20)   Contact number
profile_picture_url       VARCHAR(500)  Avatar image URL
is_active                 BOOLEAN       Account enabled
created_at                TIMESTAMP     Registration date
updated_at                TIMESTAMP     Last modified
verified_at               TIMESTAMP     Email verification date
```

### STUDENT_PROFILES
```
student_profile_id (PK)   INT           Unique ID
user_id (FK, UNIQUE)      INT           Link to users
student_id_number         VARCHAR(50)   University ID
course                    VARCHAR(100)  Major/Program
year_level                INT           Year (1-4)
university                VARCHAR(100)  School name
gender                    ENUM          'Male', 'Female', 'Other'
date_of_birth             DATE          DOB
guardian_name             VARCHAR(100)  Emergency contact
guardian_phone            VARCHAR(20)   Contact phone
is_verified_student       BOOLEAN       ID verified by admin
```

### OWNER_PROFILES
```
owner_profile_id (PK)     INT           Unique ID
user_id (FK, UNIQUE)      INT           Link to users
business_name             VARCHAR(100)  Company name
registration_number       VARCHAR(100)  Business reg. number
tax_id                    VARCHAR(50)   Tax ID
id_type                   VARCHAR(50)   Gov. ID type
id_number                 VARCHAR(100)  ID document number
verification_status       ENUM          'Pending', 'Verified', 'Rejected'
verified_by_admin         INT           Admin who approved (FK)
verified_at               TIMESTAMP     Approval date
total_dormitories         INT           Count of properties
total_rooms               INT           Count of rooms
years_in_business         INT           Years operating
business_address          VARCHAR(255)  Office location
```

### DORMITORIES
```
dormitory_id (PK)         INT           Unique ID
owner_id (FK)             INT           Owner reference
name                      VARCHAR(150)  Facility name
description               TEXT          Detailed info
location                  VARCHAR(100)  Area name
full_address              VARCHAR(255)  Street address
barangay                  VARCHAR(100)  Barangay
city_municipality         VARCHAR(100)  City
province                  VARCHAR(100)  Province
postal_code               VARCHAR(20)   Zip code
latitude                  DECIMAL       GPS latitude
longitude                 DECIMAL       GPS longitude
phone                     VARCHAR(20)   Contact phone
email                     VARCHAR(100)  Contact email
total_capacity            INT           Total beds
total_rooms               INT           Room count
occupied_rooms            INT           Occupied count
available_rooms           INT           Available count
base_price                DECIMAL(10,2) Starting rent price
status                    ENUM          'Active', 'Inactive', 'Full', 'Maintenance'
registration_status       ENUM          'Pending', 'Verified', 'Rejected'
registration_number       VARCHAR(100)  Gov. registration
verified_by_admin         INT           Admin who verified (FK)
verified_at               TIMESTAMP     Verification date
established_date          DATE          Opening date
images_json               JSON          Image URLs array
created_at                TIMESTAMP     Record created
updated_at                TIMESTAMP     Last modified
```

### ROOMS
```
room_id (PK)              INT           Unique ID
dormitory_id (FK)         INT           Parent dorm
room_number               VARCHAR(50)   Room/unit number
floor_number              INT           Floor level
room_type                 ENUM          'Single', 'Double', 'Dormitory', 'Suite'
capacity                  INT           Max occupants
current_occupancy         INT           Current count
available_slots           INT           Vacant beds
monthly_rent              DECIMAL       Monthly price
room_status               ENUM          'Available', 'Occupied', 'Reserved', 'Maintenance', 'Closed'
description               TEXT          Room features
image_url                 VARCHAR(500)  Main image
virtual_tour_url          VARCHAR(500)  3D tour link
images_json               JSON          Additional images
created_at                TIMESTAMP     Record created
updated_at                TIMESTAMP     Last modified
```

### TENANTS
```
tenant_id (PK)            INT           Unique ID
room_id (FK)              INT           Room occupied
user_id (FK)              INT           User reference (optional)
name                      VARCHAR(100)  Full name
gender                    ENUM          'Male', 'Female', 'Other'
course                    VARCHAR(100)  Academic program
year_level                INT           Year (1-4)
profile_image_url         VARCHAR(255)  Avatar
study_habits              VARCHAR(100)  Study preference
sleep_schedule            VARCHAR(100)  Sleep preference
cleanliness_level         VARCHAR(50)   Cleanliness preference
move_in_date              DATE          Check-in date
move_out_date             DATE          Check-out date
is_active                 BOOLEAN       Currently occupying
created_at                TIMESTAMP     Record created
updated_at                TIMESTAMP     Last modified
```

### BOOKINGS
```
booking_id (PK)           INT           Unique ID
room_id (FK)              INT           Room requested
student_id (FK)           INT           Student (users)
booking_date              TIMESTAMP     Request timestamp
desired_move_in_date      DATE          Preferred date
desired_move_out_date     DATE          Expected exit date
booking_status            ENUM          'Pending', 'Confirmed', 'Cancelled', 'Completed'
approved_by_owner         INT           Owner approval (FK)
approved_at               TIMESTAMP     Approval timestamp
number_of_months          INT           Lease duration
total_amount              DECIMAL       Total cost
notes                     TEXT          Special requests
created_at                TIMESTAMP     Record created
updated_at                TIMESTAMP     Last modified
```

### TRANSACTIONS
```
transaction_id (PK)       INT           Unique ID
booking_id (FK)           INT           Related booking
room_id (FK)              INT           Room reference
student_id (FK)           INT           Payer (users)
owner_id (FK)             INT           Recipient (users)
transaction_type          ENUM          'Rent Payment', 'Deposit', 'Refund', 'Maintenance Fee', 'Late Fee'
amount                    DECIMAL       Payment amount
payment_method            ENUM          'Cash', 'Bank Transfer', 'GCash', 'Check', 'Online', 'On-site'
payment_status            ENUM          'Pending', 'Completed', 'Failed', 'Cancelled'
reference_code            VARCHAR(100)  Receipt/reference
paid_at                   TIMESTAMP     Payment completion
due_date                  DATE          Payment deadline
month_covered             DATE          Billing period
notes                     TEXT          Payment notes
created_at                TIMESTAMP     Record created
updated_at                TIMESTAMP     Last modified
```

### TENANT_LEDGER
```
ledger_id (PK)            INT           Unique ID
tenant_id (FK)            INT           Tenant reference
room_id (FK)              INT           Room reference
month                     DATE          Month/period
rent_due                  DECIMAL       Amount due
rent_paid                 DECIMAL       Amount paid
balance                   DECIMAL       Outstanding
status                    ENUM          'Pending', 'Partial', 'Paid', 'Overdue'
payment_date              DATE          Payment date
notes                     TEXT          Ledger notes
created_at                TIMESTAMP     Record created
```

### MAINTENANCE_REQUESTS
```
maintenance_id (PK)       INT           Unique ID
dormitory_id (FK)         INT           Facility location
room_id (FK)              INT           Specific room (optional)
reported_by (FK)          INT           Reporter (users)
assigned_to (FK)          INT           Assignee (users)
category                  ENUM          'Electrical', 'Plumbing', 'General Repair', 'Cleaning', 'Security', 'Other'
title                     VARCHAR(150)  Issue title
description               TEXT          Issue details
urgency                   ENUM          'Low', 'Medium', 'High', 'Emergency'
status                    ENUM          'Open', 'In Progress', 'Completed', 'Cancelled'
reported_at               TIMESTAMP     Report date
completed_at              TIMESTAMP     Completion date
notes                     TEXT          Work notes
estimated_cost            DECIMAL       Estimate
actual_cost               DECIMAL       Final cost
created_at                TIMESTAMP     Record created
```

### RATINGS_REVIEWS
```
review_id (PK)            INT           Unique ID
dormitory_id (FK)         INT           Dorm reviewed
reviewer_id (FK)          INT           Reviewer (users)
rating                    INT           Overall (1-5)
title                     VARCHAR(150)  Review title
comment                   TEXT          Review text
cleanliness_rating        INT           Cleanliness (1-5)
safety_rating             INT           Safety (1-5)
value_rating              INT           Value (1-5)
amenities_rating          INT           Amenities (1-5)
owner_behavior_rating     INT           Owner/Staff (1-5)
stay_duration_months      INT           How long stayed
would_recommend           BOOLEAN       Recommend?
verified_tenant           BOOLEAN       Verified occupant
helpful_count             INT           Helpful votes
review_date               DATE          Stay date
posted_at                 TIMESTAMP     Posted date
is_approved               BOOLEAN       Admin approved
is_flagged                BOOLEAN       Flagged status
```

### NOTIFICATIONS
```
notification_id (PK)      INT           Unique ID
user_id (FK)              INT           Recipient (users)
title                     VARCHAR(150)  Title
message                   TEXT          Message body
notification_type         ENUM          'Booking', 'Payment', 'Maintenance', 'Review', 'System', 'Admin'
related_entity_type       VARCHAR(50)   Entity type
related_entity_id         INT           Entity reference
is_read                   BOOLEAN       Read status
read_at                   TIMESTAMP     Read date
created_at                TIMESTAMP     Created date
expires_at                TIMESTAMP     Expiration date
```

### LEASE_CONTRACTS
```
lease_id (PK)             INT           Unique ID
booking_id (FK)           INT           Associated booking
student_id (FK)           INT           Tenant (users)
owner_id (FK)             INT           Landlord (users)
room_id (FK)              INT           Room reference
start_date                DATE          Lease begins
end_date                  DATE          Lease ends
monthly_rent              DECIMAL       Monthly amount
security_deposit          DECIMAL       Deposit amount
terms_conditions          TEXT          Legal terms
is_signed                 BOOLEAN       Fully signed
student_signed_at         TIMESTAMP     Student signature
owner_signed_at           TIMESTAMP     Owner signature
lease_status              ENUM          'Draft', 'Active', 'Expired', 'Terminated', 'Cancelled'
document_url              VARCHAR(500)  PDF document link
created_at                TIMESTAMP     Record created
updated_at                TIMESTAMP     Last modified
```

### ADMIN_LOGS
```
log_id (PK)               INT           Unique ID
admin_id (FK)             INT           Admin user (users)
action                    VARCHAR(100)  Action type
entity_type               VARCHAR(50)   Entity type affected
entity_id                 INT           Entity reference
old_value                 JSON          Previous values
new_value                 JSON          New values
description               TEXT          Action details
ip_address                VARCHAR(45)   Admin IP
user_agent                VARCHAR(500)  Browser info
created_at                TIMESTAMP     Action date
```

### DORMITORY_DOCUMENTS
```
document_id (PK)          INT           Unique ID
dormitory_id (FK)         INT           Dorm reference
owner_id (FK)             INT           Owner (users)
document_type             VARCHAR(100)  Doc type
file_name                 VARCHAR(255)  Filename
file_path                 VARCHAR(500)  Server path
file_size                 INT           Bytes
mime_type                 VARCHAR(50)   File type
is_approved               BOOLEAN       Admin approval
approved_by               INT           Admin (users)
verified_at               TIMESTAMP     Verification date
uploaded_at               TIMESTAMP     Upload date
expires_at                DATE          Expiration date
```

---

## Integration with React/TypeScript Frontend

### API Endpoint Patterns

```typescript
// Users
GET    /api/users/:user_id
POST   /api/users/register
POST   /api/users/login
PUT    /api/users/:user_id

// Dormitories
GET    /api/dormitories
GET    /api/dormitories/:dorm_id
POST   /api/dormitories (owner only)
PUT    /api/dormitories/:dorm_id (owner only)
GET    /api/dormitories/:dorm_id/rooms
GET    /api/dormitories/:dorm_id/amenities
GET    /api/dormitories/:dorm_id/reviews

// Rooms
GET    /api/rooms/:room_id
POST   /api/rooms (owner only)
PUT    /api/rooms/:room_id (owner only)
GET    /api/rooms/:room_id/tenants

// Bookings
POST   /api/bookings (student)
GET    /api/bookings/:booking_id
PUT    /api/bookings/:booking_id/approve (owner)
PUT    /api/bookings/:booking_id/cancel (student)

// Payments
POST   /api/transactions (student)
GET    /api/transactions/:transaction_id
GET    /api/students/:student_id/ledger
GET    /api/dormitories/:dorm_id/transactions (owner)

// Maintenance
POST   /api/maintenance-requests (student/owner)
GET    /api/maintenance-requests/:id
PUT    /api/maintenance-requests/:id/status (owner)

// Reviews
POST   /api/reviews (student)
GET    /api/reviews/dorm/:dorm_id
PUT    /api/reviews/:review_id (admin - approve/flag)

// Notifications
GET    /api/notifications/user/:user_id
PUT    /api/notifications/:notification_id/read

// Admin
POST   /api/admin/verify/owner/:owner_id (admin)
POST   /api/admin/verify/dormitory/:dorm_id (admin)
GET    /api/admin/logs
```

---

## Sample Queries

### Get all available dormitories with amenities
```sql
SELECT 
    d.dormitory_id,
    d.name,
    d.location,
    d.base_price,
    d.available_rooms,
    GROUP_CONCAT(a.name SEPARATOR ', ') as amenities
FROM dormitories d
LEFT JOIN dormitory_amenities da ON d.dormitory_id = da.dormitory_id
LEFT JOIN amenities a ON da.amenity_id = a.amenity_id
WHERE d.status = 'Active' AND d.registration_status = 'Verified'
GROUP BY d.dormitory_id
ORDER BY d.base_price ASC;
```

### Get student's monthly ledger for a specific room
```sql
SELECT 
    month,
    rent_due,
    rent_paid,
    balance,
    status
FROM tenant_ledger
WHERE tenant_id = ? AND room_id = ?
ORDER BY month DESC;
```

### Get owner's total income from all dormitories
```sql
SELECT 
    d.name as dormitory_name,
    SUM(t.amount) as total_income,
    COUNT(DISTINCT t.transaction_id) as transaction_count
FROM dormitories d
LEFT JOIN rooms r ON d.dormitory_id = r.dormitory_id
LEFT JOIN transactions t ON r.room_id = t.room_id AND t.payment_status = 'Completed'
WHERE d.owner_id = ?
GROUP BY d.dormitory_id;
```

### Get pending maintenance requests for a dormitory
```sql
SELECT 
    m.maintenance_id,
    m.title,
    m.category,
    m.urgency,
    m.status,
    u.first_name as reported_by
FROM maintenance_requests m
JOIN users u ON m.reported_by = u.user_id
WHERE m.dormitory_id = ? AND m.status IN ('Open', 'In Progress')
ORDER BY m.urgency DESC, m.reported_at ASC;
```

---

## Database Backup & Maintenance

### Backup Database
```bash
# Backup to file
mysqldump -u root -p roomsync_db > roomsync_backup.sql

# Restore from backup
mysql -u root -p roomsync_db < roomsync_backup.sql
```

### Regular Maintenance Tasks
```sql
-- Optimize all tables
OPTIMIZE TABLE users, dormitories, rooms, bookings, transactions, tenants;

-- Update room availability counts
UPDATE rooms r SET 
    available_slots = capacity - (
        SELECT COUNT(*) FROM tenants t 
        WHERE t.room_id = r.room_id AND t.is_active = TRUE
    );

-- Update dormitory availability counts
UPDATE dormitories d SET 
    occupied_rooms = (
        SELECT COUNT(DISTINCT r.room_id) FROM rooms r 
        LEFT JOIN tenants t ON r.room_id = t.room_id 
        WHERE r.dormitory_id = d.dormitory_id AND t.is_active = TRUE
    ),
    available_rooms = total_rooms - (
        SELECT COUNT(DISTINCT r.room_id) FROM rooms r 
        LEFT JOIN tenants t ON r.room_id = t.room_id 
        WHERE r.dormitory_id = d.dormitory_id AND t.is_active = TRUE
    );

-- Mark overdue payments
UPDATE tenant_ledger SET status = 'Overdue' 
WHERE status != 'Paid' AND month < DATE_SUB(CURDATE(), INTERVAL 1 DAY);
```

---

## Connection Details (XAMPP)

**Database Server:** `localhost`  
**Port:** `3306`  
**Username:** `root`  
**Password:** `` (empty by default)  
**Database:** `roomsync_db`

### PHP Connection Example
```php
<?php
$conn = new mysqli('localhost', 'root', '', 'roomsync_db');
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}
echo 'Connected successfully';
?>
```

### Node.js Connection Example
```javascript
const mysql = require('mysql2/promise');

const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'roomsync_db'
});

console.log('Connected to RoomSync database');
```

---

## Next Steps

1. **Run the SQL schema** to create all tables
2. **Test database connections** from your backend
3. **Create API endpoints** for each entity
4. **Update mockData.ts** to fetch from database instead
5. **Implement authentication** with user roles
6. **Add form validation** before database inserts
7. **Set up error handling** for database operations
8. **Configure backups** for production environment

---

**Status:** Database schema ready for implementation  
**Tables:** 17  
**Relationships:** Fully normalized  
**Ready for:** Backend API development

