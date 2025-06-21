const mongoose = require('mongoose');
const axios = require('axios');

const connectDB = async () => {
  const mongoURI = 'mongodb+srv://srinjoypramanik2004:MwJ1OgFmyd81CJO7@cluster0.svrjojn.mongodb.net/agri?retryWrites=true&w=majority';

  try {
    // Optional: Fetch and log the public IP of this server (e.g., for Render)
    try {
      const res = await axios.get('https://api.ipify.org?format=json');
      console.log("📡 Public IP Address of this server:", res.data.ip);
    } catch (ipErr) {
      console.warn("⚠️ Could not fetch public IP:", ipErr.message);
    }

    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      serverSelectionTimeoutMS: 5000, // fail quickly if not reachable
    });

    console.log('✅ MongoDB connected successfully 🟢');
  } catch (err) {
    console.error('❌ MongoDB connection failed 🔴', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
