import express from 'express'
import { config } from './config/index.js';

const PORT = config.api.port
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

