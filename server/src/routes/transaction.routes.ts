import { Router } from 'express';
import { z } from 'zod';
import Transaction from '../models/Transaction';
import { protect, requireAdmin, AuthRequest } from '../middleware/auth';
import { CustomError } from '../middleware/errorHandler';

const router = Router();

const createTransactionSchema = z.object({
  userId: z.string(),
  propertyId: z.string().optional(),
  packageId: z.string().optional(),
  amount: z.number().min(0),
  gateway: z.enum(['razorpay', 'phonepe', 'test']).optional(),
  gatewayRef: z.string(),
  description: z.string().optional(),
});

const updateTransactionSchema = z.object({
  status: z.enum(['pending', 'success', 'failed', 'refunded']).optional(),
  notes: z.string().optional(),
});

// Public: Create transaction (for payment processing)
router.post('/', protect, async (req: AuthRequest, res) => {
  try {
    const data = createTransactionSchema.parse(req.body);

    const transaction = await Transaction.create({
      userId: req.user?.id,
      propertyId: data.propertyId || null,
      packageId: data.packageId || null,
      amount: data.amount,
      gateway: data.gateway || 'test',
      gatewayRef: data.gatewayRef,
      description: data.description || '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      throw new CustomError('Gateway reference already exists', 400);
    }
    throw error;
  }
});

// Admin: Get all transactions
router.get('/', protect, requireAdmin, async (req: AuthRequest, res) => {
  const status = req.query.status;
  const gateway = req.query.gateway;

  const query: any = {};
  if (status) query.status = status;
  if (gateway) query.gateway = gateway;

  const transactions = await Transaction.find(query)
    .populate('userId', 'name email phone')
    .populate('propertyId', 'title')
    .populate('packageId', 'name')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: transactions.length,
    data: transactions,
  });
});

// Admin: Get transaction by ID
router.get('/:id', protect, requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;

  const transaction = await Transaction.findById(id)
    .populate('userId', 'name email phone')
    .populate('propertyId', 'title')
    .populate('packageId', 'name');

  if (!transaction) {
    throw new CustomError('Transaction not found', 404);
  }

  res.json({
    success: true,
    data: transaction,
  });
});

// Admin: Update transaction status
router.patch('/:id/status', protect, requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'success', 'failed', 'refunded'];
  if (!validStatuses.includes(status)) {
    throw new CustomError('Invalid status', 400);
  }

  const transaction = await Transaction.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!transaction) {
    throw new CustomError('Transaction not found', 404);
  }

  res.json({
    success: true,
    message: 'Transaction status updated successfully',
    data: transaction,
  });
});

// Admin: Update transaction notes
router.patch('/:id/notes', protect, requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const validated = updateTransactionSchema.partial().parse(req.body);

  const transaction = await Transaction.findByIdAndUpdate(
    id,
    validated,
    { new: true }
  );

  if (!transaction) {
    throw new CustomError('Transaction not found', 404);
  }

  res.json({
    success: true,
    message: 'Transaction updated successfully',
    data: transaction,
  });
});

// Admin: Get transaction statistics
router.get('/admin/stats', protect, requireAdmin, async (req: AuthRequest, res) => {
  const stats = await Transaction.aggregate([
    {
      $facet: {
        totalByStatus: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              amount: { $sum: '$amount' },
            },
          },
        ],
        totalByGateway: [
          {
            $group: {
              _id: '$gateway',
              count: { $sum: 1 },
              amount: { $sum: '$amount' },
            },
          },
        ],
        monthlyRevenue: [
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
              },
              amount: { $sum: '$amount' },
              count: { $sum: 1 },
            },
          },
          { $sort: { '_id.year': -1, '_id.month': -1 } },
        ],
      },
    },
  ]);

  res.json({
    success: true,
    data: stats[0],
  });
});

export default router;
