import { Router } from 'express';

import { createCurrency, getCurrencies, convertCurrency, getAvailableCurrencies } from '../controllers/currency.controller';

const currencyRouter = Router();

currencyRouter.get('/', getCurrencies);
currencyRouter.get('/available', getAvailableCurrencies);
currencyRouter.post('/', createCurrency);
currencyRouter.post('/convert', convertCurrency);

export default currencyRouter;