import express from 'express'
import { config } from './config/index.js';
import morgan from 'morgan';
import { loggerFormat } from './utils/utils.js';
import { errorHandlerMiddleware } from './utils/errors.js';

const PORT = config.api.port
const app = express();


app.use(morgan(loggerFormat()))

app.get('/', (req, res) => {
  throw new Error()
  //res.send('Hello, World!');
});

app.use(errorHandlerMiddleware)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

