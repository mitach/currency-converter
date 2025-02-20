import express, { Request, Response } from "express";
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
    'http://localhost:3000',
    'https://your-netlify-app.netlify.app'  // You'll add this after deploying to Netlify
  ]
}));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

app.use('/api/v1/currencies', currencyRouter);

app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  await connectToDatabase();    
});