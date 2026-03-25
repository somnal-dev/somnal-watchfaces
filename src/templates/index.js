/**
 * Template Registry
 * Exports all available watchface templates
 */

const minimal = require('./minimal');
const sport = require('./sport');
const classic = require('./classic');
const digital = require('./digital');
const neon = require('./neon');
const gradient = require('./gradient');
const galaxy = require('./galaxy');
const ocean = require('./ocean');
const forest = require('./forest');
const sunset = require('./sunset');
const monochrome = require('./monochrome');

const templates = {
  minimal,
  sport,
  classic,
  digital,
  neon,
  gradient,
  galaxy,
  ocean,
  forest,
  sunset,
  monochrome
};

/**
 * Get all templates
 */
function getAll() {
  return Object.values(templates).map(t => ({
    id: t.id,
    name: t.name,
    category: t.category,
    description: t.description,
    defaultColors: t.defaultColors
  }));
}

/**
 * Get template by ID
 */
function getById(id) {
  return templates[id] || null;
}

/**
 * Get templates by category
 */
function getByCategory(category) {
  return Object.values(templates)
    .filter(t => t.category === category)
    .map(t => ({
      id: t.id,
      name: t.name,
      description: t.description
    }));
}

/**
 * Get all categories
 */
function getCategories() {
  const cats = new Set(Object.values(templates).map(t => t.category));
  return Array.from(cats);
}

module.exports = {
  getAll,
  getById,
  getByCategory,
  getCategories,
  templates
};
