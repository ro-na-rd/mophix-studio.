# MOPHIX STUDIO - FUNCTIONAL REQUIREMENTS DOCUMENT

## 1. System Overview
Mophix Studio is a professional photography website that enables:
- Portfolio and gallery management
- Client booking system
- Service offerings display
- Testimonials and reviews
- Client communication and inquiries
- Blog/Stories section
- User authentication and role-based access

---

## 2. User Roles & Actors

### 2.1 Admin
- Full system access
- User management
- Gallery and portfolio management
- Booking management
- Testimonials/reviews moderation
- Service management
- Blog post management
- Reports and analytics

### 2.2 Staff
- Manage assigned bookings
- Update booking status
- Add photos to galleries
- Respond to inquiries
- View client information

### 2.3 Client
- View portfolio and galleries
- Browse services
- Book photography sessions
- Track booking status
- Submit testimonials/reviews
- Contact studio
- View blog posts and stories

### 2.4 Guest (Unauthenticated)
- Browse portfolio
- View services
- Submit contact inquiries
- View testimonials

---

## 3. Functional Requirements

### 3.1 User Management
**FR-UM1:** Admin can create, read, update, delete user accounts
**FR-UM2:** System supports three user roles (Admin, Staff, Client)
**FR-UM3:** User authentication with email/password
**FR-UM4:** Password reset functionality
**FR-UM5:** User profile management
**FR-UM6:** Role-based access control

### 3.2 Photography Portfolio & Galleries
**FR-PG1:** Admin/Staff can upload and organize photos
**FR-PG2:** Photos can be categorized by event type (Wedding, Pregnancy, Family, Graduation, etc.)
**FR-PG3:** Create gallery collections for specific projects
**FR-PG4:** Featured projects showcase on homepage
**FR-PG5:** Gallery search and filter functionality
**FR-PG6:** Image optimization and thumbnail generation
**FR-PG7:** Photo metadata management (date, location, description)

### 3.3 Service Management
**FR-SM1:** Define photography services (Wedding, Pregnancy, Family, Graduation, Studio, Outdoor)
**FR-SM2:** Add service descriptions and pricing
**FR-SM3:** Manage service categories
**FR-SM4:** Link photos to services

### 3.4 Booking System
**FR-BS1:** Clients can request photography sessions
**FR-BS2:** Specify session type and date preferences
**FR-BS3:** Booking status tracking (Pending, Confirmed, Completed, Cancelled)
**FR-BS4:** Admin can approve/reject/assign bookings
**FR-BS5:** Automated email notifications for booking updates
**FR-BS6:** Calendar view of bookings
**FR-BS7:** Payment status tracking (if applicable)

### 3.5 Testimonials & Reviews
**FR-TR1:** Clients can submit testimonials with ratings (1-5 stars)
**FR-TR2:** Add review text and optional photo
**FR-TR3:** Admin can moderate and approve/reject testimonials
**FR-TR4:** Display approved testimonials on website
**FR-TR5:** Average rating calculation

### 3.6 Contact & Inquiry Management
**FR-CI1:** Contact form for inquiries
**FR-CI2:** Capture client name, email, phone, message
**FR-CI3:** Store inquiries in database
**FR-CI4:** Admin notification on new inquiry
**FR-CI5:** Admin can respond to inquiries
**FR-CI6:** Inquiry status tracking

### 3.7 Blog/Stories Section
**FR-BS1:** Admin can create and publish blog posts
**FR-BS2:** Add title, content, featured image, category
**FR-BS3:** Manage blog categories
**FR-BS4:** Display posts chronologically
**FR-BS5:** Search blog posts

### 3.8 Dashboard Features
**FR-DB1:** Admin dashboard with system statistics
**FR-DB2:** Recent bookings overview
**FR-DB3:** New inquiries summary
**FR-DB4:** User activity logs
**FR-DB5:** Revenue/booking statistics

---

## 4. Data Requirements

### 4.1 Data to be Stored
- User information (name, email, phone, role, account status)
- Service details (name, description, pricing, category)
- Booking information (client, service, date, status, notes)
- Photo/Gallery data (file path, description, category, metadata)
- Testimonial data (rating, text, author, approval status)
- Contact inquiries (name, email, message, status)
- Blog posts (title, content, category, publish date)
- Payment/Invoice records (if applicable)

### 4.2 Data Relationships
- User → Bookings (One-to-Many)
- Service → Bookings (One-to-Many)
- Gallery → Photos (One-to-Many)
- User → Testimonials (One-to-Many)
- Service → Gallery (Many-to-Many)
- Category → Photos (Many-to-Many)
- Blog Category → Blog Posts (One-to-Many)

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Page load time < 3 seconds
- Database queries < 1 second
- Support 100+ concurrent users

### 5.2 Security
- SSL/HTTPS encryption
- Password hashing (bcrypt)
- SQL injection prevention (prepared statements)
- CSRF protection
- XSS prevention
- Rate limiting on API endpoints

### 5.3 Scalability
- Modular architecture
- Database optimization
- Image optimization and CDN ready
- Stateless backend for horizontal scaling

### 5.4 Usability
- Responsive design (mobile, tablet, desktop)
- Intuitive admin interface
- Clear navigation
- Accessibility compliance (WCAG 2.1)

### 5.5 Maintainability
- Clean, documented code
- API documentation
- Database schema documentation
- Deployment guides

---

## 6. System Constraints
- Must support MySQL or PostgreSQL
- Technology stack: Node.js/Express backend, React frontend
- Deployed on cloud platform (Ready for AWS/Heroku/DigitalOcean)
- File storage for images (local or cloud storage)
- Email service for notifications

---

## 7. Assumptions
- Users have access to email for notifications and password recovery
- Internet connectivity available for all users
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Sufficient server storage for photo uploads

---

## 8. Out of Scope
- Payment gateway integration (framework provided for future integration)
- SMS notifications
- Advanced analytics and reporting
- Multi-language support (for initial version)
- Mobile app (web-responsive only)
