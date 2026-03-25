/**
 * Classic Roman Template
 * Elegant Roman numerals with leather strap feel
 */

const { createBaseSVG, drawMarkers, drawHands, CENTER } = require('../renderer');

module.exports = {
  id: 'classic',
  name: 'Classic Roman',
  category: 'classic',
  description: '로마자 숫자와 가죽 스트랩 느낌의 클래식 디자인',
  
  generate(options = {}) {
    const {
      backgroundColor = '#f5e6d3',
      dialColor = '#2c1810',
      markerColor = '#8b4513',
      hourHandColor = '#2c1810',
      minuteHandColor = '#2c1810',
      secondHandColor = '#8b0000'
    } = options;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const content = `
      <defs>
        <radialGradient id="dialGradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#3d2817"/>
          <stop offset="100%" stop-color="#1a0f0a"/>
        </radialGradient>
        <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur"/>
          <feOffset dx="4" dy="4"/>
          <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"/>
          <feFlood flood-color="#000000" flood-opacity="0.5"/>
          <feComposite in2="shadowDiff" operator="in"/>
          <feComposite in2="SourceGraphic" operator="over"/>
        </filter>
      </defs>
      
      <!-- Outer gold ring -->
      <circle cx="${CENTER}" cy="${CENTER}" r="215" fill="none" stroke="#d4af37" stroke-width="8"/>
      <circle cx="${CENTER}" cy="${CENTER}" r="208" fill="none" stroke="#b8962e" stroke-width="2"/>
      
      <!-- Dial face -->
      <circle cx="${CENTER}" cy="${CENTER}" r="200" fill="url(#dialGradient)" filter="url(#innerShadow)"/>
      
      <!-- Inner decorative ring -->
      <circle cx="${CENTER}" cy="${CENTER}" r="185" fill="none" stroke="#d4af37" stroke-width="1" opacity="0.5"/>
      
      <!-- Roman numeral markers -->
      ${drawMarkers({ radius: 165, innerRadius: 150, color: '#d4af37', hourNumbers: true, roman: true })}
      
      <!-- Minute markers -->
      ${Array.from({ length: 60 }, (_, i) => {
        if (i % 5 === 0) return '';
        const angle = (i * 6 - 90) * Math.PI / 180;
        const x = CENTER + 175 * Math.cos(angle);
        const y = CENTER + 175 * Math.sin(angle);
        return `<circle cx="${x}" cy="${y}" r="1.5" fill="#d4af37" opacity="0.6"/>`;
      }).join('\n      ')}
      
      <!-- Clock hands -->
      ${drawHands(hours, minutes, seconds, {
        hourColor: '#d4af37',
        minuteColor: '#d4af37',
        secondColor: secondHandColor
      })}
      
      <!-- Center cap -->
      <circle cx="${CENTER}" cy="${CENTER}" r="8" fill="#d4af37"/>
      <circle cx="${CENTER}" cy="${CENTER}" r="4" fill="#8b0000"/>
    `;
    
    return createBaseSVG(content, { background: backgroundColor });
  },
  
  defaultColors: {
    backgroundColor: '#f5e6d3',
    dialColor: '#2c1810',
    markerColor: '#8b4513',
    hourHandColor: '#2c1810',
    minuteHandColor: '#2c1810',
    secondHandColor: '#8b0000'
  }
};
