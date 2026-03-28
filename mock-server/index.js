require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sportsRoutes = require('./routes/sports');
const fixturesRoutes = require('./routes/fixtures');
const marketsRoutes = require('./routes/markets');
const configRoutes = require('./routes/config');
const sharedBetsRoutes = require('./routes/sharedBets');

const app = express();
let PORT = parseInt(process.env.PORT) || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Serve static files (test.html)
app.use(express.static(__dirname));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api-v2', sportsRoutes);
app.use('/api-v2', fixturesRoutes);
app.use('/api-v2', marketsRoutes);
app.use('/api', configRoutes);
app.use('/api/shared-bets', sharedBetsRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    responseCodes: [{ code: 'ERROR', message: err.message }],
    data: null
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    responseCodes: [{ code: 'NOT_FOUND', message: 'Endpoint not found' }],
    data: null
  });
});

/**
 * Tenta iniciar o servidor, se a porta estiver em uso, tenta a próxima
 */
function startServer(port = PORT) {
  const server = app.listen(port, () => {
    console.log(`
╔═════════════════════════════════════════╗
║   SwiftBet Mock Server Running         ║
║   Port: ${port}                          ║
║   URL: http://localhost:${port}          ║
╚═════════════════════════════════════════╝
    `);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`❌ Porta ${port} em uso, tentando ${port + 1}...`);
      server.close();
      startServer(port + 1);
    } else {
      throw err;
    }
  });
}

startServer(PORT);

module.exports = app;
