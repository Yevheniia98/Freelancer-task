// Email normalization middleware
// Add this to your backend to handle both email formats

function normalizeEmail(req, res, next) {
  if (req.body && req.body.email) {
    // Convert suprun.jen@gmail.com to suprunjen@gmail.com for database queries
    // but keep the original format for user-facing operations
    req.body.originalEmail = req.body.email;
    req.body.email = req.body.email.replace(/\./g, ''); // Remove dots before @
  }
  next();
}

// Use this middleware on auth routes:
// app.use('/api/auth', normalizeEmail, authRoutes);

module.exports = normalizeEmail;