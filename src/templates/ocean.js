/**
 * Ocean Depth Template
 * Deep sea theme with wave and water effects
 */

const { createBaseSVG, drawMarkers, drawHands, CENTER } = require('../renderer');

module.exports = {
  id: 'ocean',
  name: 'Ocean Depth',
  category: 'artistic',
  description: '바다와 물결 효과 디자인',
  
  generate(options = {}) {
    const {
      deepBlue = '#001a33',
      midBlue = '#003366',
      lightBlue = '#0066cc',
      foamColor = '#87ceeb',
      accentColor = '#00ffff'
    } = options;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Animated wave paths (static representation)
    const wave1 = `M 0 320 Q 75 290, 150 320 T 300 320 T 450 320 L 450 450 L 0 450 Z`;
    const wave2 = `M 0 350 Q 75 320, 150 350 T 300 350 T 450 350 L 450 450 L 0 450 Z`;
    const wave3 = `M 0 380 Q 75 350, 150 380 T 300 380 T 450 380 L 450 450 L 0 450 Z`;
    
    const content = `
      <defs>
        <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${deepBlue}"/>
          <stop offset="50%" stop-color="${midBlue}"/>
          <stop offset="100%" stop-color="${lightBlue}"/>
        </linearGradient>
        <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${lightBlue}" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="${midBlue}" stop-opacity="0.8"/>
        </linearGradient>
        <radialGradient id="bubbleGradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="${foamColor}" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="${lightBlue}" stop-opacity="0.3"/>
        </radialGradient>
        <filter id="waterBlur">
          <feGaussianBlur stdDeviation="0.5"/>
        </filter>
      </defs>
      
      <!-- Ocean background -->
      <rect width="450" height="450" fill="url(#oceanGradient)"/>
      
      <!-- Light rays from surface -->
      <polygon points="100,0 150,200 50,200" fill="${foamColor}" opacity="0.05"/>
      <polygon points="200,0 270,250 130,250" fill="${foamColor}" opacity="0.05"/>
      <polygon points="350,0 420,180 280,180" fill="${foamColor}" opacity="0.04"/>
      
      <!-- Waves -->
      <path d="${wave1}" fill="url(#waveGradient1)" opacity="0.4"/>
      <path d="${wave2}" fill="${lightBlue}" opacity="0.3"/>
      <path d="${wave3}" fill="${midBlue}" opacity="0.5"/>
      
      <!-- Bubbles -->
      ${Array.from({ length: 15 }, () => {
        const x = Math.random() * 400 + 25;
        const y = Math.random() * 300 + 100;
        const r = Math.random() * 8 + 3;
        return `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#bubbleGradient)" opacity="${Math.random() * 0.4 + 0.2}"/>`;
      }).join('\n      ')}
      
      <!-- Clock face (bubble-like) -->
      <circle cx="${CENTER}" cy="${CENTER}" r="150" fill="rgba(0,51,102,0.6)" stroke="${foamColor}" stroke-width="2" opacity="0.8"/>
      <circle cx="${CENTER}" cy="${CENTER}" r="145" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.5"/>
      
      <!-- Hour markers (shell-like) -->
      ${drawMarkers({ radius: 135, innerRadius: 120, color: foamColor, hourNumbers: false })}
      
      <!-- Hour numbers -->
      ${[12, 3, 6, 9].map((num, i) => {
        const angles = [-90, 0, 90, 180];
        const angle = angles[i] * Math.PI / 180;
        const x = CENTER + 105 * Math.cos(angle);
        const y = CENTER + 105 * Math.sin(angle);
        return `<text x="${x}" y="${y}" fill="${foamColor}" font-size="22" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${num}</text>`;
      }).join('\n      ')}
      
      <!-- Clock hands -->
      ${drawHands(hours, minutes, seconds, {
        hourColor: foamColor,
        minuteColor: foamColor,
        secondColor: accentColor
      })}
      
      <!-- Depth indicator -->
      <text x="50" y="420" fill="${foamColor}" font-size="12" opacity="0.6" font-family="'Courier New', monospace">
        DEPTH: 42m
      </text>
    `;
    
    return createBaseSVG(content, { background: deepBlue });
  },
  
  defaultColors: {
    deepBlue: '#001a33',
    midBlue: '#003366',
    lightBlue: '#0066cc',
    foamColor: '#87ceeb',
    accentColor: '#00ffff'
  }
};
