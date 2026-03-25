/**
 * SVG Rendering Utilities for Watchface Generation
 */

const SIZE = 450;
const CENTER = SIZE / 2;

/**
 * Base SVG template with viewBox
 */
function createBaseSVG(content, options = {}) {
  const { background = '#000000', defs = '' } = options;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
  <defs>
    ${defs}
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="${background}"/>
  ${content}
</svg>`;
}

/**
 * Create a circle element
 */
function circle(cx, cy, r, options = {}) {
  const attrs = Object.entries({
    cx, cy, r,
    fill: options.fill || 'none',
    stroke: options.stroke || '#ffffff',
    'stroke-width': options.strokeWidth || 2,
    opacity: options.opacity || 1,
    ...options
  }).map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<circle ${attrs}/>`;
}

/**
 * Create a text element
 */
function text(x, y, content, options = {}) {
  const attrs = Object.entries({
    x, y,
    fill: options.fill || '#ffffff',
    'font-size': options.fontSize || 24,
    'font-family': options.fontFamily || 'Arial, sans-serif',
    'font-weight': options.fontWeight || 'normal',
    'text-anchor': options.textAnchor || 'middle',
    'dominant-baseline': options.dominantBaseline || 'middle',
    ...options
  }).filter(([k]) => !['content'].includes(k)).map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<text ${attrs}>${content}</text>`;
}

/**
 * Create a line element
 */
function line(x1, y1, x2, y2, options = {}) {
  const attrs = Object.entries({
    x1, y1, x2, y2,
    stroke: options.stroke || '#ffffff',
    'stroke-width': options.strokeWidth || 2,
    'stroke-linecap': options.strokeLinecap || 'round',
    ...options
  }).map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<line ${attrs}/>`;
}

/**
 * Create a path element
 */
function path(d, options = {}) {
  const attrs = Object.entries({
    d,
    fill: options.fill || 'none',
    stroke: options.stroke || '#ffffff',
    'stroke-width': options.strokeWidth || 2,
    ...options
  }).map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<path ${attrs}/>`;
}

/**
 * Create a rectangle element
 */
function rect(x, y, width, height, options = {}) {
  const attrs = Object.entries({
    x, y, width, height,
    fill: options.fill || '#ffffff',
    stroke: options.stroke || 'none',
    rx: options.rx || 0,
    ry: options.ry || 0,
    ...options
  }).map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<rect ${attrs}/>`;
}

/**
 * Create linear gradient definition
 */
function linearGradient(id, stops, options = {}) {
  const { x1 = '0%', y1 = '0%', x2 = '100%', y2 = '100%' } = options;
  const stopElements = stops.map(({ offset, color, opacity = 1 }) => 
    `<stop offset="${offset}%" stop-color="${color}" stop-opacity="${opacity}"/>`
  ).join('\n    ');
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
    ${stopElements}
  </linearGradient>`;
}

/**
 * Create radial gradient definition
 */
function radialGradient(id, stops, options = {}) {
  const { cx = '50%', cy = '50%', r = '50%' } = options;
  const stopElements = stops.map(({ offset, color, opacity = 1 }) => 
    `<stop offset="${offset}%" stop-color="${color}" stop-opacity="${opacity}"/>`
  ).join('\n    ');
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">
    ${stopElements}
  </radialGradient>`;
}

/**
 * Draw clock hands (hour, minute, second)
 */
function drawHands(hours, minutes, seconds = 0, options = {}) {
  const hourAngle = ((hours % 12) + minutes / 60) * 30 - 90;
  const minuteAngle = (minutes + seconds / 60) * 6 - 90;
  const secondAngle = seconds * 6 - 90;
  
  const hourLength = 80;
  const minuteLength = 110;
  const secondLength = 130;
  
  const hourX = CENTER + hourLength * Math.cos(hourAngle * Math.PI / 180);
  const hourY = CENTER + hourLength * Math.sin(hourAngle * Math.PI / 180);
  const minuteX = CENTER + minuteLength * Math.cos(minuteAngle * Math.PI / 180);
  const minuteY = CENTER + minuteLength * Math.sin(minuteAngle * Math.PI / 180);
  const secondX = CENTER + secondLength * Math.cos(secondAngle * Math.PI / 180);
  const secondY = CENTER + secondLength * Math.sin(secondAngle * Math.PI / 180);
  
  const hourColor = options.hourColor || '#ffffff';
  const minuteColor = options.minuteColor || '#ffffff';
  const secondColor = options.secondColor || '#ff4444';
  
  return `
    ${line(CENTER, CENTER, hourX, hourY, { stroke: hourColor, 'stroke-width': 8, 'stroke-linecap': 'round' })}
    ${line(CENTER, CENTER, minuteX, minuteY, { stroke: minuteColor, 'stroke-width': 4, 'stroke-linecap': 'round' })}
    ${line(CENTER, CENTER, secondX, secondY, { stroke: secondColor, 'stroke-width': 2, 'stroke-linecap': 'round' })}
    ${circle(CENTER, CENTER, 10, { fill: secondColor })}
  `;
}

