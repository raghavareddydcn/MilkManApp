const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Proxy API requests to backend
app.use('/milkman', createProxyMiddleware({
  target: 'http://milkman-app:8081',
  changeOrigin: true,
  logLevel: 'debug'
}));

// Health check endpoint for Prometheus monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Metrics endpoint for Prometheus (basic text format)
app.get('/metrics', (req, res) => {
  const uptime = process.uptime();
  const memUsage = process.memoryUsage();
  
  const metrics = `
# HELP nodejs_up Node.js application is up
# TYPE nodejs_up gauge
nodejs_up 1

# HELP nodejs_uptime_seconds Uptime in seconds
# TYPE nodejs_uptime_seconds counter
nodejs_uptime_seconds ${uptime}

# HELP nodejs_memory_heap_used_bytes Memory heap used in bytes
# TYPE nodejs_memory_heap_used_bytes gauge
nodejs_memory_heap_used_bytes ${memUsage.heapUsed}

# HELP nodejs_memory_heap_total_bytes Memory heap total in bytes
# TYPE nodejs_memory_heap_total_bytes gauge
nodejs_memory_heap_total_bytes ${memUsage.heapTotal}
`;
  
  res.set('Content-Type', 'text/plain');
  res.send(metrics.trim());
});

// Serve static files with proper cache control
app.use('/assets', express.static(path.join(__dirname, 'dist/assets'), {
  etag: false,
  lastModified: false,
  setHeaders: (res, filePath) => {
    // Cache assets with hash in filename for 1 year
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));

// Serve other static files (like milk.svg)
app.use(express.static(path.join(__dirname, 'dist'), {
  etag: false,
  lastModified: false,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// Handle client-side routing - serve index.html for all non-static routes
app.get('*', (req, res) => {
  // Don't serve index.html for asset requests
  if (req.path.startsWith('/assets/')) {
    return res.status(404).send('Not found');
  }
  
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
