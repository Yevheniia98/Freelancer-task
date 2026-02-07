# Quick Setup Guide - Backend API Working

## Status ✅
- **Backend Server:** Running on `http://localhost:3002` 
- **Database:** MongoDB connected ✅
- **Auth Endpoint:** `/api/auth/login` ✅
- **Finance API:** `/api/finance/summary` ✅ (requires authentication)

---

## Test Credentials

```
Email:    suprunjen@gmail.com
Password: test123
```

---

## Option 1: Login via Frontend (Recommended)

1. **Open the app:** http://localhost:3030
2. **Click "Sign In"** or navigate to `/login`
3. **Enter credentials:**
   - Email: `suprunjen@gmail.com`
   - Password: `test123`
4. **Click "Sign In"**
5. **Dashboard loads with real API data** ✅

---

## Option 2: Manual Auth Token Setup

If you prefer to bypass login, run this in browser console (http://localhost:3030):

```javascript
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTg3NjA4ZDZiMWUxMDBkOGRlMTFiNTEiLCJpYXQiOjE3NzA0Nzk3NjQsImV4cCI6MTc3MDU2NjE2NH0.0603PUQr7i1aCcQYHCc2kXSN9QdsK-veoIb39ESYhrw";
const user = {
  id: "6987608d6b1e100d8de11b51",
  email: "suprunjen@gmail.com",
  firstName: "Evgeniia",
  lastName: "Suprun",
  twoFactorEnabled: false
};

localStorage.setItem('auth_token', token);
localStorage.setItem('user_data', JSON.stringify(user));

// Reload page
location.reload();
```

---

## Verify API is Working

### Test Finance API with Token

```bash
curl -s http://localhost:3002/api/finance/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" | python3 -m json.tool
```

### Test Login Endpoint

```bash
curl -s -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"suprunjen@gmail.com","password":"test123"}' | python3 -m json.tool
```

---

## Expected Console Output (After Fix)

### Before (❌ Broken - 15+ duplicate errors):
```
❌ Failed to fetch financial summary: AxiosError...
❌ Backend API unavailable, using mock data
❌ Failed to load financial data: AxiosError...
[repeated 15+ times]
```

### After (✅ Fixed - 1 clean message):
```
✅ Real data loads from API with no errors
OR
⚠️ Backend API unavailable, using mock data (if API down)
```

---

## Troubleshooting

### Problem: Still seeing 404 errors
**Solution:**
1. Verify backend is running: `ps aux | grep "node.*dist/server.js"`
2. Check it's responsive: `curl http://localhost:3002/api/health`
3. Expected response: `{"status":"OK",...}`

### Problem: Login fails with "Invalid email or password"
**Solution:**
1. Check email is lowercase: `suprunjen@gmail.com` (not `suprun.jen@gmail.com`)
2. Password is `test123`
3. If still fails, recreate user (see below)

### Problem: Finance data still shows mock data
**Solution:**
1. Check token is saved: Open DevTools → Application → localStorage → find `auth_token`
2. Verify backend is running
3. Clear cache and reload: `Ctrl+Shift+Delete`

---

## Recreate Test User

If needed, run this in terminal:

```bash
cd /Users/evgenya/freelancer-task/backend && node << 'ENDJS'
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  twoFactorEnabled: Boolean,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Delete old
    await User.deleteOne({ email: 'suprunjen@gmail.com' });
    
    // Create new
    const hashedPassword = await bcrypt.hash('test123', 10);
    const user = new User({
      email: 'suprunjen@gmail.com',
      password: hashedPassword,
      firstName: 'Evgeniia',
      lastName: 'Suprun',
      twoFactorEnabled: false
    });
    
    await user.save();
    console.log('✅ User created');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
  }
}

createUser();
ENDJS
```

---

## System Status Check

Run this command to verify everything is working:

```bash
# Check backend
echo "Backend Health:"
curl -s http://localhost:3002/api/health | python3 -m json.tool

# Check frontend
echo "Frontend Running:"
ps aux | grep "vite" | grep -v grep

# Check MongoDB
echo "Database Status:"
curl -s http://localhost:3002/api/health
```

---

## Next Steps

1. ✅ **Login to frontend** with `suprunjen@gmail.com` / `test123`
2. ✅ **Navigate to Finance** section
3. ✅ **Verify real data** loads from API (not mock data)
4. ✅ **Check console** - should show NO duplicate error messages
5. ✅ **Create meeting** with email participants - no storage errors

---

## Summary

| Component | Status | Details |
|-----------|--------|---------|
| Backend Server | ✅ Running | Port 3002 |
| MongoDB | ✅ Connected | protocol-task-manager DB |
| Redis | ✅ Connected | Cache service |
| Frontend | ✅ Running | Port 3030 |
| Auth API | ✅ Working | `/api/auth/login` |
| Finance API | ✅ Working | `/api/finance/summary` (requires auth) |
| Error Logging | ✅ Fixed | No more duplicate console messages |

---

**Ready to use!** 🚀

Go to http://localhost:3030 and login with:
- Email: `suprunjen@gmail.com`
- Password: `test123`
