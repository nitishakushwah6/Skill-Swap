const mongoose = require('mongoose');
const User = require('./models/User');
const Swap = require('./models/Swap');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/skillswap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createSwapData() {
  try {
    console.log('Creating swap data...');

    // First, get existing users or create new ones
    let user1 = await User.findOne({ email: 'john@skillswap.com' });
    let user2 = await User.findOne({ email: 'jane@skillswap.com' });

    if (!user1) {
      user1 = new User({
        name: 'John Doe',
        email: 'john@skillswap.com',
        password: 'Password123!',
        role: 'user',
        bio: 'I love teaching programming and learning new languages!',
        location: 'New York, NY',
        skills: ['JavaScript', 'Python', 'React'],
        wantedSkills: ['Spanish', 'Guitar', 'Cooking']
      });
      await user1.save();
    }

    if (!user2) {
      user2 = new User({
        name: 'Jane Smith',
        email: 'jane@skillswap.com',
        password: 'Password123!',
        role: 'user',
        bio: 'Passionate about music and always eager to learn!',
        location: 'Los Angeles, CA',
        skills: ['Guitar', 'Spanish', 'Cooking'],
        wantedSkills: ['JavaScript', 'Python', 'React']
      });
      await user2.save();
    }

    // Create various swap scenarios
    const swaps = [
      {
        userId: user1._id,
        title: 'Learn JavaScript Programming',
        description: 'I can teach you JavaScript fundamentals, ES6+, and modern web development. Looking to learn Spanish in return!',
        category: 'technology',
        skill: 'JavaScript',
        location: 'New York, NY',
        status: 'open',
        preferredTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        contactInfo: 'john@skillswap.com'
      },
      {
        userId: user2._id,
        title: 'Spanish Conversation Practice',
        description: 'Native Spanish speaker offering conversation practice. Would love to learn some basic programming!',
        category: 'language',
        skill: 'Spanish',
        location: 'Los Angeles, CA',
        status: 'open',
        preferredTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        contactInfo: 'jane@skillswap.com'
      },
      {
        userId: user1._id,
        title: 'Guitar Lessons for Beginners',
        description: 'I can teach you guitar basics and some popular songs. Looking to learn cooking techniques!',
        category: 'music',
        skill: 'Guitar',
        location: 'New York, NY',
        status: 'accepted',
        acceptedBy: user2._id,
        acceptedAt: new Date(),
        preferredTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        contactInfo: 'john@skillswap.com'
      },
      {
        userId: user2._id,
        title: 'Cooking Indian Cuisine',
        description: 'Learn to cook authentic Indian dishes like butter chicken, biryani, and naan bread. Want to learn React in exchange!',
        category: 'cooking',
        skill: 'Indian Cooking',
        location: 'Los Angeles, CA',
        status: 'open',
        preferredTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        contactInfo: 'jane@skillswap.com'
      },
      {
        userId: user1._id,
        title: 'Python Data Analysis',
        description: 'Expert in Python pandas, numpy, and matplotlib. Can teach data analysis and visualization. Looking for guitar lessons!',
        category: 'technology',
        skill: 'Python Data Analysis',
        location: 'New York, NY',
        status: 'completed',
        acceptedBy: user2._id,
        acceptedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        preferredTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        contactInfo: 'john@skillswap.com'
      },
      {
        userId: user2._id,
        title: 'React Frontend Development',
        description: 'Learn React hooks, state management, and modern frontend development. Want to learn Spanish in return!',
        category: 'technology',
        skill: 'React',
        location: 'Los Angeles, CA',
        status: 'open',
        preferredTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        contactInfo: 'jane@skillswap.com'
      }
    ];

    // Clear existing swaps (optional - comment out if you want to keep existing data)
    await Swap.deleteMany({});
    console.log('Cleared existing swaps');

    // Create and save all swaps
    for (const swapData of swaps) {
      const swap = new Swap(swapData);
      await swap.save();
    }

    console.log('✅ Swap data created successfully!');
    console.log('\n📊 Swap Summary:');
    console.log('- Total swaps created: 6');
    console.log('- Open swaps: 4');
    console.log('- Accepted swaps: 1');
    console.log('- Completed swaps: 1');
    console.log('\n🔗 You can now view this data in:');
    console.log('1. MongoDB Compass → skillswap database → swaps collection');
    console.log('2. Your frontend app (when connected to real API)');
    console.log('3. API endpoint: http://localhost:5000/api/swaps');

  } catch (error) {
    console.error('Error creating swap data:', error);
  } finally {
    mongoose.connection.close();
  }
}

createSwapData(); 