export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number | string;
}

export interface ConversionState {
  amount: string;
  currency: string;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
} 