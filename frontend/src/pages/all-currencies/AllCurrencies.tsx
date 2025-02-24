import { useState, useEffect, useRef } from 'react';
import { useConversion } from '../../hooks/useConversion';
import { Currency } from '../../types/types';
import './AllCurrencies.css';
import '../../styles/shared.css';

type SortType = 'name' | 'rate';
type SortDirection = 'asc' | 'desc';

const API_URL = import.meta.env.VITE_API_URL;

const AllCurrencies: React.FC = () => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [sortType, setSortType] = useState<SortType>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const { isConverting, convertCurrency } = useConversion();
    const [isLoading, setIsLoading] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        fetchAllCurrencies();
    }, []);

    const fetchAllCurrencies = async () => {
        try {
            const response = await fetch(`${API_URL}/currencies`);
            const data = await response.json();

            if (data.success) {
                setCurrencies(data.data.map((curr: Currency) => ({
                    ...curr,
                    rate: curr.code === 'USD' ? '1' : curr.rate.toString()
                })));
            }
        } catch (error) {
            console.error('Error fetching currencies:', error);
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

    const sortCurrencies = () => {
        return [...currencies].sort((a, b) => {
            if (sortType === 'name') {
                return sortDirection === 'asc'
                    ? a.code.localeCompare(b.code)
                    : b.code.localeCompare(a.code);
            } else {
                const rateA = Number(a.rate) || 0;
                const rateB = Number(b.rate) || 0;
                return sortDirection === 'asc'
                    ? rateA - rateB
                    : rateB - rateA;
            }
        });
    };

    const toggleSort = (type: SortType) => {
        if (sortType === type) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortType(type);
            setSortDirection('asc');
        }
    };

    return (
        <section className="rates-page">
            <article className="rates-header">
                <h1>Currency Exchange Rates</h1>
                <div className="sort-controls">
                    <button
                        onClick={() => toggleSort('name')}
                        className={sortType === 'name' ? 'active' : ''}
                    >
                        Sort by Name {sortType === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </button>
                    <button
                        onClick={() => toggleSort('rate')}
                        className={sortType === 'rate' ? 'active' : ''}
                    >
                        Sort by Rate {sortType === 'rate' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </button>
                </div>
            </article>

            <article className="rates-grid">
                {isLoading ? (
                    <div className="initial-loading">
                        <div className="spinner"></div>
                        <p>Loading currencies...</p>
                    </div>
                ) : (
                    sortCurrencies().map((currency) => (
                        <div key={currency.code} className="currency-card-wrapper">
                            <div className="currency-card">
                                <div className="currency-header">
                                    <img
                                        src={`https://flagcdn.com/${currency.code.slice(0, 2).toLowerCase()}.svg`}
                                        alt={`${currency.code} flag`}
                                        className="currency-flag"
                                    />
                                    <span className="currency-code">{currency.code}</span>
                                </div>
                                <div className="currency-name">{currency.name}</div>
                                <div className="currency-input-wrapper">
                                    <input
                                        type="number"
                                        value={currency.rate ? Number(Number(currency.rate).toFixed(4)) : ''}
                                        onChange={(e) => handleAmountChange(e.target.value, currency.code)}
                                        placeholder="0.00"
                                        className="currency-input"
                                        disabled={isConverting}
                                    />
                                    {isConverting && <div className="input-spinner"></div>}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </article>
        </section>
    );
};

export default AllCurrencies;