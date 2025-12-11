import express from 'express';
const router = express.Router()

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

router.get('/metrics', (req, res) => {
    // Placeholder for metrics data
    const metricsData = {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
    };
    res.status(200).json(metricsData);
});


export default router;