# RoomSync Database - Complete Summary

**Project:** RoomSync Room Rental Management System  
**Database Name:** `roomsync_db`  
**Total Tables:** 17  
**Status:** ✅ Ready for Implementation

---

## Quick Reference - All Tables

| # | Table Name | Purpose | Key Fields |
|---|---|---|---|
| 1 | **users** | User accounts | user_id, email, role, password_hash |
| 2 | **student_profiles** | Student details | student_id, user_id, course, year_level |
| 3 | **owner_profiles** | Landlord details | owner_profile_id, user_id, business_name, verification_status |
| 4 | **dormitories** | Facilities | dormitory_id, owner_id, name, location, base_price |
| 5 | **rooms** | Individual units | room_id, dormitory_id, room_number, capacity, monthly_rent |
| 6 | **amenities** | Facility features | amenity_id, name (WiFi, Security, etc.) |
| 7 | **dormitory_amenities** | Links dorms to amenities | dormitory_id, amenity_id |
| 8 | **tenants** | Current occupants | tenant_id, room_id, name, move_in_date |
| 9 | **bookings** | Reservations | booking_id, room_id, student_id, status |
| 10 | **transactions** | Payments | transaction_id, student_id, amount, payment_method |
| 11 | **tenant_ledger** | Monthly rent tracking | ledger_id, tenant_id, month, rent_due, balance |
| 12 | **maintenance_requests** | Facility tickets | maintenance_id, dormitory_id, category, urgency |
| 13 | **ratings_reviews** | User feedback | review_id, dormitory_id, rating (1-5) |
| 14 | **notifications** | User alerts | notification_id, user_id, message, type |
| 15 | **lease_contracts** | Digital agreements | lease_id, student_id, owner_id, terms |
| 16 | **admin_logs** | Audit trail | log_id, admin_id, action, timestamp |
| 17 | **dormitory_documents** | Verification docs | document_id, dormitory_id, file_path |

---

## Database Relationships Map

```
┌─────────────────────────────────────────────────────────┐
│ USERS (root entity - all user types)                   │
│ - user_id (PK)                                         │
│ - email, password_hash, role                           │
└────────────┬──────────────────────┬────────────────────┘
             │                      │
      ┌──────▼─────────┐    ┌──────▼────────────┐
      │ STUDENT_       │    │ OWNER_PROFILES   │
      │ PROFILES       │    │ verification_    │
      │ student_id#    │    │ status           │
      └────────────────┘    └──────┬───────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │ DORMITORIES (facilities)   │
                    │ dormitory_id, owner_id     │
                    │ coordinates, status        │
                    └────┬──────────────────┬────┘
                         │                  │
              ┌──────────▼──┐    ┌─────────▼──────────┐
              │ ROOMS       │    │ DORMITORY_         │
              │ room_id,    │    │ AMENITIES          │
              │ room_number │    │ (junction table)   │
              └────┬────────┘    └────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    ┌───▼─────┐      ┌───────▼──────┐
    │ TENANTS │      │ BOOKINGS     │
    │ (active)│      │ (pending/    │
    │         │      │ confirmed)   │
    └─────────┘      └───┬──────────┘
                        │
                    ┌───▼──────────────────┐
                    │ TRANSACTIONS (flow)  │
                    │ booking_id, amount   │
                    │ payment_status       │
                    └──────────────────────┘
                         │
                    ┌────▼─────────────────┐
                    │ TENANT_LEDGER        │
                    │ (monthly tracking)   │
                    │ rent_due, balance    │
                    └──────────────────────┘

Side Services:
├─ MAINTENANCE_REQUESTS (facility tickets)
├─ RATINGS_REVIEWS (feedback)
├─ NOTIFICATIONS (user alerts)
├─ LEASE_CONTRACTS (agreements)
├─ DORMITORY_DOCUMENTS (verification)
└─ ADMIN_LOGS (audit trail)
```

---

## Key Data Flows

### 1. Dormitory Discovery Flow
```
Student browses /find-dormitory
    ↓
Query: SELECT dormitories WITH amenities, reviews, availability
    ↓
Display list with filtering (city, price, amenities)
    ↓
Student clicks dormitory
    ↓
Query: GET dormitory details + rooms + reviews
    ↓
Show individual rooms, tenant profiles, booking form
```

