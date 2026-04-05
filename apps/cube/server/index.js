const express = require('express');
const cors = require('cors');
const profilesRouter = require('./routes/profiles');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8003;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// API routes
app.use('/api/profiles', profilesRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[cube-api] Server running on port ${PORT}`);
});
