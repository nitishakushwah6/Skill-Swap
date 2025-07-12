# SkillSwap Platform 🚀

A modern, mobile-responsive skill exchange platform built with the MERN stack for hackathon-level presentation. Connect with learners across India to exchange skills and accelerate your learning journey.

## ✨ Features

### Core Functionality
- **User Authentication** - Secure login with demo credentials
- **Skill Management** - List skills you offer and want to learn
- **Swap Requests** - Send and manage skill swap requests
- **User Profiles** - Comprehensive profile management with availability settings
- **Real-time Stats** - Live user statistics and engagement metrics

### Mobile-First Design
- **Responsive Layout** - Optimized for all screen sizes (320px - 4K)
- **Touch-Friendly** - 44px minimum touch targets for mobile devices
- **Mobile Navigation** - Bottom navigation bar for easy access
- **Gesture Support** - Swipe-friendly interactions
- **Progressive Enhancement** - Works on all devices with graceful degradation

### Hackathon-Level UI
- **Glass Morphism** - Modern glass card effects with backdrop blur
- **Gradient Animations** - Dynamic background gradients
- **Floating Elements** - Animated floating particles (hidden on mobile)
- **Neon Glow Effects** - Subtle glow effects on interactive elements
- **Smooth Transitions** - 60fps animations with reduced motion support

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing

## 📱 Mobile Compatibility

### Supported Devices
- **iOS Safari** (iOS 12+)
- **Android Chrome** (Android 8+)
- **Samsung Internet** (Android 8+)
- **Firefox Mobile** (Android 8+)
- **Edge Mobile** (Windows 10+)

### Responsive Breakpoints
- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

### Mobile Optimizations
- **Touch Targets**: Minimum 44px for all interactive elements
- **Font Scaling**: Responsive typography that scales appropriately
- **Image Optimization**: Responsive images with proper aspect ratios
- **Performance**: Optimized animations and reduced motion support
- **Accessibility**: Screen reader support and keyboard navigation

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hackathon
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend environment
   cd server
   cp .env.example .env
   ```
   
   Edit `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/skillswap
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   # Start backend (from server directory)
   npm run dev

   # Start frontend (from client directory, in new terminal)
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔐 Demo Credentials

Use these credentials to test the application:
- **Email**: `demo@skillswap.com`
- **Password**: `demo123`

## 📱 Mobile Testing

### Browser DevTools
1. Open Chrome DevTools (F12)
2. Click the device toggle button
3. Select a mobile device or set custom dimensions
4. Test touch interactions and responsive behavior

### Real Device Testing
1. Ensure your computer and mobile device are on the same network
2. Find your computer's IP address
3. Access `http://[YOUR_IP]:3000` on your mobile device
4. Test all functionality on the actual device

### Mobile-Specific Features
- **Bottom Navigation**: Swipe-friendly navigation bar
- **Touch Gestures**: Tap, swipe, and pinch interactions
- **Orientation Support**: Works in portrait and landscape modes
- **Offline Support**: Graceful handling of network issues

## 🎨 Customization

### Colors and Themes
Edit `client/src/index.css` to customize:
- Primary colors and gradients
- Animation timings
- Glass morphism effects
- Mobile breakpoints

### Responsive Design
The application uses Tailwind CSS breakpoints:
- `sm:` (640px+) - Small devices
- `md:` (768px+) - Medium devices
- `lg:` (1024px+) - Large devices
- `xl:` (1280px+) - Extra large devices

### Mobile Navigation
Customize the mobile navigation in each component:
```javascript
<nav className="mobile-nav md:hidden">
  <div className="flex justify-around items-center">
    <a href="/" className="mobile-nav-item">
      <span className="text-lg mb-1">🏠</span>
      <span>Home</span>
    </a>
    // ... more navigation items
  </div>
</nav>
```

## 🔧 Development

### Project Structure
```
hackathon/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── index.css       # Global styles
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── package.json
└── README.md
```

### Available Scripts

**Backend (server directory)**
```bash
npm run dev      # Start development server
npm start        # Start production server
npm test         # Run tests
```

**Frontend (client directory)**
```bash
npm start        # Start development server
npm build        # Build for production
npm test         # Run tests
```

## 🌟 Hackathon Features

### Presentation Ready
- **Demo Data**: Pre-populated with realistic user data
- **Smooth Animations**: 60fps animations for professional feel
- **Error Handling**: Graceful error states and loading indicators
- **Mobile Demo**: Perfect for mobile-first hackathon demos

### Performance Optimized
- **Lazy Loading**: Components load on demand
- **Optimized Images**: Responsive images with proper sizing
- **Minimal Bundle**: Optimized for fast loading
- **Caching**: Efficient caching strategies

## 🐛 Troubleshooting

### Common Issues

**Mobile not working properly:**
- Clear browser cache
- Check if mobile navigation is visible
- Verify responsive breakpoints

**Animations not smooth:**
- Check if reduced motion is enabled
- Verify device performance
- Test on different browsers

**Touch interactions not working:**
- Ensure touch targets are 44px minimum
- Check for overlapping elements
- Test on actual mobile device

### Performance Tips
- Use Chrome DevTools Performance tab
- Monitor network requests
- Check for memory leaks
- Optimize images and assets

## 📄 License

This project is created for hackathon purposes. Feel free to use and modify as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple devices
5. Submit a pull request

## 📞 Support

For hackathon support or questions:
- Check the troubleshooting section
- Review mobile compatibility guidelines
- Test on multiple devices before presentation

---

**Built with ❤️ for hackathon success!** 🚀 