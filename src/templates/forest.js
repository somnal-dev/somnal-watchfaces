/**
 * Forest Green Template
 * Nature and botanical theme
 */

const { createBaseSVG, drawMarkers, drawHands, CENTER } = require('../renderer');

module.exports = {
  id: 'forest',
  name: 'Forest Green',
  category: 'artistic',
  description: '자연과 식물 테마 디자인',
  
  generate(options = {}) {
    const {
      backgroundColor = '#1a2f1a',
      leafGreen = '#228b22',
      darkGreen = '#006400',
      lightGreen = '#90ee90',
      accentColor = '#ffd700'
    } = options;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const content = `
      <defs>
        <radialGradient id="forestGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${leafGreen}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${lightGreen}"/>
          <stop offset="100%" stop-color="${darkGreen}"/>
        </linearGradient>
      </defs>
      
      <!-- Forest background -->
      <rect width="450" height="450" fill="${backgroundColor}"/>
      
      <!-- Dappled light effect -->
      ${Array.from({ length: 8 }, () => {
        const x = Math.random() * 400 + 25;
        const y = Math.random() * 400 + 25;
        const r = Math.random() * 40 + 20;
        return `<circle cx="${x}" cy="${y}" r="${r}" fill="${lightGreen}" opacity="0.05"/>`;
      }).join('\n      ')}
      
      <!-- Decorative leaves -->
      <g transform="translate(50, 50) rotate(-30)">
        <ellipse cx="0" cy="0" rx="30" ry="15" fill="${leafGreen}" opacity="0.6"/>
        <line x1="-25" y1="0" x2="25" y2="0" stroke="${darkGreen}" stroke-width="1"/>
      </g>
      <g transform="translate(400, 80) rotate(45)">
        <ellipse cx="0" cy="0" rx="25" ry="12" fill="${leafGreen}" opacity="0.5"/>
        <line x1="-20" y1="0" x2="20" y2="0" stroke="${darkGreen}" stroke-width="1"/>
      </g>
      <g transform="translate(380, 380) rotate(15)">
        <ellipse cx="0" cy="0" rx="35" ry="18" fill="${leafGreen}" opacity="0.5"/>
        <line x1="-30" y1="0" x2="30" y2="0" stroke="${darkGreen}" stroke-width="1"/>
      </g>
      <g transform="translate(70, 350) rotate(-45)">
        <ellipse cx="0" cy="0" rx="28" ry="14" fill="${leafGreen}" opacity="0.55"/>
        <line x1="-23" y1="0" x2="23" y2="0" stroke="${darkGreen}" stroke-width="1"/>
      </g>
      
      <!-- Central glow -->
      <circle cx="${CENTER}" cy="${CENTER}" r="180" fill="url(#forestGlow)"/>
      
      <!-- Clock face -->
      <circle cx="${CENTER}" cy="${CENTER}" r="155" fill="rgba(26,47,26,0.8)" stroke="${lightGreen}" stroke-width="2"/>
      <circle cx="${CENTER}" cy="${CENTER}" r="145" fill="none" stroke="${leafGreen}" stroke-width="1" opacity="0.5"/>
      
      <!-- Vine-like markers -->
      ${Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const x1 = CENTER + 140 * Math.cos(angle);
        const y1 = CENTER + 140 * Math.sin(angle);
        const x2 = CENTER + 125 * Math.cos(angle);
        const y2 = CENTER + 125 * Math.sin(angle);
        
        if (i % 3 === 0) {
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${lightGreen}" stroke-width="3" stroke-linecap="round"/>
                  <circle cx="${x1}" cy="${y1}" r="4" fill="${accentColor}" opacity="0.7"/>`;
        }
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${lightGreen}" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>`;
      }).join('\n      ')}
      
      <!-- Hour numbers (nature font style) -->
      ${[12, 3, 6, 9].map((num, i) => {
        const angles = [-90, 0, 90, 180];
        const angle = angles[i] * Math.PI / 180;
        const x = CENTER + 105 * Math.cos(angle);
        const y = CENTER + 105 * Math.sin(angle);
        return `<text x="${x}" y="${y}" fill="${lightGreen}" font-size="18" text-anchor="middle" dominant-baseline="middle">${num}</text>`;
      }).join('\n      ')}
      
      <!-- Clock hands -->
      ${drawHands(hours, minutes, seconds, {
        hourColor: lightGreen,
        minuteColor: lightGreen,
        secondColor: accentColor
      })}
      
      <!-- Small decorative elements -->
      <circle cx="${CENTER - 60}" cy="${CENTER + 80}" r="8" fill="${leafGreen}" opacity="0.4"/>
      <circle cx="${CENTER + 70}" cy="${CENTER - 70}" r="6" fill="${leafGreen}" opacity="0.3"/>
    `;
    
    return createBaseSVG(content, { background: backgroundColor });
  },
  
  defaultColors: {
    backgroundColor: '#1a2f1a',
    leafGreen: '#228b22',
    darkGreen: '#006400',
    lightGreen: '#90ee90',
    accentColor: '#ffd700'
  }
};
