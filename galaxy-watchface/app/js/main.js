/**
 * Somnal Watchface - Galaxy Watch Main Logic
 * Supports both digital and analog display modes
 */

class SomnalWatchface {
  constructor() {
    this.config = null;
    this.isAmbient = false;
    this.updateInterval = null;
    
    // DOM Elements
    this.elements = {
      hours: document.getElementById('hours'),
      minutes: document.getElementById('minutes'),
      seconds: document.getElementById('seconds'),
      ampm: document.getElementById('ampm'),
      dateDisplay: document.getElementById('date-display'),
      batteryDisplay: document.getElementById('battery-display'),
      stepsDisplay: document.getElementById('steps-display'),
      heartrateDisplay: document.getElementById('heartrate-display'),
      hourHand: document.getElementById('hour-hand'),
      minuteHand: document.getElementById('minute-hand'),
      secondHand: document.getElementById('second-hand'),
      watchface: document.getElementById('watchface')
    };
    
    this.init();
  }
  
  async init() {
    await this.loadConfig();
    this.applyConfig();
    this.startClock();
    this.setupEventListeners();
    this.setupComplications();
  }
  
  async loadConfig() {
    try {
      const response = await fetch('config.json');
      this.config = await response.json();
    } catch (error) {
      console.error('Failed to load config, using defaults');
      this.config = {
        settings: {
          showSeconds: true,
          showDate: true,
          showBattery: true,
          use24Hour: true,
          updateInterval: 1000
        },
        colors: {
          background: '#1a1a2e',
          primary: '#ffffff',
          accent: '#e94560'
        }
      };
    }
  }
  
  applyConfig() {
    const { colors, settings } = this.config;
    const watchface = this.elements.watchface;
    
    // Apply colors
    watchface.style.setProperty('--bg-color', colors.background);
    watchface.style.setProperty('--primary-color', colors.primary);
    watchface.style.setProperty('--accent-color', colors.accent);
    watchface.style.setProperty('--text-color', colors.text || colors.primary);
    
    // Apply visibility settings
    if (!settings.showSeconds) {
      this.elements.seconds.style.display = 'none';
    }
    
    if (!settings.showDate) {
      document.getElementById('complication-top').style.display = 'none';
    }
    
    if (!settings.showBattery) {
      document.getElementById('complication-left').style.display = 'none';
    }
    
    if (!settings.showSteps) {
      document.getElementById('complication-right').style.display = 'none';
    }
    
    if (!settings.showHeartRate) {
      document.getElementById('complication-bottom').style.display = 'none';
    }
  }
  
  startClock() {
    this.updateTime();
    this.updateInterval = setInterval(() => {
      this.updateTime();
    }, this.config.settings.updateInterval || 1000);
  }
  
  updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const { settings } = this.config;
    
    // Digital display
    if (settings.use24Hour) {
      this.elements.hours.textContent = String(hours).padStart(2, '0');
      this.elements.ampm.textContent = '';
    } else {
      const displayHours = hours % 12 || 12;
      this.elements.hours.textContent = String(displayHours).padStart(2, '0');
      this.elements.ampm.textContent = hours >= 12 ? 'PM' : 'AM';
    }
    
    this.elements.minutes.textContent = String(minutes).padStart(2, '0');
    this.elements.seconds.textContent = ':' + String(seconds).padStart(2, '0');
    
    // Analog display (if visible)
    this.updateAnalogHands(hours, minutes, seconds);
    
