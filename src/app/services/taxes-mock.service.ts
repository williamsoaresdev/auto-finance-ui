import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TaxRate, AdditionalFee, FeeType } from '../types';

export interface CreditProfile {
  id: string;
  name: string;
  description: string;
  rateAdjustment: number;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaxesMockService {

  constructor() { }

  /**
   * Retorna os perfis de crédito disponíveis
   * @returns Observable<CreditProfile[]>
   */
  getCreditProfiles(): Observable<CreditProfile[]> {
    const creditProfiles: CreditProfile[] = [
      { 
        id: 'excellent', 
        name: 'Excellent Credit', 
        description: '750+ FICO Score', 
        rateAdjustment: -1.5,
        color: 'bg-green-100 text-green-800 border-green-200'
      },
      { 
        id: 'good', 
        name: 'Good Credit', 
        description: '680-749 FICO Score', 
        rateAdjustment: 0,
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      },
      { 
        id: 'fair', 
        name: 'Fair Credit', 
        description: '580-679 FICO Score', 
        rateAdjustment: 2.5,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      },
      { 
        id: 'poor', 
        name: 'Poor Credit', 
        description: '500-579 FICO Score', 
        rateAdjustment: 5.0,
        color: 'bg-red-100 text-red-800 border-red-200'
      }
    ];

    return of(creditProfiles);
  }

  /**
   * Retorna as taxas base por ano de veículo
   * @returns Observable<TaxRate[]>
   */
  getBaseTaxRates(): Observable<TaxRate[]> {
    const baseTaxRates: TaxRate[] = [
      {
        id: 1,
        vehicleYear: 2024,
        yearRange: '2024 (New)',
        taxPercentage: 12.5,
        description: '0km Vehicles - Standard rate for new vehicles',
        additionalFees: [
          { name: 'IPVA', amount: 4.0, type: FeeType.PERCENTAGE },
          { name: 'Mandatory Insurance', amount: 28.77, type: FeeType.FIXED },
          { name: 'Licensing Fee', amount: 23.22, type: FeeType.FIXED },
          { name: 'Registration Fee', amount: 35.55, type: FeeType.FIXED }
        ]
      },
      {
        id: 2,
        vehicleYear: 2023,
        yearRange: '2023 (Semi-new)',
        taxPercentage: 11.8,
        description: '1 year old vehicles - Small depreciation applied',
        additionalFees: [
          { name: 'IPVA', amount: 4.0, type: FeeType.PERCENTAGE },
          { name: 'Mandatory Insurance', amount: 28.77, type: FeeType.FIXED },
          { name: 'Licensing Fee', amount: 23.22, type: FeeType.FIXED },
          { name: 'Inspection', amount: 15.51, type: FeeType.FIXED }
        ]
      },
      {
        id: 3,
        vehicleYear: 2022,
        yearRange: '2022 (Semi-new)',
        taxPercentage: 11.2,
        description: '2 year old vehicles - Reduced rate due to depreciation',
        additionalFees: [
          { name: 'IPVA', amount: 4.0, type: FeeType.PERCENTAGE },
          { name: 'Mandatory Insurance', amount: 28.77, type: FeeType.FIXED },
          { name: 'Licensing Fee', amount: 23.22, type: FeeType.FIXED },
          { name: 'Inspection', amount: 15.51, type: FeeType.FIXED }
        ]
      },
      {
        id: 4,
        vehicleYear: 2021,
        yearRange: '2021 (Semi-new)',
        taxPercentage: 10.5,
        description: '3 year old vehicles - Reduced rate',
        additionalFees: [
          { name: 'IPVA', amount: 4.0, type: FeeType.PERCENTAGE },
          { name: 'Mandatory Insurance', amount: 28.77, type: FeeType.FIXED },
          { name: 'Licensing Fee', amount: 23.22, type: FeeType.FIXED },
          { name: 'Inspection', amount: 15.51, type: FeeType.FIXED }
        ]
      },
      {
        id: 5,
        vehicleYear: 2020,
        yearRange: '2016-2020 (Used)',
        taxPercentage: 9.8,
        description: '4-8 year old vehicles - Used vehicle rate',
        additionalFees: [
          { name: 'IPVA', amount: 4.0, type: FeeType.PERCENTAGE },
          { name: 'Mandatory Insurance', amount: 28.77, type: FeeType.FIXED },
          { name: 'Licensing Fee', amount: 23.22, type: FeeType.FIXED },
          { name: 'Complete Inspection', amount: 22.87, type: FeeType.FIXED },
          { name: 'Technical Report', amount: 17.27, type: FeeType.FIXED }
        ]
      },
      {
        id: 6,
        vehicleYear: 2015,
        yearRange: '2010-2015 (Used)',
        taxPercentage: 8.9,
        description: '9-14 year old vehicles - Reduced rate for older used cars',
        additionalFees: [
          { name: 'IPVA', amount: 4.0, type: FeeType.PERCENTAGE },
          { name: 'Mandatory Insurance', amount: 28.77, type: FeeType.FIXED },
          { name: 'Licensing Fee', amount: 23.22, type: FeeType.FIXED },
          { name: 'Complete Inspection', amount: 22.87, type: FeeType.FIXED },
          { name: 'Technical Report', amount: 17.27, type: FeeType.FIXED },
          { name: 'Additional Inspection', amount: 75.00, type: FeeType.FIXED }
        ]
      },
      {
        id: 7,
        vehicleYear: 2009,
        yearRange: 'Up to 2009 (Old)',
        taxPercentage: 7.5,
        description: '15+ year old vehicles - Minimum rate for old vehicles',
        additionalFees: [
          { name: 'IPVA', amount: 4.0, type: FeeType.PERCENTAGE },
          { name: 'Mandatory Insurance', amount: 28.77, type: FeeType.FIXED },
          { name: 'Licensing Fee', amount: 23.22, type: FeeType.FIXED },
          { name: 'Rigorous Inspection', amount: 185.50, type: FeeType.FIXED },
          { name: 'Complete Technical Report', amount: 150.00, type: FeeType.FIXED },
          { name: 'Vehicle Inspection', amount: 17.27, type: FeeType.FIXED }
        ]
      }
    ];

    return of(baseTaxRates);
  }
}