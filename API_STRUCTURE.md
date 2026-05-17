# RoomSync API Structure & Data Flow

**Purpose:** Guide for connecting React frontend to MySQL database via backend API

---

## Database Connection Flow

```
Frontend (React/TypeScript)
    ↓
HTTP Requests (fetch/axios)
    ↓
Backend API (Node.js/Express or PHP)
    ↓
Database Queries
    ↓
MySQL (roomsync_db)
    ↓
Response JSON
    ↓
React Components Update
```

---

## Core API Endpoints

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Request Body:
{
    "email": "student@university.com",
    "password": "hashed_password",
    "role": "student",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "09123456789"
}

Database Operation:
INSERT INTO users (email, password_hash, role, first_name, last_name, phone)
VALUES (?, ?, ?, ?, ?, ?)
```

#### Login User
```
POST /api/auth/login
Request Body:
{
    "email": "student@university.com",
    "password": "user_password"
}

Database Operation:
SELECT * FROM users WHERE email = ?
- Check password_hash
- Return JWT token + user data
```

#### Get Current User Profile
```
GET /api/auth/me
Headers: { Authorization: "Bearer {token}" }

Database Operations:
SELECT * FROM users WHERE user_id = ?
SELECT * FROM student_profiles WHERE user_id = ?
-- OR
SELECT * FROM owner_profiles WHERE user_id = ?
```

---

### Dormitory Endpoints

#### Search/List Dormitories
```
GET /api/dormitories?city=Nasugbu&price_min=2000&price_max=4000&amenities=WiFi,Security
Response:
[
    {
        "dormitory_id": 1,
        "name": "Arasof Student Lodge",
        "location": "Bucana, Nasugbu",
        "base_price": 2500,
        "available_rooms": 3,
        "rating": 4.5,
        "amenities": ["WiFi", "Study Area", "24/7 Security"],
        "images": ["image1.jpg", "image2.jpg"],
        "latitude": 14.0711,
        "longitude": 120.6328
    }
]

Database Query:
SELECT d.*, 
       GROUP_CONCAT(a.name) as amenities,
       AVG(rr.rating) as rating
FROM dormitories d
LEFT JOIN dormitory_amenities da ON d.dormitory_id = da.dormitory_id
LEFT JOIN amenities a ON da.amenity_id = a.amenity_id
LEFT JOIN ratings_reviews rr ON d.dormitory_id = rr.dormitory_id
WHERE d.city_municipality = ? AND d.base_price BETWEEN ? AND ?
      AND d.status = 'Active' AND d.registration_status = 'Verified'
GROUP BY d.dormitory_id
```

#### Get Dormitory Details
```
GET /api/dormitories/1
Response:
{
    "dormitory_id": 1,
    "name": "Arasof Student Lodge",
    "owner": {
        "user_id": 5,
        "name": "Maria Santos",
        "phone": "09123456789"
    },
    "description": "...",
    "location": {...},
    "rooms": [...],
    "amenities": [...],
    "reviews": [...]
}

Database Queries:
SELECT d.* FROM dormitories WHERE dormitory_id = ?
SELECT u.* FROM users u JOIN dormitories d ON u.user_id = d.owner_id WHERE d.dormitory_id = ?
SELECT r.* FROM rooms WHERE dormitory_id = ?
SELECT a.* FROM amenities a JOIN dormitory_amenities da ON a.amenity_id = da.amenity_id WHERE da.dormitory_id = ?
SELECT rr.* FROM ratings_reviews WHERE dormitory_id = ?
```

#### Get Rooms in Dormitory
```
GET /api/dormitories/1/rooms
Response:
[
    {
        "room_id": 1,
        "room_number": "101",
        "capacity": 6,
        "available_slots": 2,
        "monthly_rent": 2500,
        "status": "Available",
        "images": ["room1.jpg"],
        "tenants": [
            {
                "name": "Maria Clara Santos",
                "gender": "Female",
                "course": "BS Computer Science",
                "study_habits": "Quiet Study"
            }
        ]
    }
]

Database Query:
SELECT r.*, 
       COUNT(t.tenant_id) as occupancy,
       r.capacity - COUNT(CASE WHEN t.is_active = TRUE THEN 1 END) as available_slots
FROM rooms r
LEFT JOIN tenants t ON r.room_id = t.room_id
WHERE r.dormitory_id = ? AND r.room_status = 'Available'
GROUP BY r.room_id
```

#### Create Dormitory (Owner)
```
POST /api/dormitories
Headers: { Authorization: "Bearer {token}" }
Request Body:
{
    "name": "New Dormitory",
    "description": "...",
    "location": "...",
    "full_address": "...",
    "city_municipality": "Nasugbu",
    "total_capacity": 20,
    "base_price": 3000,
    "amenities": [1, 2, 3]
}

