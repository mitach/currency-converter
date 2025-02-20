import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/home/Home';
import AllCurrencies from './pages/all-currencies/AllCurrencies';
import { CurrencyProvider } from './context/CurrencyContext';

const App: React.FC = () => {
  return (
    <CurrencyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/all-currencies" element={<AllCurrencies />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CurrencyProvider>
  );
};

export default App;
