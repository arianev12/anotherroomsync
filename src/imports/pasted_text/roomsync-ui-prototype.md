Design a modern **web-based system UI prototype** called:

**“RoomSync: A Smart Dormitory Operations Management System”**

The design should be **clean, minimal, and professional**, using:

* White background
* Light gray sections
* Soft blue or teal accent color
* Rounded cards and simple icons
* Clean spacing (similar to Airbnb + admin dashboard UI)

The system has **three user roles: Admin, Dormitory Owner (Landlord), and Student/Tenant**.

Create only the **core screens and important flows**.

---

SCREEN 1: LOGIN PAGE

Create a simple centered login page with:

* RoomSync logo
* Email field
* Password field
* Login button
* Role selection (Admin / Owner / Student)
* Register link

---

SCREEN 2: ADMIN DASHBOARD

Sidebar menu:

* Dashboard
* Manage Owners
* Dormitories
* Reports

Dashboard content:

* Total Owners
* Total Dormitories
* Total Tenants

Include a table:

* Dorm Name
* Owner Name
* Location
* Status

---

SCREEN 3: OWNER DASHBOARD

Sidebar menu:

* Dashboard
* My Dormitories
* Tenant Requests
* Maintenance
* Payments

Dashboard cards:

* Total Dorms
* Occupied Rooms
* Available Rooms
* Pending Requests

---

SCREEN 4: ADD DORM (IMPORTANT CORE FEATURE)

Create a form where owners can upload a dormitory.

Fields:

* Dorm Name
* Address
* Description
* Price
* Capacity
* Amenities (checkboxes)
* Upload Images
* Upload 360 Image

Include a **large interactive map**:

* Owner can drop a pin to set dorm location

Buttons:

* Save Dorm
* Cancel

---

SCREEN 5: STUDENT DASHBOARD

Sidebar menu:

* Dashboard
* Find Dormitory
* Dorm Matching
* Roommate Matching
* Requests
* Maintenance
* Payments

Dashboard content:

* Recommended dorms
* Notifications

---

SCREEN 6: FIND DORMITORY (MAP-BASED – CORE FEATURE)

Create a **map interface**:

* Detect current user location
* Show dormitories within **200 meters**
* Display dorms as map pins

Below the map:

* List of available dorms (cards)

Each card shows:

* Dorm name
* Price
* Amenities

When clicked:

* Open dorm details

---

SCREEN 7: DORM DETAILS PAGE

Show:

* Dorm name
* Price
* Capacity
* Amenities
* Image gallery
* 360° room view
* Location map

Buttons:

* Send Request
* Schedule Visit

---

SCREEN 8: TENANT REQUEST (OWNER SIDE)

Display tenant requests in cards or table:

* Student name
* Dorm selected
* Move-in date

Buttons:

* Approve
* Reject

---

SCREEN 9: DORM MATCHING

Filters:

* Budget
* Amenities
* Distance

Show results as dorm cards.

---

SCREEN 10: ROOMMATE MATCHING

Form inputs:

* Gender
* Course
* Study habits
* Sleep schedule

Show suggested roommates in profile cards.

---

SCREEN 11: POST-RENT DASHBOARD (IMPORTANT LOGIC)

Once a student is accepted:

* Hide “Find Dormitory”
* Show:

  * Maintenance Requests
  * Payment Tracking

---

SCREEN 12: MAINTENANCE SYSTEM

Tenant:

* Submit issue (description + image)

Owner:

* View requests
* Status:

  * Pending
  * Ongoing
  * Completed

---

SCREEN 13: PAYMENT SYSTEM

Show:

* Monthly rent
* Due date
* Payment status

Highlight unpaid dues.

---

DESIGN RULES:

* Use minimal text (short labels only)
* Use icons for features
* Use card-based layout
* Keep spacing clean and modern
* Avoid too many colors
* Focus on usability and simplicity

The overall UI should look like a professional **web-based dormitory management dashboard system**.
