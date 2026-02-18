# Login Credentials

## Working Test User

**Email:** `vickyjosh94@gmail.com`
**Password:** `Test123456!`

## How to Use

1. Go to http://localhost:3030/login
2. Enter the email above
3. Enter the password above
4. Click "Sign In"

## If Login Fails

If you still get a 401 error, run this command to reset the password:

```bash
cd backend
node reset-user-password.js
```

This will output new credentials to use.

## Available Test Users

Run this to see all users:

```bash
cd backend
node check-all-users.js
```

## Creating Additional Users

Use the Register page at http://localhost:3030/create-account to create new test users.

