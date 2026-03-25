/**
 * Watchface Generator
 * Main SVG generation engine
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const templates = require('./templates');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../data/watchfaces');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Generate a watchface from a template
 */
function generate(templateId, options = {}) {
  const template = templates.getById(templateId);
  
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }
  
  const svg = template.generate(options);
  
  return {
    id: uuidv4(),
    templateId,
    name: options.name || `${template.name} ${Date.now()}`,
    category: template.category,
    style: options.style || 'default',
    colors: { ...template.defaultColors, ...options.colors },
    svg,
    createdAt: new Date().toISOString()
  };
}

/**
 * Save a generated watchface
 */
function save(watchface) {
  const filePath = path.join(DATA_DIR, `${watchface.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(watchface, null, 2));
  return filePath;
}

/**
 * Load a watchface by ID
 */
function load(id) {
  const filePath = path.join(DATA_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * List all saved watchfaces
 */
function list() {
  if (!fs.existsSync(DATA_DIR)) {
    return [];
  }
  
  return fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));
      return {
        id: data.id,
        name: data.name,
        templateId: data.templateId,
        category: data.category,
        createdAt: data.createdAt
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Delete a watchface
 */
function remove(id) {
  const filePath = path.join(DATA_DIR, `${id}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

/**
 * Generate sample watchfaces from all templates
 */
function generateSamples(outputDir = DATA_DIR) {
  const results = [];
  const allTemplates = templates.getAll();
  
  for (const templateInfo of allTemplates) {
    try {
      const watchface = generate(templateInfo.id, {
        name: `${templateInfo.name} Sample`
      });
      const filePath = path.join(outputDir, `${watchface.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(watchface, null, 2));
      
      // Also save raw SVG
      const svgPath = path.join(outputDir, `${watchface.id}.svg`);
      fs.writeFileSync(svgPath, watchface.svg);
      
      results.push({
        templateId: templateInfo.id,
        name: templateInfo.name,
        watchfaceId: watchface.id,
        success: true
      });
      
      console.log(`✓ Generated: ${templateInfo.name}`);
    } catch (err) {
      results.push({
        templateId: templateInfo.id,
        name: templateInfo.name,
        success: false,
        error: err.message
      });
      console.error(`✗ Failed: ${templateInfo.name} - ${err.message}`);
    }
  }
  
  return results;
}

// CLI test
if (require.main === module) {
  console.log('\n🎨 Watchface Generator Test\n');
  console.log('Generating samples from all templates...\n');
  
  const results = generateSamples();
  
  console.log('\n📊 Results:');
  console.log(`  Total: ${results.length}`);
  console.log(`  Success: ${results.filter(r => r.success).length}`);
  console.log(`  Failed: ${results.filter(r => !r.success).length}`);
  console.log(`\n📁 Output: ${DATA_DIR}\n`);
}

module.exports = {
  generate,
  save,
  load,
  list,
  remove,
  generateSamples,
  templates
};
