/**
 * Neon Digital Template
 * Fluorescent digital display with cyberpunk vibes
 */

const { createBaseSVG, drawDigitalTime, drawComplications, CENTER } = require('../renderer');

module.exports = {
  id: 'digital',
  name: 'Neon Digital',
  category: 'digital',
  description: '형광색 디지털 사이버펑크 디자인',
  
  generate(options = {}) {
    const {
      backgroundColor = '#0a0a0a',
      primaryColor = '#00ffff',
      accentColor = '#ff00ff',
      glowIntensity = 'high'
    } = options;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const glowFilter = glowIntensity === 'high' ? '0 0 20px' : '0 0 10px';
    
    const content = `
      <defs>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="scanline" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="50%" stop-color="${primaryColor}" stop-opacity="0.03"/>
          <stop offset="100%" stop-color="transparent"/>
        </linearGradient>
      </defs>
      
      <!-- Grid background -->
      ${Array.from({ length: 9 }, (_, i) => 
        `<line x1="${50 + i * 50}" y1="0" x2="${50 + i * 50}" y2="450" stroke="${primaryColor}" stroke-width="0.5" opacity="0.1"/>`
      ).join('\n      ')}
      ${Array.from({ length: 9 }, (_, i) => 
        `<line x1="0" y1="${50 + i * 50}" x2="450" y2="${50 + i * 50}" stroke="${primaryColor}" stroke-width="0.5" opacity="0.1"/>`
      ).join('\n      ')}
      
      <!-- Hexagonal frame -->
      <polygon points="225,30 400,110 400,340 225,420 50,340 50,110" 
               fill="none" stroke="${primaryColor}" stroke-width="3" filter="url(#neonGlow)"/>
      <polygon points="225,50 380,120 380,330 225,400 70,330 70,120" 
               fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.5"/>
      
      <!-- Main time display -->
      <g filter="url(#neonGlow)">
        ${drawDigitalTime(hours, minutes, null, {
          y: 180,
          color: primaryColor,
          fontSize: 80,
          fontWeight: 'bold',
          format24h: true
        })}
      </g>
      
      <!-- Seconds display -->
      <text x="${CENTER}" y="230" fill="${accentColor}" font-size="28" 
            text-anchor="middle" font-family="'Courier New', monospace" filter="url(#neonGlow)">
        :${String(seconds).padStart(2, '0')}
      </text>
      
      <!-- Date display -->
      <text x="${CENTER}" y="280" fill="${primaryColor}" font-size="18" 
            text-anchor="middle" font-family="'Courier New', monospace" opacity="0.8">
        ${now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
      </text>
      
      <!-- Status indicators -->
      <g transform="translate(${CENTER}, 330)">
        <rect x="-80" y="-15" width="160" height="30" fill="none" stroke="${accentColor}" stroke-width="1" rx="5"/>
        <text x="0" y="5" fill="${accentColor}" font-size="12" text-anchor="middle" font-family="'Courier New', monospace">
          BLUETOOTH • WIFI
        </text>
      </g>
      
      <!-- Decorative elements -->
      <circle cx="100" cy="100" r="30" fill="none" stroke="${primaryColor}" stroke-width="1" opacity="0.3"/>
      <circle cx="350" cy="350" r="30" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.3"/>
      
      <!-- Scanline effect -->
      <rect width="450" height="450" fill="url(#scanline)" opacity="0.5"/>
    `;
    
    return createBaseSVG(content, { background: backgroundColor });
  },
  
  defaultColors: {
    backgroundColor: '#0a0a0a',
    primaryColor: '#00ffff',
    accentColor: '#ff00ff',
    glowIntensity: 'high'
  }
};