Database Operations:
INSERT INTO dormitories (owner_id, name, description, ...)
VALUES (?, ?, ?, ...)
GET @dorm_id = LAST_INSERT_ID()

INSERT INTO dormitory_amenities (dormitory_id, amenity_id)
VALUES (@dorm_id, 1), (@dorm_id, 2), (@dorm_id, 3)

CREATE NOTIFICATION for admin verification
```

---

### Room Endpoints

#### Get Room Details
```
GET /api/rooms/1
Response:
{
    "room_id": 1,
    "room_number": "101",
    "dormitory": {...},
    "capacity": 6,
    "occupancy": 4,
    "available_slots": 2,
    "monthly_rent": 2500,
    "current_tenants": [...],
    "images": [...]
}

Database Query:
SELECT r.* FROM rooms WHERE room_id = ?
SELECT COUNT(*) FROM tenants WHERE room_id = ? AND is_active = TRUE
```

#### Update Room Availability
```
PUT /api/rooms/1/status
Request Body:
{
    "status": "Maintenance",
    "notes": "Air-con repair"
}

Database Operations:
UPDATE rooms SET room_status = ? WHERE room_id = ?
CREATE NOTIFICATION about room status change
```

---

### Booking Endpoints

#### Create Booking
```
POST /api/bookings
Headers: { Authorization: "Bearer {token}" }
Request Body:
{
    "room_id": 1,
    "desired_move_in_date": "2026-06-01",
    "desired_move_out_date": "2027-06-01",
    "number_of_months": 12,
    "notes": "First time renting"
}

Database Operations:
INSERT INTO bookings (room_id, student_id, booking_date, desired_move_in_date, ...)
VALUES (?, ?, NOW(), ?, ...)

CREATE NOTIFICATION to owner: "New booking request for Room 101"
```

#### Approve Booking (Owner)
```
PUT /api/bookings/1/approve
Headers: { Authorization: "Bearer {token}" }
Request Body:
{
    "approved": true
}

Database Operations:
UPDATE bookings SET booking_status = 'Confirmed', approved_by_owner = ?, approved_at = NOW()
WHERE booking_id = ?

UPDATE rooms SET room_status = 'Reserved' WHERE room_id = ?

CREATE LEASE_CONTRACT with 'Draft' status

CREATE NOTIFICATION to student: "Your booking has been approved!"
```

#### Get Student Bookings
```
GET /api/bookings/my-bookings
Headers: { Authorization: "Bearer {token}" }
Response:
[
    {
        "booking_id": 1,
        "room": {...},
        "dormitory": {...},
        "status": "Confirmed",
        "move_in": "2026-06-01",
        "move_out": "2027-06-01"
    }
]

Database Query:
SELECT b.*, r.*, d.* 
FROM bookings b
JOIN rooms r ON b.room_id = r.room_id
JOIN dormitories d ON r.dormitory_id = d.dormitory_id
WHERE b.student_id = ?
ORDER BY b.booking_date DESC
```

---

### Payment/Transaction Endpoints

#### Record Payment
```
POST /api/transactions
Headers: { Authorization: "Bearer {token}" }
Request Body:
{
    "booking_id": 1,
    "amount": 2500,
    "payment_method": "GCash",
    "month_covered": "2026-06-01",
    "reference_code": "GCASH20260515001"
}

Database Operations:
INSERT INTO transactions (booking_id, room_id, student_id, owner_id, 
                         transaction_type, amount, payment_method, 
                         payment_status, reference_code, month_covered, paid_at)
VALUES (?, ?, ?, ?, 'Rent Payment', ?, ?, 'Completed', ?, ?, NOW())

UPDATE tenant_ledger SET rent_paid = ?, balance = (rent_due - ?), status = 'Paid'
WHERE tenant_id = ? AND month = ?

CREATE NOTIFICATION to owner: "New rent payment received"
CREATE NOTIFICATION to student: "Payment confirmed"
```

#### Get Tenant Ledger
```
GET /api/tenants/1/ledger
Response:
[
    {
        "month": "2026-05-01",
        "rent_due": 2500,
        "rent_paid": 2500,
        "balance": 0,
        "status": "Paid",
        "payment_date": "2026-05-15"
    }
]

Database Query:
SELECT * FROM tenant_ledger WHERE tenant_id = ? ORDER BY month DESC
```

#### Get Owner Income Summary
```
GET /api/dormitories/1/income-summary?from_date=2026-01-01&to_date=2026-12-31
Response:
{
    "total_income": 150000,
    "transactions": [
        {
            "date": "2026-05-15",
            "amount": 2500,
            "type": "Rent Payment",
            "student": "John Doe",
            "room": "101"
        }
    ]
}

