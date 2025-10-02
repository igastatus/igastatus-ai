# IGASTATUS - Istanbul Airport Live Status

Modern, clean, and professional website for Istanbul Airport (IGA) real-time flight tracking and information.

## Features

- ✈️ **Live Flight Tracking** - Real-time flight map with RadarBox integration
- 📊 **Flight Information** - Live arrivals and departures board
- 🌤️ **Weather Information** - METAR, TAF, and live weather conditions
- 📄 **Airport Charts** - Download LTFM navigation charts
- 🎧 **Live ATC** - Real-time air traffic control audio
- 🔍 **Flight Search** - Search and book flights via Skyscanner

## Technology Stack

- Pure HTML5, CSS3, and Vanilla JavaScript
- No frameworks or build tools required
- Responsive design for all devices
- Modern glassmorphism UI inspired by IGA Airport official website

## Project Structure

```
igastatus-new/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Styles with modern design
├── js/
│   └── main.js         # JavaScript functionality
├── charts/
│   ├── LTFMCHART2024.pdf
│   └── LTFMCHART2023.pdf
└── favicon.ico
```

## Local Development

1. Open the project directory
2. Start a local server:
   ```bash
   python3 -m http.server 8081
   ```
3. Open browser: `http://localhost:8081`

## Deployment

### GitHub Pages
1. Create a new repository
2. Push all files to the repository
3. Enable GitHub Pages in repository settings
4. Your site will be live at: `https://yourusername.github.io/reponame`

### Alternative: Use as-is
All files are ready for deployment to any web hosting service. Just upload the files to your server root directory.

## Chart URLs
- LTFM Charts 2024-2025: `https://igastatus.com/charts/LTFMCHART2024.pdf`
- LTFM Charts 2023: `https://igastatus.com/charts/LTFMCHART2023.pdf`

## API Integrations

- **CheckWX API**: Weather METAR/TAF data
- **RadarBox**: Live flight tracking map
- **FlightRadar.Live**: Arrivals/Departures boards
- **Windy**: Weather visualization
- **LiveATC**: Air traffic control audio
- **Skyscanner**: Flight search widget

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

©2025 IGASTATUS. All Rights Reserved.

---

**Forever in Love ❤️ LTBA**
