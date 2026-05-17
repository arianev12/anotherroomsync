# 🏠 RoomSync - Dormitory Management System

A comprehensive dormitory management system built with React, TypeScript, and Tailwind CSS, designed specifically for BatStateU Arasof Campus students, dormitory owners, and administrators.

## 🌟 Overview

RoomSync is a centralized platform that connects students, dormitory owners, and administrators to streamline dormitory management, rent payments, maintenance requests, and roommate matching.

## ✨ Complete Feature Set

### 1. 🏢 Dormitory Listing & Management
- **Add, edit, and delete dormitory listings**
- **Upload photos** for dormitories and individual rooms
- **Room capacity management** with real-time availability tracking
- **Registration system** with unique registration numbers (BLGF-2024-XXX)
- **Admin verification workflow** (Pending → Verified/Rejected)
- **Status badges** and verified shields for students

### 2. 🔍 Smart Dorm Search System
- **Advanced filtering** by price range, amenities, distance, and availability
- **Natural language search parser** that understands queries like:
  - "I want a dorm within my budget of 3000 including water and wifi"
  - "Looking for aircon room under ₱3500 near campus"
  - "Budget 2500 with laundry and 24/7 security"
- **Interactive map view** with dormitory markers
- **GPS-based location detection** for accurate distance sorting
- **Real-time "Near Me" sorting** when GPS is enabled
- **Grid/List view toggle** for better browsing experience

### 3. 👥 Tenant Record Management
- **Complete tenant profiles** with personal information
- **Course and year level tracking**
- **Move-in date records**
- **Room assignment history**
- **Current occupancy status**
- **Contact information management**
- **Individual tenant ledgers** with full transaction history

### 4. 💳 Rent Payment Tracking & GCash Integration
- **GCash QR code payment system**
  - Owners can upload their GCash QR code
  - Students scan QR to pay instantly
  - Receipt upload with reference number
  - Owner verification workflow
- **Payment history** with unique receipt numbers
- **Transaction ledger** for each tenant
- **Payment status tracking** (Paid/Pending/Overdue)
- **Automated receipt generation**
- **Payment reminders** with due date countdown
- **Balance monitoring** and outstanding bill alerts

### 5. 🔧 Maintenance Request System
- **Submit requests** with photo uploads
- **Issue categorization** (Plumbing, Electrical, General)
- **Status tracking** (Pending, In Progress, Resolved)
- **Request history** for both students and owners
- **Photo evidence** for better issue documentation

### 6. 📱 Centralized Information Platform
- **Unified dashboard** for all user roles
- **Comprehensive dormitory details**
- **Room photos and virtual tours**
- **Complete amenities listing**
- **Location and contact information**
- **Transparent pricing**
- **Verified registration badges**

### 7. 🔔 Notification System
- **Toast notifications** (Sonner library)
- **Payment reminders** before due dates
- **Maintenance status updates**
- **System announcements**
- **Customizable notification preferences**
- **Email and push notification toggles**

### 8. 📍 GPS-Based Location Detection
- **Real-time user location** via browser Geolocation API
- **Accurate distance calculation** from user to dormitories
- **"Use My Location" button** with loading states
- **GPS active indicator** (green button + pulsing dot)
- **Automatic distance-based sorting**
- **High-accuracy positioning**
- **Fallback to campus location** if GPS fails

### 9. 📊 Landlord Dashboard
- **Revenue analytics** with interactive charts (Recharts)
- **Occupancy statistics** and trends
- **Tenant list** with payment status overview
- **Individual tenant ledgers** with messaging
- **Payment verification system** for GCash receipts
- **Outstanding balance monitoring**
- **Maintenance request tracking**

### 10. 🤝 Roommate Matching System
- **Preference-based matching algorithm**
- **Match score calculation** (percentage-based)
- **Filter by:**
  - Gender
  - Course and year level
  - Study habits
  - Sleep schedule
  - Cleanliness preferences
- **Direct messaging** to potential roommates
- **Visual match indicators**
- **Current tenant profiles** in each room

### 11. 🎯 Smart Dorm Matching Suggestions
- **AI-style smart suggestions**
- **Natural language understanding**
- **Budget optimization**
- **Amenity-based scoring**
- **Availability filtering**
- **Alternative suggestions** when exact matches aren't found
- **Match criteria breakdown**
- **Distance-based recommendations**

## 🎨 Additional Features

### User Experience
- ✅ **Dark/Light Mode** with smooth transitions
- ✅ **Responsive Design** for all screen sizes
- ✅ **Smooth Animations** using Motion (Framer Motion)
- ✅ **Toast Notifications** for user feedback
- ✅ **Loading States** for better UX
- ✅ **Error Handling** with user-friendly messages

