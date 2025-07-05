# 🎮 Breakout Game

A modern, feature-rich Breakout game built with HTML5 Canvas, CSS3, and JavaScript. This project evolved from a simple Breakout clone into a comprehensive arcade experience with power-ups, particle effects, mobile controls, and a global leaderboard powered by Supabase.

## 🎯 Project Background

This Breakout game started as a basic implementation and has been enhanced with modern web development features. The project demonstrates proficiency in:

- **DOM manipulation** and **JavaScript game logic**
- **Canvas API** for smooth 2D graphics and animations
- **Responsive design** with mobile-first approach
- **Database integration** using Supabase for real-time leaderboards
- **Audio handling** with browser autoplay policy compliance
- **Touch controls** and device detection for mobile gaming
- **Particle systems** and visual effects for enhanced gameplay

## 🎮 Core Features

### **Enhanced Gameplay**
- **Classic Breakout mechanics** with smooth ball physics and collision detection
- **Power-up system** with 5 different types: Extra Life, Paddle Extend/Shrink, Multi-ball, Speed Boost
- **Particle effects system** for visual feedback on brick destruction and ball trails
- **Progressive difficulty** with colorful brick patterns and increasing challenge

### **Multi-Platform Controls**
- **Desktop**: Mouse movement or Arrow keys for paddle control
- **Mobile**: Touch and drag controls with customizable sensitivity
- **Universal**: Pause/Resume with 'P' key or pause button
- **Device detection** automatically switches between desktop and mobile interfaces

### **Game State Management**
- **Start screen** with comprehensive instructions and control guides
- **Pause menu** with resume, restart, and main menu options
- **Game over screen** with score saving and leaderboard integration
- **Settings menu** with customizable game parameters

### **Customization & Settings**
- **Music volume control** with real-time adjustment
- **Ball speed adjustment** (Slow/Normal/Fast) for different skill levels
- **Paddle size options** (Small/Normal/Large) for varied gameplay
- **Touch sensitivity** for mobile devices (Low/Normal/High)
- **Particle effects intensity** (Low/Normal/High) for performance tuning

### **Global Leaderboard System**
- **Supabase-powered** real-time leaderboard with cloud storage
- **Top 10 scores** with medal indicators (🥇🥈🥉)
- **Anonymous score saving** with username input
- **Automatic updates** and error handling

## 🎨 Visual Design & UX

### **Retro Arcade Aesthetic**
- **Neon color scheme** with cyan, magenta, and yellow highlights
- **Glowing effects** and text shadows for authentic arcade feel
- **Smooth animations** and transitions between game states
- **Responsive design** that adapts to all screen sizes

### **Mobile Optimization**
- **Touch-friendly interface** with appropriate button sizes
- **Landscape and portrait** orientation support
- **Mobile-specific UI** adjustments and controls
- **Performance optimization** for smooth gameplay on mobile devices

## 🛠️ Technical Implementation

### **Frontend Technologies**
- **HTML5 Canvas** for game rendering and animations
- **CSS3** with custom properties and responsive design
- **JavaScript ES6+** with modern syntax and features
- **Web Audio API** with browser autoplay policy handling

### **Backend Integration**
- **Supabase** for real-time database operations
- **Row Level Security (RLS)** for secure anonymous access
- **RESTful API** integration for leaderboard functionality

### **Performance Features**
- **RequestAnimationFrame** for smooth 60fps gameplay
- **Efficient collision detection** algorithms
- **Optimized particle system** with configurable intensity
- **Memory management** for long gaming sessions

## 🚀 Quick Start

### **1. Clone and Setup**
```bash
git clone https://github.com/yourusername/breakout-game.git
cd breakout-game
```

### **2. Supabase Setup (Optional for leaderboard)**
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create a `leaderboard` table with these columns:
   ```sql
   CREATE TABLE leaderboard (
     id BIGSERIAL PRIMARY KEY,
     username TEXT NOT NULL,
     score BIGINT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```
