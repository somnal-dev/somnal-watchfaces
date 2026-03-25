/**
 * Neon Template (additional)
 * Bright neon colors for vibrant look
 */

const { createBaseSVG, drawMarkers, drawHands, drawDigitalTime, CENTER } = require('../renderer');

module.exports = {
  id: 'neon',
  name: 'Neon Glow',
  category: 'digital',
  description: '형광색 네온 글로우 디자인',
  
  generate(options = {}) {
    const {
      backgroundColor = '#000000',
      neonPink = '#ff1493',
      neonBlue = '#00ffff',
      neonPurple = '#9400d3',
      neonGreen = '#39ff14'
    } = options;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const content = `
      <defs>
        <filter id="pinkGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="blueGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Background with radial glow -->
      <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${neonPurple}" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <rect width="450" height="450" fill="${backgroundColor}"/>
      <circle cx="${CENTER}" cy="${CENTER}" r="225" fill="url(#bgGlow)"/>
      
      <!-- Neon rings -->
      <circle cx="${CENTER}" cy="${CENTER}" r="190" fill="none" stroke="${neonPink}" stroke-width="3" filter="url(#pinkGlow)" opacity="0.8"/>
      <circle cx="${CENTER}" cy="${CENTER}" r="170" fill="none" stroke="${neonBlue}" stroke-width="2" filter="url(#blueGlow)" opacity="0.6"/>
      <circle cx="${CENTER}" cy="${CENTER}" r="150" fill="none" stroke="${neonPurple}" stroke-width="1" opacity="0.4"/>
      
      <!-- Neon markers -->
      ${Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const x = CENTER + 130 * Math.cos(angle);
        const y = CENTER + 130 * Math.sin(angle);
        const colors = [neonPink, neonBlue, neonPurple, neonGreen];
        const color = colors[i % 4];
        const isMain = i % 3 === 0;
        return `<circle cx="${x}" cy="${y}" r="${isMain ? 8 : 4}" fill="${color}" filter="url(#blueGlow)"/>`;
      }).join('\n      ')}
      
      <!-- Main time display -->
      <g filter="url(#pinkGlow)">
        ${drawDigitalTime(hours, minutes, null, {
          y: CENTER,
          color: neonPink,
          fontSize: 72,
          fontWeight: 'bold'
        })}
      </g>
      
      <!-- Seconds with different color -->
      <text x="${CENTER}" y="290" fill="${neonGreen}" font-size="32" text-anchor="middle" 
            font-family="'Courier New', monospace" filter="url(#blueGlow)">
        :${String(seconds).padStart(2, '0')}
      </text>
      
      <!-- Date -->
      <text x="${CENTER}" y="330" fill="${neonBlue}" font-size="14" text-anchor="middle" 
            font-family="'Courier New', monospace" opacity="0.8">
        ${now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
      </text>
      
      <!-- Decorative elements -->
      <line x1="150" y1="360" x2="300" y2="360" stroke="${neonPurple}" stroke-width="2" filter="url(#blueGlow)" opacity="0.5"/>
      
      <!-- Corner neons -->
      <circle cx="50" cy="50" r="20" fill="none" stroke="${neonPink}" stroke-width="2" filter="url(#pinkGlow)" opacity="0.5"/>
      <circle cx="400" cy="50" r="20" fill="none" stroke="${neonBlue}" stroke-width="2" filter="url(#blueGlow)" opacity="0.5"/>
      <circle cx="50" cy="400" r="20" fill="none" stroke="${neonGreen}" stroke-width="2" filter="url(#blueGlow)" opacity="0.5"/>
      <circle cx="400" cy="400" r="20" fill="none" stroke="${neonPurple}" stroke-width="2" filter="url(#blueGlow)" opacity="0.5"/>
    `;
    
    return createBaseSVG(content, { background: backgroundColor });
  },
  
  defaultColors: {
    backgroundColor: '#000000',
    neonPink: '#ff1493',
    neonBlue: '#00ffff',
    neonPurple: '#9400d3',
    neonGreen: '#39ff14'
  }
};
