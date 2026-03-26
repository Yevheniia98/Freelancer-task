import mongoose, { Document, Schema } from 'mongoose';

export interface IFinancialTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  platform: 'upwork' | 'freelancer' | 'fiverr' | 'toptal' | 'guru';
  transactionId: string;
  type: 'earning' | 'withdrawal' | 'refund' | 'fee' | 'bonus';
  amount: number;
  currency: string;
  description?: string;
  projectId?: string;
  projectName?: string;
  clientName?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transactionDate: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const FinancialTransactionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    platform: {
      type: String,
      enum: ['upwork', 'freelancer', 'fiverr', 'toptal', 'guru'],
      required: true,
      index: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['earning', 'withdrawal', 'refund', 'fee', 'bonus'],
      required: true,
      default: 'earning',
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    description: {
      type: String,
    },
    projectId: {
      type: String,
    },
    projectName: {
      type: String,
    },
    clientName: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'completed',
    },
    transactionDate: {
      type: Date,
      required: true,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique transaction per platform
FinancialTransactionSchema.index(
  { userId: 1, platform: 1, transactionId: 1 },
  { unique: true }
);

// Index for date range queries
FinancialTransactionSchema.index({ userId: 1, transactionDate: -1 });

export default mongoose.model<IFinancialTransaction>(
  'FinancialTransaction',
  FinancialTransactionSchema
);
