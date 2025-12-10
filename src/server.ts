import express, { NextFunction, Request, Response } from 'express'
import { config } from './config/index.js';
import morgan from 'morgan';
import { loggerFormat } from './utils/utils.js';
import { errorHandlerMiddleware } from './utils/errors.js';
import { handleUserCreation } from './controllers/users.js';

const PORT = config.api.port
const app = express();

app.use(morgan(loggerFormat()))
app.use(express.json());

app.get('/', (req, res) => {
  throw new Error()
  //res.send('Hello, World!');
});

app.post('/api/user', (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handleUserCreation(req, res)).catch(next)
})

app.use(errorHandlerMiddleware)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