3. Enable Row Level Security and create policies for anonymous access
4. Update `supabase-config.js` with your project credentials

### **3. Run the Game**
- **Option 1**: Open `game.html` directly in a web browser
- **Option 2**: Serve with a local server: `python -m http.server 8000`
- **Option 3**: Use any static file server of your choice

## 🎮 How to Play

### **Basic Controls**
1. **Start the game** from the main menu
2. **Control the paddle** with mouse/touch or arrow keys
3. **Break all bricks** to complete the level
4. **Avoid losing the ball** - you have 3 lives
5. **Collect power-ups** for special abilities
6. **Save your score** to compete on the global leaderboard

### **Power-up System**
- ❤️ **Extra Life**: Adds one life to your total
- ⬆️ **Paddle Extend**: Makes paddle 50% larger for easier ball control
- ⬇️ **Paddle Shrink**: Makes paddle 30% smaller for increased challenge
- ⚽ **Multi-ball**: Creates 2 additional balls for faster brick clearing
- ⚡ **Speed Boost**: Increases ball speed by 50% for dynamic gameplay

### **Scoring System**
- **1 point** per brick destroyed
- **Power-ups** appear randomly when breaking bricks
- **High scores** are saved to the global leaderboard
- **Medals** are awarded for top 3 positions

## 📱 Mobile Gaming Experience

### **Touch Controls**
- **Intuitive touch interface** with visual feedback
- **Customizable sensitivity** for different device types
- **Responsive design** that works on all screen sizes
- **Landscape optimization** for better gaming experience

### **Mobile-Specific Features**
- **Device detection** automatically enables touch controls
- **Touch area indicators** for paddle control guidance
- **Optimized UI** with larger touch targets
- **Performance tuning** for smooth mobile gameplay

## 🔧 Advanced Configuration

### **Audio Setup**
- Place your background music file as `boss.ogg` in the project root
- The game handles browser autoplay restrictions automatically
- Volume control available in settings menu
- Audio status indicator shows when music is ready

### **Performance Tuning**
- **Particle effects** can be adjusted for different device capabilities
- **Touch sensitivity** can be fine-tuned for individual preferences
- **Ball speed** affects game difficulty and challenge level
- **Paddle size** options for different skill levels

## 🐛 Troubleshooting

### **Audio Issues**
- **Modern browsers** require user interaction before playing audio
- **Click any button** to enable background music
- **Check file path** - ensure `boss.ogg` exists in the project folder
- **Browser console** will show detailed error messages

### **Leaderboard Problems**
- **Verify Supabase configuration** in `supabase-config.js`
- **Check browser console** for network error messages
- **Ensure RLS policies** allow anonymous access
- **Test database connection** with simple queries

### **Mobile Control Issues**
- **Device detection** should automatically enable mobile controls
- **Adjust touch sensitivity** in settings if controls feel unresponsive
- **Check touch events** aren't being blocked by browser
- **Try landscape mode** for better mobile gaming experience

### **Performance Issues**
- **Reduce particle effects** to "Low" in settings for better performance
- **Close other browser tabs** to free up memory
- **Update browser** to latest version for best compatibility
- **Check device capabilities** for smooth 60fps gameplay

## 🎯 Development Journey

This project demonstrates the evolution from a basic game concept to a polished, feature-complete web application. Key development phases included:

1. **Core Gameplay** - Basic Breakout mechanics with ball physics
2. **Visual Enhancement** - Particle effects and retro styling
3. **Mobile Support** - Touch controls and responsive design
4. **Backend Integration** - Supabase leaderboard system
5. **Polish & Optimization** - Settings, audio, and performance tuning

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for bugs and feature requests.

## 📞 Support

If you encounter any issues or have questions about the game or setup process, please open an issue on GitHub.

---

**Enjoy the game! 🎮**

*This project showcases modern web development techniques while delivering an engaging, retro-style gaming experience.*