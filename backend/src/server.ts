import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';

import connectToDatabase from "./configs/db.config";
import errorMiddleware from "./middlewares/error.middleware";
import currencyRouter from "./routes/currency.routes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5500;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://famous-chaja-81bb8b.netlify.app/'
  ]
}));
app.use(express.json());

app.use('/api/v1/currencies', currencyRouter);

app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  await connectToDatabase();    
});