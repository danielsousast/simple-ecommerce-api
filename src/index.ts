import express from 'express';
import 'dotenv/config';
import connectDatabase from './config/database.js';
import setupI18n from './config/locale.js';
import { setupCors } from './config/cors.js';
import categoryRouter from './routes/category.routes.js';

connectDatabase()

const app = express();

setupCors(app);
setupI18n(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/categories", categoryRouter);

const PORT = process.env.PORT || 3000;

app.get('/health', (_, res) => {
  res.send('Server is healthy');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});