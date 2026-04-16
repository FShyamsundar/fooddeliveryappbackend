# Food Delivery Backend

## Overview

This is the backend API for a comprehensive food delivery system built with Node.js, Express, and MongoDB. It provides a robust set of endpoints for managing users, restaurants, orders, payments, and administrative functions.

## Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control (Customer, Restaurant Owner, Admin)
- **Restaurant Management**: Complete CRUD operations for restaurants including location, cuisine types, and operating hours
- **Menu Management**: Dynamic menu items with categories, pricing, availability, and customization options
- **Order Processing**: Full order lifecycle from placement to delivery tracking
- **Payment Integration**: Secure payment processing using Razorpay
- **Review System**: Customer reviews and ratings for restaurants
- **File Upload**: Image upload functionality for restaurant photos and menu items
- **Admin Dashboard**: Comprehensive administrative controls
- **Data Validation**: Input validation and error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Payment**: Razorpay API
- **File Upload**: Multer
- **Security**: bcryptjs for password hashing
- **Validation**: express-validator

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local installation or cloud service like MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the backend root directory with the following variables:

   ```
   MONGODB_URI=mongodb://localhost:27017/food-delivery
   JWT_SECRET=your_secure_jwt_secret_key_here
   RAZORPAY_KEY_ID=your_secure_razorpay_key_id_here
   RAZORPAY_KEY_SECRET=your_secure_razorpay_key_secret_here
   PORT=5000
   ```

4. **Database Setup:**
   Ensure MongoDB is running locally or update `MONGODB_URI` to point to your MongoDB instance.

5. **Seed Sample Data:**

   ```bash
   npm run seed
   ```

6. **Start Development Server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000` with hot reloading enabled.

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register new user account
- `POST /login` - User login with JWT token
- `GET /profile` - Retrieve current user profile

### Restaurant Routes (`/api/restaurants`)

- `GET /` - Get all active restaurants with filtering options
- `GET /:id` - Get detailed restaurant information
- `POST /` - Create new restaurant (Restaurant Owner/Admin only)
- `PUT /:id` - Update restaurant details
- `DELETE /:id` - Deactivate restaurant

### Order Routes (`/api/orders`)

- `POST /` - Place new order
- `GET /` - Get user's order history
- `GET /:id` - Get specific order details
- `PUT /:id/status` - Update order status (Restaurant/Admin only)

### Payment Routes (`/api/payments`)

- `POST /create-payment-intent` - Create Razorpay order for checkout

### Review Routes (`/api/reviews`)

- `POST /` - Submit restaurant review
- `GET /:restaurantId` - Get all reviews for a restaurant

### Admin Routes (`/api/admin`)

- `GET /users` - Get all system users
- `GET /restaurants` - Get all restaurants (including inactive)
- `GET /orders` - Get all orders in the system

## Sample Data

After running the seed script (`npm run seed`), the following sample data will be available for testing:

### Sample Users

| Email               | Password      | Role             | Description                       |
| ------------------- | ------------- | ---------------- | --------------------------------- |
| `customer@test.com` | `password123` | Customer         | Regular customer account          |
| `owner@test.com`    | `password123` | Restaurant Owner | Can manage restaurants and orders |
| `admin@test.com`    | `password123` | Admin            | Full system access                |

### Sample Restaurants

1. **Pizza Palace** - Italian cuisine, rating: 4.5⭐
2. **Burger House** - American burgers, rating: 4.3⭐
3. **Sushi Master** - Japanese sushi, rating: 4.7⭐
4. **Taco Fiesta** - Mexican street food, rating: 4.4⭐
5. **Golden Dragon** - Chinese cuisine, rating: 4.2⭐
6. **Mediterranean Delight** - Middle Eastern, rating: 4.6⭐
7. **Vegan Paradise** - Plant-based, rating: 4.3⭐
8. **Pasta Bella** - Italian pasta, rating: 4.8⭐

### Sample Menu Items

Each restaurant includes 3-5 menu items with:

- Item names and descriptions
- Pricing ($8.99 - $24.99)
- Categories (Main Course, Appetizer, etc.)
- Dietary information (vegetarian options)
- Customization extras (additional toppings, sides)

## Testing the API

### 1. Health Check

```bash
curl http://localhost:5000/api/health
```

### 2. User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "1234567890",
    "role": "customer"
  }'
```

### 3. User Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "password123"
  }'
```

### 4. Get Restaurants (requires authentication)

```bash
curl -X GET http://localhost:5000/api/restaurants \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Place Order (requires authentication)

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "restaurantId": "restaurant_id_here",
    "items": [
      {
        "menuItemId": "menu_item_id",
        "quantity": 2,
        "extras": ["extra_cheese"]
      }
    ],
    "deliveryAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    }
  }'
```

### Testing Tools

- **Postman**: Import the API collection and test endpoints
- **Thunder Client**: VS Code extension for API testing
- **curl**: Command-line testing as shown above

### Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/              # Route handlers
│   ├── adminController.js
│   ├── authController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── restaurantController.js
│   └── reviewController.js
├── middleware/
│   └── authMiddleware.js     # Authentication middleware
├── models/                   # Mongoose schemas
│   ├── MenuItem.js
│   ├── Order.js
│   ├── Restaurant.js
│   ├── Review.js
│   └── User.js
├── routes/                   # API routes
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   ├── restaurantRoutes.js
│   └── reviewRoutes.js
├── uploads/                  # File uploads directory
├── utils/
│   └── helpers.js            # Utility functions
├── package.json
├── server.js                 # Main server file
└── seed.js                   # Database seeding script
```

## Contributing

1. Follow the existing code structure and naming conventions
2. Add proper error handling and validation
3. Update documentation for new endpoints
4. Test thoroughly before submitting changes

## License

This project is licensed under the ISC License.
