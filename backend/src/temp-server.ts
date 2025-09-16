import express, { Request, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const app = express();

// Enable CORS for all requests
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// In-memory user storage (temporary solution)
const users: any[] = [
  {
    id: 1,
    email: "suprun.jen@gmail.com",
    password: "$2b$10$.i6w9NCM/J95NbONzdq0F.SJilsgqeUll82kjsySyXyKjsd8lyJ5m", // "03101998Polo"
    fullName: "User Test",
    resetCode: null,
    resetCodeExpires: null
  }
];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-make-it-long-and-complex';

// Email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'freelancetasker0@gmail.com',
    pass: 'cflj fcsz jadd gbmy'
  }
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  },
});

const upload = multer({ storage });

// Authentication middleware
const authenticateToken = (req: any, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Login route
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Register route
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password, and full name are required' 
      });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      fullName,
      resetCode: null,
      resetCodeExpires: null
    };

    users.push(newUser);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Forgot password route
app.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: 'If an account with this email exists, a reset code will be sent'
      });
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Send email
    const mailOptions = {
      from: 'freelancetasker0@gmail.com',
      to: email,
      subject: 'Password Reset Code',
      html: `
        <h2>Password Reset Request</h2>
        <p>Your password reset code is: <strong>${resetCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Reset code sent to your email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send reset code' 
    });
  }
});

// Reset password route
app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, code, and new password are required' 
      });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid reset code' 
      });
    }

    if (user.resetCode !== code || !user.resetCodeExpires || Date.now() > user.resetCodeExpires) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset code' 
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null;
    user.resetCodeExpires = null;

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to reset password' 
    });
  }
});

// File upload route
app.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "File not uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});

// Dashboard route (protected)
app.get('/api/dashboard', authenticateToken, (req: any, res: Response) => {
  res.json({
    success: true,
    message: 'Dashboard data',
    user: req.user
  });
});

// API File upload route (for profile pictures, etc.)
app.post("/api/upload", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "File not uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});

// In-memory project storage
const projects: any[] = [];
let projectIdCounter = 1;

// Project routes
// Get all projects
app.get('/api/projects', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: projects
  });
});

// Get project by ID
app.get('/api/projects/:id', (req: Request, res: Response) => {
  const projectId = req.params.id;
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }
  
  res.json({
    success: true,
    data: project
  });
});

// Create new project
app.post('/api/projects', (req: Request, res: Response) => {
  const { title, description, priority, status, deadline } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Title and description are required'
    });
  }
  
  const newProject = {
    id: `project_${projectIdCounter++}_${Date.now()}`,
    title,
    description,
    priority: priority || 'medium',
    status: status || 'pending',
    deadline: deadline || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    files: []
  };
  
  projects.push(newProject);
  
  res.status(201).json({
    success: true,
    data: newProject
  });
});

// Update project
app.put('/api/projects/:id', (req: Request, res: Response) => {
  const projectId = req.params.id;
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }
  
  projects[projectIndex] = {
    ...projects[projectIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: projects[projectIndex]
  });
});

// Delete project
app.delete('/api/projects/:id', (req: Request, res: Response) => {
  const projectId = req.params.id;
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }
  
  projects.splice(projectIndex, 1);
  
  res.json({
    success: true,
    message: 'Project deleted successfully'
  });
});

// Upload file for project
app.post('/api/projects/:id/files', upload.single('file'), (req: Request, res: Response) => {
  const projectId = req.params.id;
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }
  
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
  
  const fileInfo = {
    id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: `/uploads/${req.file.filename}`,
    size: req.file.size,
    mimetype: req.file.mimetype,
    uploadedAt: new Date().toISOString()
  };
  
  project.files.push(fileInfo);
  project.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    data: fileInfo
  });
});

// Meeting invitation endpoints
app.post('/api/meeting-invitations/send-multiple', async (req: Request, res: Response) => {
  try {
    const { recipients, meetingData } = req.body;

    console.log('📧 Received meeting invitation request:', {
      recipients: recipients?.length || 0,
      meetingData: meetingData?.title || 'No title'
    });

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Recipients array is required and must not be empty'
      });
    }

    if (!meetingData || !meetingData.title) {
      return res.status(400).json({
        success: false,
        message: 'Meeting data with title is required'
      });
    }

    const emailResults = await Promise.allSettled(
      recipients.map(async (recipient) => {
        if (!recipient.email) {
          throw new Error(`Invalid recipient: missing email`);
        }

        const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Meeting Invitation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: #0D7C66; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .meeting-details { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #0D7C66; }
        .join-button { display: inline-block; background: #0D7C66; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📅 Meeting Invitation</h1>
        </div>
        <div class="content">
            <p>Hello ${recipient.name || 'there'},</p>
            
            <p>You're invited to join our upcoming meeting:</p>
            
            <div class="meeting-details">
                <div class="detail-row">
                    <span class="label">Meeting:</span> ${meetingData.title}
                </div>
                ${meetingData.description ? `
                <div class="detail-row">
                    <span class="label">Description:</span> ${meetingData.description}
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="label">Date:</span> ${new Date(meetingData.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                </div>
                <div class="detail-row">
                    <span class="label">Time:</span> ${meetingData.startTime} - ${meetingData.endTime}
                </div>
                ${meetingData.platform ? `
                <div class="detail-row">
                    <span class="label">Platform:</span> ${meetingData.platform.charAt(0).toUpperCase() + meetingData.platform.slice(1)}
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="label">Organizer:</span> ${meetingData.organizerName} (${meetingData.organizerEmail})
                </div>
            </div>
            
            ${meetingData.meetingLink ? `
            <p style="text-align: center;">
                <a href="${meetingData.meetingLink}" class="join-button">🔗 Join Meeting</a>
            </p>
            ` : ''}
            
            <p>We look forward to seeing you there!</p>
            
            <p>Best regards,<br>
            ${meetingData.organizerName}</p>
        </div>
        <div class="footer">
            <p>This is an automated invitation from the Freelancer Task Manager</p>
        </div>
    </div>
</body>
</html>
        `;

        const mailOptions = {
          from: `"${meetingData.organizerName}" <${process.env.EMAIL_USER || 'freelancetasker0@gmail.com'}>`,
          to: recipient.email,
          subject: `📅 Meeting Invitation: ${meetingData.title}`,
          html: emailContent
        };

        console.log(`📤 Sending email to: ${recipient.email}`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${recipient.email}:`, info.messageId);
        
        return {
          email: recipient.email,
          name: recipient.name,
          status: 'sent',
          messageId: info.messageId
        };
      })
    );

    const sentSuccessfully = emailResults.filter(result => result.status === 'fulfilled').length;
    const failed = emailResults.filter(result => result.status === 'rejected').length;
    
    const failedResults = emailResults
      .filter(result => result.status === 'rejected')
      .map(result => ({
        error: (result as PromiseRejectedResult).reason.message
      }));

    console.log(`📊 Email results: ${sentSuccessfully} sent, ${failed} failed`);

    res.json({
      success: true,
      message: `Meeting invitations processed: ${sentSuccessfully} sent, ${failed} failed`,
      data: {
        sentSuccessfully,
        failed,
        results: emailResults.map(result => 
          result.status === 'fulfilled' ? result.value : { error: (result as PromiseRejectedResult).reason.message }
        ),
        failedResults
      }
    });

  } catch (error) {
    console.error('❌ Meeting invitation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send meeting invitations',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/meeting-invitations/send-single', async (req: Request, res: Response) => {
  try {
    const { recipient, meetingData } = req.body;

    if (!recipient?.email || !meetingData?.title) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email and meeting title are required'
      });
    }

    // Use the same logic as send-multiple but for a single recipient
    const result = await sendSingleMeetingInvitation(recipient, meetingData);
    
    res.json({
      success: true,
      message: 'Meeting invitation sent successfully',
      data: result
    });

  } catch (error) {
    console.error('❌ Single meeting invitation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send meeting invitation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper function for single email sending
async function sendSingleMeetingInvitation(recipient: any, meetingData: any) {
  const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Meeting Invitation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: #0D7C66; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .meeting-details { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #0D7C66; }
        .join-button { display: inline-block; background: #0D7C66; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📅 Meeting Invitation</h1>
        </div>
        <div class="content">
            <p>Hello ${recipient.name || 'there'},</p>
            
            <p>You're invited to join our upcoming meeting:</p>
            
            <div class="meeting-details">
                <div class="detail-row">
                    <span class="label">Meeting:</span> ${meetingData.title}
                </div>
                ${meetingData.description ? `
                <div class="detail-row">
                    <span class="label">Description:</span> ${meetingData.description}
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="label">Date:</span> ${new Date(meetingData.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                </div>
                <div class="detail-row">
                    <span class="label">Time:</span> ${meetingData.startTime} - ${meetingData.endTime}
                </div>
                ${meetingData.platform ? `
                <div class="detail-row">
                    <span class="label">Platform:</span> ${meetingData.platform.charAt(0).toUpperCase() + meetingData.platform.slice(1)}
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="label">Organizer:</span> ${meetingData.organizerName} (${meetingData.organizerEmail})
                </div>
            </div>
            
            ${meetingData.meetingLink ? `
            <p style="text-align: center;">
                <a href="${meetingData.meetingLink}" class="join-button">🔗 Join Meeting</a>
            </p>
            ` : ''}
            
            <p>We look forward to seeing you there!</p>
            
            <p>Best regards,<br>
            ${meetingData.organizerName}</p>
        </div>
        <div class="footer">
            <p>This is an automated invitation from the Freelancer Task Manager</p>
        </div>
    </div>
</body>
</html>
  `;

  const mailOptions = {
    from: `"${meetingData.organizerName}" <${process.env.EMAIL_USER || 'freelancetasker0@gmail.com'}>`,
    to: recipient.email,
    subject: `📅 Meeting Invitation: ${meetingData.title}`,
    html: emailContent
  };

  console.log(`📤 Sending single email to: ${recipient.email}`);
  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent to ${recipient.email}:`, info.messageId);
  
  return {
    email: recipient.email,
    name: recipient.name,
    status: 'sent',
    messageId: info.messageId
  };
}

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`🚀 Temporary server running on http://localhost:${PORT}`);
  console.log(`📧 Email service configured`);
  console.log(`📁 File uploads enabled`);
  console.log(`🔐 Authentication enabled`);
});
