const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8012;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper to sanitize filename
const sanitizeFilename = (name) => {
  let safeName = name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  if (!safeName.endsWith('.sb3')) safeName += '.sb3';
  return safeName;
};

// Helper to check if content is JSON
const isJson = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// POST /api/projects/save - Save project JSON
app.post('/api/projects/save', (req, res) => {
  try {
    const { filename, projectData } = req.body;
    
    if (!filename || !projectData) {
      return res.status(400).json({ error: 'Missing filename or projectData' });
    }
    
    const safeName = sanitizeFilename(filename);
    const filePath = path.join(dataDir, safeName);
    
    // Save as JSON for now (easier for debugging)
    fs.writeFileSync(filePath, JSON.stringify(projectData, null, 2));
    
    const stats = fs.statSync(filePath);
    
    console.log(`[Scratch-API] Saved project: ${safeName} (${stats.size} bytes)`);
    res.json({ 
      success: true, 
      filename: safeName,
      savedAt: new Date().toISOString(),
      size: stats.size
    });
  } catch (error) {
    console.error('[Scratch-API] Save error:', error);
    res.status(500).json({ error: 'Failed to save project' });
  }
});

// GET /api/projects/list - List all saved projects
app.get('/api/projects/list', (req, res) => {
  try {
    if (!fs.existsSync(dataDir)) {
      return res.json({ projects: [] });
    }
    
    const files = fs.readdirSync(dataDir);
    const projects = files
      .filter(f => f.endsWith('.sb3'))
      .map(f => {
        const stats = fs.statSync(path.join(dataDir, f));
        return {
          filename: f,
          savedAt: stats.mtime.toISOString(),
          size: stats.size
        };
      })
      .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    
    res.json({ projects });
  } catch (error) {
    console.error('[Scratch-API] List error:', error);
    res.status(500).json({ error: 'Failed to list projects' });
  }
});

// GET /api/projects/load/:filename - Load a project
app.get('/api/projects/load/:filename', (req, res) => {
  try {
    const safeName = sanitizeFilename(req.params.filename);
    const filePath = path.join(dataDir, safeName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const data = fs.readFileSync(filePath);
    
    // Check if it's JSON or binary (ZIP/SB3)
    const isBinary = data[0] === 0x50 && data[1] === 0x4B; // ZIP magic number "PK"
    
    if (isBinary) {
      // It's a real SB3 (ZIP) file - send as binary
      console.log(`[Scratch-API] Loaded binary project: ${safeName}`);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(data);
    } else {
      // It's JSON format
      console.log(`[Scratch-API] Loaded JSON project: ${safeName}`);
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    }
  } catch (error) {
    console.error('[Scratch-API] Load error:', error);
    res.status(500).json({ error: 'Failed to load project' });
  }
});

// Legacy file upload endpoint
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dataDir);
  },
  filename: (req, file, cb) => {
    cb(null, sanitizeFilename(req.params.name));
  }
});
const upload = multer({ storage });

// POST /api/projects/:name - Save a project via file upload
app.post('/api/projects/:name', upload.single('project'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No project file uploaded' });
  }
  console.log(`[Scratch-API] Saved project (upload): ${req.file.filename}`);
  res.json({ success: true, filename: req.file.filename });
});

// GET /api/projects/:name - Load a project via file download
app.get('/api/projects/:name', (req, res) => {
  const safeName = sanitizeFilename(req.params.name);
  const filePath = path.join(dataDir, safeName);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  console.log(`[Scratch-API] Loaded project (download): ${safeName}`);
  res.sendFile(filePath);
});

// GET /api/projects - List all projects (legacy)
app.get('/api/projects', (req, res) => {
  if (!fs.existsSync(dataDir)) {
    return res.json({ projects: [] });
  }
  const files = fs.readdirSync(dataDir);
  const projects = files
    .filter(f => f.endsWith('.sb3'))
    .map(f => f.replace('.sb3', ''));
  res.json({ projects });
});

// DELETE /api/projects/delete/:filename - Delete a project
app.delete('/api/projects/delete/:filename', (req, res) => {
  try {
    const safeName = sanitizeFilename(req.params.filename);
    const filePath = path.join(dataDir, safeName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    fs.unlinkSync(filePath);
    console.log(`[Scratch-API] Deleted project: ${safeName}`);
    res.json({ success: true, filename: safeName });
  } catch (error) {
    console.error('[Scratch-API] Delete error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

app.listen(PORT, () => {
  console.log(`[Scratch-API] Server running on port ${PORT}`);
  console.log(`[Scratch-API] Data directory: ${dataDir}`);
});
