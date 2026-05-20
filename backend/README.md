# Mophix Studio Backend API

A comprehensive REST API for the Mophix Studio Photography Website built with Node.js, Express, and Sequelize ORM.

## Features

- **User Management**: Authentication, roles (admin, staff, client), profile management
- **Photography Portfolio**: Gallery and photo management with categorization
- **Booking System**: Session booking requests, status tracking, payment management
- **Testimonials & Reviews**: Client feedback with admin moderation
- **Contact Inquiries**: Contact form submissions and response tracking
- **Blog/Stories**: Create and publish photography stories and tips
- **Dashboard**: Admin analytics and statistics
- **Security**: JWT authentication, password hashing, role-based access control

## Tech Stack

- **Node.js** 16+
- **Express.js** 4.x - Web framework
- **Sequelize** 6.x - ORM for database operations
- **MySQL/PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Key configurations needed:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET` (minimum 32 characters for production)
- `FRONTEND_URL`
- SMTP credentials for emails
- Optional: AWS S3 for cloud storage

### 3. Setup Database

```bash
# If using MySQL
mysql -u root -p
CREATE DATABASE mophix_studio;

# Import schema
mysql -u root -p mophix_studio < ../database/schema.sql
```

### 4. Run Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (protected)
- `POST /api/v1/auth/request-password-reset` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Services
- `GET /api/v1/services` - Get all services
- `GET /api/v1/services/:id` - Get service by ID
- `POST /api/v1/services` - Create service (admin)
- `PUT /api/v1/services/:id` - Update service (admin)
- `DELETE /api/v1/services/:id` - Delete service (admin)

### Galleries & Photos
- `GET /api/v1/galleries` - Get all galleries
- `GET /api/v1/galleries/:id` - Get gallery with photos
- `POST /api/v1/galleries` - Create gallery (staff/admin)
- `PUT /api/v1/galleries/:id` - Update gallery (staff/admin)
- `DELETE /api/v1/galleries/:id` - Delete gallery (staff/admin)
- `POST /api/v1/galleries/:id/photos` - Upload photos (staff/admin)
- `PUT /api/v1/galleries/photos/:id` - Update photo (staff/admin)
- `DELETE /api/v1/galleries/photos/:id` - Delete photo (staff/admin)

### Bookings
- `GET /api/v1/bookings` - Get all bookings (admin/staff/own bookings for clients)
- `GET /api/v1/bookings/:id` - Get booking details
- `POST /api/v1/bookings` - Create booking (clients)
- `PATCH /api/v1/bookings/:id/status` - Update booking status (admin/staff)
- `PATCH /api/v1/bookings/:id/payment` - Update payment status (admin/staff)
- `DELETE /api/v1/bookings/:id` - Delete booking
- `GET /api/v1/bookings/calendar/:month/:year` - Get calendar bookings

### Testimonials
- `GET /api/v1/testimonials` - Get approved testimonials (public)
- `GET /api/v1/testimonials/rating/average` - Get average rating (public)
- `POST /api/v1/testimonials` - Create testimonial (clients)
- `GET /api/v1/testimonials/pending` - Get pending testimonials (admin)
- `POST /api/v1/testimonials/:id/approve` - Approve testimonial (admin)
- `POST /api/v1/testimonials/:id/reject` - Reject testimonial (admin)

### Contact Inquiries
- `POST /api/v1/contact` - Submit inquiry (public)
- `GET /api/v1/contact` - Get all inquiries (admin)
- `GET /api/v1/contact/:id` - Get inquiry (admin)
- `GET /api/v1/contact/stats` - Get inquiry statistics (admin)
- `PATCH /api/v1/contact/:id/status` - Update inquiry status (admin)
- `POST /api/v1/contact/:id/respond` - Respond to inquiry (admin)

### Blog
- `GET /api/v1/blog` - Get published blog posts (public)
- `GET /api/v1/blog/categories` - Get blog categories (public)
- `GET /api/v1/blog/post/:slug` - Get blog post by slug (public)
- `POST /api/v1/blog` - Create blog post (admin)
- `PUT /api/v1/blog/:id` - Update blog post (admin)
- `DELETE /api/v1/blog/:id` - Delete blog post (admin)
- `GET /api/v1/blog/drafts` - Get draft posts (admin)
- `POST /api/v1/blog/categories` - Create blog category (admin)

### Users
- `GET /api/v1/users` - Get all users (admin)
- `GET /api/v1/users/:id` - Get user (protected)
- `PUT /api/v1/users/:id` - Update user profile (protected)
- `PUT /api/v1/users/:id/role` - Update user role (admin)
- `PATCH /api/v1/users/:id/toggle-active` - Activate/deactivate user (admin)

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics (admin)
- `GET /api/v1/dashboard/bookings/analytics` - Get booking analytics (admin)
- `GET /api/v1/dashboard/revenue/report` - Get revenue report (admin)

## File Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/             # Business logic
│   │   ├── auth.controller.js
│   │   ├── services.controller.js
│   │   ├── bookings.controller.js
│   │   ├── galleries.controller.js
│   │   ├── testimonials.controller.js
│   │   ├── contact.controller.js
│   │   ├── blog.controller.js
│   │   ├── users.controller.js
│   │   └── dashboard.controller.js
│   ├── models/
│   │   └── index.js             # Sequelize model definitions
│   ├── routes/                  # API route definitions
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── services/                # Business logic services
│   └── utils/                   # Utility functions
├── uploads/                     # Uploaded files
├── server.js                    # Entry point
├── package.json
└── .env.example

```

## Database Schema

The database includes 15 tables with proper relationships and constraints:

- `users` - User accounts (admin, staff, client)
- `services` - Photography services offered
- `galleries` - Photo collections
- `photos` - Individual photos
- `bookings` - Photography session requests
- `testimonials` - Client reviews
- `contact_inquiries` - Contact form submissions
- `blog_posts` - Blog articles
- `categories` - Photo categories
- And supporting junction and settings tables

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. User logs in with email/password
2. Server returns JWT token
3. Include token in Authorization header: `Bearer <token>`
4. Token expires in 7 days (configurable)

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": []  // Optional validation errors
}
```

## Testing

```bash
npm test
npm run test:watch
```

## Deployment

### Traditional Hosting

1. Install Node.js and PM2
2. Configure environment variables
3. Install dependencies: `npm install`
4. Start the server: `npm start`
5. Use PM2 or another process manager for production

### Cloud Platforms

**Heroku:**
```bash
heroku create mophix-api
heroku config:set <ENV_VARIABLES>
git push heroku main
```

**DigitalOcean/AWS:**
- Use provided guides for Node.js deployment
- Set environment variables
- Configure database connection
- Use PM2 for process management

## Performance Optimization

- Database query optimization with Sequelize eager loading
- Image optimization and thumbnails
- Pagination for large datasets
- Caching headers for static content
- Connection pooling for database

## Security Considerations

- ✓ JWT token-based authentication
- ✓ Password hashing with bcryptjs
- ✓ SQL injection prevention (Sequelize parameterized queries)
- ✓ CORS configuration
- ✓ Input validation and sanitization
- ✓ Rate limiting (to be implemented)
- ✓ HTTPS required in production
- ✓ Secure headers (Helmet recommended)

## Support & Documentation

- API Documentation: Available at `/api/v1/docs` (Swagger UI can be added)
- Database Schema: See `../database/schema.sql`
- Requirements: See `../project-docs/1_FUNCTIONAL_REQUIREMENTS.md`

## License

ISC - Kigali Business Lab

## Contributors

- Kigali Business Lab Interns
- Backend Team: [Intern Names]
