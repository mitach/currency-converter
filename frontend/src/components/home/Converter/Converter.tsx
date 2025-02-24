import { useState, useEffect, useRef } from 'react';

import './Converter.css';
import { Currency } from '../../../types/types';
import { useCurrency } from '../../../context/CurrencyContext';
import { useConversion } from '../../../hooks/useConversion';
import '../../../styles/shared.css';

const API_URL = import.meta.env.VITE_API_URL;

const Converter: React.FC = () => {
    const {
        currencies,
        setCurrencies,
        selectedCurrencies,
        setSelectedCurrencies
    } = useCurrency();

    const { isConverting, convertCurrency } = useConversion();

    const [availableCurrencies, setAvailableCurrencies] = useState<{ code: string; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        if (currencies.length === 0) {
            fetchCurrencies();
        }
        fetchAvailableCurrencies();
    }, []);

    const fetchCurrencies = async () => {
        try {
            const response = await fetch(`${API_URL}/currencies?codes=${selectedCurrencies.join(',')}`);
            const data = await response.json();

            setCurrencies(data.data);
        } catch (error) {
            console.error('Error fetching currencies:', error);
        } finally {
            setIsLoading(false);
        }

    };

    const fetchAvailableCurrencies = async () => {
        try {
            const response = await fetch(`${API_URL}/currencies/available`);
            const data = await response.json();
            if (data.success) {
                setAvailableCurrencies(data.data);
            }
        } catch (error) {
            console.error('Error fetching available currencies:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAmountChange = (value: string, fromCurrency: string) => {
        setCurrencies(currencies.map(curr => ({
            ...curr,
            amount: curr.code === fromCurrency ? value : curr.amount,
            rate: curr.code === fromCurrency ? value : curr.rate
        })));

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            convertCurrency(value, fromCurrency, currencies, setCurrencies);
        }, 750);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const addCurrency = async (currencyCode: string) => {
        if (!currencyCode || selectedCurrencies.includes(currencyCode)) {
            return;
        }

        try {
            const usdValue = currencies.find(c => c.code === 'USD')?.rate;

            if (usdValue && !isNaN(Number(usdValue))) {
                const response = await fetch(`${API_URL}/currencies/convert`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: Number(usdValue),
                        fromCurrency: 'USD',
                        currencies: [currencyCode]
                    })
                });
                const data = await response.json();

                if (data.success) {
                    setSelectedCurrencies((prev: string[]) => [...prev, currencyCode]);
                    setCurrencies((prev: Currency[]) => [...prev, {
                        ...data.data[0],
                        rate: data.data[0].amount.toString()
                    }]);
                }
            } else {
                const response = await fetch(`${API_URL}/currencies?codes=${currencyCode}`);
                const data = await response.json();

                if (data.success && data.data.length > 0) {
                    setSelectedCurrencies(prev => [...prev, currencyCode]);
                    setCurrencies(prev => [...prev, { ...data.data[0], rate: '' }]);
                }
            }
        } catch (error) {
            console.error('Error adding currency:', error);
        }
    };

    const removeCurrency = (currencyCode: string) => {
        if (currencyCode !== 'USD') {
            setSelectedCurrencies((prev: string[]) => prev.filter(code => code !== currencyCode));
            setCurrencies((prev: Currency[]) => prev.filter(curr => curr.code !== currencyCode));
        }
    };

    return (
        <div className="converter-container">
            {isLoading ? (
                <div className="initial-loading">
                    <div className="spinner"></div>
                    <p>Loading currencies...</p>
                </div>
            ) : (
                <div className="currency-inputs">
                    {currencies.map((currency) => (
                        <div key={currency.code} className="currency-input-group">
                            <div className="currency-input-group-inner">
                                <label>
                                    <img
                                        src={`https://flagcdn.com/${currency.code.slice(0, 2).toLowerCase()}.svg`}
                                        alt={`${currency.code} flag`}
                                        className="converter-currency-flag"
                                    />
                                    {currency.code}
                                </label>
                                <div className="input-with-button">
                                    <input
                                        type="number"
                                        value={(currency.rate ? Number(Number(currency.rate).toFixed(4)) : '')}
                                        onChange={(e) => handleAmountChange(e.target.value, currency.code)}
                                        placeholder="0.00"
                                        disabled={isConverting}
                                    />
                                    {isConverting && <div className="input-spinner"></div>}
                                    {currency.code !== 'USD' && (
                                        <button
                                            className="remove-currency"
                                            onClick={() => removeCurrency(currency.code)}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="add-currency-section">
                <select
                    onChange={(e) => addCurrency(e.target.value)}
                    value=""
                >
                    <option value="">Add currency...</option>
                    {availableCurrencies
                        .filter(curr => !selectedCurrencies.includes(curr.code))
                        .map(curr => (
                            <option key={curr.code} value={curr.code}>
                                {curr.code} - {curr.name}
                            </option>
                        ))}
                </select>
            </div>
        </div>
    );
};

export default Converter;
