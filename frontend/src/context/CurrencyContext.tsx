import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';
import { Currency } from '../types/types';

interface CurrencyContextType {
    currencies: Currency[];
    setCurrencies: Dispatch<SetStateAction<Currency[]>>;
    selectedCurrencies: string[];
    setSelectedCurrencies: Dispatch<SetStateAction<string[]>>;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(['USD', 'EUR', 'PLN', 'BGN', 'CNY']);

    return (
        <CurrencyContext.Provider value={{
            currencies,
            setCurrencies,
            selectedCurrencies,
            setSelectedCurrencies
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === null) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}; 