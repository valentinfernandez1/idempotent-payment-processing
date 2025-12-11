import express from 'express';
import usersRoutes from './users.js';
import authRoutes from './auth.js';
const router = express.Router()

router.use('/api/users', usersRoutes);
router.use('/api/auth', authRoutes);

export default router;