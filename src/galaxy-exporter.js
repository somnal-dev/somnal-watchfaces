/**
 * Galaxy Watchface Exporter
 * Converts SVG templates to Wear OS compatible HTML/CSS format
 */

const fs = require('fs');
const path = require('path');
const templates = require('./templates');
const generator = require('./generator');

// Base paths
const BASE_DIR = path.join(__dirname, '..');
const GALAXY_DIR = path.join(BASE_DIR, 'galaxy-watchface');
const OUTPUT_DIR = path.join(BASE_DIR, 'output/galaxy-watchfaces');
const APP_DIR = path.join(GALAXY_DIR, 'app');

// Style mapping from template categories to CSS classes
const STYLE_MAP = {
  minimal: 'style-minimal',
  digital: 'style-neon',
  neon: 'style-neon',
  gradient: 'style-gradient',
  galaxy: 'style-galaxy',
  ocean: 'style-ocean',
  forest: 'style-forest',
  sunset: 'style-sunset',
  sport: 'style-sport',
  classic: 'style-classic',
  monochrome: 'style-monochrome'
};

/**
 * Convert template colors to CSS variables
 */
function colorsToCSS(colors) {
  const cssVars = [];
  const mapping = {
    backgroundColor: '--bg-color',
    background: '--bg-color',
    primaryColor: '--primary-color',
    primary: '--primary-color',
    markerColor: '--primary-color',
    hourHandColor: '--primary-color',
    accentColor: '--accent-color',
    secondHandColor: '--accent-color',
    textColor: '--text-color',
    text: '--text-color',
    neonPink: '--accent-color',
    neonBlue: '--primary-color'
  };
  
  for (const [key, value] of Object.entries(colors)) {
    const cssVar = mapping[key] || `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    if (value && typeof value === 'string' && value.startsWith('#')) {
      cssVars.push(`  ${cssVar}: ${value};`);
    }
  }
  
  return cssVars.join('\n');
}

/**
 * Extract design elements from SVG for HTML conversion
 */
function parseSVGDesign(svgContent) {
  const design = {
    hasAnalog: false,
    hasDigital: false,
    hasSeconds: true,
    markers: [],
    complications: []
  };
  
  // Check for clock hands (analog)
  if (svgContent.includes('hand') || svgContent.includes('Hand')) {
    design.hasAnalog = true;
  }
  
  // Check for digital display
  if (svgContent.includes('digital') || svgContent.includes('Digital') || /font-size.*\d{2,}/.test(svgContent)) {
    design.hasDigital = true;
  }
  
  // Extract marker positions
  const markerMatches = svgContent.matchAll(/<circle[^>]*cx="(\d+)"[^>]*cy="(\d+)"[^>]*>/g);
  for (const match of markerMatches) {
    design.markers.push({
      x: parseInt(match[1]),
      y: parseInt(match[2])
    });
  }
  
  return design;
}

/**
 * Generate custom CSS for a specific watchface
 */
function generateWatchfaceCSS(watchface) {
  const { colors, templateId } = watchface;
  const template = templates.getById(templateId);
  const defaultColors = template?.defaultColors || {};
  const mergedColors = { ...defaultColors, ...colors };
  
  const styleClass = STYLE_MAP[template?.category] || 'style-minimal';
  
  return `/* Custom styles for ${watchface.name} */
.watchface.custom-${watchface.id.slice(0, 8)} {
${colorsToCSS(mergedColors)}
}

/* Override with template-specific class */
.watchface.custom-${watchface.id.slice(0, 8)}.${styleClass} {
  /* Combined styles */
}
`;
}

/**
 * Generate HTML for a specific watchface
 */
function generateWatchfaceHTML(watchface) {
  const template = templates.getById(watchface.templateId);
  const styleClass = STYLE_MAP[template?.category] || 'style-minimal';
  const customClass = `custom-${watchface.id.slice(0, 8)}`;
  
  const config = {
    watchface: {
      name: watchface.name,
      version: '1.0.0',
      author: 'Somnal'
    },
    settings: {
      showSeconds: true,
      showDate: true,
      showBattery: true,
      showHeartRate: false,
      showSteps: false,
      use24Hour: true,
      updateInterval: 1000
    },
    colors: {
      ...template?.defaultColors,
      ...watchface.colors
    }
  };
  
  return {
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${watchface.name}</title>
  <link rel="stylesheet" href="css/style.css">
  <style>${generateWatchfaceCSS(watchface)}</style>
</head>
<body>
  <div id="watchface" class="watchface ${styleClass} ${customClass}">
    <div class="background-layer"></div>
    <div class="markers-layer"></div>
    
    <div class="complications">
      <div class="complication top">
        <span class="complication-value" id="date-display">--</span>
      </div>
      <div class="complication left">
        <span class="complication-icon">🔋</span>
        <span class="complication-value" id="battery-display">--</span>
      </div>
    </div>
    
    <div class="time-display">
      <div class="hours" id="hours">00</div>
      <div class="time-separator">:</div>
      <div class="minutes" id="minutes">00</div>
    </div>
    
    <div class="seconds-display" id="seconds">:00</div>
    <div class="ampm-display" id="ampm">AM</div>
  </div>
  
  <script src="js/main.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      if (window.watchface) {
        window.watchface.setStyle('${template?.category || 'minimal'}');
        window.watchface.setColors(${JSON.stringify(config.colors)});
      }
    });
  </script>
</body>
</html>`,
    config
  };
}

