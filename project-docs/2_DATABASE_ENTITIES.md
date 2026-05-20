# MOPHIX STUDIO - DATABASE ENTITIES & ATTRIBUTES

## 1. IDENTIFIED ENTITIES

### 1.1 Users Entity
**Purpose:** Store user account information  
**Attributes:**
- user_id (Primary Key)
- email (Unique)
- password_hash
- first_name
- last_name
- phone
- role (ENUM: admin, staff, client)
- profile_image_url
- bio
- address
- city
- country
- is_active
- created_at
- updated_at

---

### 1.2 Services Entity
**Purpose:** Define photography services offered  
**Attributes:**
- service_id (Primary Key)
- name (e.g., Wedding, Pregnancy, Family)
- description
- category (Enum or reference)
- price
- duration_hours
- includes_photos_count (how many photos included)
- includes_album
- includes_prints
- is_active
- created_at
- updated_at

---

### 1.3 Bookings Entity
**Purpose:** Manage photography session bookings  
**Attributes:**
- booking_id (Primary Key)
- user_id (Foreign Key → Users)
- service_id (Foreign Key → Services)
- booking_date
- preferred_time_start
- preferred_time_end
- event_date
- event_location
- number_of_participants
- special_requests
- status (ENUM: pending, confirmed, completed, cancelled)
- total_price
- payment_status (unpaid, paid, partial)
- notes
- created_at
- updated_at

---

### 1.4 Photos/Gallery Entity
**Purpose:** Store photography portfolio  
**Attributes:**
- photo_id (Primary Key)
- gallery_id (Foreign Key → Galleries)
- title
- description
- file_path (local or cloud URL)
- thumbnail_path
- file_size
- image_width
- image_height
- upload_date
- photographer_name (staff member)
- is_featured
- view_count
- created_at

---

### 1.5 Galleries Entity
**Purpose:** Organize photos into project collections  
**Attributes:**
- gallery_id (Primary Key)
- title (Project name)
- description
- cover_image_path
- event_type/category (wedding, pregnancy, family, etc.)
- photo_count
- is_published
- created_by (Foreign Key → Users)
- published_date
- created_at
- updated_at

---

### 1.6 Gallery_Service (Junction Table)
**Purpose:** Link galleries to services (Many-to-Many)  
**Attributes:**
- gallery_service_id (Primary Key)
- gallery_id (Foreign Key → Galleries)
- service_id (Foreign Key → Services)

---

### 1.7 Categories Entity
**Purpose:** Categorize photos and galleries  
**Attributes:**
- category_id (Primary Key)
- name (Wedding, Pregnancy, Family, Graduation, Studio, Outdoor)
- description
- icon_url
- display_order

---

### 1.8 Photo_Category (Junction Table)
**Purpose:** Link photos to multiple categories (Many-to-Many)  
**Attributes:**
- photo_category_id (Primary Key)
- photo_id (Foreign Key → Photos)
- category_id (Foreign Key → Categories)

---

### 1.9 Testimonials Entity
**Purpose:** Store client feedback and reviews  
**Attributes:**
- testimonial_id (Primary Key)
- booking_id (Foreign Key → Bookings)
- user_id (Foreign Key → Users)
- rating (1-5 stars)
- title
- content (Review text)
- photo_url (Optional client photo)
- is_approved (Admin moderation)
- approved_by (Foreign Key → Users)
- approved_date
- is_featured
- created_at
- updated_at

---

### 1.10 Contact_Inquiries Entity
**Purpose:** Store contact form submissions  
**Attributes:**
- inquiry_id (Primary Key)
- name
- email
- phone
- subject
- message
- inquiry_type (General, Booking, Feedback, Complaint)
- status (ENUM: new, in_progress, resolved, spam)
- responded_by (Foreign Key → Users)
- response_message
- response_date
- created_at
- updated_at

---

### 1.11 Blog_Posts Entity
**Purpose:** Manage photography stories and tips  
**Attributes:**
- post_id (Primary Key)
- title
- slug (URL-friendly)
- content (Rich text)
- featured_image_url
- category_id (Foreign Key → Blog_Categories)
- author_id (Foreign Key → Users)
- status (draft, published, archived)
- view_count
- published_date
- created_at
- updated_at

---

### 1.12 Blog_Categories Entity
**Purpose:** Categorize blog posts  
**Attributes:**
- blog_category_id (Primary Key)
- name
- slug
- description
- display_order

---

### 1.13 Invoices Entity (Optional - for payments)
**Purpose:** Track payments and invoices  
**Attributes:**
- invoice_id (Primary Key)
- booking_id (Foreign Key → Bookings)
- invoice_number (Unique)
- amount
- tax_amount
- total_amount
- payment_method
- status (pending, paid, overdue, cancelled)
- issued_date
- due_date
- paid_date
- notes
- created_at

---

### 1.14 Activity_Logs Entity
**Purpose:** Track system activity for audit  
**Attributes:**
- log_id (Primary Key)
- user_id (Foreign Key → Users)
- action (created, updated, deleted, viewed)
- entity_type (booking, photo, user, etc.)
- entity_id
- description
- ip_address
- created_at

---

### 1.15 Settings Entity
**Purpose:** Store system configuration  
**Attributes:**
- setting_id (Primary Key)
- setting_key (Unique)
- setting_value
- setting_type (string, integer, boolean, json)
- updated_at

---

## 2. DATA RELATIONSHIPS SUMMARY

```
Users (1) ──→ (Many) Bookings
Users (1) ──→ (Many) Testimonials
Users (1) ──→ (Many) Blog_Posts
Users (1) ──→ (Many) Contact_Inquiries
Users (1) ──→ (Many) Galleries
Users (1) ──→ (Many) Activity_Logs

Services (1) ──→ (Many) Bookings
Services (1) ──→ (Many) Gallery_Service

Galleries (1) ──→ (Many) Photos
Galleries (1) ──→ (Many) Gallery_Service

Categories (1) ──→ (Many) Photo_Category

Photos (1) ──→ (Many) Photo_Category

Blog_Categories (1) ──→ (Many) Blog_Posts

Bookings (1) ──→ (Many) Testimonials
Bookings (1) ──→ (Many) Invoices

Services (Many) ──→ (Many) Galleries [via Gallery_Service]
Photos (Many) ──→ (Many) Categories [via Photo_Category]
```

---

## 3. Normalization Status

All entities are designed to be in **Third Normal Form (3NF)**:
- ✅ Each table has a primary key
- ✅ All non-key attributes are fully dependent on the primary key
- ✅ No transitive dependencies
- ✅ Junction tables for Many-to-Many relationships
- ✅ Foreign keys enforce referential integrity
- ✅ No data redundancy
