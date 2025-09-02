// Tasas de cambio fijas (valores aproximados, en un caso real esto vendría de una API)
const EXCHANGE_RATES: Record<string, number> = {
  COP: 1,       // Peso colombiano (moneda base)
  USD: 0.00025, // 1 COP = 0.00025 USD (aproximadamente 1 USD = 4000 COP)
  EUR: 0.00023, // 1 COP = 0.00023 EUR (aproximadamente 1 EUR = 4348 COP)
  GBP: 0.00020, // 1 COP = 0.00020 GBP (aproximadamente 1 GBP = 5000 COP)
};

type Currency = 'COP' | 'USD' | 'EUR' | 'GBP';

export const convertCurrency = (amount: number, from: Currency, to: Currency): number => {
  if (from === to) return amount;
  
  // Convertir a COP primero (moneda base)
  const amountInCOP = from === 'COP' ? amount : amount / EXCHANGE_RATES[from];
  
  // Convertir a la moneda objetivo
  const result = to === 'COP' ? amountInCOP : amountInCOP * EXCHANGE_RATES[to];
  
  return parseFloat(result.toFixed(2));
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};
