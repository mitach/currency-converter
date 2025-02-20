import { RequestHandler } from 'express';
import Currency from '../models/Currency.model';

export const getCurrencies: RequestHandler = async (req, res, next) => {
    try {
        const codes = req.query.codes as string;
        const codesArray = codes ? codes.split(',').map((code: string) => code.trim().toUpperCase()) : [];

        let currencies = codesArray.length
            ? await Currency.find({ code: { $in: codesArray } })
            : await Currency.find({});

        if (codesArray.length) {
            const codeIndexMap = new Map(codesArray.map((code, index) => [code, index]));
            currencies.sort((a, b) => codeIndexMap.get(a.code)! - codeIndexMap.get(b.code)!);
        }

        res.status(200).json({
            success: true,
            message: 'Retrieved all currencies successfully',
            data: currencies,
        })
    } catch (error) {
        next(error);
    }
}

export const createCurrency: RequestHandler = async (req, res, next) => {
    try {
        const { code, name, symbol, rate } = req.body;

        const existingCode = await Currency.findOne({ code });

        if (existingCode) {

        }

        const newCurrency = await Currency.create({ code, name, symbol, rate });

        res.status(201).json({
            success: true,
            message: 'Currency created successfully',
            data: newCurrency
        });
    } catch (error) {
        next(error);
    }
}

export const convertCurrency: RequestHandler = async (req, res, next) => {
    try {
        const { amount, fromCurrency, currencies: targetCurrencies } = req.body;

        // Check if amount is undefined or not a valid number string
        if (amount === undefined || fromCurrency === undefined || !targetCurrencies) {
            res.status(400).json({
                success: false,
                message: 'Missing required parameters: amount, fromCurrency, or currencies',
            });

            return;
        }

        const numericAmount = Number(amount);
        // Only reject if it's not a valid number (allows 0 and decimals)
        if (isNaN(numericAmount)) {
            res.status(400).json({
                success: false,
                message: 'Amount must be a valid number',
            });
            return;
        }

        // Get all required currencies including the source currency
        const allCurrencies = [...new Set([fromCurrency, ...targetCurrencies])];
        const currencyData = await Currency.find({ code: { $in: allCurrencies } });

        // Find source currency rate
        const sourceCurrency = currencyData.find(c => c.code === fromCurrency);
        if (!sourceCurrency) {
            res.status(404).json({
                success: false,
                message: `Source currency ${fromCurrency} not found`,
            });
            return;
        }

        // Calculate conversions
        const conversions = currencyData.map(currency => ({
            code: currency.code,
            amount: currency.code === fromCurrency
                ? Number(amount)
                : Number((Number(amount) * Number(currency.rate) / Number(sourceCurrency.rate)).toFixed(4)),
            name: currency.name
        }));

        res.status(200).json({
            success: true,
            message: 'Currency conversion successful',
            data: conversions,
        });
    } catch (error) {
        next(error);
    }
};

export const getAvailableCurrencies: RequestHandler = async (req, res, next) => {
    try {
        const currencies = await Currency.find({}, { code: 1, name: 1, _id: 0 });
        
        res.status(200).json({
            success: true,
            message: 'Retrieved available currencies successfully',
            data: currencies
        });
    } catch (error) {
        next(error);
    }
};