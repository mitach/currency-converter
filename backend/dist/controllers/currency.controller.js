"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableCurrencies = exports.convertCurrency = exports.createCurrency = exports.getCurrencies = void 0;
const Currency_model_1 = __importDefault(require("../models/Currency.model"));
const getCurrencies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const codes = req.query.codes;
        const codesArray = codes ? codes.split(',').map((code) => code.trim().toUpperCase()) : [];
        let currencies = codesArray.length
            ? yield Currency_model_1.default.find({ code: { $in: codesArray } })
            : yield Currency_model_1.default.find({});
        if (codesArray.length) {
            const codeIndexMap = new Map(codesArray.map((code, index) => [code, index]));
            currencies.sort((a, b) => codeIndexMap.get(a.code) - codeIndexMap.get(b.code));
        }
        res.status(200).json({
            success: true,
            message: 'Retrieved all currencies successfully',
            data: currencies,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCurrencies = getCurrencies;
const createCurrency = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, name, symbol, rate } = req.body;
        const existingCode = yield Currency_model_1.default.findOne({ code });
        if (existingCode) {
        }
        const newCurrency = yield Currency_model_1.default.create({ code, name, symbol, rate });
        res.status(201).json({
            success: true,
            message: 'Currency created successfully',
            data: newCurrency
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createCurrency = createCurrency;
const convertCurrency = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const currencyData = yield Currency_model_1.default.find({ code: { $in: allCurrencies } });
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
    }
    catch (error) {
        next(error);
    }
});
exports.convertCurrency = convertCurrency;
const getAvailableCurrencies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currencies = yield Currency_model_1.default.find({}, { code: 1, name: 1, _id: 0 });
        res.status(200).json({
            success: true,
            message: 'Retrieved available currencies successfully',
            data: currencies
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAvailableCurrencies = getAvailableCurrencies;
