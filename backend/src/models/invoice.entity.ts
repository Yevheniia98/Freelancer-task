import mongoose, { Document, Schema, Model } from 'mongoose';

// Invoice entity for managing invoices and payments
export interface IInvoiceEntity extends Document {
  id: string;
  clientId: string;
  projectId?: string;
  invoiceNumber: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  paidAmount?: number;
  paymentMethod?: string;
  paymentReference?: string;
  taxRate?: number;
  taxAmount?: number;
  discountRate?: number;
  discountAmount?: number;
  subtotal: number;
  total: number;
  notes?: string;
  attachments?: string[];
  reminderSent?: Date;
  reminderCount: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  markAsPaid(amount?: number, method?: string, reference?: string): Promise<IInvoiceEntity>;
  markAsViewed(): Promise<IInvoiceEntity>;
  sendReminder(): Promise<IInvoiceEntity>;
}

// Static methods interface
export interface IInvoiceModel extends Model<IInvoiceEntity> {
  findByClient(clientId: string): Promise<IInvoiceEntity[]>;
  findByStatus(status: string): Promise<IInvoiceEntity[]>;
  findOverdue(): Promise<IInvoiceEntity[]>;
  getTotalRevenue(clientId?: string): Promise<any[]>;
}

const InvoiceEntitySchema = new Schema<IInvoiceEntity>({
  clientId: {
    type: String,
    required: [true, 'Client ID is required'],
    index: true
  },
  projectId: {
    type: String,
    index: true
  },
  invoiceNumber: {
    type: String,
    required: [true, 'Invoice number is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Invoice number cannot exceed 50 characters']
  },
  title: {
    type: String,
    required: [true, 'Invoice title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    uppercase: true
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'],
    default: 'draft',
    index: true
  },
  issueDate: {
    type: Date,
    required: [true, 'Issue date is required'],
    index: true
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    index: true
  },
  paidDate: {
    type: Date
  },
  paidAmount: {
    type: Number,
    min: [0, 'Paid amount cannot be negative']
  },
  paymentMethod: {
    type: String,
    trim: true,
    enum: ['bank_transfer', 'paypal', 'stripe', 'cash', 'check', 'crypto', 'other']
  },
  paymentReference: {
    type: String,
    trim: true,
    maxlength: [100, 'Payment reference cannot exceed 100 characters']
  },
  taxRate: {
    type: Number,
    min: [0, 'Tax rate cannot be negative'],
    max: [100, 'Tax rate cannot exceed 100%'],
    default: 0
  },
  taxAmount: {
    type: Number,
    min: [0, 'Tax amount cannot be negative'],
    default: 0
  },
  discountRate: {
    type: Number,
    min: [0, 'Discount rate cannot be negative'],
    max: [100, 'Discount rate cannot exceed 100%'],
    default: 0
  },
  discountAmount: {
    type: Number,
    min: [0, 'Discount amount cannot be negative'],
    default: 0
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative']
  },
  total: {
    type: Number,
    required: [true, 'Total is required'],
    min: [0, 'Total cannot be negative']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  attachments: [{
    type: String,
    trim: true
  }],
  reminderSent: {
    type: Date
  },
  reminderCount: {
    type: Number,
    default: 0,
    min: [0, 'Reminder count cannot be negative']
  }
}, {
  timestamps: true,
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
InvoiceEntitySchema.index({ clientId: 1, issueDate: -1 });
InvoiceEntitySchema.index({ status: 1, dueDate: 1 });
InvoiceEntitySchema.index({ invoiceNumber: 1 }, { unique: true });
InvoiceEntitySchema.index({ projectId: 1 });
InvoiceEntitySchema.index({ total: -1 });
InvoiceEntitySchema.index({ 
  title: 'text', 
  description: 'text',
  invoiceNumber: 'text' 
}); // For text search

// Virtual for formatted amounts
InvoiceEntitySchema.virtual('formattedAmount').get(function(this: IInvoiceEntity) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount);
});

InvoiceEntitySchema.virtual('formattedTotal').get(function(this: IInvoiceEntity) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.total);
});

