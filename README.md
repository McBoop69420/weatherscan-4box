![](https://media.discordapp.net/attachments/1339090268263157770/1367899479168122900/banner.png?ex=6816432a&is=6814f1aa&hm=61bea94dd7975435efd6e895f24f90375683b571b88a0b47fac2c7d1d5d33749&=&format=webp&quality=lossless&width=1100&height=200)

------------

# Weatherscan-4box

**Weatherscan Local XL - 4-Panel Dashboard Edition**

This is a fork of **Weatherscan Local XL** by ***mist weather media*** with enhanced features:
- **Standalone Desktop Launcher** - One-click startup with automatic server management
- **Secure API Key Management** - API keys kept out of version control
- **Desktop Shortcut Creation** - Easy access from your desktop

Original project: **Weatherscan Local XL** - A simulated recreation of "Weatherscan Local" by The Weather Channel in HTML/CSS/JS

Best used with mainland United States locations

Best used with Google Chrome on Windows

Online demo: [local.weatherscan.net](https://local.weatherscan.net)

© Mist Weather Media 2025.

------------

# New Features in 4box Edition

## Standalone Desktop Launcher
- **launcher.js** - Automated process management
  - Starts Express server automatically
  - Waits for server health check before launching Electron
  - Manages both processes from a single script
  - Clean shutdown when app closes

## Easy Setup
- **Launch Weatherscan.bat** - One-click launcher for Windows
- **create-shortcut.ps1** - Creates desktop shortcut automatically
- **config.example.js** - Template for API key configuration

## Security Improvements
- API keys stored in `config.js` (not tracked in git)
- `.gitignore` updated to exclude sensitive data
- Example configuration provided for easy setup

------------

**Special thanks to these talented minds who made this project possible!**

**Joe Molinelli (TheGoldDiamond9)** - Lead Developer  
**COLSTER** - Lead Designer / Developer (CSS)  
**PicelBoi** - Developer (Radar)  
**JensonWx** - Developer (HTML)  
**SSPWXR** - Developer (Express Conversion)  
**zachNet** - Audio Engineer  

and the rest of the Mist Creative Team for their support!

------------

Need support beyond the scope of this README? Have any questions? Feel free to join our Discord for support!

[***mist weather media*** on Discord](https://discord.gg/hV2w5sZQxz)

------------

Are you a developer? Pull requests are welcome! If you find a bug and fix it yourself, submit one with the fixed code and it may be merged into the main branch!

# Initial Setup

1. **Install [Node.js LTS](https://nodejs.org/en/)**
   - Download and install the latest LTS version
   - Restart your terminal/command prompt after installation

2. **Acquire API Keys** (required for weather data and radar)
   - *weather.com* API key - Sign up at [weather.com](https://www.weather.com/)
   - *mapbox.com* API key - Sign up at [mapbox.com](https://www.mapbox.com/)

3. **Configure API Keys**
   - Go to `/webroot/js/` folder
   - Copy `config.example.js` to `config.js`
   - Open `config.js` in a text editor
   - Line 1: Replace `"YOUR_WEATHER_COM_API_KEY"` with your weather.com API key
   - Line 2: Replace `"YOUR_MAPBOX_API_KEY"` with your mapbox.com API key
   - Save and close `config.js`

4. **Install Dependencies**
   - Open terminal/command prompt in the project root directory
   - Run: `npm install`
   - This installs all required packages

5. **Launch the App**

   **Option A - Easy Desktop Launch (Recommended):**
   - Double-click `Launch Weatherscan.bat`
   - Or run `create-shortcut.ps1` to create a desktop shortcut
   - The launcher automatically starts both the server and desktop app

   **Option B - Manual Launch:**
   - Run: `npm start` (starts the Express server on port 8080)
   - In a separate terminal, navigate to `electron-wrapper/`
   - Run: `npm install` (first time only)
   - Run: `npm start` (launches the desktop app)

------------

Enjoy the nostalgia! You're all set.

Many thanks for using our simulator! We hope you like it.
