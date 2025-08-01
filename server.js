const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Connect MongoDB
connectDB();

app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: [
    'https://thecodecreater-adminpanel-thzy.vercel.app',
    'https://thecodecreater-frontend.vercel.app',
    'http://localhost:3001', // admin panel dev
    'http://localhost:3000'  // frontend dev
  ],
  credentials: true
}));

// Advanced API routes
// User profile & messages routes above
app.use('/api/auth', require('./routes/auth'));
const userAuthRoutes = require('./routes/userAuth');
const userMessagesRoutes = require('./routes/userMessages');
app.use('/api/users', userAuthRoutes);
app.use('/api/users', require('./routes/forgotPassword'));
app.use('/api/user/messages', userMessagesRoutes);
app.use('/api/user/profile', require('./routes/userProfile'));
app.use('/api/admin/users', require('./routes/adminUsers'));
app.use('/api/admin/messages', require('./routes/adminMessages'));
app.use('/api/admin/blogs', require('./routes/adminBlogs'));
app.use('/api/admin/testimonials', require('./routes/adminTestimonials'));
app.use('/api/admin/comments', require('./routes/adminComments'));
app.use('/api/services', require('./routes/services'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/blogs', require('./routes/blogComments'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/header', require('./routes/header'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/project-consultation', require('./routes/projectConsultation'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/faqs', require('./routes/faq'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is working.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Socket.io connection for real-time updates
const ChatMessage = require('./models/ChatMessage');

io.on('connection', (socket) => {
  console.log('Socket.io client connected:', socket.id);

  // Join room by user email or 'admin'
  socket.on('join', ({ email, isAdmin }) => {
    const room = isAdmin ? 'admin' : email;
    socket.join(room);
    socket.room = room;
  });

  // Handle sending chat message
  socket.on('chat-message', async (data) => {
    // data: { from, to, message }
    const { from, to, message } = data;
    if (!from || !to || !message) return;
    // Save to DB
    const chatMsg = await ChatMessage.create({ from, to, message });
    // Emit to recipient room
    io.to(to).emit('chat-message', {
      from,
      to,
      message,
      timestamp: chatMsg.timestamp,
      _id: chatMsg._id
    });
    // Emit to sender for instant feedback
    socket.emit('chat-message', {
      from,
      to,
      message,
      timestamp: chatMsg.timestamp,
      _id: chatMsg._id
    });
  });

  // Typing indicator (optional)
  socket.on('typing', ({ from, to }) => {
    io.to(to).emit('typing', { from });
  });

  // Legacy admin-update event
  socket.on('admin-update', (data) => {
    socket.broadcast.emit('frontend-update', data);
  });

  // Properly handle disconnect
  socket.on('disconnect', () => {
    console.log('Socket.io client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
