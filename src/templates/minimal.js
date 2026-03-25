/**
 * Minimal Clean Template
 * Simple, elegant design with just numbers
 */

const { createBaseSVG, drawMarkers, drawHands, CENTER } = require('../renderer');

module.exports = {
  id: 'minimal',
  name: 'Minimal Clean',
  category: 'minimal',
  description: '숫자만 있는 심플하고 우아한 디자인',
  
  generate(options = {}) {
    const {
      backgroundColor = '#1a1a2e',
      markerColor = '#ffffff',
      hourHandColor = '#ffffff',
      minuteHandColor = '#ffffff',
      secondHandColor = '#e94560',
      showNumbers = true
    } = options;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const content = `
      <!-- Outer ring -->
      <circle cx="${CENTER}" cy="${CENTER}" r="200" fill="none" stroke="${markerColor}" stroke-width="1" opacity="0.3"/>
      
      <!-- Hour markers -->
      ${drawMarkers({ radius: 185, innerRadius: 170, color: markerColor, hourNumbers: showNumbers, roman: false })}
      
      <!-- Clock hands -->
      ${drawHands(hours, minutes, seconds, {
        hourColor: hourHandColor,
        minuteColor: minuteHandColor,
        secondColor: secondHandColor
      })}
    `;
    
    return createBaseSVG(content, { background: backgroundColor });
  },
  
  defaultColors: {
    backgroundColor: '#1a1a2e',
    markerColor: '#ffffff',
    hourHandColor: '#ffffff',
    minuteHandColor: '#ffffff',
    secondHandColor: '#e94560'
  }
};
