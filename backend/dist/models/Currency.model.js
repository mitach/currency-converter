"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const currencySchema = new mongoose_1.default.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
    },
    rate: {
        type: String,
        required: true,
    },
    last_updated: {
        type: Number,
        required: true,
        default: Date.now
    }
}, { timestamps: true });
const Currency = mongoose_1.default.model('Currency', currencySchema);
exports.default = Currency;
