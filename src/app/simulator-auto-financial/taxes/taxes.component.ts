import { Component, input, output, signal, OnChanges, SimpleChanges, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleModel, TaxRate, AdditionalFee, FeeType } from '../../types';

interface CreditProfile {
  id: string;
  name: string;
  description: string;
  rateAdjustment: number;
  color: string;
}

@Component({
  selector: 'app-taxes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './taxes.component.html',
  styleUrl: './taxes.component.css'
})
export class TaxesComponent implements OnChanges {
  selectedVehicle = input<VehicleModel | null>(null);
  taxesSelected = output<TaxRate>();

  selectedTaxRate = signal<TaxRate | null>(null);
  applicableTaxRates = signal<TaxRate[]>([]);
  showRateSelector = signal<boolean>(false);

  creditProfiles: CreditProfile[] = [
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

  selectedCreditProfile = signal<CreditProfile>(this.creditProfiles[1]);

  baseTaxRates: TaxRate[] = [
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

  constructor() {
    // Effect para atualizar applicableTaxRates quando selectedVehicle muda
    effect(() => {
      const vehicle = this.selectedVehicle();
      if (vehicle) {
        this.generateApplicableTaxRates();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Manter para compatibilidade, mas a lógica agora é tratada pelo effect
  }

  private generateApplicableTaxRates(): void {
    const vehicle = this.selectedVehicle();
    if (!vehicle) {
      this.applicableTaxRates.set([]);
      return;
    }

    const vehicleYear = vehicle.year;
    let baseRate: TaxRate | undefined;
    
    if (vehicleYear >= 2024) {
      baseRate = this.baseTaxRates.find(rate => rate.vehicleYear === 2024);
    } else if (vehicleYear === 2023) {
      baseRate = this.baseTaxRates.find(rate => rate.vehicleYear === 2023);
    } else if (vehicleYear === 2022) {
      baseRate = this.baseTaxRates.find(rate => rate.vehicleYear === 2022);
    } else if (vehicleYear === 2021) {
      baseRate = this.baseTaxRates.find(rate => rate.vehicleYear === 2021);
    } else if (vehicleYear >= 2016 && vehicleYear <= 2020) {
      baseRate = this.baseTaxRates.find(rate => rate.vehicleYear === 2020);
    } else if (vehicleYear >= 2010 && vehicleYear <= 2015) {
      baseRate = this.baseTaxRates.find(rate => rate.vehicleYear === 2015);
    } else {
      baseRate = this.baseTaxRates.find(rate => rate.vehicleYear === 2009);
    }

    if (!baseRate) return;

    const newApplicableRates = this.creditProfiles.map((profile, index) => ({
      ...baseRate!,
      id: baseRate!.id + index * 100,
      taxPercentage: Math.max(0.1, baseRate!.taxPercentage + profile.rateAdjustment),
      description: `${baseRate!.description} - ${profile.name}`,
      yearRange: `${baseRate!.yearRange} - ${profile.name}`
    }));

    this.applicableTaxRates.set(newApplicableRates);
    this.selectCreditProfile(this.selectedCreditProfile());
  }

  selectCreditProfile(profile: CreditProfile): void {
    this.selectedCreditProfile.set(profile);
    const applicableRates = this.applicableTaxRates();
    const applicableRate = applicableRates.find(rate => 
      rate.description.includes(profile.name)
    );
    
    if (applicableRate) {
      this.onTaxRateSelect(applicableRate);
    }
  }

  onTaxRateSelect(taxRate: TaxRate): void {
    this.selectedTaxRate.set(taxRate);
    this.taxesSelected.emit(taxRate);
  }

  toggleRateSelector(): void {
    this.showRateSelector.update(value => !value);
  }

  calculateTotalAdditionalFees(fees: AdditionalFee[], vehiclePrice: number = 0): number {
    return fees.reduce((total, fee) => {
      if (fee.type === FeeType.FIXED) {
        return total + fee.amount;
      } else {
        return total + (vehiclePrice * fee.amount / 100);
      }
    }, 0);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatPercentage(percentage: number): string {
    return `${percentage.toFixed(1)}%`;
  }

  getFeeDisplayValue(fee: AdditionalFee, vehiclePrice: number = 0): string {
    if (fee.type === FeeType.FIXED) {
      return this.formatCurrency(fee.amount);
    } else {
      const calculatedAmount = vehiclePrice * fee.amount / 100;
      return `${this.formatPercentage(fee.amount)} (${this.formatCurrency(calculatedAmount)})`;
    }
  }

  getTaxCategoryClass(vehicleYear: number): string {
    if (vehicleYear >= 2024) return 'bg-green-100 text-green-800';
    if (vehicleYear >= 2021) return 'bg-blue-100 text-blue-800';
    if (vehicleYear >= 2016) return 'bg-yellow-100 text-yellow-800';
    if (vehicleYear >= 2010) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  }

  getRateComparisonText(rate: TaxRate): string {
    const baseRate = this.baseTaxRates.find(br => br.vehicleYear === rate.vehicleYear);
    if (!baseRate) return '';
    
    const difference = rate.taxPercentage - baseRate.taxPercentage;
    if (difference === 0) return 'Standard Rate';
    if (difference < 0) return `${Math.abs(difference).toFixed(1)}% Lower`;
    return `+${difference.toFixed(1)}% Higher`;
  }

  getAdjustedRate(profile: CreditProfile): number {
    const vehicle = this.selectedVehicle();
    if (!vehicle) return 0;
    
    const vehicleYear = vehicle.year;
    let baseRate: TaxRate | undefined;
    
    if (vehicleYear >= 2024) {
      baseRate = this.baseTaxRates.find(rate => rate.vehicleYear === 2024);
    } else if (vehicleYear === 2023) {
      baseRate = this.baseTaxRates.find(rate => rate.vehicleYear === 2023);
    } else if (vehicleYear === 2022) {
      baseRate = this.baseTaxRates.find(rate => rate.vehicleYear === 2022);
    } else if (vehicleYear === 2021) {
      baseRate = this.baseTaxRates.find(rate => rate.vehicleYear === 2021);
    } else if (vehicleYear >= 2016 && vehicleYear <= 2020) {
      baseRate = this.baseTaxRates.find(rate => rate.vehicleYear === 2020);
    } else if (vehicleYear >= 2010 && vehicleYear <= 2015) {
      baseRate = this.baseTaxRates.find(rate => rate.vehicleYear === 2015);
    } else {
      baseRate = this.baseTaxRates.find(rate => rate.vehicleYear === 2009);
    }

    if (!baseRate) return 0;
    return Math.max(0.1, baseRate.taxPercentage + profile.rateAdjustment);
  }
}