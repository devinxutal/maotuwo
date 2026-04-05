const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Data directory — configurable via env, defaults to sibling of deployment
const DATA_DIR = process.env.CUBE_DATA_DIR || path.join(__dirname, '..', 'data', 'profiles');
const DEFAULT_CONFIG_PATH = path.join(__dirname, '..', 'data', 'default_formulas.json');

const PREDEFINED_PROFILES = ['public', 'loki', 'gloria', 'eric', 'sunny'];

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Get profile file path
function profilePath(name) {
  return path.join(DATA_DIR, `${name.toLowerCase()}.json`);
}

// Initialize a profile from default if it doesn't exist
function ensureProfile(name) {
  const filePath = profilePath(name);
  if (!fs.existsSync(filePath)) {
    ensureDataDir();
    let defaultData = { version: 1, timestamp: new Date().toISOString(), data: {} };
    if (fs.existsSync(DEFAULT_CONFIG_PATH)) {
      try {
        defaultData = JSON.parse(fs.readFileSync(DEFAULT_CONFIG_PATH, 'utf-8'));
        defaultData.timestamp = new Date().toISOString();
      } catch (e) {
        console.error('[profiles] Failed to read default config:', e.message);
      }
    }
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    console.log(`[profiles] Initialized profile: ${name}`);
  }
}

// GET /api/profiles — list all profiles
router.get('/', (_req, res) => {
  ensureDataDir();
  // Ensure all predefined profiles exist
  PREDEFINED_PROFILES.forEach(ensureProfile);

  const files = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));

  res.json({ profiles: files });
});

// GET /api/profiles/:name — get full profile data
router.get('/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  ensureProfile(name);

  try {
    const data = JSON.parse(fs.readFileSync(profilePath(name), 'utf-8'));
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to read profile', detail: e.message });
  }
});

// PUT /api/profiles/:name — full overwrite (import / reset)
router.put('/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  if (!req.body || !req.body.data) {
    return res.status(400).json({ error: 'Invalid body: must include "data" field' });
  }

  ensureDataDir();
  const payload = {
    version: req.body.version || 1,
    timestamp: new Date().toISOString(),
    data: req.body.data
  };

  try {
    fs.writeFileSync(profilePath(name), JSON.stringify(payload, null, 2), 'utf-8');
    res.json({ ok: true, timestamp: payload.timestamp });
  } catch (e) {
    res.status(500).json({ error: 'Failed to write profile', detail: e.message });
  }
});

// PATCH /api/profiles/:name — partial update (single case edit)
router.patch('/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const { caseId, mainFormulaId, formulas } = req.body;

  if (!caseId) {
    return res.status(400).json({ error: 'Missing caseId in body' });
  }

  ensureProfile(name);

  try {
    const filePath = profilePath(name);
    const profile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (!profile.data) profile.data = {};
    profile.data[caseId] = { mainFormulaId, formulas };
    profile.timestamp = new Date().toISOString();

    fs.writeFileSync(filePath, JSON.stringify(profile, null, 2), 'utf-8');
    res.json({ ok: true, timestamp: profile.timestamp });
  } catch (e) {
    res.status(500).json({ error: 'Failed to patch profile', detail: e.message });
  }
});

module.exports = router;