Database Query:
SELECT t.*, u.first_name, u.last_name, r.room_number
FROM transactions t
JOIN rooms r ON t.room_id = r.room_id
JOIN users u ON t.student_id = u.user_id
WHERE r.dormitory_id = ? AND t.paid_at BETWEEN ? AND ?
ORDER BY t.paid_at DESC
```

---

### Tenant Management Endpoints

#### Add Tenant to Room
```
POST /api/rooms/1/tenants
Headers: { Authorization: "Bearer {token}" }
Request Body:
{
    "name": "Maria Clara Santos",
    "gender": "Female",
    "course": "BS Computer Science",
    "year_level": 2,
    "study_habits": "Quiet Study",
    "sleep_schedule": "Early Bird",
    "cleanliness_level": "Very Organized",
    "move_in_date": "2026-06-01"
}

Database Operations:
INSERT INTO tenants (room_id, name, gender, course, year_level, ...)
VALUES (?, ?, ?, ?, ?, ...)

UPDATE rooms SET current_occupancy = current_occupancy + 1, available_slots = capacity - current_occupancy
WHERE room_id = ?

CREATE TENANT_LEDGER entries for upcoming months
```

#### Move Out Tenant
```
PUT /api/tenants/1/move-out
Headers: { Authorization: "Bearer {token}" }
Request Body:
{
    "move_out_date": "2027-06-01",
    "deposit_refund": 2500
}

Database Operations:
UPDATE tenants SET is_active = FALSE, move_out_date = ? WHERE tenant_id = ?

UPDATE rooms SET current_occupancy = current_occupancy - 1, available_slots = capacity - current_occupancy
WHERE room_id = ?

INSERT INTO transactions (type='Refund', amount=?, payment_status='Completed')

CREATE NOTIFICATION: "Deposit refund processed"
```

---

### Maintenance Endpoints

#### Report Maintenance Issue
```
POST /api/maintenance-requests
Headers: { Authorization: "Bearer {token}" }
Request Body:
{
    "dormitory_id": 1,
    "room_id": 1,
    "category": "Electrical",
    "title": "Light bulb not working",
    "description": "Room 101 - ceiling light flickering",
    "urgency": "Medium"
}

Database Operations:
INSERT INTO maintenance_requests (dormitory_id, room_id, reported_by, category, title, description, urgency, status)
VALUES (?, ?, ?, ?, ?, ?, ?, 'Open')

CREATE NOTIFICATION to owner: "New maintenance request"
```

#### Update Maintenance Status (Owner)
```
PUT /api/maintenance-requests/1/status
Headers: { Authorization: "Bearer {token}" }
Request Body:
{
    "status": "Completed",
    "notes": "Replaced light bulb",
    "actual_cost": 150
}

Database Operations:
UPDATE maintenance_requests SET status = ?, completed_at = NOW(), notes = ?, actual_cost = ?
WHERE maintenance_id = ?

CREATE NOTIFICATION to reporter: "Maintenance completed"
```

---

### Review Endpoints

#### Post Review
```
POST /api/dormitories/1/reviews
Headers: { Authorization: "Bearer {token}" }
Request Body:
{
    "rating": 4,
    "title": "Great place for students",
    "comment": "Clean rooms, helpful owner, good WiFi",
    "cleanliness_rating": 4,
    "safety_rating": 5,
    "value_rating": 4,
    "amenities_rating": 4,
    "owner_behavior_rating": 5,
    "stay_duration_months": 12,
    "would_recommend": true
}

Database Operations:
INSERT INTO ratings_reviews (dormitory_id, reviewer_id, rating, title, comment, ...)
VALUES (?, ?, ?, ?, ?, ...)

UPDATE dormitories SET (recalculate average rating)
```

#### Get Dormitory Reviews
```
GET /api/dormitories/1/reviews?sort=newest&is_approved=true
Response:
[
    {
        "review_id": 1,
        "reviewer": "John Doe",
        "rating": 4,
        "title": "Great place",
        "posted": "2026-05-10",
        "verified_tenant": true,
        "helpful_count": 5
    }
]

Database Query:
SELECT rr.*, u.first_name, u.last_name
FROM ratings_reviews rr
JOIN users u ON rr.reviewer_id = u.user_id
WHERE rr.dormitory_id = ? AND rr.is_approved = TRUE
ORDER BY rr.posted_at DESC
```

---

### Notification Endpoints

#### Get User Notifications
```
GET /api/notifications?limit=20&is_read=false
Headers: { Authorization: "Bearer {token}" }
Response:
[
    {
        "notification_id": 1,
        "title": "New booking request",
        "message": "Room 101 has a new booking request",
        "type": "Booking",
        "related_entity_type": "booking",
        "related_entity_id": 5,
        "created_at": "2026-05-15 14:30:00",
        "is_read": false
    }
]

