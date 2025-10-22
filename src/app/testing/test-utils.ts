export const TEST_TIMEOUT = 5000;
export const ASYNC_TIMEOUT = 10000;

export const VALID_FORM_DATA = {
  downPayment: 5000,
  termMonths: 60,
  monthlyIncome: 5000
};

export const INVALID_FORM_DATA = {
  downPayment: -100,
  termMonths: 10,
  monthlyIncome: 100
};

export const SIMULATION_STEPS = {
  BRAND: 1,
  VEHICLE: 2,
  TAXES: 3,
  FINANCING: 4
};

export const SELECTORS = {
  FORM: 'form',
  SUBMIT_BUTTON: '[type="submit"]',
  RESET_BUTTON: '[data-testid="reset-button"]',
  ERROR_MESSAGE: '.error-message',
  SUCCESS_MESSAGE: '.success-message',
  LOADING_SPINNER: '.loading-spinner',
  STEP_INDICATOR: '.step-indicator',
  PROGRESS_BAR: '.progress-bar'
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  MIN_VALUE: 'Value is too low',
  MAX_VALUE: 'Value is too high'
};

export const CALCULATION_SCENARIOS = [
  {
    name: 'Standard financing',
    vehiclePrice: 25000,
    downPayment: 5000,
    termMonths: 60,
    interestRate: 4.5,
    expectedMonthlyPayment: 373.28
  },
  {
    name: 'High down payment',
    vehiclePrice: 30000,
    downPayment: 15000,
    termMonths: 48,
    interestRate: 3.9,
    expectedMonthlyPayment: 340.89
  },
  {
    name: 'Extended term',
    vehiclePrice: 35000,
    downPayment: 3500,
    termMonths: 84,
    interestRate: 5.5,
    expectedMonthlyPayment: 456.78
  }
];

export const TEST_ENVIRONMENT = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Auto Finance UI Test',
  version: '1.0.0-test'
};

export const MOCK_RESPONSES = {
  SUCCESS: {
    success: true,
    data: null,
    message: 'Operation completed successfully'
  },
  ERROR: {
    success: false,
    data: null,
    message: 'An error occurred',
    errors: ['Test error message']
  }
};

export function generateTestId(prefix: string = 'test'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateTestPrice(min: number = 15000, max: number = 50000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getTestDate(yearsAgo: number = 0): Date {
  const date = new Date();
  date.setFullYear(date.getFullYear() - yearsAgo);
  return date;
}