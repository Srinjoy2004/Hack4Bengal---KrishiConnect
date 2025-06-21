const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

dotenv.config();

const authRoutes = require('../routes/authRoutes');
const loginRoutes = require('../routes/loginroutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS setup for multiple allowed origins
const allowedOrigins = [
  'https://krishi-connect-frontend-nu.vercel.app',
  'https://agrismart-frontend-deployment.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Session middleware
app.use(session({
  secret: "yourSecretKey", // ✅ Replace with env-safe secret in production
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://srinjoypramanik2004:MwJ1OgFmyd81CJO7@cluster0.svrjojn.mongodb.net/myAppDB?retryWrites=true&w=majority",
    collectionName: 'sessions',
    ttl: 60 * 60 // 1 hour
  }),
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    secure: false // change to true if using HTTPS in production
  }
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', loginRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Server running 🚀');
});

app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});
