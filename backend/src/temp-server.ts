import express, { Request, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import mongoose from "mongoose";

// Import task entity
import { TaskEntity, TaskStatus } from "./models/task.entity";

// Import CRM entities
import { ClientEntity } from "./models/client.entity";
import { CommunicationEntity } from "./models/communication.entity";
import { InvoiceEntity } from "./models/invoice.entity";
import { DealEntity } from "./models/deal.entity";
import { NoteEntity } from "./models/note.entity";

// Load environment variables
dotenv.config();

const app = express();

// MongoDB connection
let isMongoConnected = false;

const connectToMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/freelancer-task';
    await mongoose.connect(mongoUri);
    console.log('📊 Connected to MongoDB');
    isMongoConnected = true;
  } catch (error: any) {
    console.error('⚠️  MongoDB connection failed, using in-memory storage:', error.message);
    isMongoConnected = false;
  }
};

// Initialize MongoDB connection
connectToMongoDB();

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

// In-memory task storage (fallback when MongoDB is not available)
const inMemoryTasks: any[] = [
  {
    _id: '1',
    title: 'Complete Project Setup',
    description: 'Set up the initial project structure and dependencies',
    dueDate: new Date('2024-02-15'),
    priority: 'high',
    status: 'TODO',
    assigneeId: 1,
    projectId: '1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '2', 
    title: 'Implement User Authentication',
    description: 'Create login and registration functionality',
    dueDate: new Date('2024-02-20'),
    priority: 'high',
    status: 'IN_PROGRESS',
    assigneeId: 1,
    projectId: '1',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-18')
  },
  {
    _id: '3',
    title: 'Design Database Schema',
    description: 'Create the database schema for all entities',
    dueDate: new Date('2024-02-10'),
    priority: 'medium',
    status: 'COMPLETED',
    assigneeId: 1,
    projectId: '1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20')
  },
  {
    _id: '4',
    title: 'Write API Documentation',
    description: 'Document all API endpoints and their usage',
    dueDate: new Date('2024-03-01'),
    priority: 'low',
    status: 'TODO',
    assigneeId: 1,
    projectId: '1',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    _id: '5',
    title: 'Code Review and Testing',
    description: 'Review code quality and write comprehensive tests',
    dueDate: new Date('2024-02-25'),
    priority: 'medium',
    status: 'IN_PROGRESS',
    assigneeId: 1,
    projectId: '1',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-25')
  }
];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-make-it-long-and-complex';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'freelancetasker0@gmail.com',
    pass: process.env.SMTP_PASS || 'cflj fcsz jadd gbmy'
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

// General file upload (no restrictions)
const upload = multer({ storage });

