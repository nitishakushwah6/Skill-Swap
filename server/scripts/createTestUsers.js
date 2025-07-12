const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createTestUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap');
    console.log('Connected to MongoDB');

    // Check if test users already exist
    const existingDemoUser = await User.findOne({ email: 'demo@skillswap.com' });
    const existingAdminUser = await User.findOne({ email: 'admin@skillswap.com' });

    if (existingDemoUser) {
      console.log('Demo user already exists');
    } else {
      // Create demo user
      const demoUser = new User({
        name: 'Demo User',
        email: 'demo@skillswap.com',
        password: 'demo123',
        skills: ['React', 'JavaScript', 'Node.js'],
        wantedSkills: ['UI/UX Design', 'Python', 'Machine Learning'],
        bio: 'I love learning new technologies and sharing my knowledge with others.',
        location: 'Mumbai, India',
        status: 'active',
        role: 'user'
      });

      await demoUser.save();
      console.log('Demo user created successfully');
    }

    if (existingAdminUser) {
      console.log('Admin user already exists');
    } else {
      // Create admin user
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@skillswap.com',
        password: 'admin123',
        skills: ['System Administration', 'Database Management', 'Security'],
        wantedSkills: ['Cloud Computing', 'DevOps', 'AI/ML'],
        bio: 'Platform administrator helping users connect and learn together.',
        location: 'Delhi, India',
        status: 'active',
        role: 'admin'
      });

      await adminUser.save();
      console.log('Admin user created successfully');
    }

    // Create additional test users for swap requests
    const testUsers = [
      {
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        password: 'password123',
        skills: ['UI/UX Design', 'Figma', 'Prototyping'],
        wantedSkills: ['React', 'JavaScript', 'Node.js'],
        bio: 'UI/UX designer passionate about creating beautiful user experiences.',
        location: 'Mumbai, India',
        status: 'active',
        role: 'user'
      },
      {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: 'password123',
        skills: ['Python', 'Machine Learning', 'Data Analysis'],
        wantedSkills: ['Web Development', 'JavaScript', 'React'],
        bio: 'Data scientist exploring the world of AI and machine learning.',
        location: 'Delhi, India',
        status: 'active',
        role: 'user'
      },
      {
        name: 'Priya Patel',
        email: 'priya@example.com',
        password: 'password123',
        skills: ['Content Writing', 'SEO', 'Social Media'],
        wantedSkills: ['Graphic Design', 'Photoshop', 'Illustrator'],
        bio: 'Content creator and digital marketer helping brands grow online.',
        location: 'Bangalore, India',
        status: 'active',
        role: 'user'
      }
    ];

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`Test user ${userData.name} created successfully`);
      } else {
        console.log(`Test user ${userData.name} already exists`);
      }
    }

    console.log('All test users created successfully!');
    console.log('\nTest Credentials:');
    console.log('Demo User: demo@skillswap.com / demo123');
    console.log('Admin User: admin@skillswap.com / admin123');
    console.log('Sarah Chen: sarah@example.com / password123');
    console.log('Rahul Sharma: rahul@example.com / password123');
    console.log('Priya Patel: priya@example.com / password123');

  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
createTestUsers(); 