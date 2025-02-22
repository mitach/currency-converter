import { useState } from 'react';
import { Currency } from '../types/types';

const API_URL = import.meta.env.VITE_API_URL;

export const useConversion = () => {
    const [isConverting, setIsConverting] = useState(false);

    const convertCurrency = async (
        value: string,
        fromCurrency: string,
        currencies: Currency[],
        setCurrencies: (currencies: Currency[]) => void
    ) => {
        if (value === '') {
            setCurrencies(currencies.map(curr => ({
                ...curr,
                rate: ''
            })));
            return;
        }

        const numValue = Number(value);
        if (isNaN(numValue)) {
            return;
        }

        setIsConverting(true);
        try {
            const response = await fetch(`${API_URL}/currencies/convert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: numValue,
                    fromCurrency,
                    currencies: currencies.map(c => c.code)
                })
            });

            const data = await response.json();

            console.error(data)
            if (data.success) {
                setCurrencies(currencies.map(curr => {
                    if (curr.code === fromCurrency) {
                        return { ...curr, amount: value, rate: value };
                    }
                    const conversion = data.data.find((c: any) => c.code === curr.code);
                    return {
                        ...curr,
                        rate: conversion ? conversion.amount.toString() : curr.rate
                    };
                }));
            }
        } catch (error) {
            console.error('Error converting currencies:', error);
        } finally {
            setIsConverting(false);
        }
    };

    return { isConverting, convertCurrency };
}; 