export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject: string;
}

export interface HttpErrorResponse {
  error: {
    message: string;
    code: string;
    details?: Record<string, unknown>;
  };
  status: number;
  statusText: string;
}

export interface Brand {
  id: number;
  name: string;
  country: string;
  logo?: string;
  established: number;
}

export interface VehicleModel {
  id: number;
  brandId: number;
  name: string;
  year: number;
  price: number;
  category: VehicleCategory;
  fuelType: FuelType;
  transmission: TransmissionType;
  engine: string;
  features: string[];
}

export enum VehicleCategory {
  SEDAN = 'sedan',
  SUV = 'suv',
  HATCHBACK = 'hatchback',
  COUPE = 'coupe',
  CONVERTIBLE = 'convertible',
  TRUCK = 'truck',
  VAN = 'van'
}

export enum FuelType {
  GASOLINE = 'gasoline',
  DIESEL = 'diesel',
  HYBRID = 'hybrid',
  ELECTRIC = 'electric',
  FLEX = 'flex'
}

export enum TransmissionType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  CVT = 'cvt'
}

export interface TaxRate {
  id: number;
  vehicleYear: number;
  yearRange: string;
  taxPercentage: number;
  description: string;
  additionalFees: AdditionalFee[];
}

export interface AdditionalFee {
  name: string;
  amount: number;
  type: FeeType;
}

export enum FeeType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage'
}

export interface FinancingSimulation {
  brandId?: number;
  vehicleId?: number;
  vehiclePrice: number;
  downPayment: number;
  financedAmount: number;
  interestRate: number;
  termMonths: number;
  taxRate: number;
  additionalFees: AdditionalFee[];
  monthlyPayment: number;
  totalAmount: number;
  totalInterest: number;
  totalTaxes: number;
  totalFees: number;
}

export interface SimulationStep {
  step: number;
  title: string;
  completed: boolean;
  data?: unknown;
}