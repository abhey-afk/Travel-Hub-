# Travel Hub 🚗

A modern car rental web application built with MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to rent cars easily and efficiently.

## 🌟 Features

- **User Authentication**
  - Sign up/Sign in functionality
  - User profile management

- **Car Rental Features**
  - Browse available cars
  - Filter cars by various criteria
  - Make reservations
  - View booking history
  - Real-time availability updates

- **Modern UI/UX**
  - Responsive design
  - Interactive car selection
  - User-friendly booking process
  - Beautiful car showcase
  - Testimonials section

## 🛠️ Tech Stack

### Frontend
- React.js
- SCSS for styling
- React Router for navigation
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/abhey-afk/Travel-Hub-.git
cd Travel-Hub-
```

2. Install dependencies for backend
```bash
cd server
npm install
```

3. Set up environment variables for backend
Create a `.env` file in the server directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Install dependencies for frontend
```bash
cd ../client
npm install
```

5. Start the development servers

For backend:
```bash
cd server
npm start
```

For frontend:
```bash
cd client
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
Travel-Hub/
├── client/                 # Frontend React application
│   ├── public/            # Public assets
│   └── src/               # Source files
│       ├── components/    # React components
│       ├── pages/         # Page components
│       ├── styles/        # SCSS styles
│       └── images/        # Image assets
│
└── server/                # Backend Node.js application
    ├── config/           # Configuration files
    ├── controllers/     # Request handlers
    ├── models/         # Database models
    ├── routes/        # API routes
    └── middleware/   # Custom middleware
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get specific car
- `POST /api/cars/book` - Book a car

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Abhey** - *Initial work* - [abhey-afk](https://github.com/abhey-afk)

## 🙏 Acknowledgments

- Thanks to all contributors who helped in building this project
- Special thanks to the open-source community for their invaluable resources
