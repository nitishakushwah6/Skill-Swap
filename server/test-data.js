const mongoose = require('mongoose');
const User = require('./models/User');
const Swap = require('./models/Swap');
const Rating = require('./models/Rating');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/skillswap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createTestData() {
  try {
    console.log('Creating test data...');

    // Create test users
    const user1 = new User({
      name: 'John Doe',
      email: 'john@skillswap.com',
      password: 'Password123!',
      role: 'user',
      bio: 'I love teaching programming and learning new languages!',
      location: 'New York, NY',
      skills: ['JavaScript', 'Python', 'React'],
      wantedSkills: ['Spanish', 'Guitar', 'Cooking']
    });

    const user2 = new User({
      name: 'Jane Smith',
      email: 'jane@skillswap.com',
      password: 'Password123!',
      role: 'user',
      bio: 'Passionate about music and always eager to learn!',
      location: 'Los Angeles, CA',
      skills: ['Guitar', 'Spanish', 'Cooking'],
      wantedSkills: ['JavaScript', 'Python', 'React']
    });

    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@skillswap.com',
      password: 'Password123!',
      role: 'admin',
      bio: 'Platform administrator',
      location: 'San Francisco, CA',
      skills: ['Management', 'System Administration'],
      wantedSkills: ['New Technologies']
    });

    // Save users
    await user1.save();
    await user2.save();
    await adminUser.save();

    console.log('Users created successfully!');

    // Create test swaps
    const swap1 = new Swap({
      userId: user1._id,
      title: 'Learn JavaScript Programming',
      description: 'I can teach you JavaScript fundamentals, ES6+, and modern web development. Looking to learn Spanish in return!',
      category: 'technology',
      skill: 'JavaScript',
      location: 'New York, NY',
      status: 'open'
    });

    const swap2 = new Swap({
      userId: user2._id,
      title: 'Spanish Conversation Practice',
      description: 'Native Spanish speaker offering conversation practice. Would love to learn some basic programming!',
      category: 'language',
      skill: 'Spanish',
      location: 'Los Angeles, CA',
      status: 'open'
    });

    const swap3 = new Swap({
      userId: user1._id,
      title: 'Guitar Lessons for Beginners',
      description: 'I can teach you guitar basics and some popular songs. Looking to learn cooking techniques!',
      category: 'music',
      skill: 'Guitar',
      location: 'New York, NY',
      status: 'accepted',
      acceptedBy: user2._id,
      acceptedAt: new Date()
    });

    // Save swaps
    await swap1.save();
    await swap2.save();
    await swap3.save();

    console.log('Swaps created successfully!');

    // Create test ratings
    const rating1 = new Rating({
      fromUser: user1._id,
      toUser: user2._id,
      swapId: swap3._id,
      rating: 5,
      comment: 'Excellent guitar teacher! Very patient and knowledgeable. Highly recommended!'
    });

    const rating2 = new Rating({
      fromUser: user2._id,
      toUser: user1._id,
      swapId: swap3._id,
      rating: 4,
      comment: 'Great student! Very enthusiastic and quick learner. Would definitely teach again!'
    });

    // Save ratings
    await rating1.save();
    await rating2.save();

    console.log('Ratings created successfully!');
    console.log('\n✅ Test data created successfully!');
    console.log('\n📊 Database Summary:');
    console.log('- Users: 3 (2 regular users + 1 admin)');
    console.log('- Swaps: 3 (2 open, 1 accepted)');
    console.log('- Ratings: 2');
    console.log('\n🔗 You can now view this data in MongoDB Compass!');

  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestData(); 