/**
 * Draw hour markers
 */
function drawMarkers(options = {}) {
  const { radius = 180, innerRadius = 160, color = '#ffffff', hourNumbers = true, roman = false } = options;
  const markers = [];
  const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * Math.PI / 180;
    const x1 = CENTER + radius * Math.cos(angle);
    const y1 = CENTER + radius * Math.sin(angle);
    const x2 = CENTER + innerRadius * Math.cos(angle);
    const y2 = CENTER + innerRadius * Math.sin(angle);
    
    if (i % 3 === 0) {
      // Major markers
      markers.push(line(x1, y1, x2, y2, { stroke: color, 'stroke-width': 4 }));
    } else {
      // Minor markers
      markers.push(line(x1, y1, x2, y2, { stroke: color, 'stroke-width': 2, opacity: 0.6 }));
    }
    
    if (hourNumbers) {
      const textRadius = radius + 25;
      const tx = CENTER + textRadius * Math.cos(angle);
      const ty = CENTER + textRadius * Math.sin(angle);
      const label = roman ? romanNumerals[i] : (i === 0 ? 12 : i);
      markers.push(text(tx, ty, label, { fill: color, 'font-size': 24 }));
    }
  }
  
  return markers.join('\n  ');
}

/**
 * Draw minute markers
 */
function drawMinuteMarkers(options = {}) {
  const { radius = 185, color = '#ffffff', opacity = 0.3 } = options;
  const markers = [];
  
  for (let i = 0; i < 60; i++) {
    if (i % 5 !== 0) {
      const angle = (i * 6 - 90) * Math.PI / 180;
      const x1 = CENTER + radius * Math.cos(angle);
      const y1 = CENTER + radius * Math.sin(angle);
      markers.push(circle(x1, y1, 2, { fill: color, opacity }));
    }
  }
  
  return markers.join('\n  ');
}

/**
 * Draw complications (weather, heart rate, battery, steps)
 */
function drawComplications(complications = [], options = {}) {
  const { color = '#ffffff', fontSize = 14 } = options;
  const positions = [
    { x: CENTER, y: 80 },     // Top
    { x: CENTER, y: 370 },    // Bottom
    { x: 80, y: CENTER },     // Left
    { x: 370, y: CENTER },    // Right
  ];
  
  return complications.map((comp, i) => {
    if (i >= positions.length) return '';
    const pos = positions[i];
    let icon = '';
    let label = '';
    
    switch (comp.type) {
      case 'weather':
        icon = '☀️';
        label = comp.value || '23°C';
        break;
      case 'heartrate':
        icon = '❤️';
        label = comp.value || '72 BPM';
        break;
      case 'battery':
        icon = '🔋';
        label = comp.value || '85%';
        break;
      case 'steps':
        icon = '👟';
        label = comp.value || '8,542';
        break;
      default:
        label = comp.value || '';
    }
    
    return `
    <g class="complication-${comp.type}">
      ${text(pos.x, pos.y - 10, icon, { fill: color, 'font-size': fontSize + 4 })}
      ${text(pos.x, pos.y + 12, label, { fill: color, 'font-size': fontSize })}
    </g>`;
  }).join('\n');
}

/**
 * Draw digital time display
 */
function drawDigitalTime(hours, minutes, seconds = null, options = {}) {
  const { 
    y = CENTER, 
    color = '#ffffff', 
    fontSize = 72,
    fontWeight = 'bold',
    showSeconds = false,
    format24h = true
  } = options;
  
  const h = format24h ? hours : (hours % 12 || 12);
  const hStr = String(h).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');
  const sStr = seconds !== null ? `:${String(seconds).padStart(2, '0')}` : '';
  
  return text(CENTER, y, `${hStr}:${mStr}${showSeconds ? sStr : ''}`, {
    fill: color,
    'font-size': fontSize,
    'font-weight': fontWeight,
    'font-family': "'Courier New', monospace"
  });
}

module.exports = {
  SIZE,
  CENTER,
  createBaseSVG,
  circle,
  text,
  line,
  path,
  rect,
  linearGradient,
  radialGradient,
  drawHands,
  drawMarkers,
  drawMinuteMarkers,
  drawComplications,
  drawDigitalTime
};
