import { Brand, VehicleModel, TaxRate, FeeType, VehicleCategory, FuelType, TransmissionType } from '../types';
import { CreditProfile } from '../services/taxes-mock.service';

export const mockBrands: Brand[] = [
  {
    id: 1,
    name: 'Toyota',
    country: 'Japan',
    logo: '/assets/brands/toyota.png',
    established: 1937
  },
  {
    id: 2,
    name: 'Honda',
    country: 'Japan',
    logo: '/assets/brands/honda.png',
    established: 1946
  },
  {
    id: 3,
    name: 'Ford',
    country: 'USA',
    logo: '/assets/brands/ford.png',
    established: 1903
  }
];

export const mockVehicles: VehicleModel[] = [
  {
    id: 1,
    brandId: 1,
    name: 'Camry',
    year: 2024,
    price: 25000,
    category: VehicleCategory.SEDAN,
    fuelType: FuelType.GASOLINE,
    transmission: TransmissionType.AUTOMATIC,
    engine: '2.5L 4-Cylinder',
    features: ['Safety Sense 2.0', 'Apple CarPlay', 'Android Auto']
  },
  {
    id: 2,
    brandId: 2,
    name: 'Civic',
    year: 2024,
    price: 23000,
    category: VehicleCategory.SEDAN,
    fuelType: FuelType.GASOLINE,
    transmission: TransmissionType.CVT,
    engine: '2.0L 4-Cylinder',
    features: ['Honda Sensing', 'Apple CarPlay', 'Android Auto']
  },
  {
    id: 3,
    brandId: 3,
    name: 'F-150',
    year: 2024,
    price: 35000,
    category: VehicleCategory.TRUCK,
    fuelType: FuelType.GASOLINE,
    transmission: TransmissionType.AUTOMATIC,
    engine: '3.3L V6',
    features: ['Co-Pilot360', 'SYNC 4', 'Pro Power Onboard']
  }
];

export const mockTaxRates: TaxRate[] = [
  {
    id: 1,
    vehicleYear: 2024,
    yearRange: '2024',
    taxPercentage: 4.5,
    description: 'Excellent credit rate for new vehicles',
    additionalFees: [
      { name: 'Documentation Fee', amount: 299, type: FeeType.FIXED },
      { name: 'Registration Fee', amount: 150, type: FeeType.FIXED }
    ]
  },
  {
    id: 2,
    vehicleYear: 2023,
    yearRange: '2023',
    taxPercentage: 5.2,
    description: 'Good credit rate for 1-year-old vehicles',
    additionalFees: [
      { name: 'Documentation Fee', amount: 299, type: FeeType.FIXED },
      { name: 'Registration Fee', amount: 150, type: FeeType.FIXED }
    ]
  }
];

export const mockCreditProfiles: CreditProfile[] = [
  {
    id: 'excellent',
    name: 'Excellent',
    description: 'Credit score 750+',
    rateAdjustment: 0,
    color: '#10B981'
  },
  {
    id: 'good',
    name: 'Good',
    description: 'Credit score 700-749',
    rateAdjustment: 0.5,
    color: '#3B82F6'
  },
  {
    id: 'fair',
    name: 'Fair',
    description: 'Credit score 650-699',
    rateAdjustment: 1.5,
    color: '#F59E0B'
  },
  {
    id: 'poor',
    name: 'Poor',
    description: 'Credit score below 650',
    rateAdjustment: 3.0,
    color: '#EF4444'
  }
];

export const mockContactForm = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '555-123-4567',
  message: 'I am interested in financing options for a new vehicle.',
  subject: 'Vehicle Financing Inquiry'
};

export const mockFinancingSimulation = {
  brandId: 1,
  vehicleId: 1,
  vehiclePrice: 25000,
  downPayment: 5000,
  financedAmount: 20449,
  interestRate: 4.5,
  termMonths: 60,
  taxRate: 4.5,
  additionalFees: mockTaxRates[0].additionalFees,
  monthlyPayment: 381.08,
  totalAmount: 27864.8,
  totalInterest: 2415.8,
  totalTaxes: 449,
  totalFees: 449
};