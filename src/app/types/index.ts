export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  id: number;
  name?: string;
  email?: string;
}

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: VehicleCondition;
  features: string[];
}

export enum VehicleCondition {
  NEW = 'new',
  USED = 'used',
  CERTIFIED = 'certified'
}

export interface LoanApplication {
  id: number;
  userId: number;
  vehicleId: number;
  requestedAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  status: LoanStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}

export interface CreateLoanApplicationRequest {
  vehicleId: number;
  requestedAmount: number;
  termMonths: number;
  downPayment: number;
  annualIncome: number;
  employmentYears: number;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject: string;
}

export interface LoanCalculatorForm {
  vehiclePrice: number;
  downPayment: number;
  interestRate: number;
  termMonths: number;
}

export interface LoanCalculatorResult {
  monthlyPayment: number;
  totalAmount: number;
  totalInterest: number;
  paymentSchedule: PaymentScheduleItem[];
}

export interface PaymentScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
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

export interface Environment {
  production: boolean;
  apiUrl: string;
  appName: string;
  version: string;
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