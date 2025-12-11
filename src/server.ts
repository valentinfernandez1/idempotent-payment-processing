import express, { NextFunction, Request, Response } from 'express'
import { config } from './config/index.js';
import morgan from 'morgan';
import { loggerFormat } from './utils/utils.js';
import { errorHandlerMiddleware } from './utils/errors.js';
import monitoringRoutes from './routes/monitoring.js';
import v1Routes from './routes/v1/index.js';

const PORT = config.api.port
const app = express();

app.use(morgan(loggerFormat()))
app.use(express.json());

app.use(`/`, monitoringRoutes)
app.use(`/v1`, v1Routes);

app.use(errorHandlerMiddleware)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