InvoiceEntitySchema.virtual('formattedSubtotal').get(function(this: IInvoiceEntity) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.subtotal);
});

// Virtual for days overdue
InvoiceEntitySchema.virtual('daysOverdue').get(function(this: IInvoiceEntity) {
  if (this.status === 'paid' || !this.dueDate) return 0;
  
  const today = new Date();
  const diffTime = today.getTime() - this.dueDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
});

// Virtual for payment status
InvoiceEntitySchema.virtual('paymentStatus').get(function(this: IInvoiceEntity) {
  if (this.status === 'paid') return 'paid';
  
  // Calculate days overdue
  const today = new Date();
  const diffTime = today.getTime() - this.dueDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const daysOverdue = diffDays > 0 ? diffDays : 0;
  
  if (daysOverdue > 0) return 'overdue';
  if (this.status === 'sent' || this.status === 'viewed') return 'pending';
  return 'draft';
});

// Virtual for remaining amount
InvoiceEntitySchema.virtual('remainingAmount').get(function(this: IInvoiceEntity) {
  return this.total - (this.paidAmount || 0);
});

// Pre-save middleware
InvoiceEntitySchema.pre('save', function(this: IInvoiceEntity, next) {
  // Calculate tax amount if tax rate is provided
  if (this.taxRate && this.taxRate > 0) {
    this.taxAmount = (this.amount * this.taxRate) / 100;
  }
  
  // Calculate discount amount if discount rate is provided
  if (this.discountRate && this.discountRate > 0) {
    this.discountAmount = (this.amount * this.discountRate) / 100;
  }
  
  // Calculate subtotal
  this.subtotal = this.amount - (this.discountAmount || 0);
  
  // Calculate total
  this.total = this.subtotal + (this.taxAmount || 0);
  
  // Auto-generate invoice number if not provided
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.invoiceNumber = `INV-${year}${month}-${random}`;
  }
  
  // Update status based on payment
  if (this.paidAmount && this.paidAmount >= this.total && this.status !== 'paid') {
    this.status = 'paid';
    this.paidDate = new Date();
  }
  
  // Check if overdue
  if (this.status !== 'paid' && this.status !== 'cancelled' && this.dueDate < new Date()) {
    this.status = 'overdue';
  }
  
  next();
});

// Instance methods
InvoiceEntitySchema.methods.markAsPaid = function(amount?: number, method?: string, reference?: string) {
  this.status = 'paid';
  this.paidDate = new Date();
  this.paidAmount = amount || this.total;
  if (method) this.paymentMethod = method;
  if (reference) this.paymentReference = reference;
  return this.save();
};

InvoiceEntitySchema.methods.markAsViewed = function() {
  if (this.status === 'sent') {
    this.status = 'viewed';
    return this.save();
  }
  return this;
};

InvoiceEntitySchema.methods.sendReminder = function() {
  this.reminderSent = new Date();
  this.reminderCount += 1;
  return this.save();
};

// Static methods
InvoiceEntitySchema.statics.findByClient = function(clientId: string) {
  return this.find({ clientId }).sort({ issueDate: -1 });
};

InvoiceEntitySchema.statics.findByStatus = function(status: string) {
  return this.find({ status }).sort({ issueDate: -1 });
};

InvoiceEntitySchema.statics.findOverdue = function() {
  return this.find({ 
    status: { $in: ['sent', 'viewed', 'overdue'] },
    dueDate: { $lt: new Date() }
  }).sort({ dueDate: 1 });
};

InvoiceEntitySchema.statics.getTotalRevenue = function(clientId?: string) {
  const match: any = { status: 'paid' };
  if (clientId) match.clientId = clientId;
  
  return this.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);
};

export const InvoiceEntity = mongoose.model<IInvoiceEntity, IInvoiceModel>('InvoiceEntity', InvoiceEntitySchema);
