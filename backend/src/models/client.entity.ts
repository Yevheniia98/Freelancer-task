import mongoose, { Document, Schema } from 'mongoose';

// Client entity similar to TypeORM style
export interface IClientEntity extends Document {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalEarned: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientEntitySchema = new Schema<IClientEntity>({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters'],
    match: [
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please provide a valid phone number'
    ]
  },
  totalEarned: {
    type: Number,
    default: 0,
    min: [0, 'Total earned cannot be negative']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true, // This automatically adds createdAt and updatedAt
  toJSON: {
    virtuals: true,
    transform: function(doc, ret: any) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better performance
ClientEntitySchema.index({ email: 1 }, { unique: true });
ClientEntitySchema.index({ name: 1 });
ClientEntitySchema.index({ totalEarned: -1 });
ClientEntitySchema.index({ createdAt: -1 });
ClientEntitySchema.index({ name: 'text', email: 'text', notes: 'text' }); // For text search

// Virtual for client status based on totalEarned
ClientEntitySchema.virtual('status').get(function(this: IClientEntity) {
  if (this.totalEarned === 0) return 'new';
  if (this.totalEarned < 1000) return 'bronze';
  if (this.totalEarned < 5000) return 'silver';
  if (this.totalEarned < 10000) return 'gold';
  return 'platinum';
});

// Virtual for formatted earnings
ClientEntitySchema.virtual('formattedEarnings').get(function(this: IClientEntity) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.totalEarned);
});

// Pre-save middleware for email validation and normalization
ClientEntitySchema.pre('save', function(this: IClientEntity, next) {
  // Normalize email
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  
  // Normalize phone number (remove spaces and dashes)
  if (this.phone) {
    this.phone = this.phone.replace(/[\s\-\(\)]/g, '');
  }
  
  next();
});

// Instance methods
ClientEntitySchema.methods.addEarnings = function(amount: number) {
  this.totalEarned += amount;
  return this.save();
};

ClientEntitySchema.methods.resetEarnings = function() {
  this.totalEarned = 0;
  return this.save();
};

export const ClientEntity = mongoose.model<IClientEntity>('ClientEntity', ClientEntitySchema);
