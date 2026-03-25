/**
 * Gradient Wave Template
 * Beautiful gradient background with wave effects
 */

const { createBaseSVG, drawMarkers, drawHands, CENTER } = require('../renderer');

module.exports = {
  id: 'gradient',
  name: 'Gradient Wave',
  category: 'artistic',
  description: '그라데이션 배경과 물결 효과',
  
  generate(options = {}) {
    const {
      gradientStart = '#667eea',
      gradientEnd = '#764ba2',
      waveColor = '#ffffff',
      markerColor = '#ffffff',
      handColor = '#ffffff'
    } = options;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const content = `
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${gradientStart}"/>
          <stop offset="100%" stop-color="${gradientEnd}"/>
        </linearGradient>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${waveColor}" stop-opacity="0.1"/>
          <stop offset="50%" stop-color="${waveColor}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${waveColor}" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      
      <!-- Background gradient -->
      <rect width="450" height="450" fill="url(#bgGradient)"/>
      
      <!-- Wave effects -->
      <path d="M 0 150 Q 112.5 120, 225 150 T 450 150 L 450 250 Q 337.5 220, 225 250 T 0 250 Z" 
            fill="url(#waveGradient)"/>
      <path d="M 0 200 Q 112.5 170, 225 200 T 450 200 L 450 300 Q 337.5 270, 225 300 T 0 300 Z" 
            fill="url(#waveGradient)"/>
      <path d="M 0 300 Q 112.5 270, 225 300 T 450 300 L 450 400 Q 337.5 370, 225 400 T 0 400 Z" 
            fill="url(#waveGradient)" opacity="0.5"/>
      
      <!-- Frosted glass clock face -->
      <circle cx="${CENTER}" cy="${CENTER}" r="160" fill="rgba(255,255,255,0.1)"/>
      <circle cx="${CENTER}" cy="${CENTER}" r="160" fill="none" stroke="${waveColor}" stroke-width="2" opacity="0.5"/>
      
      <!-- Hour markers -->
      ${drawMarkers({ radius: 145, innerRadius: 130, color: markerColor, hourNumbers: false })}
      
      <!-- Selected hour numbers -->
      ${[12, 3, 6, 9].map((num, i) => {
        const angles = [-90, 0, 90, 180];
        const angle = angles[i] * Math.PI / 180;
        const x = CENTER + 120 * Math.cos(angle);
        const y = CENTER + 120 * Math.sin(angle);
        return `<text x="${x}" y="${y}" fill="${markerColor}" font-size="20" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${num}</text>`;
      }).join('\n      ')}
      
      <!-- Clock hands -->
      ${drawHands(hours, minutes, seconds, {
        hourColor: handColor,
        minuteColor: handColor,
        secondColor: '#ff6b6b'
      })}
    `;
    
    return createBaseSVG(content, { background: `url(#bgGradient)` });
  },
  
  defaultColors: {
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    waveColor: '#ffffff',
    markerColor: '#ffffff',
    handColor: '#ffffff'
  }
};
