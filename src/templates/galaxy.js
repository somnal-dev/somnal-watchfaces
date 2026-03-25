/**
 * Galaxy Star Template
 * Space theme with stars and nebula effects
 */

const { createBaseSVG, drawMarkers, drawHands, drawDigitalTime, CENTER } = require('../renderer');

module.exports = {
  id: 'galaxy',
  name: 'Galaxy Star',
  category: 'artistic',
  description: '별과 우주 테마 디자인',
  
  generate(options = {}) {
    const {
      backgroundColor = '#0d0221',
      nebulaColor1 = '#5c2d91',
      nebulaColor2 = '#1e3a8a',
      starColor = '#ffffff',
      accentColor = '#ffd700'
    } = options;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Generate random stars
    const stars = Array.from({ length: 50 }, () => {
      const x = Math.random() * 450;
      const y = Math.random() * 450;
      const r = Math.random() * 2 + 0.5;
      const opacity = Math.random() * 0.8 + 0.2;
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${starColor}" opacity="${opacity}"/>`;
    }).join('\n      ');
    
    const content = `
      <defs>
        <radialGradient id="nebula1" cx="30%" cy="30%" r="60%">
          <stop offset="0%" stop-color="${nebulaColor1}" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
        <radialGradient id="nebula2" cx="70%" cy="70%" r="50%">
          <stop offset="0%" stop-color="${nebulaColor2}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
        <radialGradient id="planetGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.8"/>
          <stop offset="70%" stop-color="${accentColor}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
        <filter id="starGlow">
          <feGaussianBlur stdDeviation="1" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="450" height="450" fill="${backgroundColor}"/>
      
      <!-- Nebula effects -->
      <ellipse cx="100" cy="100" rx="200" ry="150" fill="url(#nebula1)"/>
      <ellipse cx="380" cy="380" rx="150" ry="120" fill="url(#nebula2)"/>
      
      <!-- Stars -->
      <g filter="url(#starGlow)">
        ${stars}
      </g>
      
      <!-- Large decorative stars -->
      <polygon points="80,80 83,90 93,90 85,97 88,107 80,100 72,107 75,97 67,90 77,90" 
               fill="${starColor}" opacity="0.9"/>
      <polygon points="370,120 372,127 379,127 373,132 375,139 370,134 365,139 367,132 361,127 368,127" 
               fill="${starColor}" opacity="0.7" transform="scale(0.8) translate(80, -20)"/>
      
      <!-- Planet decoration -->
      <circle cx="380" cy="80" r="25" fill="url(#planetGlow)"/>
      <circle cx="380" cy="80" r="18" fill="${accentColor}" opacity="0.6"/>
      
      <!-- Clock ring (orbit) -->
      <circle cx="${CENTER}" cy="${CENTER}" r="160" fill="none" stroke="${starColor}" stroke-width="1" opacity="0.2"/>
      <circle cx="${CENTER}" cy="${CENTER}" r="180" fill="none" stroke="${starColor}" stroke-width="0.5" opacity="0.15" stroke-dasharray="5 10"/>
      
      <!-- Constellation hour markers -->
      ${drawMarkers({ radius: 145, innerRadius: 135, color: starColor, hourNumbers: false })}
      
      <!-- Zodaic-style hour indicators -->
      ${[12, 3, 6, 9].map((num, i) => {
        const angles = [-90, 0, 90, 180];
        const angle = angles[i] * Math.PI / 180;
        const x = CENTER + 115 * Math.cos(angle);
        const y = CENTER + 115 * Math.sin(angle);
        return `<circle cx="${x}" cy="${y}" r="15" fill="rgba(255,255,255,0.1)" stroke="${starColor}" stroke-width="1"/>
                <text x="${x}" y="${y}" fill="${starColor}" font-size="12" text-anchor="middle" dominant-baseline="middle">${num}</text>`;
      }).join('\n      ')}
      
      <!-- Clock hands -->
      ${drawHands(hours, minutes, seconds, {
        hourColor: starColor,
        minuteColor: starColor,
        secondColor: accentColor
      })}
      
      <!-- Digital overlay -->
      <text x="${CENTER}" y="340" fill="${starColor}" font-size="16" text-anchor="middle" opacity="0.8" font-family="'Courier New', monospace">
        ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}
      </text>
    `;
    
    return createBaseSVG(content, { background: backgroundColor });
  },
  
  defaultColors: {
    backgroundColor: '#0d0221',
    nebulaColor1: '#5c2d91',
    nebulaColor2: '#1e3a8a',
    starColor: '#ffffff',
    accentColor: '#ffd700'
  }
};
