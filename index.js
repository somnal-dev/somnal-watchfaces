/**
 * Somnal Watchface Factory
 * Express server for watchface generation and management
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const generator = require('./src/generator');
const templates = require('./src/templates');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data/watchfaces')));

// API Routes

/**
 * GET /api/watchfaces
 * List all saved watchfaces
 */
app.get('/api/watchfaces', (req, res) => {
  try {
    const list = generator.list();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/templates
 * List all available templates
 */
app.get('/api/templates', (req, res) => {
  try {
    const list = templates.getAll();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/templates/:id
 * Get template details
 */
app.get('/api/templates/:id', (req, res) => {
  try {
    const template = templates.getById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }
    res.json({ 
      success: true, 
      data: {
        id: template.id,
        name: template.name,
        category: template.category,
        description: template.description,
        defaultColors: template.defaultColors
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/categories
 * List all categories
 */
app.get('/api/categories', (req, res) => {
  try {
    const cats = templates.getCategories();
    res.json({ success: true, data: cats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/watchfaces/generate
 * Generate a new watchface
 */
app.post('/api/watchfaces/generate', (req, res) => {
  try {
    const { templateId, name, style, colors } = req.body;
    
    if (!templateId) {
      return res.status(400).json({ success: false, error: 'templateId is required' });
    }
    
    const watchface = generator.generate(templateId, { name, style, colors });
    generator.save(watchface);
    
    res.json({ 
      success: true, 
      data: {
        id: watchface.id,
        name: watchface.name,
        templateId: watchface.templateId,
        category: watchface.category,
        createdAt: watchface.createdAt,
        svgUrl: `/api/watchfaces/${watchface.id}/svg`
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/watchfaces/:id
 * Get watchface details
 */
app.get('/api/watchfaces/:id', (req, res) => {
  try {
    const watchface = generator.load(req.params.id);
    if (!watchface) {
      return res.status(404).json({ success: false, error: 'Watchface not found' });
    }
    res.json({ success: true, data: watchface });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/watchfaces/:id/svg
 * Get watchface SVG
 */
app.get('/api/watchfaces/:id/svg', (req, res) => {
  try {
    const watchface = generator.load(req.params.id);
    if (!watchface) {
      return res.status(404).json({ success: false, error: 'Watchface not found' });
    }
    res.type('image/svg+xml').send(watchface.svg);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/watchfaces/:id/download
 * Download watchface SVG
 */
app.get('/api/watchfaces/:id/download', (req, res) => {
  try {
    const watchface = generator.load(req.params.id);
    if (!watchface) {
      return res.status(404).json({ success: false, error: 'Watchface not found' });
    }
    
    const filename = `${watchface.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.svg`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.type('image/svg+xml').send(watchface.svg);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/watchfaces/:id/customize
 * Customize an existing watchface
 */
app.post('/api/watchfaces/:id/customize', (req, res) => {
  try {
    const existing = generator.load(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Watchface not found' });
    }
    
    const { name, colors, style } = req.body;
    
    // Generate new version with customizations
    const customized = generator.generate(existing.templateId, {
      name: name || existing.name,
      style: style || existing.style,
      colors: { ...existing.colors, ...colors }
    });
    
    generator.save(customized);
    
    res.json({ 
      success: true, 
      data: {
        id: customized.id,
        name: customized.name,
        templateId: customized.templateId,
        createdAt: customized.createdAt,
        svgUrl: `/api/watchfaces/${customized.id}/svg`
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/watchfaces/:id
 * Delete a watchface
 */
app.delete('/api/watchfaces/:id', (req, res) => {
  try {
    const removed = generator.remove(req.params.id);
    if (!removed) {
      return res.status(404).json({ success: false, error: 'Watchface not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/generate-all
 * Generate samples from all templates
 */
app.post('/api/generate-all', (req, res) => {
  try {
    const results = generator.generateSamples();
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'somnal-watchfaces' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🎨 Somnal Watchface Factory`);
  console.log(`   Running on port ${PORT}`);
  console.log(`   http://localhost:${PORT}\n`);
});

module.exports = app;
