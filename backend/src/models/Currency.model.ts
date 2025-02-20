import mongoose from 'mongoose';

const currencySchema  = new mongoose.Schema({
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

const Currency = mongoose.model('Currency', currencySchema);

export default Currency;