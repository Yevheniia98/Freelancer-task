const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simple in-memory notifications storage for testing
const notifications = [];

// Health check endpoint
app.get('/api/notifications/health', (req, res) => {
  res.json({
    success: true,
    message: 'Notification service is healthy',
    timestamp: new Date().toISOString()
  });
});

// Get notifications (no auth required for testing)
app.get('/api/notifications', (req, res) => {
  res.json({
    success: true,
    message: 'Notifications retrieved successfully',
    data: notifications,
    pagination: {
      page: 1,
      limit: 20,
      total: notifications.length,
      hasMore: false
    }
  });
});

// Create notification
app.post('/api/notifications', (req, res) => {
  const { title, message, type, priority } = req.body;

  if (!title || !message) {
    return res.status(400).json({
      success: false,
      message: 'Title and message are required'
    });
  }

  const notification = {
    id: Date.now().toString(),
    userId: 'test-user',
    title,
    message,
    type: type || 'general',
    priority: priority || 'medium',
    isRead: false,
    createdAt: new Date().toISOString(),
    metadata: {}
  };

  notifications.push(notification);
  console.log(`✅ Notification created: ${title}`);

  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    data: notification
  });
});

// Get notification stats
app.get('/api/notifications/stats', (req, res) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  res.json({
    success: true,
    message: 'Notification statistics retrieved successfully',
    data: {
      total: notifications.length,
      unread: unreadCount
    }
  });
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`🚀 Simple notification test server running on http://localhost:${PORT}`);
  console.log(`✅ Ready to test notification API endpoints`);
});