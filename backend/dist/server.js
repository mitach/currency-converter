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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_config_1 = __importDefault(require("./configs/db.config"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const currency_routes_1 = __importDefault(require("./routes/currency.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5500;
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        'https://famous-chaja-81bb8b.netlify.app/'
    ]
}));
app.use(express_1.default.json());
app.use('/api/v1/currencies', currency_routes_1.default);
app.use(error_middleware_1.default);
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server running on http://localhost:${PORT}`);
    yield (0, db_config_1.default)();
}));
