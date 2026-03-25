/**
 * Sport Active Template
 * Fitness-focused with heart rate, steps, calories
 */

const { createBaseSVG, drawMarkers, drawHands, drawDigitalTime, drawComplications, CENTER } = require('../renderer');

module.exports = {
  id: 'sport',
  name: 'Sport Active',
  category: 'sport',
  description: '심박/스텝/칼로리 표시하는 스포츠 디자인',
  
  generate(options = {}) {
    const {
      backgroundColor = '#0f0f0f',
      primaryColor = '#00ff88',
      accentColor = '#ff6b35',
      textColor = '#ffffff',
      style = 'analog' // analog, digital, hybrid
    } = options;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const complications = [
      { type: 'heartrate', value: '72 BPM' },
      { type: 'steps', value: '8,542' },
      { type: 'battery', value: '85%' },
      { type: 'weather', value: '18°C' }
    ];
    
    let timeDisplay = '';
    if (style === 'digital' || style === 'hybrid') {
      timeDisplay = drawDigitalTime(hours, minutes, null, {
        y: style === 'digital' ? CENTER : 300,
        color: primaryColor,
        fontSize: style === 'digital' ? 64 : 32,
        fontWeight: 'bold'
      });
    }
    
    let hands = '';
    if (style === 'analog' || style === 'hybrid') {
      hands = drawHands(hours, minutes, seconds, {
        hourColor: textColor,
        minuteColor: primaryColor,
        secondColor: accentColor
      });
    }
    
    const content = `
      <!-- Sport ring -->
      <circle cx="${CENTER}" cy="${CENTER}" r="210" fill="none" stroke="${primaryColor}" stroke-width="3" opacity="0.5"/>
      <circle cx="${CENTER}" cy="${CENTER}" r="200" fill="none" stroke="${primaryColor}" stroke-width="1" opacity="0.3"/>
      
      <!-- Activity arc (steps progress) -->
      <path d="M 225 50 A 175 175 0 0 1 400 225" fill="none" stroke="${primaryColor}" stroke-width="8" stroke-linecap="round" opacity="0.8"/>
      
      <!-- Heart rate zone indicator -->
      <circle cx="${CENTER}" cy="${CENTER}" r="140" fill="none" stroke="${accentColor}" stroke-width="2" stroke-dasharray="10 5" opacity="0.4"/>
      
      ${style !== 'digital' ? drawMarkers({ radius: 170, innerRadius: 155, color: textColor, hourNumbers: style === 'hybrid' ? false : true }) : ''}
      
      ${hands}
      ${timeDisplay}
      
      ${drawComplications(complications, { color: textColor, fontSize: 12 })}
    `;
    
    return createBaseSVG(content, { background: backgroundColor });
  },
  
  defaultColors: {
    backgroundColor: '#0f0f0f',
    primaryColor: '#00ff88',
    accentColor: '#ff6b35',
    textColor: '#ffffff'
  }
};
