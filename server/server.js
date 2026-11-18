require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

const app = express();
const httpServer = http.createServer(app);
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((item) => item.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ success: true, app: 'Wazzupp API', status: 'running', timestamp: new Date().toISOString() }));

const io = new Server(httpServer, { cors: { origin: allowedOrigins, methods: ['GET', 'POST'], credentials: true } });
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('disconnect', (reason) => console.log('Socket disconnected:', socket.id, reason));
});

const PORT = process.env.PORT || 5000;
async function startServer() {
  try {
    await connectDB();
    httpServer.listen(PORT, () => console.log('Wazzupp API listening on port', PORT));
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}
startServer();
