# NestJS Cookie-Based Authentication System

A secure, production-ready authentication system built with NestJS featuring cookie-based JWT authentication, role-based access control, and seamless cross-subdomain support.

## 🚀 Features

- **🔐 Secure Cookie-Based JWT Authentication** - HTTP-only cookies for enhanced security
- **🔄 Automatic Token Refresh** - Seamless refresh token rotation
- **👥 Role-Based Access Control** - Multiple user roles (Admin, Manager, Employee)
- **🌐 Cross-Subdomain Support** - Works across multiple subdomains
- **🔒 Enhanced Security** - BCrypt password hashing, token versioning, and secure cookie policies
- **📊 Prisma ORM Integration** - Type-safe database operations
- **🧪 Swagger Testing Ready** - Complete testing suite included

## 🛠 Technology Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with cookie storage
- **Password Hashing**: BCrypt
- **Validation**: Class Validator
- **Testing**: Swagger

## 📋 Prerequisites

Before running this application, ensure you have:

- Node.js (v16 or higher)
- PostgreSQL database
- pnpm
- Postman (for API testing)

## 🚦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/manikerisaurabh/NestJS-Cookie-based-Authentication
cd NestJS-Cookie-based-Authentication
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Database Setup

Create a PostgreSQL database and update your `.env` file:

```bash
# Update the DATABASE_URL in your .env file
DATABASE_URL="postgresql://postgres:<your_password>@localhost:5432/nestjs_cookie_auth"
NODE_ENV="development"
```

### 4. Run Database Migrations

```bash
npx prisma generate

pnpx prisma db push
```

### 5. Environment Configuration

Create a `.env` file in the root directory:

```env
# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-here
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"

# Application
NODE_ENV=development
PORT=3000
```

### 6. Start the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📖 API Endpoints

### Authentication Endpoints

| Method | Endpoint         | Description                  |
| ------ | ---------------- | ---------------------------- |
| POST   | `/auth/register` | Register a new user          |
| POST   | `/auth/login`    | User login                   |
| POST   | `/auth/refresh`  | Refresh access token         |
| POST   | `/auth/logout`   | User logout                  |
| GET    | `/auth/profile`  | Get user profile (protected) |

### User Registration Example

```json
// POST /auth/register
{
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "EMPLOYEE",
  "first_name": "John",
  "last_name": "Doe",
  "hospitalId": "optional-hospital-uuid"
}
```

### User Login Example

```json
// POST /auth/login
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

## 🎯 Advantages of Cookie-Based Authentication

### Enhanced Security

- **HTTP-only cookies** prevent XSS attacks
- **Secure flag** ensures cookies are only sent over HTTPS
- **SameSite policy** protects against CSRF attacks
- **Automatic token refresh** with secure rotation

### Better User Experience

- **Silent authentication** without manual token management
- **Automatic token inclusion** in all requests
- **Cross-subdomain support** for microservices architecture

### Production Ready

- **Token expiration handling** with refresh mechanism
- **Role-based access control** for authorization
- **Scalable architecture** suitable for large applications
- **Comprehensive error handling** for all edge cases

## 🔒 Security Considerations

1. **Always use HTTPS** in production environments
2. **Rotate JWT secrets** regularly in production
3. **Implement rate limiting** on authentication endpoints
4. **Use strong password policies** for user registration
5. **Regularly update dependencies** to patch security vulnerabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Prisma documentation](https://www.prisma.io/docs/)
2. Review the [NestJS authentication guide](https://docs.nestjs.com/security/authentication)
3. Create an issue in the GitHub repository

## 🙏 Acknowledgments

- [NestJS Team](https://nestjs.com/) for the amazing framework
- [Prisma Team](https://www.prisma.io/) for the excellent ORM
- All contributors who help improve this project

---

**Note**: This is a template implementation. Always conduct security audits and customize the authentication system according to your specific requirements before deploying to production.
