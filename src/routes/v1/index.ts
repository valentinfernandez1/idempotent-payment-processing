import express from 'express';
import usersRoutes from './users.js';
const router = express.Router()

router.use('/api/users', usersRoutes);


export default router;