    // Update date
    this.updateDate(now);
  }
  
  updateAnalogHands(hours, minutes, seconds) {
    const hourDeg = (hours % 12) * 30 + minutes * 0.5;
    const minuteDeg = minutes * 6 + seconds * 0.1;
    const secondDeg = seconds * 6;
    
    if (this.elements.hourHand) {
      this.elements.hourHand.style.transform = `rotate(${hourDeg}deg)`;
    }
    if (this.elements.minuteHand) {
      this.elements.minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    }
    if (this.elements.secondHand) {
      this.elements.secondHand.style.transform = `rotate(${secondDeg}deg)`;
    }
  }
  
  updateDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateStr = date.toLocaleDateString('en-US', options).toUpperCase();
    this.elements.dateDisplay.textContent = dateStr;
  }
  
  setupComplications() {
    // Battery
    this.updateBattery();
    setInterval(() => this.updateBattery(), 60000);
    
    // Steps (simulated - would need health API in production)
    this.updateSteps();
    setInterval(() => this.updateSteps(), 300000);
    
    // Heart Rate (simulated)
    this.updateHeartRate();
    setInterval(() => this.updateHeartRate(), 10000);
  }
  
  async updateBattery() {
    try {
      // Tizen/Web API for battery level
      if (typeof tizen !== 'undefined' && tizen.systeminfo) {
        const battery = await tizen.systeminfo.getPropertyValue('BATTERY');
        this.elements.batteryDisplay.textContent = `${Math.round(battery.level * 100)}%`;
      } else if ('getBattery' in navigator) {
        const battery = await navigator.getBattery();
        this.elements.batteryDisplay.textContent = `${Math.round(battery.level * 100)}%`;
      } else {
        this.elements.batteryDisplay.textContent = '100%';
      }
    } catch (error) {
      this.elements.batteryDisplay.textContent = '--';
    }
  }
  
  updateSteps() {
    // Would integrate with Samsung Health SDK in production
    // Simulated value for demo
    const steps = Math.floor(Math.random() * 10000);
    this.elements.stepsDisplay.textContent = steps.toLocaleString();
  }
  
  updateHeartRate() {
    // Would integrate with Samsung Health SDK in production
    // Simulated value for demo
    const hr = Math.floor(60 + Math.random() * 40);
    this.elements.heartrateDisplay.textContent = `${hr} BPM`;
  }
  
  setupEventListeners() {
    // Ambient mode support
    if (typeof tizen !== 'undefined') {
      tizen.time.setTimeChangeListener(() => {
        this.updateTime();
      });
      
      // Ambient mode
      document.addEventListener('timetick', () => {
        this.updateTime();
      });
      
      document.addEventListener('ambientmodechanged', (e) => {
        this.isAmbient = e.detail.ambientMode;
        this.toggleAmbientMode(this.isAmbient);
      });
    }
    
    // Touch events for interactive features
    this.elements.watchface.addEventListener('click', (e) => {
      this.handleTap(e);
    });
  }
  
  toggleAmbientMode(isAmbient) {
    if (isAmbient) {
      // Reduce to minimal display (time only)
      this.elements.seconds.style.display = 'none';
      document.querySelectorAll('.complication').forEach(el => {
        el.style.opacity = '0.3';
      });
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }
      // Update every minute in ambient mode
      this.updateInterval = setInterval(() => this.updateTime(), 60000);
    } else {
      // Restore full display
      if (this.config.settings.showSeconds) {
        this.elements.seconds.style.display = 'block';
      }
      document.querySelectorAll('.complication').forEach(el => {
        el.style.opacity = '1';
      });
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }
      this.startClock();
    }
  }
  
  handleTap(event) {
    // Toggle seconds display on tap
    const secondsVisible = this.elements.seconds.style.display !== 'none';
    this.elements.seconds.style.display = secondsVisible ? 'none' : 'block';
  }
  
  setStyle(styleName) {
    const watchface = this.elements.watchface;
    // Remove existing style classes
    watchface.className = 'watchface';
    // Add new style
    watchface.classList.add(`style-${styleName}`);
  }
  
  setColors(colors) {
    const watchface = this.elements.watchface;
    if (colors.background) watchface.style.setProperty('--bg-color', colors.background);
    if (colors.primary) watchface.style.setProperty('--primary-color', colors.primary);
    if (colors.accent) watchface.style.setProperty('--accent-color', colors.accent);
    if (colors.text) watchface.style.setProperty('--text-color', colors.text);
  }
  
  // Public API for external control
  showAnalogMode(show) {
    const analogDisplay = document.getElementById('analog-display');
    const digitalDisplay = document.querySelector('.time-display');
    
    if (show) {
      analogDisplay.style.display = 'block';
      digitalDisplay.style.display = 'none';
    } else {
      analogDisplay.style.display = 'none';
      digitalDisplay.style.display = 'flex';
    }
  }
  
  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

// Initialize watchface when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.watchface = new SomnalWatchface();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SomnalWatchface;
}
