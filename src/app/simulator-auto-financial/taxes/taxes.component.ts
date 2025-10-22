import { Component, input, output, signal, effect, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleModel, TaxRate, AdditionalFee, FeeType } from '../../types';
import { TaxesMockService, CreditProfile } from '../../services/taxes-mock.service';

@Component({
  selector: 'app-taxes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './taxes.component.html',
  styleUrl: './taxes.component.css'
})
export class TaxesComponent implements OnInit {
  selectedVehicle = input<VehicleModel | null>(null);
  taxesSelected = output<TaxRate>();

  selectedTaxRate = signal<TaxRate | null>(null);
  applicableTaxRates = signal<TaxRate[]>([]);
  showRateSelector = signal<boolean>(false);

  creditProfiles = signal<CreditProfile[]>([]);
  selectedCreditProfile = signal<CreditProfile | null>(null);
  baseTaxRates = signal<TaxRate[]>([]);

  private taxesMockService = inject(TaxesMockService);

  constructor() {
    effect(() => {
      const vehicle = this.selectedVehicle();
      if (vehicle) {
        this.generateApplicableTaxRates();
      }
    });
  }

  ngOnInit(): void {
    this.loadCreditProfiles();
    this.loadBaseTaxRates();
  }

  private loadCreditProfiles(): void {
    this.taxesMockService.getCreditProfiles().subscribe(profiles => {
      this.creditProfiles.set(profiles);
      // Definir perfil padrão como 'good'
      const defaultProfile = profiles.find(p => p.id === 'good') || profiles[0];
      this.selectedCreditProfile.set(defaultProfile);
    });
  }

  private loadBaseTaxRates(): void {
    this.taxesMockService.getBaseTaxRates().subscribe(rates => {
      this.baseTaxRates.set(rates);
    });
  }

  private generateApplicableTaxRates(): void {
    const vehicle = this.selectedVehicle();
    if (!vehicle) {
      this.applicableTaxRates.set([]);
      return;
    }

    const vehicleYear = vehicle.year;
    const baseTaxRates = this.baseTaxRates();
    let baseRate: TaxRate | undefined;
    
    if (vehicleYear >= 2024) {
      baseRate = baseTaxRates.find(rate => rate.vehicleYear === 2024);
    } else if (vehicleYear === 2023) {
      baseRate = baseTaxRates.find(rate => rate.vehicleYear === 2023);
    } else if (vehicleYear === 2022) {
      baseRate = baseTaxRates.find(rate => rate.vehicleYear === 2022);
    } else if (vehicleYear === 2021) {
      baseRate = baseTaxRates.find(rate => rate.vehicleYear === 2021);
    } else if (vehicleYear >= 2016 && vehicleYear <= 2020) {
      baseRate = baseTaxRates.find(rate => rate.vehicleYear === 2020);
    } else if (vehicleYear >= 2010 && vehicleYear <= 2015) {
      baseRate = baseTaxRates.find(rate => rate.vehicleYear === 2015);
    } else {
      baseRate = baseTaxRates.find(rate => rate.vehicleYear === 2009);
    }

    if (!baseRate) return;

    const creditProfiles = this.creditProfiles();
    const newApplicableRates = creditProfiles.map((profile, index) => ({
      ...baseRate!,
      id: baseRate!.id + index * 100,
      taxPercentage: Math.max(0.1, baseRate!.taxPercentage + profile.rateAdjustment),
      description: `${baseRate!.description} - ${profile.name}`,
      yearRange: `${baseRate!.yearRange} - ${profile.name}`
    }));

    this.applicableTaxRates.set(newApplicableRates);
    const currentProfile = this.selectedCreditProfile();
    if (currentProfile) {
      this.selectCreditProfile(currentProfile);
    }
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
    const baseTaxRates = this.baseTaxRates();
    const baseRate = baseTaxRates.find(br => br.vehicleYear === rate.vehicleYear);
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
    const baseTaxRates = this.baseTaxRates();
    let baseRate: TaxRate | undefined;
    
    if (vehicleYear >= 2024) {
      baseRate = baseTaxRates.find(rate => rate.vehicleYear === 2024);
    } else if (vehicleYear === 2023) {
      baseRate = baseTaxRates.find(rate => rate.vehicleYear === 2023);
    } else if (vehicleYear === 2022) {
      baseRate = baseTaxRates.find(rate => rate.vehicleYear === 2022);
    } else if (vehicleYear === 2021) {
      baseRate = baseTaxRates.find(rate => rate.vehicleYear === 2021);
    } else if (vehicleYear >= 2016 && vehicleYear <= 2020) {
      baseRate = baseTaxRates.find(rate => rate.vehicleYear === 2020);
    } else if (vehicleYear >= 2010 && vehicleYear <= 2015) {
      baseRate = baseTaxRates.find(rate => rate.vehicleYear === 2015);
    } else {
      baseRate = baseTaxRates.find(rate => rate.vehicleYear === 2009);
    }

    if (!baseRate) return 0;
    return Math.max(0.1, baseRate.taxPercentage + profile.rateAdjustment);
  }
}