### 2. Booking & Payment Flow
```
Student submits booking request
    ├─ INSERT INTO bookings (status='Pending')
    ├─ CREATE NOTIFICATION to owner
    └─ Student waits for approval

Owner approves booking
    ├─ UPDATE bookings (status='Confirmed')
    ├─ INSERT INTO lease_contracts (status='Draft')
    ├─ CREATE NOTIFICATION to student
    └─ Generate lease for signatures

Student signs lease + makes first payment
    ├─ UPDATE lease_contracts (status='Active')
    ├─ INSERT INTO transactions (Rent Payment)
    ├─ UPDATE tenant_ledger
    ├─ INSERT INTO tenants (is_active=TRUE)
    ├─ UPDATE rooms (occupancy++)
    └─ CREATE NOTIFICATION confirmations

Monthly payments
    ├─ INSERT INTO transactions (payment_method, reference_code)
    ├─ UPDATE tenant_ledger (rent_paid, balance, status)
    ├─ NOTIFICATIONS to both parties
    └─ Track late payments automatically
```

### 3. Owner Revenue Tracking Flow
```
Owner views dashboard
    ├─ Query: SUM(transactions) WHERE owner_id = ? AND payment_status='Completed'
    ├─ Query: SELECT tenant_ledger to see which tenants owe money
    ├─ Query: SELECT maintenance requests and costs
    └─ Display revenue chart + outstanding payments

Owner collects payment
    ├─ INSERT INTO transactions
    ├─ UPDATE tenant_ledger
    └─ NOTIFICATION to both parties
```

### 4. Maintenance Request Flow
```
Tenant reports maintenance issue
    ├─ INSERT INTO maintenance_requests (status='Open')
    ├─ CREATE NOTIFICATION to owner
    └─ Attach images/details

Owner acknowledges and assigns to worker
    ├─ UPDATE maintenance_requests (status='In Progress', assigned_to)
    ├─ CREATE NOTIFICATION to tenant
    └─ Optional: Link to relevant room/tenant

Worker completes maintenance
    ├─ UPDATE maintenance_requests (status='Completed', completed_at)
    ├─ Record actual_cost
    └─ NOTIFICATION to tenant (resolved)

If cost involved:
    ├─ INSERT INTO transactions (Maintenance Fee)
    ├─ NOTIFICATION to tenant (new charge)
    └─ Track in tenant_ledger
```

### 5. Review & Rating Flow
```
Tenant moves out or completes stay
    ├─ Invite to leave review
    └─ POST /api/reviews

Tenant submits review
    ├─ INSERT INTO ratings_reviews (is_approved=FALSE initially)
    ├─ Admin reviews for appropriateness
    ├─ UPDATE ratings_reviews (is_approved=TRUE or FALSE)
    └─ Recalculate dormitory average rating

Display on dormitory page
    ├─ Show only is_approved=TRUE reviews
    ├─ Display helpful vote count
    ├─ Highlight verified tenant badges
    └─ Sort by date or helpful count
```

---

## Sample Data Included

### Pre-populated Amenities (15 types)
- WiFi, Aircon, Study Area, Laundry
- 24/7 Security, CCTV, Gym
- Common Kitchen, Hot Water, Water Supply
- Rooftop Lounge, Study Lounge, Parking, Pool, Fan Rooms

### Sample Users Created
```sql
-- Admin account (for verification/management)
admin@roomsync.com / role='admin'

-- Owner account (for testing landlord features)
owner@roomsync.com / role='owner'
```

### Sample Dormitory Created
```
Name: Arasof Student Lodge
Location: Bucana, Nasugbu, Batangas
Coordinates: 14.0711, 120.6328
Owner: Maria Santos
Status: Active & Verified
Amenities: WiFi, Study Area, 24/7 Security, Water Supply, Common Kitchen
```

### Sample Rooms
```
Room 101: Dormitory (6 capacity, 2 available) - ₱2,500/month
Room 102: Double (2 capacity, 1 available) - ₱2,000/month
```

---

## Essential Indexes for Performance

All critical queries have indexes on:
- `users`: email, role, phone
- `dormitories`: owner_id, city, status, registration_status, location (spatial)
- `rooms`: dormitory_id, status
- `transactions`: booking_id, student_id, owner_id, payment_status, month_covered
- `tenant_ledger`: tenant_id, month, status
- `bookings`: room_id, student_id, status
- `maintenance_requests`: dormitory_id, status, urgency
- `ratings_reviews`: dormitory_id, rating
- `notifications`: user_id, is_read
- `tenants`: room_id, is_active

