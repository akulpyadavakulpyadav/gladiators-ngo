require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gladiators';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI, { family: 4 });
    console.log('Connected to MongoDB for seeding...');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    const usersToSeed = [
      {
        _id: 'VLT123456',
        role: 'volunteer',
        pin: '123456',
        name: 'Aniruddha',
        aadhaar: '123412341234',
        phone: '9876543210',
        email: 'volunteer@example.com',
        age: '22',
        location: 'Bangalore',
        interests: ['Environment', 'Education']
      },
      {
        _id: 'NGO123456',
        role: 'ngo',
        pin: '123456',
        name: 'Global Green Initiative',
        ngoDarpanId: 'NGODARPAN123456789012',
        email: 'contact@globalgreen.org',
        headquarters: 'Bangalore',
        website: 'https://globalgreen.org',
        domain: 'Environment',
        pocName: 'Rajesh Kumar',
        pocPhone: '9876543211',
        pocDesignation: 'Director',
        pocEmail: 'rajesh@globalgreen.org'
      },
      {
        _id: 'CPY123456',
        role: 'company',
        pin: '123456',
        name: 'Tata CSR',
        cin: 'L27020MH1958PLC011107',
        email: 'csr@tata.com',
        headquarters: 'Mumbai',
        website: 'https://tata.com',
        industrySector: 'Manufacturing',
        csrFocus: ['Education', 'Environment'],
        pocName: 'Sunita Sharma',
        pocPhone: '9876543212',
        pocDesignation: 'CSR Head',
        pocEmail: 'sunita.sharma@tata.com'
      }
    ];

    await User.insertMany(usersToSeed);
    console.log('Seeded initial mock users successfully!');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
