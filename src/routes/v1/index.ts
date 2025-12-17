import express from 'express';
import usersRoutes from './users.js';
import authRoutes from './auth.js';
import paymentRoutes from './payment.js';
import devRoutes from './dev.js';
import { apiConfig } from '../../config/api.js';

const router = express.Router()

router.use('/api/users', usersRoutes);
router.use('/api', authRoutes);
router.use('/api/payment', paymentRoutes);

if(apiConfig.platform === 'DEV'){
    console.log("Development routes enabled at: http://{ENDPOINT}/{VERSION}/api/dev")
    router.use('/api/dev', devRoutes);
}

export default router;