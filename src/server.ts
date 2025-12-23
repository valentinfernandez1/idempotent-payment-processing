import express, { NextFunction, Request, Response } from 'express'
import { config } from './config/index.js';
import morgan from 'morgan';
import { loggerFormat } from './utils/utils.js';
import { monitoringRoutes, v1Routes, webhookRoutes } from './routes/index.js';
import { initRedis } from './db/redis.js';
import { errorHandlerMiddleware } from './middlewares/error.js';

async function bootstrap() {
  await initRedis()
  const app = express();

  app.use(morgan(loggerFormat()))
  
  app.use('/webhooks/stripe', webhookRoutes)

  app.use(express.json());

  app.use(`/`, monitoringRoutes)
  app.use(`/v1`, v1Routes);

  app.use(errorHandlerMiddleware)

  const server = app.listen(config.api.port, () => {
    const addr = server.address();
    if (!addr) {
        throw new Error("Server is not listening");
    }

    if (typeof addr === "string") {
      console.log(`Listening on pipe ${addr}`);
      return;
    }

    const {address, port} = addr;

    const host = address === '::' || address === '0.0.0.0'? 'localhost' : address;
    console.log(`Server is running on http://${host}:${port}`);
  })
}


bootstrap();