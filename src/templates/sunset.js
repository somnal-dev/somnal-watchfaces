/**
 * Sunset Warm Template
 * Warm sunset colors and gradients
 */

const { createBaseSVG, drawMarkers, drawHands, CENTER } = require('../renderer');

module.exports = {
  id: 'sunset',
  name: 'Sunset Warm',
  category: 'artistic',
  description: '따뜻한 일몰 색감 디자인',
  
  generate(options = {}) {
    const {
      skyTop = '#ff6b35',
      skyMid = '#f7931e',
      skyBottom = '#ffd93d',
      sunColor = '#fff3b0',
      accentColor = '#ff4500'
    } = options;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const content = `
      <defs>
        <linearGradient id="sunsetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${skyTop}"/>
          <stop offset="50%" stop-color="${skyMid}"/>
          <stop offset="100%" stop-color="${skyBottom}"/>
        </linearGradient>
        <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${sunColor}"/>
          <stop offset="70%" stop-color="${skyBottom}"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
        <linearGradient id="horizonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${skyBottom}" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="${skyMid}" stop-opacity="0.6"/>
        </linearGradient>
      </defs>
      
      <!-- Sunset sky -->
      <rect width="450" height="450" fill="url(#sunsetGradient)"/>
      
      <!-- Sun -->
      <circle cx="${CENTER}" cy="350" r="80" fill="url(#sunGradient)"/>
      <circle cx="${CENTER}" cy="350" r="50" fill="${sunColor}" opacity="0.9"/>
      
      <!-- Sun rays -->
      ${Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30) * Math.PI / 180;
        const x1 = CENTER + 55 * Math.cos(angle);
        const y1 = 350 + 55 * Math.sin(angle);
        const x2 = CENTER + 100 * Math.cos(angle);
        const y2 = 350 + 100 * Math.sin(angle);
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${sunColor}" stroke-width="2" opacity="0.4"/>`;
      }).join('\n      ')}
      
      <!-- Horizon line -->
      <rect x="0" y="380" width="450" height="70" fill="url(#horizonGradient)" opacity="0.5"/>
      <line x1="0" y1="385" x2="450" y2="385" stroke="${sunColor}" stroke-width="1" opacity="0.6"/>
      
      <!-- Clouds -->
      <g opacity="0.4">
        <ellipse cx="100" cy="80" rx="60" ry="25" fill="${sunColor}"/>
        <ellipse cx="140" cy="75" rx="40" ry="20" fill="${sunColor}"/>
        <ellipse cx="350" cy="120" rx="50" ry="22" fill="${sunColor}"/>
        <ellipse cx="320" cy="115" rx="35" ry="18" fill="${sunColor}"/>
      </g>
      
      <!-- Clock face (semi-transparent) -->
      <circle cx="${CENTER}" cy="180" r="120" fill="rgba(255,255,255,0.15)" stroke="${sunColor}" stroke-width="2"/>
      <circle cx="${CENTER}" cy="180" r="110" fill="none" stroke="${sunColor}" stroke-width="1" opacity="0.4"/>
      
      <!-- Hour markers -->
      ${Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const x1 = CENTER + 105 * Math.cos(angle);
        const y1 = 180 + 105 * Math.sin(angle);
        const x2 = CENTER + 95 * Math.cos(angle);
        const y2 = 180 + 95 * Math.sin(angle);
        const highlight = i % 3 === 0;
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
                       stroke="${sunColor}" stroke-width="${highlight ? 3 : 1.5}" stroke-linecap="round"
                       opacity="${highlight ? 1 : 0.6}"/>`;
      }).join('\n      ')}
      
      <!-- Clock hands (centered at 180) -->
      <g>
        ${(() => {
          const hourAngle = ((hours % 12) + minutes / 60) * 30 - 90;
          const minuteAngle = (minutes + seconds / 60) * 6 - 90;
          const secondAngle = seconds * 6 - 90;
          const hourLength = 50;
          const minuteLength = 70;
          const secondLength = 85;
          const cx = CENTER, cy = 180;
          return `
            <line cx="${cx}" cy="${cy}" x1="${cx}" y1="${cy}" 
                  x2="${cx + hourLength * Math.cos(hourAngle * Math.PI / 180)}" 
                  y2="${cy + hourLength * Math.sin(hourAngle * Math.PI / 180)}" 
                  stroke="${sunColor}" stroke-width="6" stroke-linecap="round"/>
            <line cx="${cx}" cy="${cy}" x1="${cx}" y1="${cy}" 
                  x2="${cx + minuteLength * Math.cos(minuteAngle * Math.PI / 180)}" 
                  y2="${cy + minuteLength * Math.sin(minuteAngle * Math.PI / 180)}" 
                  stroke="${sunColor}" stroke-width="3" stroke-linecap="round"/>
            <line cx="${cx}" cy="${cy}" x1="${cx}" y1="${cy}" 
                  x2="${cx + secondLength * Math.cos(secondAngle * Math.PI / 180)}" 
                  y2="${cy + secondLength * Math.sin(secondAngle * Math.PI / 180)}" 
                  stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>
            <circle cx="${cx}" cy="${cy}" r="6" fill="${accentColor}"/>
          `;
        })()}
      </g>
    `;
    
    return createBaseSVG(content, { background: skyTop });
  },
  
  defaultColors: {
    skyTop: '#ff6b35',
    skyMid: '#f7931e',
    skyBottom: '#ffd93d',
    sunColor: '#fff3b0',
    accentColor: '#ff4500'
  }
};