// Project file upload with PDF support and size limits
const projectFileUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all previously supported formats plus PDFs
    const allowedTypes = [
      'application/pdf', // PDF files
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/svg+xml', 'image/webp', 'image/tiff',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOC, DOCX
      'text/plain', 'application/rtf', 'application/vnd.oasis.opendocument.text', // TXT, RTF, ODT
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLS, XLSX
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPT, PPTX
      'video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv', // Video formats
      'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed' // Archive formats
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not supported. Supported formats include PDF, images, documents, videos, and archives.`));
    }
  }
});

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
app.post('/api/projects/:id/files', projectFileUpload.single('file'), (req: Request, res: Response) => {
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
    data: fileInfo,
    message: `File uploaded successfully (${(req.file.size / (1024 * 1024)).toFixed(2)}MB)`
  });
});

// Add error handling middleware for file upload errors
app.use((error: any, req: Request, res: Response, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${error.message}`
    });
  }
  
  if (error.message && error.message.includes('File type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
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
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .meeting-details { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #764ba2; }
        .join-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
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
          from: `"${meetingData.organizerName}" <${process.env.SMTP_USER || 'freelancetasker0@gmail.com'}>`,
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
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .meeting-details { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #764ba2; }
        .join-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
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

// ==================== TASK STATISTICS ENDPOINT ====================

// Task Statistics endpoint (protected)
app.get('/api/tasks/statistics', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.user.userId || req.user.id;
    console.log(`📊 Fetching task statistics for user: ${userId}`);

    let tasks: any[] = [];

    if (isMongoConnected) {
      // Use MongoDB
      const userObjectId = new mongoose.Types.ObjectId(userId);
      tasks = await TaskEntity.find({ assigneeId: userObjectId }).lean();
    } else {
      // Use in-memory storage
      tasks = inMemoryTasks.filter(task => task.assigneeId === userId);
    }
    
    console.log(`📋 Found ${tasks.length} tasks for user ${userId}`);

    // Calculate statistics
    const totalTasks = tasks.length;
    
    const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
    const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS').length;
    const pendingTasks = tasks.filter(task => 
      task.status === 'TODO' || 
      task.status === 'IN_REVIEW'
    ).length;
    const cancelledTasks = tasks.filter(task => task.status === 'CANCELLED').length;
    
    // Calculate completion rate
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Additional useful statistics
    const overdueTasks = tasks.filter(task => {
      if (!task.dueDate || task.status === 'COMPLETED') return false;
      return new Date() > new Date(task.dueDate);
    }).length;
    
    const dueSoonTasks = tasks.filter(task => {
      if (!task.dueDate || task.status === 'COMPLETED') return false;
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const dueDate = new Date(task.dueDate);
      return dueDate <= tomorrow && dueDate > now;
    }).length;

    // Priority breakdown
    const priorityBreakdown = {
      urgent: tasks.filter(task => task.priority === 'urgent' && task.status !== 'COMPLETED').length,
      high: tasks.filter(task => task.priority === 'high' && task.status !== 'COMPLETED').length,
      medium: tasks.filter(task => task.priority === 'medium' && task.status !== 'COMPLETED').length,
      low: tasks.filter(task => task.priority === 'low' && task.status !== 'COMPLETED').length
    };

    // Recent activity (tasks updated in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentlyUpdatedTasks = tasks.filter(task => 
      new Date(task.updatedAt) >= sevenDaysAgo
    ).length;

    const statistics = {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      cancelledTasks,
      completionRate,
      overdueCount: overdueTasks,
      dueSoonTasks,
      priorityBreakdown,
      recentlyUpdatedTasks,
      // Additional metadata
      lastUpdated: new Date().toISOString(),
      userId: req.user.userId || req.user.id,
      userName: req.user.email,
      dataSource: isMongoConnected ? 'MongoDB' : 'In-Memory'
    };

    console.log(`✅ Task statistics calculated:`, {
      totalTasks,
      completedTasks,
      completionRate: `${completionRate}%`,
      overdueCount: overdueTasks,
      dueSoonTasks
    });

    res.json({
      success: true,
      data: statistics,
      message: 'Task statistics retrieved successfully'
    });

  } catch (error) {
    console.error('❌ Error fetching task statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching task statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ==================== ADDITIONAL TASK ENDPOINTS ====================

// Get user's tasks (for debugging/verification)
app.get('/api/tasks/my-tasks', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.user.userId || req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const priority = req.query.priority as string;

    console.log(`📋 Fetching tasks for user: ${userId}, page: ${page}, limit: ${limit}`);

    let tasks: any[] = [];
    let totalTasks = 0;

    if (isMongoConnected) {
      // Use MongoDB
      const userObjectId = new mongoose.Types.ObjectId(userId);
      
      // Build query
      let query: any = { assigneeId: userObjectId };
      
      if (status) {
        query.status = status;
      }
      
      if (priority) {
        query.priority = priority;
      }

      // Get tasks with pagination
      tasks = await TaskEntity.find(query)
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .populate('projectId', 'title')
        .lean();

      totalTasks = await TaskEntity.countDocuments(query);
    } else {
      // Use in-memory storage
      let filteredTasks = inMemoryTasks.filter(task => task.assigneeId === userId);
      
      // Apply filters
      if (status) {
        filteredTasks = filteredTasks.filter(task => task.status === status);
      }
      
      if (priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === priority);
      }

      // Sort by updated date (newest first)
      filteredTasks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      // Apply pagination
      totalTasks = filteredTasks.length;
      const startIndex = (page - 1) * limit;
      tasks = filteredTasks.slice(startIndex, startIndex + limit);
    }

    const totalPages = Math.ceil(totalTasks / limit);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page,
          limit,
          totalCount: totalTasks,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        currentPage: page
      },
      message: 'Tasks retrieved successfully',
      dataSource: isMongoConnected ? 'MongoDB' : 'In-Memory'
    });

  } catch (error) {
    console.error('❌ Error fetching user tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching tasks',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create a new task
app.post('/api/tasks', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.user.userId || req.user.id;
    console.log(`📝 Creating new task for user: ${userId}`);
    
    const { title, description, priority, status, dueDate, project, clientName } = req.body;
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }
    
    if (isMongoConnected) {
      // Use MongoDB
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const projectObjectId = new mongoose.Types.ObjectId(); // Generate a project ID or use existing
      
      const newTask = new TaskEntity({
        title,
        description: description || '',
        priority: priority || 'medium',
        status: status || 'TODO',
        assigneeId: userObjectId,
        projectId: projectObjectId,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const savedTask = await newTask.save();
      
      res.status(201).json({
        success: true,
        data: savedTask,
        message: 'Task created successfully'
      });
    } else {
      // Use in-memory storage
      const newTask = {
        _id: (inMemoryTasks.length + 1).toString(),
        title,
        description: description || '',
        priority: priority || 'medium',
        status: status || 'TODO',
        assigneeId: userId,
        projectId: '1', // Default project
        dueDate: dueDate ? new Date(dueDate) : null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      inMemoryTasks.push(newTask);
      
      res.status(201).json({
        success: true,
        data: newTask,
        message: 'Task created successfully (in-memory)',
        dataSource: 'In-Memory'
      });
    }
    
  } catch (error: any) {
    console.error('❌ Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
});

// Create a sample task (for testing)
app.post('/api/tasks/create-sample', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    // Create a sample project ID (you might want to adjust this)
    const sampleProjectId = new mongoose.Types.ObjectId();
    
    const sampleTasks = [
      {
        title: 'Complete project proposal',
        description: 'Write and submit the project proposal for Q4 initiatives',
        priority: 'high',
        status: TaskStatus.IN_PROGRESS,
        assigneeId: userObjectId,
        projectId: sampleProjectId,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      },
      {
        title: 'Review client feedback',
        description: 'Analyze client feedback and prepare response document',
        priority: 'medium',
        status: TaskStatus.TODO,
        assigneeId: userObjectId,
        projectId: sampleProjectId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      {
        title: 'Update documentation',
        description: 'Update project documentation with latest changes',
        priority: 'low',
        status: TaskStatus.COMPLETED,
        assigneeId: userObjectId,
        projectId: sampleProjectId,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        title: 'Prepare presentation',
        description: 'Create presentation slides for stakeholder meeting',
        priority: 'urgent',
        status: TaskStatus.IN_REVIEW,
        assigneeId: userObjectId,
        projectId: sampleProjectId,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day from now
      }
    ];

    const createdTasks = await TaskEntity.insertMany(sampleTasks);
    
    console.log(`✅ Created ${createdTasks.length} sample tasks for user ${userId}`);

    res.json({
      success: true,
      data: {
        tasksCreated: createdTasks.length,
        tasks: createdTasks
      },
      message: 'Sample tasks created successfully'
    });

  } catch (error) {
    console.error('❌ Error creating sample tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating sample tasks',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update an existing task
app.put('/api/tasks/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.userId || req.user.id;
    const { title, description, priority, status, dueDate } = req.body;
    
    console.log(`📝 Updating task ${taskId} for user: ${userId}`);
    
    if (isMongoConnected) {
      // Use MongoDB
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const taskObjectId = new mongoose.Types.ObjectId(taskId);
      
      const updatedTask = await TaskEntity.findOneAndUpdate(
        { _id: taskObjectId, assigneeId: userObjectId },
        {
          title,
          description,
          priority,
          status,
          dueDate: dueDate ? new Date(dueDate) : null,
          updatedAt: new Date()
        },
        { new: true }
      );
      
      if (!updatedTask) {
        return res.status(404).json({
          success: false,
          message: 'Task not found or not authorized'
        });
      }
      
      res.json({
        success: true,
        data: updatedTask,
        message: 'Task updated successfully'
      });
    } else {
      // Use in-memory storage
      const taskIndex = inMemoryTasks.findIndex(task => 
        task._id === taskId && task.assigneeId === userId
      );
      
      if (taskIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Task not found or not authorized'
        });
      }
      
      inMemoryTasks[taskIndex] = {
        ...inMemoryTasks[taskIndex],
        title: title || inMemoryTasks[taskIndex].title,
        description: description || inMemoryTasks[taskIndex].description,
        priority: priority || inMemoryTasks[taskIndex].priority,
        status: status || inMemoryTasks[taskIndex].status,
        dueDate: dueDate ? new Date(dueDate) : inMemoryTasks[taskIndex].dueDate,
        updatedAt: new Date()
      };
      
      res.json({
        success: true,
        data: inMemoryTasks[taskIndex],
        message: 'Task updated successfully (in-memory)',
        dataSource: 'In-Memory'
      });
    }
    
  } catch (error: any) {
    console.error('❌ Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: error.message
    });
  }
});

// Delete a task
app.delete('/api/tasks/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.userId || req.user.id;
    
    console.log(`🗑️ Deleting task ${taskId} for user: ${userId}`);
    
    if (isMongoConnected) {
      // Use MongoDB
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const taskObjectId = new mongoose.Types.ObjectId(taskId);
      
      const deletedTask = await TaskEntity.findOneAndDelete({
        _id: taskObjectId,
        assigneeId: userObjectId
      });
      
      if (!deletedTask) {
        return res.status(404).json({
          success: false,
          message: 'Task not found or not authorized'
        });
      }
      
      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } else {
      // Use in-memory storage
      const taskIndex = inMemoryTasks.findIndex(task => 
        task._id === taskId && task.assigneeId === userId
      );
      
      if (taskIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Task not found or not authorized'
        });
      }
      
      inMemoryTasks.splice(taskIndex, 1);
      
      res.json({
        success: true,
        message: 'Task deleted successfully (in-memory)',
        dataSource: 'In-Memory'
      });
    }
    
  } catch (error: any) {
    console.error('❌ Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message
    });
  }
});