### Design
- ✅ **Modern UI** with Tailwind CSS v4
- ✅ **Teal Theme** (#0d9488, #14b8a6, #2dd4bf)
- ✅ **Glassmorphism Effects** on landing page
- ✅ **Gradient Overlays** for visual appeal
- ✅ **Interactive Components** with hover effects
- ✅ **Smooth Page Transitions**

### Analytics & Reporting
- ✅ **Revenue Trend Charts** (Line charts)
- ✅ **Occupancy Trend** visualization
- ✅ **Price Distribution** analysis
- ✅ **Dormitory Status** overview
- ✅ **Payment Statistics** for owners
- ✅ **System-wide Analytics** for admins

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v6
- **Charts:** Recharts
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion)
- **Notifications:** Sonner
- **Build Tool:** Vite
- **Package Manager:** pnpm

## 👥 User Roles

### 1. Administrator
- Manage all dormitories and owners
- Verify dormitory registrations
- View system-wide analytics
- Monitor payments and occupancy
- Handle owner verification (ID verification)

### 2. Dormitory Owner
- Manage their dormitory listings
- Add/edit/delete rooms
- Track tenant payments
- Verify GCash payments from students
- Handle maintenance requests
- View individual tenant ledgers
- Message tenants
- Upload GCash QR code for payments
- Monitor revenue and occupancy

### 3. Student/Tenant
- Search for dormitories
- Filter by preferences
- Use natural language search
- Pay rent via GCash
- Upload payment receipts
- Submit maintenance requests
- Find compatible roommates
- View payment history
- Track upcoming payments
- Message dormitory owners

## 📂 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── admin/          # Admin components
│   │   ├── owner/          # Owner components
│   │   ├── student/        # Student components
│   │   ├── ui/             # Reusable UI components
│   │   └── ...
│   ├── contexts/
│   │   ├── NotificationsContext.tsx
│   │   ├── StudentContext.tsx
│   │   └── ThemeContext.tsx
│   ├── data/
│   │   └── mockData.ts     # Mock data for development
│   ├── pages/
│   │   ├── admin/          # Admin pages
│   │   ├── owner/          # Owner pages
│   │   ├── student/        # Student pages
│   │   └── Landing.tsx
│   ├── routes.tsx          # App routing configuration
│   └── App.tsx             # Main app component
├── styles/
│   ├── fonts.css
│   └── theme.css           # Theme tokens & CSS variables
└── ...
```

## 🚀 Key Highlights

### Smart Features
- 🧠 **Natural Language Processing** for search queries
- 🎯 **AI-style Recommendations** for dormitory matching
- 📊 **Intelligent Scoring Algorithm** for roommate compatibility
- 🗺️ **GPS-powered Distance Calculation** for accurate sorting
- 💡 **Smart Alternative Suggestions** when exact matches aren't found

### Payment Innovation
- 💰 **Integrated GCash Payment** with QR codes
- 📸 **Receipt Upload System** for verification
- ✅ **Owner Approval Workflow** for transparency
- 📝 **Reference Number Tracking** for accountability
- 🧾 **Automatic Receipt Generation** with unique IDs

### User-Centric Design
- 🎨 **Beautiful Glassmorphism** effects
- 🌓 **Auto Dark Mode** support
- ⚡ **Smooth Animations** throughout
- 📱 **Mobile-Responsive** design
- 🔔 **Real-time Notifications**

## 📊 System Statistics

- **Total Dormitories:** 6 active dormitories
- **Total Rooms:** 14 rooms across all dormitories
- **Capacity:** 65 total bed spaces
- **User Roles:** 3 (Admin, Owner, Student)
- **Payment Methods:** Cash, Bank Transfer, GCash
- **Features:** 11 major features + 16 additional enhancements

## 🎯 Use Cases

1. **For Students:**
   - Find affordable dormitories near campus
   - Match with compatible roommates
   - Pay rent easily via GCash
   - Submit maintenance requests
   - Track payment history

2. **For Owners:**
   - List and manage properties
   - Accept GCash payments
   - Verify payment receipts
   - Track tenant payments
   - Monitor occupancy rates
   - Communicate with tenants

3. **For Administrators:**
   - Oversee all dormitories
   - Verify registrations
   - Monitor system activity
   - Analyze revenue trends
   - Ensure quality standards

## 🔒 Security Features

- ✅ ID Verification for dormitory owners
- ✅ Registration number system
- ✅ Admin approval workflow
- ✅ Secure payment verification
- ✅ Reference number tracking
- ✅ Receipt validation system

## 🌐 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ⚠️ Internet Explorer (Not supported)

## 📝 License

This project is built for educational purposes as part of the BatStateU Arasof Campus dormitory management initiative.

---

**Version:** 2.1 (Complete Feature Set)  
**Last Updated:** May 16, 2026  
**Built with ❤️ for BatStateU Arasof Campus**
