import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    statusCode?: number;
    errors?: Record<string, { message: string }>;
}

const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    try {
        let error = { ...err };
        error.message = err.message;

        // Mongoose validation error
        if (err.name === 'ValidationError' && err.errors) {
            const message = Object.values(err.errors).map(val => val.message);

            error = new Error(message.join(', '));
            error.statusCode = 400;
        }

        // Check if currency is not existing in database
        if (err.name === 'NoExistingCurrencyError') {
            error.statusCode = 404;
        }

        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error' });
    } catch (error) {
        next(error);
    }
}

export default errorMiddleware;