// ====================================
// CRM API ENDPOINTS
// ====================================

// === CLIENTS ENDPOINTS ===

// Get all clients
app.get('/api/clients', authenticateToken, async (req: any, res: Response) => {
  try {
    const clients = await ClientEntity.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error: any) {
    console.error('❌ Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Get client by ID
app.get('/api/clients/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const client = await ClientEntity.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error: any) {
    console.error('❌ Error fetching client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// Create new client
app.post('/api/clients', authenticateToken, async (req: any, res: Response) => {
  try {
    const { name, email, phone, notes } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const client = new ClientEntity({
      name,
      email,
      phone,
      notes
    });

    await client.save();
    res.status(201).json(client);
  } catch (error: any) {
    console.error('❌ Error creating client:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Client with this email already exists' });
    }
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Update client
app.put('/api/clients/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const { name, email, phone, notes } = req.body;
    
    const client = await ClientEntity.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, notes },
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (error: any) {
    console.error('❌ Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// Delete client
app.delete('/api/clients/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const client = await ClientEntity.findByIdAndDelete(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (error: any) {
    console.error('❌ Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// === COMMUNICATIONS ENDPOINTS ===

// Get all communications for a client
app.get('/api/clients/:clientId/communications', authenticateToken, async (req: any, res: Response) => {
  try {
    const communications = await CommunicationEntity.findByClient(req.params.clientId);
    res.json(communications);
  } catch (error: any) {
    console.error('❌ Error fetching communications:', error);
    res.status(500).json({ error: 'Failed to fetch communications' });
  }
});

// Get all communications
app.get('/api/communications', authenticateToken, async (req: any, res: Response) => {
  try {
    const { type, clientId, isImportant } = req.query;
    const filter: any = {};
    
    if (type) filter.type = type;
    if (clientId) filter.clientId = clientId;
    if (isImportant !== undefined) filter.isImportant = isImportant === 'true';

    const communications = await CommunicationEntity.find(filter).sort({ date: -1 });
    res.json(communications);
  } catch (error: any) {
    console.error('❌ Error fetching communications:', error);
    res.status(500).json({ error: 'Failed to fetch communications' });
  }
});

// Create new communication
app.post('/api/communications', authenticateToken, async (req: any, res: Response) => {
  try {
    const { clientId, type, direction, subject, content, date, duration, platform, tags, isImportant } = req.body;

    if (!clientId || !type || !direction || !content) {
      return res.status(400).json({ error: 'Client ID, type, direction, and content are required' });
    }

    const communication = new CommunicationEntity({
      clientId,
      type,
      direction,
      subject,
      content,
      date: date ? new Date(date) : new Date(),
      duration,
      platform,
      tags,
      isImportant: isImportant || false
    });

    await communication.save();
    res.status(201).json(communication);
  } catch (error: any) {
    console.error('❌ Error creating communication:', error);
    res.status(500).json({ error: 'Failed to create communication' });
  }
});

// Update communication
app.put('/api/communications/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const { subject, content, tags, isImportant } = req.body;
    
    const communication = await CommunicationEntity.findByIdAndUpdate(
      req.params.id,
      { subject, content, tags, isImportant },
      { new: true, runValidators: true }
    );

    if (!communication) {
      return res.status(404).json({ error: 'Communication not found' });
    }

    res.json(communication);
  } catch (error: any) {
    console.error('❌ Error updating communication:', error);
    res.status(500).json({ error: 'Failed to update communication' });
  }
});

// Delete communication
app.delete('/api/communications/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const communication = await CommunicationEntity.findByIdAndDelete(req.params.id);
    
    if (!communication) {
      return res.status(404).json({ error: 'Communication not found' });
    }

    res.json({ message: 'Communication deleted successfully' });
  } catch (error: any) {
    console.error('❌ Error deleting communication:', error);
    res.status(500).json({ error: 'Failed to delete communication' });
  }
});

// === INVOICES ENDPOINTS ===

// Get all invoices
app.get('/api/invoices', authenticateToken, async (req: any, res: Response) => {
  try {
    const { status, clientId } = req.query;
    const filter: any = {};
    
    if (status) filter.status = status;
    if (clientId) filter.clientId = clientId;

    const invoices = await InvoiceEntity.find(filter).sort({ issueDate: -1 });
    res.json(invoices);
  } catch (error: any) {
    console.error('❌ Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Get invoices for a client
app.get('/api/clients/:clientId/invoices', authenticateToken, async (req: any, res: Response) => {
  try {
    const invoices = await InvoiceEntity.findByClient(req.params.clientId);
    res.json(invoices);
  } catch (error: any) {
    console.error('❌ Error fetching client invoices:', error);
    res.status(500).json({ error: 'Failed to fetch client invoices' });
  }
});

// Get invoice by ID
app.get('/api/invoices/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const invoice = await InvoiceEntity.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error: any) {
    console.error('❌ Error fetching invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// Create new invoice
app.post('/api/invoices', authenticateToken, async (req: any, res: Response) => {
  try {
    const { 
      clientId, 
      projectId, 
      title, 
      description, 
      amount, 
      currency, 
      issueDate, 
      dueDate,
      taxRate,
      discountRate,
      notes 
    } = req.body;

    if (!clientId || !title || !amount || !issueDate || !dueDate) {
      return res.status(400).json({ error: 'Client ID, title, amount, issue date, and due date are required' });
    }

    const invoice = new InvoiceEntity({
      clientId,
      projectId,
      title,
      description,
      amount,
      currency: currency || 'USD',
      issueDate: new Date(issueDate),
      dueDate: new Date(dueDate),
      taxRate: taxRate || 0,
      discountRate: discountRate || 0,
      notes
    });

    await invoice.save();
    res.status(201).json(invoice);
  } catch (error: any) {
    console.error('❌ Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Update invoice
app.put('/api/invoices/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const { 
      title, 
      description, 
      amount, 
      currency, 
      dueDate,
      taxRate,
      discountRate,
      notes,
      status
    } = req.body;
    
    const invoice = await InvoiceEntity.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        description, 
        amount, 
        currency, 
        dueDate: dueDate ? new Date(dueDate) : undefined,
        taxRate,
        discountRate,
        notes,
        status
      },
      { new: true, runValidators: true }
    );

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error: any) {
    console.error('❌ Error updating invoice:', error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// Mark invoice as paid
app.post('/api/invoices/:id/mark-paid', authenticateToken, async (req: any, res: Response) => {
  try {
    const { amount, paymentMethod, paymentReference } = req.body;
    
    const invoice = await InvoiceEntity.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    await invoice.markAsPaid(amount, paymentMethod, paymentReference);
    res.json(invoice);
  } catch (error: any) {
    console.error('❌ Error marking invoice as paid:', error);
    res.status(500).json({ error: 'Failed to mark invoice as paid' });
  }
});

// Delete invoice
app.delete('/api/invoices/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const invoice = await InvoiceEntity.findByIdAndDelete(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error: any) {
    console.error('❌ Error deleting invoice:', error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

// Get invoice statistics
app.get('/api/invoices/statistics', authenticateToken, async (req: any, res: Response) => {
  try {
    const [totalRevenue] = await InvoiceEntity.getTotalRevenue();
    const overdueInvoices = await InvoiceEntity.findOverdue();
    const pendingInvoices = await InvoiceEntity.find({ status: { $in: ['sent', 'viewed'] } });
    
    const stats = {
      totalRevenue: totalRevenue?.total || 0,
      overdueCount: overdueInvoices.length,
      pendingCount: pendingInvoices.length,
      overdueAmount: overdueInvoices.reduce((sum: number, inv: any) => sum + inv.total, 0),
      pendingAmount: pendingInvoices.reduce((sum: number, inv: any) => sum + inv.total, 0)
    };

    res.json(stats);
  } catch (error: any) {
    console.error('❌ Error fetching invoice statistics:', error);
    res.status(500).json({ error: 'Failed to fetch invoice statistics' });
  }
});

// === DEALS ENDPOINTS ===

// Get all deals
app.get('/api/deals', authenticateToken, async (req: any, res: Response) => {
  try {
    const { stage, clientId, priority } = req.query;
    const filter: any = {};
    
    if (stage) filter.stage = stage;
    if (clientId) filter.clientId = clientId;
    if (priority) filter.priority = priority;

    const deals = await DealEntity.find(filter).sort({ updatedAt: -1 });
    res.json(deals);
  } catch (error: any) {
    console.error('❌ Error fetching deals:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// Get deals by stage (for pipeline view)
app.get('/api/deals/pipeline', authenticateToken, async (req: any, res: Response) => {
  try {
    const pipeline = await DealEntity.aggregate([
      { $match: { stage: { $nin: ['closed_won', 'closed_lost'] } } },
      { 
        $group: { 
          _id: '$stage',
          deals: { $push: '$$ROOT' },
          totalValue: { $sum: '$value' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json(pipeline);
  } catch (error: any) {
    console.error('❌ Error fetching pipeline:', error);
    res.status(500).json({ error: 'Failed to fetch pipeline' });
  }
});

// Get deals for a client
app.get('/api/clients/:clientId/deals', authenticateToken, async (req: any, res: Response) => {
  try {
    const deals = await DealEntity.findByClient(req.params.clientId);
    res.json(deals);
  } catch (error: any) {
    console.error('❌ Error fetching client deals:', error);
    res.status(500).json({ error: 'Failed to fetch client deals' });
  }
});

// Create new deal
app.post('/api/deals', authenticateToken, async (req: any, res: Response) => {
  try {
    const { 
      clientId, 
      title, 
      description, 
      value, 
      currency, 
      expectedCloseDate,
      source,
      priority,
      tags
    } = req.body;

    if (!clientId || !title || !value || !source) {
      return res.status(400).json({ error: 'Client ID, title, value, and source are required' });
    }

    const deal = new DealEntity({
      clientId,
      title,
      description,
      value,
      currency: currency || 'USD',
      expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : undefined,
      source,
      priority: priority || 'medium',
      tags
    });

    await deal.save();
    res.status(201).json(deal);
  } catch (error: any) {
    console.error('❌ Error creating deal:', error);
    res.status(500).json({ error: 'Failed to create deal' });
  }
});

// Update deal
app.put('/api/deals/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const deal = await DealEntity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.json(deal);
  } catch (error: any) {
    console.error('❌ Error updating deal:', error);
    res.status(500).json({ error: 'Failed to update deal' });
  }
});

// Move deal to stage
app.post('/api/deals/:id/move-stage', authenticateToken, async (req: any, res: Response) => {
  try {
    const { stage, probability } = req.body;
    
    const deal = await DealEntity.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    await deal.moveToStage(stage, probability);
    res.json(deal);
  } catch (error: any) {
    console.error('❌ Error moving deal stage:', error);
    res.status(500).json({ error: 'Failed to move deal stage' });
  }
});

// Close deal as won
app.post('/api/deals/:id/close-won', authenticateToken, async (req: any, res: Response) => {
  try {
    const deal = await DealEntity.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    await deal.closeWon();
    res.json(deal);
  } catch (error: any) {
    console.error('❌ Error closing deal as won:', error);
    res.status(500).json({ error: 'Failed to close deal as won' });
  }
});

// Close deal as lost
app.post('/api/deals/:id/close-lost', authenticateToken, async (req: any, res: Response) => {
  try {
    const { reason } = req.body;
    
    const deal = await DealEntity.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    await deal.closeLost(reason);
    res.json(deal);
  } catch (error: any) {
    console.error('❌ Error closing deal as lost:', error);
    res.status(500).json({ error: 'Failed to close deal as lost' });
  }
});

// Add activity to deal
app.post('/api/deals/:id/activities', authenticateToken, async (req: any, res: Response) => {
  try {
    const { type, description, date, completed } = req.body;
    
    const deal = await DealEntity.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    await deal.addActivity({ type, description, date: date ? new Date(date) : new Date(), completed });
    res.json(deal);
  } catch (error: any) {
    console.error('❌ Error adding deal activity:', error);
    res.status(500).json({ error: 'Failed to add deal activity' });
  }
});

// Delete deal
app.delete('/api/deals/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const deal = await DealEntity.findByIdAndDelete(req.params.id);
    
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.json({ message: 'Deal deleted successfully' });
  } catch (error: any) {
    console.error('❌ Error deleting deal:', error);
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});

// === NOTES ENDPOINTS ===

// Get all notes
app.get('/api/notes', authenticateToken, async (req: any, res: Response) => {
  try {
    const { type, status, clientId, priority } = req.query;
    const filter: any = {};
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (clientId) filter.clientId = clientId;
    if (priority) filter.priority = priority;

    const notes = await NoteEntity.find(filter).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error: any) {
    console.error('❌ Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Get notes for a client
app.get('/api/clients/:clientId/notes', authenticateToken, async (req: any, res: Response) => {
  try {
    const notes = await NoteEntity.findByClient(req.params.clientId);
    res.json(notes);
  } catch (error: any) {
    console.error('❌ Error fetching client notes:', error);
    res.status(500).json({ error: 'Failed to fetch client notes' });
  }
});

// Get reminders that need to be sent
app.get('/api/notes/reminders', authenticateToken, async (req: any, res: Response) => {
  try {
    const reminders = await NoteEntity.findRemindersToSend();
    res.json(reminders);
  } catch (error: any) {
    console.error('❌ Error fetching reminders:', error);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

// Get overdue notes
app.get('/api/notes/overdue', authenticateToken, async (req: any, res: Response) => {
  try {
    const overdue = await NoteEntity.findOverdue();
    res.json(overdue);
  } catch (error: any) {
    console.error('❌ Error fetching overdue notes:', error);
    res.status(500).json({ error: 'Failed to fetch overdue notes' });
  }
});

// Create new note
app.post('/api/notes', authenticateToken, async (req: any, res: Response) => {
  try {
    const { 
      clientId, 
      projectId, 
      dealId, 
      type, 
      title, 
      content, 
      priority, 
      tags,
      reminderDate,
      dueDate,
      color
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const note = new NoteEntity({
      clientId,
      projectId,
      dealId,
      type: type || 'note',
      title,
      content,
      priority: priority || 'medium',
      tags,
      reminderDate: reminderDate ? new Date(reminderDate) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      color
    });

    await note.save();
    res.status(201).json(note);
  } catch (error: any) {
    console.error('❌ Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update note
app.put('/api/notes/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const note = await NoteEntity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error: any) {
    console.error('❌ Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Mark note as completed
app.post('/api/notes/:id/complete', authenticateToken, async (req: any, res: Response) => {
  try {
    const note = await NoteEntity.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await note.markAsCompleted();
    res.json(note);
  } catch (error: any) {
    console.error('❌ Error completing note:', error);
    res.status(500).json({ error: 'Failed to complete note' });
  }
});

// Archive note
app.post('/api/notes/:id/archive', authenticateToken, async (req: any, res: Response) => {
  try {
    const note = await NoteEntity.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await note.archive();
    res.json(note);
  } catch (error: any) {
    console.error('❌ Error archiving note:', error);
    res.status(500).json({ error: 'Failed to archive note' });
  }
});

// Delete note
app.delete('/api/notes/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const note = await NoteEntity.findByIdAndDelete(req.params.id);
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error: any) {
    console.error('❌ Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Team invitation endpoint
app.post('/api/team/invitations/send', async (req: any, res: Response) => {
  try {
    const { emails, message } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Email addresses are required'
      });
    }

    console.log('📧 Sending team invitations to:', emails);
    console.log('📝 Message:', message);

    // Set up nodemailer with Gmail
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Send real emails
    const results = [];
    const successfulEmails = [];
    const failedEmails = [];

    for (const email of emails) {
      try {
        const inviteLink = `http://localhost:8080/my-team?invited=${encodeURIComponent(email)}`;
        
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 You're Invited!</h1>
              <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Join our team workspace</p>
            </div>
            
            <div style="padding: 20px; background: #f9f9f9; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">Hi there! 👋</h2>
              <p style="color: #666; line-height: 1.6; font-size: 16px;">
                ${message || 'You have been invited to join our team workspace. We would love to have you collaborate with us!'}
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteLink}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        font-size: 16px; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                🚀 Join Team Workspace
              </a>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #999; font-size: 14px;">
              <p>If the button doesn't work, copy and paste this link in your browser:</p>
              <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px;">
                ${inviteLink}
              </p>
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"Team Workspace" <${process.env.SMTP_USER}>`,
          to: email,
          subject: '🎉 You\'re invited to join our team!',
          html: emailHtml,
          text: `Hi there!\n\n${message || 'You have been invited to join our team workspace.'}\n\nClick this link to join: ${inviteLink}`
        });

        console.log(`✅ Email sent successfully to ${email}`);
        results.push({ email, success: true, inviteLink });
        successfulEmails.push(email);

      } catch (emailError: any) {
        console.error(`❌ Failed to send email to ${email}:`, emailError.message);
        results.push({ email, success: false, error: emailError.message });
        failedEmails.push(email);
      }
    }

    res.json({
      success: true,
      message: `Successfully sent ${successfulEmails.length} invitation(s)${failedEmails.length > 0 ? ` (${failedEmails.length} failed)` : ''}`,
      summary: {
        total: emails.length,
        invited: successfulEmails.length,
        failed: failedEmails.length,
        results
      }
    });

  } catch (error: any) {
    console.error('❌ Error sending team invitations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send invitations',
      error: error.message
    });
  }
});

// =====================================
// NOTIFICATION ENDPOINTS (In-Memory)
// =====================================

// In-memory notifications storage
interface TempNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  isRead: boolean;
  createdAt: Date;
  metadata?: any;
}

const inMemoryNotifications: TempNotification[] = [];

// Health check for notifications
app.get('/api/notifications/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Notification service is healthy',
    timestamp: new Date().toISOString()
  });
});

// Get user notifications
app.get('/api/notifications', authenticateToken, (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const unreadOnly = req.query.unreadOnly === 'true';

    let userNotifications = inMemoryNotifications.filter(n => n.userId === userId.toString());
    
    if (unreadOnly) {
      userNotifications = userNotifications.filter(n => !n.isRead);
    }

    // Sort by creation date (newest first)
    userNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotifications = userNotifications.slice(startIndex, endIndex);

    res.json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: paginatedNotifications,
      pagination: {
        page,
        limit,
        total: userNotifications.length,
        hasMore: endIndex < userNotifications.length
      }
    });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications'
    });
  }
});

// Get notification stats
app.get('/api/notifications/stats', authenticateToken, (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const userNotifications = inMemoryNotifications.filter(n => n.userId === userId.toString());
    const unreadCount = userNotifications.filter(n => !n.isRead).length;

    res.json({
      success: true,
      message: 'Notification statistics retrieved successfully',
      data: {
        total: userNotifications.length,
        unread: unreadCount
      }
    });
  } catch (error: any) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notification statistics'
    });
  }
});

// Create notification
app.post('/api/notifications', authenticateToken, (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { title, message, type, priority, metadata } = req.body;

    if (!title || !message || !type) {
      return res.status(400).json({
        success: false,
        message: 'Title, message, and type are required'
      });
    }

    const notification: TempNotification = {
      id: Date.now().toString(),
      userId: userId.toString(),
      title,
      message,
      type,
      priority: priority || 'medium',
      isRead: false,
      createdAt: new Date(),
      metadata: metadata || {}
    };

    inMemoryNotifications.push(notification);
    console.log(`✅ Notification created: ${title} for user ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error: any) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification'
    });
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', authenticateToken, (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = inMemoryNotifications.find(n => 
      n.id === notificationId && n.userId === userId.toString()
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.isRead = true;

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error: any) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
});

// Mark all notifications as read
app.put('/api/notifications/read-all', authenticateToken, (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    let count = 0;

    inMemoryNotifications.forEach(notification => {
      if (notification.userId === userId.toString() && !notification.isRead) {
        notification.isRead = true;
        count++;
      }
    });

    res.json({
      success: true,
      message: `${count} notifications marked as read`,
      data: { count }
    });
  } catch (error: any) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
});

// Delete notification
app.delete('/api/notifications/:id', authenticateToken, (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const index = inMemoryNotifications.findIndex(n => 
      n.id === notificationId && n.userId === userId.toString()
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    inMemoryNotifications.splice(index, 1);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
});

// Clear all notifications
app.post('/api/notifications/clear-all', authenticateToken, (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const initialLength = inMemoryNotifications.length;
    
    // Remove all notifications for this user
    const filtered = inMemoryNotifications.filter(n => n.userId !== userId.toString());
    const removedCount = initialLength - filtered.length;
    
    // Clear the array and repopulate with filtered results
    inMemoryNotifications.length = 0;
    inMemoryNotifications.push(...filtered);

    res.json({
      success: true,
      message: `${removedCount} notifications cleared successfully`,
      data: { count: removedCount }
    });
  } catch (error: any) {
    console.error('Clear all notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear all notifications'
    });
  }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🚀 Temporary server running on http://localhost:${PORT}`);
  console.log(`📧 Email service configured`);
  console.log(`📁 File uploads enabled`);
  console.log(`🔐 Authentication enabled`);
});