/**
 * Generate manifest for a watchface package
 */
function generateManifest(watchface) {
  const template = templates.getById(watchface.templateId);
  
  return {
    name: watchface.name,
    version: '1.0.0',
    package: `com.somnal.watchface.${watchface.id.slice(0, 8)}`,
    description: template?.description || 'Custom Somnal Watchface',
    author: 'Somnal',
    icons: {
      '128': 'icon128.png',
      '512': 'icon512.png'
    },
    wearable: {
      type: 'watchface',
      platform: ['wearable'],
      preview: {
        type: 'circular',
        width: 360,
        height: 360
      }
    },
    permissions: [
      'http://tizen.org/privilege/alarm',
      'http://tizen.org/privilege/healthinfo'
    ]
  };
}

/**
 * Export a single watchface to Galaxy format
 */
function exportWatchface(watchfaceId) {
  const watchface = generator.load(watchfaceId);
  if (!watchface) {
    throw new Error(`Watchface not found: ${watchfaceId}`);
  }
  
  const outputDir = path.join(OUTPUT_DIR, watchface.id);
  const appDir = path.join(outputDir, 'app');
  const cssDir = path.join(appDir, 'css');
  const jsDir = path.join(appDir, 'js');
  const resourcesDir = path.join(outputDir, 'resources');
  
  // Create directories
  [outputDir, appDir, cssDir, jsDir, resourcesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Generate files
  const { html, config } = generateWatchfaceHTML(watchface);
  const manifest = generateManifest(watchface);
  
  // Write files
  fs.writeFileSync(path.join(appDir, 'index.html'), html);
  fs.writeFileSync(path.join(appDir, 'config.json'), JSON.stringify(config, null, 2));
  fs.writeFileSync(path.join(resourcesDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  
  // Copy base CSS and JS
  const baseCSS = fs.readFileSync(path.join(GALAXY_DIR, 'app/css/style.css'));
  const baseJS = fs.readFileSync(path.join(GALAXY_DIR, 'app/js/main.js'));
  
  fs.writeFileSync(path.join(cssDir, 'style.css'), baseCSS);
  fs.writeFileSync(path.join(jsDir, 'main.js'), baseJS);
  
  // Copy SVG as preview
  const svgPath = path.join(BASE_DIR, `data/watchfaces/${watchface.id}.svg`);
  if (fs.existsSync(svgPath)) {
    fs.copyFileSync(svgPath, path.join(resourcesDir, 'preview.svg'));
  }
  
  console.log(`✓ Exported: ${watchface.name} -> ${outputDir}`);
  
  return {
    id: watchface.id,
    name: watchface.name,
    outputDir,
    files: [
      'app/index.html',
      'app/config.json',
      'app/css/style.css',
      'app/js/main.js',
      'resources/manifest.json',
      'resources/preview.svg'
    ]
  };
}

/**
 * Export all watchfaces to Galaxy format
 */
function exportAll() {
  const list = generator.list();
  const results = [];
  
  console.log(`\n🚀 Exporting ${list.length} watchfaces to Galaxy format...\n`);
  
  for (const item of list) {
    try {
      const result = exportWatchface(item.id);
      results.push(result);
    } catch (error) {
      console.error(`✗ Failed to export ${item.name}: ${error.message}`);
    }
  }
  
  console.log(`\n✅ Successfully exported ${results.length}/${list.length} watchfaces\n`);
  
  return results;
}

/**
 * Generate sample watchfaces for testing
 */
function generateSamples(count = 3) {
  const allTemplates = templates.getAll();
  const samples = [];
  
  console.log(`\n🎨 Generating ${count} sample watchfaces...\n`);
  
  // Select diverse templates
  const selectedTemplates = allTemplates
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
  
  for (const template of selectedTemplates) {
    const watchface = generator.generate(template.id, {
      name: `Sample ${template.name}`,
      colors: template.defaultColors
    });
    
    generator.save(watchface);
    samples.push(watchface);
    
    console.log(`✓ Generated: ${watchface.name} (${template.category})`);
  }
  
  return samples;
}

/**
 * CLI interface
 */
function cli() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'export':
      if (args[1]) {
        exportWatchface(args[1]);
      } else {
        exportAll();
      }
      break;
      
    case 'generate':
      const count = parseInt(args[1]) || 3;
      const samples = generateSamples(count);
      samples.forEach(s => exportWatchface(s.id));
      break;
      
    case 'list':
      const list = generator.list();
      console.log('\n📱 Available Watchfaces:\n');
      list.forEach((item, i) => {
        console.log(`  ${i + 1}. ${item.name} (${item.id})`);
      });
      console.log('');
      break;
      
    default:
      console.log(`
📱 Galaxy Watchface Exporter

Usage:
  node galaxy-exporter.js <command> [options]

Commands:
  export [id]    Export watchface(s) to Galaxy format
                 (all if no ID provided)
  generate [n]   Generate n sample watchfaces and export
                 (default: 3)
  list           List all available watchfaces

Examples:
  node galaxy-exporter.js export
  node galaxy-exporter.js export fc8164f0-6ac9-4b87-91f4-5862d07af5c4
  node galaxy-exporter.js generate 5
  node galaxy-exporter.js list
`);
  }
}

// Run CLI if called directly
if (require.main === module) {
  cli();
}

module.exports = {
  exportWatchface,
  exportAll,
  generateSamples,
  generateWatchfaceHTML,
  generateManifest,
  colorsToCSS,
  parseSVGDesign
};
