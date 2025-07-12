# SkillSwap Backend API

A robust Node.js/Express backend for the SkillSwap platform, providing RESTful APIs for user authentication, skill swapping, ratings, and admin management.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone and navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/skillswap
   JWT_SECRET=skillswap-super-secret-jwt-key-2024-hackathon
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development mode (auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Verify installation**
   ```bash
   curl http://localhost:5000/api/health
   ```

## 🏗️ Architecture

### Project Structure
```
server/
├── models/          # MongoDB schemas
│   ├── User.js     # User model
│   ├── Swap.js     # Skill swap model
│   └── Rating.js   # Rating model
├── routes/          # API routes
│   ├── auth.js     # Authentication routes
│   ├── users.js    # User management
│   ├── swaps.js    # Skill swap operations
│   ├── ratings.js  # Rating system
│   └── admin.js    # Admin panel
├── middleware/      # Custom middleware
│   ├── auth.js     # JWT authentication
│   └── errorHandler.js
├── server.js       # Main server file
├── package.json    # Dependencies
└── .env           # Environment variables
```

### Key Technologies
- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **mongoose-paginate-v2** - Pagination
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (paginated) |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user profile |
| DELETE | `/api/users/:id` | Delete user |

### Skill Swaps
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/swaps` | Get all swaps (paginated) |
| GET | `/api/swaps/:id` | Get swap by ID |
| POST | `/api/swaps` | Create new swap |
| PUT | `/api/swaps/:id` | Update swap |
| DELETE | `/api/swaps/:id` | Delete swap |
| PATCH | `/api/swaps/:id/accept` | Accept swap |
| PATCH | `/api/swaps/:id/complete` | Complete swap |
| GET | `/api/swaps/search` | Search swaps |

### Ratings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ratings/user/:userId` | Get user ratings |
| GET | `/api/ratings/:id` | Get rating by ID |
| POST | `/api/ratings` | Submit rating |
| PUT | `/api/ratings/:id` | Update rating |
| DELETE | `/api/ratings/:id` | Delete rating |
| GET | `/api/ratings/average/:userId` | Get average rating |

### Admin (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Admin dashboard stats |
| GET | `/api/admin/users` | Manage users |
| PATCH | `/api/admin/users/:id/role` | Update user role |
| PATCH | `/api/admin/users/:id/status` | Ban/unban user |
| GET | `/api/admin/swaps` | Manage swaps |
| GET | `/api/admin/ratings` | Manage ratings |
| GET | `/api/admin/analytics` | Platform analytics |
| POST | `/api/admin/announcements` | Send announcements |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Structure
```json
{
  "userId": "user_id_here",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## 📊 Data Models

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: ['user', 'admin'],
  profilePicture: String,
  bio: String,
  location: String,
  skills: [String],
  wantedSkills: [String],
  rating: Number,
  totalRatings: Number,
  status: ['active', 'banned'],
  // ... timestamps
}
```

### Swap Model
```javascript
{
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  category: String,
  skill: String,
  location: String,
  status: ['open', 'accepted', 'completed', 'cancelled'],
  acceptedBy: ObjectId (ref: User),
  // ... timestamps
}
```

### Rating Model
```javascript
{
  fromUser: ObjectId (ref: User),
  toUser: ObjectId (ref: User),
  swapId: ObjectId (ref: Swap),
  rating: Number (1-5),
  comment: String,
  // ... timestamps
}
```

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - express-validator middleware
- **Rate Limiting** - Prevent abuse
- **CORS Protection** - Cross-origin security
- **Helmet Headers** - Security headers
- **Role-based Access** - Admin/user permissions

## 🔧 Configuration

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | Database URL | localhost:27017/skillswap |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | Token expiration | 7d |
| `CLIENT_URL` | Frontend URL | http://localhost:3000 |

### Database Configuration
The application automatically creates collections and indexes when it starts. MongoDB connection includes:
- Connection pooling
- Error handling
- Automatic reconnection
- Index optimization

## 🧪 Testing

### Manual Testing
Use tools like Postman or curl to test endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Demo Credentials
- **Regular User**: user@skillswap.com / password123
- **Admin User**: admin@skillswap.com / admin123

## 📈 Performance

### Optimizations
- **Database Indexing** - Optimized queries
- **Pagination** - Efficient data loading
- **Compression** - Reduced bandwidth
- **Caching** - Response caching (future)
- **Connection Pooling** - Database efficiency

### Monitoring
- Request logging with Morgan
- Error tracking
- Performance metrics
- Health check endpoint

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🔄 Development Workflow

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Start server in development mode**
   ```bash
   npm run dev
   ```

3. **Make API requests**
   - Use Postman or similar tool
   - Test all endpoints
   - Verify responses

4. **Monitor logs**
   - Check console for errors
   - Verify database connections
   - Monitor request/response times

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure MongoDB Atlas
4. Set up environment variables
5. Use PM2 or similar process manager

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/skillswap
JWT_SECRET=your-super-secure-secret-key
CLIENT_URL=https://yourdomain.com
```

## 🤝 Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include input validation
4. Test all endpoints
5. Update documentation

## 📞 Support

For issues or questions:
1. Check the console logs
2. Verify environment variables
3. Ensure MongoDB is running
4. Test with Postman
5. Review error messages

## 📝 License

This project is part of the SkillSwap platform for the 2024 hackathon. 