/**
 * Monochrome Template
 * Clean black and white minimal design
 */

const { createBaseSVG, drawMarkers, drawHands, drawDigitalTime, CENTER } = require('../renderer');

module.exports = {
  id: 'monochrome',
  name: 'Monochrome',
  category: 'minimal',
  description: '흑백 미니멀 디자인',
  
  generate(options = {}) {
    const {
      backgroundColor = '#000000',
      primaryColor = '#ffffff',
      accentGray = '#888888',
      style = 'analog' // analog, digital
    } = options;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    let timeContent = '';
    
    if (style === 'digital') {
      timeContent = `
        <!-- Digital display box -->
        <rect x="125" y="175" width="200" height="100" fill="none" stroke="${primaryColor}" stroke-width="2"/>
        <line x1="125" y1="185" x2="325" y2="185" stroke="${primaryColor}" stroke-width="1"/>
        
        <!-- Time -->
        ${drawDigitalTime(hours, minutes, seconds, {
          y: 235,
          color: primaryColor,
          fontSize: 48,
          fontWeight: 'bold',
          showSeconds: true
        })}
        
        <!-- Date -->
        <text x="${CENTER}" y="205" fill="${accentGray}" font-size="14" text-anchor="middle" font-family="'Courier New', monospace">
          ${now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()}
        </text>
      `;
    } else {
      timeContent = `
        <!-- Outer rings -->
        <circle cx="${CENTER}" cy="${CENTER}" r="200" fill="none" stroke="${primaryColor}" stroke-width="1" opacity="0.2"/>
        <circle cx="${CENTER}" cy="${CENTER}" r="195" fill="none" stroke="${primaryColor}" stroke-width="0.5" opacity="0.1"/>
        
        <!-- Main dial -->
        <circle cx="${CENTER}" cy="${CENTER}" r="185" fill="none" stroke="${primaryColor}" stroke-width="2"/>
        
        <!-- Minute track -->
        <circle cx="${CENTER}" cy="${CENTER}" r="175" fill="none" stroke="${accentGray}" stroke-width="1" stroke-dasharray="2 8"/>
        
        <!-- Hour markers -->
        ${Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const isMain = i % 3 === 0;
          const outerR = 180;
          const innerR = isMain ? 160 : 168;
          const x1 = CENTER + outerR * Math.cos(angle);
          const y1 = CENTER + outerR * Math.sin(angle);
          const x2 = CENTER + innerR * Math.cos(angle);
          const y2 = CENTER + innerR * Math.sin(angle);
          
          if (isMain) {
            const nums = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            const tx = CENTER + 135 * Math.cos(angle);
            const ty = CENTER + 135 * Math.sin(angle);
            return `
              <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${primaryColor}" stroke-width="4"/>
              <text x="${tx}" y="${ty}" fill="${primaryColor}" font-size="24" text-anchor="middle" dominant-baseline="middle" font-weight="300">${nums[i]}</text>
            `;
          }
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${primaryColor}" stroke-width="2" opacity="0.5"/>`;
        }).join('\n        ')}
        
        <!-- Clock hands -->
        ${drawHands(hours, minutes, seconds, {
          hourColor: primaryColor,
          minuteColor: primaryColor,
          secondColor: accentGray
        })}
        
        <!-- Center detail -->
        <circle cx="${CENTER}" cy="${CENTER}" r="12" fill="none" stroke="${primaryColor}" stroke-width="2"/>
        <circle cx="${CENTER}" cy="${CENTER}" r="4" fill="${primaryColor}"/>
      `;
    }
    
    const content = `
      <!-- Corner accents -->
      <path d="M 20 20 L 20 60 M 20 20 L 60 20" stroke="${primaryColor}" stroke-width="1" opacity="0.3" fill="none"/>
      <path d="M 430 20 L 430 60 M 430 20 L 390 20" stroke="${primaryColor}" stroke-width="1" opacity="0.3" fill="none"/>
      <path d="M 20 430 L 20 390 M 20 430 L 60 430" stroke="${primaryColor}" stroke-width="1" opacity="0.3" fill="none"/>
      <path d="M 430 430 L 430 390 M 430 430 L 390 430" stroke="${primaryColor}" stroke-width="1" opacity="0.3" fill="none"/>
      
      ${timeContent}
      
      <!-- Bottom label -->
      <text x="${CENTER}" y="420" fill="${accentGray}" font-size="10" text-anchor="middle" font-family="'Courier New', monospace" letter-spacing="4">
        MONOCHROME
      </text>
    `;
    
    return createBaseSVG(content, { background: backgroundColor });
  },
  
  defaultColors: {
    backgroundColor: '#000000',
    primaryColor: '#ffffff',
    accentGray: '#888888',
    style: 'analog'
  }
};