Database Query:
SELECT * FROM notifications 
WHERE user_id = ? AND (is_read = ? OR is_read IS NULL)
ORDER BY created_at DESC
LIMIT ?
```

#### Mark Notification as Read
```
PUT /api/notifications/1/read
Headers: { Authorization: "Bearer {token}" }

Database Operation:
UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE notification_id = ?
```

---

### Admin Endpoints

#### Verify Owner Account
```
PUT /api/admin/owners/5/verify
Headers: { Authorization: "Bearer {admin_token}" }
Request Body:
{
    "status": "Verified"
}

Database Operations:
UPDATE owner_profiles SET verification_status = ?, verified_by_admin = ?, verified_at = NOW()
WHERE user_id = ?

INSERT INTO admin_logs (admin_id, action, entity_type, entity_id, new_value, description)

CREATE NOTIFICATION to owner: "Your account has been verified"
```

#### Verify Dormitory
```
PUT /api/admin/dormitories/1/verify
Headers: { Authorization: "Bearer {admin_token}" }
Request Body:
{
    "status": "Verified"
}

Database Operations:
UPDATE dormitories SET registration_status = ?, verified_by_admin = ?, verified_at = NOW()
WHERE dormitory_id = ?

INSERT INTO admin_logs (...)

UPDATE dormitories SET status = 'Active'

CREATE NOTIFICATION to owner: "Your dormitory has been verified"
```

#### Approve Review
```
PUT /api/admin/reviews/1/approve
Headers: { Authorization: "Bearer {admin_token}" }
Request Body:
{
    "is_approved": true
}

Database Operation:
UPDATE ratings_reviews SET is_approved = TRUE WHERE review_id = ?
```

#### Get Admin Audit Logs
```
GET /api/admin/logs?entity_type=owner&action=verify&limit=50
Response:
[
    {
        "log_id": 1,
        "admin": "Admin User",
        "action": "verify",
        "entity_type": "owner",
        "entity_id": 5,
        "description": "Owner verification approved",
        "timestamp": "2026-05-15 10:00:00"
    }
]

Database Query:
SELECT al.*, u.first_name, u.last_name
FROM admin_logs al
JOIN users u ON al.admin_id = u.user_id
WHERE (al.entity_type = ? OR ? IS NULL) AND (al.action = ? OR ? IS NULL)
ORDER BY al.created_at DESC
LIMIT ?
```

---

## Error Handling Responses

### Success Response
```json
{
    "success": true,
    "message": "Operation completed successfully",
    "data": {...}
}
```

### Error Response
```json
{
    "success": false,
    "error": "Validation error",
    "message": "Email already exists",
    "details": ["Email must be unique"]
}
```

### Unauthorized Response
```json
{
    "success": false,
    "error": "Unauthorized",
    "message": "Invalid or expired token"
}
```

### Database Error Response
```json
{
    "success": false,
    "error": "Database error",
    "message": "Failed to update record"
}
```

---

## Authentication Workflow

```
1. User logs in with credentials
   └─ POST /api/auth/login
   
2. Backend verifies credentials
   └─ SELECT * FROM users WHERE email = ?
   └─ Compare password_hash
   
3. Backend generates JWT token
   └─ Includes user_id, role, email
   └─ Expires in 24 hours
   
4. Frontend stores token in localStorage
   └─ localStorage.setItem('token', jwt)
   
5. Frontend includes token in subsequent requests
   └─ headers: { Authorization: "Bearer " + token }
   
6. Backend validates token before processing requests
   └─ Verify signature and expiration
   └─ Extract user_id from claims
   └─ Enforce role-based access control
   
7. If token expires
   └─ Frontend redirects to login
   └─ User must re-authenticate
```

---

## Data Validation Rules

### User Registration
- Email: Must be valid email format and unique
- Password: Minimum 8 characters
- Phone: Must be 10-15 digits
- Names: Maximum 100 characters

### Dormitory Creation
- Name: Required, max 150 chars
- Address: Required, max 255 chars
- Capacity: Minimum 1
- Base price: Must be > 0
- Coordinates: Valid latitude/longitude

### Booking Creation
- Room must exist and be available
- Move-in date must be in future
- Move-out date must be after move-in date
- Student can only have one active booking per room

### Payment Transaction
- Amount must match rent due
- Reference code must be unique
- Payment method must be in allowed list

---

## Security Considerations

1. **Password hashing:** Use bcrypt with salt rounds ≥ 10
2. **JWT tokens:** Sign with strong secret, set expiration
3. **CORS:** Allow only frontend domain
4. **Rate limiting:** Limit login attempts
5. **Input validation:** Sanitize all user inputs
6. **SQL injection:** Use prepared statements
7. **Role-based access:** Enforce role permissions
8. **HTTPS:** Use only in production
9. **Sensitive data:** Never log passwords or tokens
10. **Database backups:** Regular automated backups

