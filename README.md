Termux Chess LAN
Play chess offline on Android phones using mobile hotspot - perfect for metro, trains, or anywhere without internet connectivity.



🎯 Why This Project?
Ever wanted to play chess with a friend during a metro ride or in places with no internet? This project transforms two Android phones into a complete chess gaming setup using just a mobile hotspot and Termux. No internet required, no external servers needed - just pure offline multiplayer chess.

✨ Features
🏠 Create or Join Rooms — Easy room creation & joining with unique codes
⚡ Real-Time Gameplay — Synchronized moves using WebSocket (socket.io)
⏱️ Move History — Track all moves made in the game
📱 Mobile Optimized — Responsive design perfect for phone screens
🌐 Offline Play — Works completely offline using mobile hotspot
🔄 Game Controls — Reset, undo moves, and leave game options
🎮 Drag & Drop — Intuitive piece movement with click or drag
🛠️ Technology Stack
Frontend: React, Vite, TailwindCSS
Backend: Node.js, Express, Socket.IO
Chess Engine: Chess.js library
Platform: Android (Termux), Mobile Hotspot
Real-time Communication: WebSockets
📋 Prerequisites
2 Android phones
Termux app installed on one phone (server)
Mobile hotspot capability
Basic familiarity with terminal commands
🚀 Step-by-Step Setup
Phase 1: Set Up Mobile Hotspot
On Phone 1 (Server Phone):

Go to Settings → Network & Internet → Hotspot & Tethering
Enable Wi-Fi Hotspot
Set a hotspot name (e.g., "ChessGame") and password
Important: Turn OFF mobile data to avoid data charges
Note down the hotspot name and password
On Phone 2 (Client Phone):

Go to Wi-Fi Settings
Connect to Phone 1's hotspot using the password
Wait for connection confirmation
Phase 2: Install Termux on Phone 1
Download Termux from F-Droid (recommended) or Google Play Store
Open Termux and wait for initial setup
Update packages:
pkg update && pkg upgrade


Phase 3: Install Node.js and Git
In Termux on Phone 1:

# Install Node.js and Git
pkg install nodejs git

# Verify installation
node --version
npm --version


Phase 4: Clone and Setup Chess Game
# Clone the chess project
git clone https://github.com/yourusername/termux-chess-lan.git

# Navigate to project
cd termux-chess-lan

# Check project structure
ls -la


Phase 5: Start the Server
Terminal 1 - Server:

# Install server dependencies
cd server
npm install

# Start the server
npm start
You should see:

Server is online on all network interfaces


Phase 6: Start the Client
Open a new Termux session (swipe down, tap "New Session"):

# Navigate to client folder
cd ~/termux-chess-lan/client

# Install client dependencies
npm install

# Start the client
npm run dev
You should see:

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.43.1:5173/


Phase 7: Access Game on Both Phones
On Phone 1 (Server):

Open browser → http://localhost:5173
On Phone 2 (Client):

Open browser → http://192.168.43.1:5173 (use the Network IP shown)


Phase 8: Play Chess!
On Phone 1:

Enter a room code (e.g., "metro123")
Click "Join" - you'll be assigned White pieces
Share the room code with your friend
On Phone 2:

Enter the same room code ("metro123")
Click "Join" - you'll be assigned Black pieces
Start playing!


🎮 How to Play
Create Room: Enter any room code and click "Join" to create a new game
Join Room: Enter an existing room code to join a friend's game
Move Pieces: Click and drag pieces or click source then destination
Game Controls: Use Reset, Undo, or Leave buttons as needed
Room Codes: Share simple codes like "chess1", "metro", "train" etc.
🔧 Troubleshooting
If Phone 2 can't connect:

Verify both phones are on the same hotspot
Try common hotspot IPs: 192.168.43.1:5173, 192.168.1.1:5173
Check if both server (port 3001) and client (port 5173) are running
If moves don't sync:

Refresh both browsers
Rejoin the same room code
Restart the server if needed
Network IP Detection:

# In Termux, find your IP
ifconfig
🏗️ Development Journey
This project was born out of a simple need - playing chess during metro rides without internet. Here's how it evolved:

Research Phase: Explored existing LAN chess solutions on GitHub
Architecture Decision: Chose web-based approach for cross-platform compatibility
Platform Selection: Termux on Android for server hosting capabilities
Network Configuration: Overcame CORS and localhost restrictions for LAN access
Mobile Optimization: Ensured responsive design for phone screens
Testing: Validated in real metro scenarios with mobile hotspot
🤝 Contributing
Contributions are welcome! Areas for improvement:

[ ] Add pawn promotion feature
[ ] Implement game timer/clock
[ ] Add sound effects for moves
[ ] Create native Android app version
[ ] Add spectator mode
[ ] Implement game replay feature
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Original LAN-Chess concept by officialpranav
Chess.js library for game logic
Socket.IO for real-time communication
Termux community for Android terminal environment
Built with ❤️ for offline chess enthusiasts

Perfect for metro rides, train journeys, camping trips, or anywhere you want to play chess without internet!