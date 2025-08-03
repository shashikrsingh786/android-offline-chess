
# ♟️ Termux Chess LAN

**Offline Chess via Hotspot – No Internet, No Problem!**  
Play full chess games with your friend using two Android phones connected via mobile hotspot.  
Perfect for **metro rides**, **train journeys**, **chai breaks**, or **when Jio betrays you again 😤📶**.

---

## 📸 Preview

<table>
<tr>
<td><img src="screenshots/termux-setup.png" width="250"/><br><sub>📱 Termux Setup</sub></td>
<td><img src="screenshots/browser-game.png" width="250"/><br><sub>🌐 Game UI</sub></td>
<td><img src="screenshots/match-result.png" width="250"/><br><sub>✅ Game Result</sub></td>
</tr>
</table>



---

## 🎯 Why This Project?

Imagine this: You're in the Delhi Metro 🚇. There's **no internet**, but your colleague is like,  
*"Bro, ek chess ho jaaye?"*

And you're like:  
**"Nahi bhai, ab main tera phone nahi pakadunga. Apne phone pe hi khel."**

So I built this — a fun, zero-internet, mobile-hotspot powered chess game 🧠♟️

---

## ✨ Features

- 🏠 **Create / Join Game Rooms** — Simple custom room codes like `metro123`
- ⚡ **Real-Time Sync** — Moves sync instantly using WebSockets
- 🔄 **Controls** — Reset, Undo, Leave whenever you want
- 🎮 **Drag & Drop UI** — Easy on touchscreen
- 📱 **Mobile-Optimized** — Works great on phones
- 🌐 **Works 100% Offline** — Just a hotspot, no data

---

## 🛠️ Tech Stack (a.k.a. What’s under the hood)

| Layer       | Tools & Libraries               |
|-------------|----------------------------------|
| Frontend    | React, Vite, TailwindCSS         |
| Backend     | Node.js, Express, Socket.IO      |
| Chess Logic | [Chess.js](https://github.com/jhlywa/chess.js) |
| Hosting     | Termux on Android 🤖             |
| Connection  | Hotspot LAN via WebSocket        |

---

## 📋 What You’ll Need

- 📱 Two Android phones  
- 📡 One phone with **mobile hotspot**
- 🧰 [Termux](https://f-droid.org/packages/com.termux/) installed (on server phone)
- 🌐 Node.js + npm in Termux

---

## 🚀 Setup Guide (Quick & Fun)

### 🔥 Step 1: Setup Hotspot

**On Phone 1 (Server):**
- Go to: `Settings → Hotspot & Tethering`
- Turn ON Wi-Fi hotspot 🔥
- Turn OFF mobile data (save that 4G 😎)

**On Phone 2 (Client):**
- Connect to Phone 1’s hotspot via Wi-Fi

---

### 📦 Step 2: Setup Termux (Server Phone)

Open Termux:

```bash
pkg update && pkg upgrade
pkg install nodejs git
node --version
npm --version
````

---

### 🧠 Step 3: Clone the Project

```bash
git clone https://github.com/shashikrsingh786/android-offline-chess.git
cd android-offline-chess
```

---

### 🚦 Step 4: Start the Server

```bash
cd server
npm install
npm start
```

You should see:

```
Server running on all network interfaces on port 3001
```

---

### 💻 Step 5: Run the Client UI (React App)

Open a new Termux session (Swipe down → New Session):

```bash
cd ~/android-offline-chess/client
npm install
npm run dev
```

---

### 📲 Step 6: Open in Browser

**Phone 1 (Server):**
`http://localhost:5173`

**Phone 2 (Client):**
`http://192.168.43.1:5173`
(Or whatever IP is shown in terminal of phone 1)

---

## 🕹️ How to Play

1. **Create Room**
   Enter any room code (e.g. `metroOP`) → click Join → you’re White

2. **Join Room**
   Friend enters same code → joins as Black

3. **Make Moves**
   Drag pieces or tap → easy!

4. **Control Game**
   Use Reset, Undo, Leave as needed

---

## 📈 Real-Life Use Case

> Me and my office buddy wanted to play chess on our **own phones**.
> Metro network was trash as usual 🫠.
> So I made this. Now we challenge each other daily while people around us scroll reels 😎📵♟️

---


