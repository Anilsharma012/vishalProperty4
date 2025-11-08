import { Router } from 'express';
import { z } from 'zod';
import Package from '../models/Package';
import { protect, requireAdmin, AuthRequest } from '../middleware/auth';
import { CustomError } from '../middleware/errorHandler';

const router = Router();

const packageSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.number().min(0),
  durationDays: z.number().min(1),
  features: z.array(z.string()).optional(),
  listingLimit: z.number().min(1).optional(),
  isPremium: z.boolean().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

// Public: Get all active packages
router.get('/', async (req, res) => {
  const packages = await Package.find({ isActive: true })
    .sort({ displayOrder: 1, price: 1 });

  res.json({
    success: true,
    count: packages.length,
    data: packages,
  });
});

// Public: Get package by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const pkg = await Package.findById(id);
  if (!pkg) {
    throw new CustomError('Package not found', 404);
  }

  res.json({
    success: true,
    data: pkg,
  });
});

// Admin: Create package
router.post('/', protect, requireAdmin, async (req: AuthRequest, res) => {
  const validated = packageSchema.parse(req.body);

  const existingPackage = await Package.findOne({ name: validated.name });
  if (existingPackage) {
    throw new CustomError('Package name already exists', 400);
  }

  const pkg = await Package.create({
    name: validated.name,
    description: validated.description || '',
    price: validated.price,
    durationDays: validated.durationDays,
    features: validated.features || [],
    listingLimit: validated.listingLimit || 1,
    isPremium: validated.isPremium || false,
    isActive: validated.isActive !== false,
    displayOrder: validated.displayOrder || 0,
  });

  res.status(201).json({
    success: true,
    message: 'Package created successfully',
    data: pkg,
  });
});

// Admin: Update package
router.put('/:id', protect, requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const validated = packageSchema.partial().parse(req.body);

  const pkg = await Package.findById(id);
  if (!pkg) {
    throw new CustomError('Package not found', 404);
  }

  if (validated.name && validated.name !== pkg.name) {
    const existing = await Package.findOne({
      name: validated.name,
      _id: { $ne: id },
    });
    if (existing) {
      throw new CustomError('Package name already exists', 400);
    }
  }

  const updated = await Package.findByIdAndUpdate(id, validated, { new: true });

  res.json({
    success: true,
    message: 'Package updated successfully',
    data: updated,
  });
});

// Admin: Delete package
router.delete('/:id', protect, requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;

  const pkg = await Package.findByIdAndDelete(id);
  if (!pkg) {
    throw new CustomError('Package not found', 404);
  }

  res.json({
    success: true,
    message: 'Package deleted successfully',
  });
});

// Admin: Get all packages (including inactive)
router.get('/admin/all', protect, requireAdmin, async (req: AuthRequest, res) => {
  const packages = await Package.find()
    .sort({ displayOrder: 1, price: 1 });

  res.json({
    success: true,
    count: packages.length,
    data: packages,
  });
});

export default router;