---

## Connection Information (XAMPP Default)

```
Host:     localhost
Port:     3306
Username: root
Password: (empty)
Database: roomsync_db
```

### Test Connection in MySQL:
```sql
USE roomsync_db;
SHOW TABLES;
SELECT COUNT(*) as table_count FROM information_schema.TABLES WHERE TABLE_SCHEMA='roomsync_db';
-- Should show: 17
```

---

## File Manifest

| File | Purpose | Size | Status |
|------|---------|------|--------|
| `DATABASE_SCHEMA.sql` | SQL creation script | ~400 lines | ✅ Ready to run |
| `DATABASE_SETUP_GUIDE.md` | Setup instructions & reference | ~600 lines | ✅ Complete |
| `API_STRUCTURE.md` | Backend API endpoints guide | ~700 lines | ✅ Complete |
| `DATABASE_COMPLETE_SUMMARY.md` | This file - quick reference | ~350 lines | ✅ This document |

---

## Implementation Checklist

### Phase 1: Database Setup
- [ ] Run DATABASE_SCHEMA.sql in MySQL
- [ ] Verify 17 tables created: `SHOW TABLES;`
- [ ] Test sample data: `SELECT * FROM users;`
- [ ] Verify indexes: `SHOW INDEXES FROM dormitories;`

### Phase 2: Backend API Development
- [ ] Create Node.js/Express API or PHP REST endpoints
- [ ] Implement authentication endpoints (register, login)
- [ ] Create dormitory listing and search endpoints
- [ ] Build booking and payment processing
- [ ] Add notification system
- [ ] Implement admin verification workflows

### Phase 3: Frontend Integration
- [ ] Replace mockData.ts with API calls
- [ ] Install axios or fetch wrapper
- [ ] Create custom hooks for API calls (useStudents, useDormitories, etc.)
- [ ] Add error handling and loading states
- [ ] Implement authentication context with JWT tokens
- [ ] Add role-based UI rendering (student vs owner vs admin)

### Phase 4: Testing & Refinement
- [ ] Unit test database queries
- [ ] Integration test API endpoints
- [ ] End-to-end test user workflows
- [ ] Performance testing for large datasets
- [ ] Security audit (SQL injection, XSS, etc.)

### Phase 5: Production Deployment
- [ ] Set up production database with backups
- [ ] Configure environment variables (host, port, credentials)
- [ ] Enable SSL/HTTPS
- [ ] Set up automated backups
- [ ] Monitor database performance
- [ ] Plan database scaling strategy

---

## Key Statistics

- **Total Entities:** 17 tables
- **Total Relationships:** 20+ foreign keys
- **Indexes:** 45+ performance indexes
- **Supported Users:** Scalable (no hard limits)
- **Monthly Transactions:** Unlimited
- **Data Types:** 8 (INT, VARCHAR, DECIMAL, DATE, TIMESTAMP, ENUM, JSON, TEXT)
- **Constraints:** Comprehensive (PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK)

---

## Next Immediate Actions

1. **Execute DATABASE_SCHEMA.sql** to create the database
   ```bash
   mysql -u root -p < DATABASE_SCHEMA.sql
   ```

2. **Verify database created**
   ```sql
   USE roomsync_db;
   SHOW TABLES;
   ```

3. **Begin backend API development** using API_STRUCTURE.md as reference

4. **Update React components** to call API endpoints instead of mockData

5. **Implement authentication** with JWT tokens and role-based access

---

## Support & Troubleshooting

### Common Issues

**Q: Foreign key constraint errors?**  
A: Ensure parent tables exist and referenced IDs match

**Q: Duplicate key error on email/phone?**  
A: Database enforces UNIQUE constraints - verify data in INSERT statements

**Q: API returns 404 for search?**  
A: Check indexes are created and query filters match table structure

**Q: Payment not showing in ledger?**  
A: Ensure transaction payment_status='Completed' before ledger update

### Performance Optimization

- Add caching layer (Redis) for frequently accessed dormitories
- Paginate search results (limit 20 per page)
- Use database connection pooling
- Archive old transactions (> 2 years)
- Regular OPTIMIZE TABLE maintenance

---

**Database Status:** ✅ Complete and Ready for Implementation  
**Last Updated:** May 17, 2026  
**Total Documentation:** 3 guides + this summary = ~1,650 lines of comprehensive documentation

