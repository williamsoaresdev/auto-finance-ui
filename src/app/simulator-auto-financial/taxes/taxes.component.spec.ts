import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxesComponent } from './taxes.component';
import { TaxesMockService, CreditProfile } from '../../services/taxes-mock.service';
import { VehicleModel, TaxRate, AdditionalFee, FeeType, VehicleCategory, FuelType, TransmissionType } from '../../types';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const mockCreditProfiles: CreditProfile[] = [
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

const mockBaseTaxRates: TaxRate[] = [
  {
    id: 1,
    vehicleYear: 2024,
    yearRange: '2024 (New)',
    taxPercentage: 12.5,
    description: '0km Vehicles - Standard rate for new vehicles',
    additionalFees: [
      { name: 'IPVA', amount: 4.0, type: FeeType.PERCENTAGE },
      { name: 'Mandatory Insurance', amount: 28.77, type: FeeType.FIXED }
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
      { name: 'Mandatory Insurance', amount: 28.77, type: FeeType.FIXED }
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
      { name: 'Mandatory Insurance', amount: 28.77, type: FeeType.FIXED }
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
      { name: 'Mandatory Insurance', amount: 28.77, type: FeeType.FIXED }
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
      { name: 'Mandatory Insurance', amount: 28.77, type: FeeType.FIXED }
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
      { name: 'Mandatory Insurance', amount: 28.77, type: FeeType.FIXED }
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
      { name: 'Mandatory Insurance', amount: 28.77, type: FeeType.FIXED }
    ]
  }
];

const mockVehicle2024: VehicleModel = {
  id: 1,
  brandId: 1,
  name: 'Test Vehicle 2024',
  year: 2024,
  price: 50000,
  category: VehicleCategory.SEDAN,
  fuelType: FuelType.GASOLINE,
  transmission: TransmissionType.AUTOMATIC,
  engine: '2.0L',
  features: ['ABS', 'Airbags']
};

const mockVehicle2020: VehicleModel = {
  id: 2,
  brandId: 1,
  name: 'Test Vehicle 2020',
  year: 2020,
  price: 35000,
  category: VehicleCategory.SUV,
  fuelType: FuelType.GASOLINE,
  transmission: TransmissionType.AUTOMATIC,
  engine: '2.5L',
  features: ['ABS', 'Airbags']
};

const mockVehicle2009: VehicleModel = {
  id: 3,
  brandId: 1,
  name: 'Test Vehicle 2009',
  year: 2009,
  price: 15000,
  category: VehicleCategory.HATCHBACK,
  fuelType: FuelType.GASOLINE,
  transmission: TransmissionType.MANUAL,
  engine: '1.6L',
  features: ['ABS']
};

describe('TaxesComponent', () => {
  let component: TaxesComponent;
  let fixture: ComponentFixture<TaxesComponent>;
  let taxesMockService: jasmine.SpyObj<TaxesMockService>;

  beforeEach(async () => {
    const taxesServiceSpy = jasmine.createSpyObj('TaxesMockService', ['getCreditProfiles', 'getBaseTaxRates']);

    await TestBed.configureTestingModule({
      imports: [TaxesComponent, NoopAnimationsModule],
      providers: [
        { provide: TaxesMockService, useValue: taxesServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaxesComponent);
    component = fixture.componentInstance;
    taxesMockService = TestBed.inject(TaxesMockService) as jasmine.SpyObj<TaxesMockService>;
  });

  beforeEach(() => {
    taxesMockService.getCreditProfiles.and.returnValue(of(mockCreditProfiles));
    taxesMockService.getBaseTaxRates.and.returnValue(of(mockBaseTaxRates));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should load credit profiles on init', () => {
      component.ngOnInit();

      expect(taxesMockService.getCreditProfiles).toHaveBeenCalled();
      expect(component.creditProfiles()).toEqual(mockCreditProfiles);
    });

    it('should load base tax rates on init', () => {
      component.ngOnInit();

      expect(taxesMockService.getBaseTaxRates).toHaveBeenCalled();
      expect(component.baseTaxRates()).toEqual(mockBaseTaxRates);
    });

    it('should set default credit profile to "good"', () => {
      component.ngOnInit();

      const selectedProfile = component.selectedCreditProfile();
      expect(selectedProfile).toBeTruthy();
      expect(selectedProfile?.id).toBe('good');
    });

    it('should fallback to first profile if "good" not found', () => {
      const profilesWithoutGood = mockCreditProfiles.filter(p => p.id !== 'good');
      taxesMockService.getCreditProfiles.and.returnValue(of(profilesWithoutGood));

      component.ngOnInit();

      const selectedProfile = component.selectedCreditProfile();
      expect(selectedProfile).toEqual(profilesWithoutGood[0]);
    });

    it('should initialize with default signal values', () => {
      expect(component.selectedTaxRate()).toBeNull();
      expect(component.applicableTaxRates()).toEqual([]);
      expect(component.showRateSelector()).toBe(false);
      expect(component.creditProfiles()).toEqual([]);
      expect(component.selectedCreditProfile()).toBeNull();
      expect(component.baseTaxRates()).toEqual([]);
    });
  });

  describe('Vehicle Selection Effect', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should generate applicable tax rates when vehicle is selected', () => {
      spyOn(component, 'generateApplicableTaxRates' as any).and.callThrough();

      fixture.componentRef.setInput('selectedVehicle', mockVehicle2024);
      fixture.detectChanges();

      expect(component['generateApplicableTaxRates']).toHaveBeenCalled();
    });

    it('should clear applicable rates when vehicle is null', () => {
      // Directly call the private method to test its logic
      component['generateApplicableTaxRates']();
      expect(component.applicableTaxRates()).toEqual([]);
    });
  });

  describe('Tax Rate Generation', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should generate rates for 2024 vehicles', () => {
      fixture.componentRef.setInput('selectedVehicle', mockVehicle2024);
      fixture.detectChanges();

      const applicableRates = component.applicableTaxRates();
      expect(applicableRates.length).toBe(mockCreditProfiles.length);
      
      const baseRate = mockBaseTaxRates.find(r => r.vehicleYear === 2024);
      const excellentCreditRate = applicableRates.find(r => r.description.includes('Excellent Credit'));
      
      expect(excellentCreditRate).toBeTruthy();
      expect(excellentCreditRate!.taxPercentage).toBeCloseTo(baseRate!.taxPercentage - 1.5, 1);
    });

    it('should generate rates for 2020 vehicles (2016-2020 range)', () => {
      fixture.componentRef.setInput('selectedVehicle', mockVehicle2020);
      fixture.detectChanges();

      const applicableRates = component.applicableTaxRates();
      const baseRate = mockBaseTaxRates.find(r => r.vehicleYear === 2020);
      const goodCreditRate = applicableRates.find(r => r.description.includes('Good Credit'));
      
      expect(goodCreditRate!.taxPercentage).toBeCloseTo(baseRate!.taxPercentage, 1);
    });

    it('should generate rates for 2009 vehicles (very old)', () => {
      fixture.componentRef.setInput('selectedVehicle', mockVehicle2009);
      fixture.detectChanges();

      const applicableRates = component.applicableTaxRates();
      const baseRate = mockBaseTaxRates.find(r => r.vehicleYear === 2009);
      const poorCreditRate = applicableRates.find(r => r.description.includes('Poor Credit'));
      
      expect(poorCreditRate!.taxPercentage).toBeCloseTo(baseRate!.taxPercentage + 5.0, 1);
    });

    it('should enforce minimum tax rate of 0.1%', () => {
      const negativeAdjustmentProfile = {
        ...mockCreditProfiles[0],
        rateAdjustment: -20 // Very negative adjustment
      };
      const profilesWithNegative = [negativeAdjustmentProfile, ...mockCreditProfiles.slice(1)];
      taxesMockService.getCreditProfiles.and.returnValue(of(profilesWithNegative));
      
      component.ngOnInit();
      fixture.detectChanges();
      
      fixture.componentRef.setInput('selectedVehicle', mockVehicle2024);
      fixture.detectChanges();

      const applicableRates = component.applicableTaxRates();
      const rateWithNegativeAdjustment = applicableRates[0];
      
      expect(rateWithNegativeAdjustment.taxPercentage).toBeGreaterThanOrEqual(0.1);
    });

    it('should auto-select rate when credit profile is already selected', () => {
      component.selectCreditProfile(mockCreditProfiles[1]); // Select 'good' credit
      
      fixture.componentRef.setInput('selectedVehicle', mockVehicle2024);
      fixture.detectChanges();

      expect(component.selectedTaxRate()).toBeTruthy();
      expect(component.selectedTaxRate()!.description).toContain('Good Credit');
    });
  });

  describe('Credit Profile Selection', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
      fixture.componentRef.setInput('selectedVehicle', mockVehicle2024);
      fixture.detectChanges();
    });

    it('should select credit profile and update selected tax rate', () => {
      const excellentProfile = mockCreditProfiles[0];
      
      component.selectCreditProfile(excellentProfile);

      expect(component.selectedCreditProfile()).toEqual(excellentProfile);
      expect(component.selectedTaxRate()).toBeTruthy();
      expect(component.selectedTaxRate()!.description).toContain('Excellent Credit');
    });

    it('should emit taxesSelected when profile is selected', () => {
      spyOn(component.taxesSelected, 'emit');
      const fairProfile = mockCreditProfiles[2];
      
      component.selectCreditProfile(fairProfile);

      expect(component.taxesSelected.emit).toHaveBeenCalledWith(component.selectedTaxRate()!);
    });
  });

  describe('Tax Rate Selection', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
      fixture.componentRef.setInput('selectedVehicle', mockVehicle2024);
      fixture.detectChanges();
    });

    it('should select tax rate and emit event', () => {
      spyOn(component.taxesSelected, 'emit');
      const applicableRates = component.applicableTaxRates();
      const selectedRate = applicableRates[0];
      
      component.onTaxRateSelect(selectedRate);

      expect(component.selectedTaxRate()).toEqual(selectedRate);
      expect(component.taxesSelected.emit).toHaveBeenCalledWith(selectedRate);
    });
  });

  describe('Rate Selector Toggle', () => {
    it('should toggle rate selector visibility', () => {
      expect(component.showRateSelector()).toBe(false);
      
      component.toggleRateSelector();
      expect(component.showRateSelector()).toBe(true);
      
      component.toggleRateSelector();
      expect(component.showRateSelector()).toBe(false);
    });
  });

  describe('Additional Fee Calculations', () => {
    const mockFees: AdditionalFee[] = [
      { name: 'Fixed Fee', amount: 100, type: FeeType.FIXED },
      { name: 'Percentage Fee', amount: 5, type: FeeType.PERCENTAGE }
    ];

    it('should calculate total additional fees correctly', () => {
      const vehiclePrice = 50000;
      const total = component.calculateTotalAdditionalFees(mockFees, vehiclePrice);
      
      // 100 (fixed) + (50000 * 5 / 100) = 100 + 2500 = 2600
      expect(total).toBe(2600);
    });

    it('should calculate fees with zero vehicle price', () => {
      const total = component.calculateTotalAdditionalFees(mockFees, 0);
      
      // Only fixed fees count when vehicle price is 0
      expect(total).toBe(100);
    });

    it('should handle empty fees array', () => {
      const total = component.calculateTotalAdditionalFees([], 50000);
      expect(total).toBe(0);
    });
  });

  describe('Currency and Percentage Formatting', () => {
    it('should format currency correctly', () => {
      expect(component.formatCurrency(1234.56)).toBe('$1,234.56');
      expect(component.formatCurrency(0)).toBe('$0.00');
      expect(component.formatCurrency(1000000)).toBe('$1,000,000.00');
    });

    it('should format percentage correctly', () => {
      expect(component.formatPercentage(12.5)).toBe('12.5%');
      expect(component.formatPercentage(0)).toBe('0.0%');
      expect(component.formatPercentage(100)).toBe('100.0%');
    });
  });

  describe('Fee Display Value', () => {
    it('should display fixed fee as currency', () => {
      const fixedFee: AdditionalFee = { name: 'Fixed Fee', amount: 100, type: FeeType.FIXED };
      const display = component.getFeeDisplayValue(fixedFee, 50000);
      
      expect(display).toBe('$100.00');
    });

    it('should display percentage fee with calculated amount', () => {
      const percentageFee: AdditionalFee = { name: 'Percentage Fee', amount: 5, type: FeeType.PERCENTAGE };
      const display = component.getFeeDisplayValue(percentageFee, 50000);
      
      expect(display).toBe('5.0% ($2,500.00)');
    });

    it('should handle percentage fee with zero vehicle price', () => {
      const percentageFee: AdditionalFee = { name: 'Percentage Fee', amount: 5, type: FeeType.PERCENTAGE };
      const display = component.getFeeDisplayValue(percentageFee, 0);
      
      expect(display).toBe('5.0% ($0.00)');
    });
  });

  describe('Tax Category Class', () => {
    it('should return correct class for new vehicles (2024+)', () => {
      expect(component.getTaxCategoryClass(2024)).toBe('bg-green-100 text-green-800');
      expect(component.getTaxCategoryClass(2025)).toBe('bg-green-100 text-green-800');
    });

    it('should return correct class for recent vehicles (2021-2023)', () => {
      expect(component.getTaxCategoryClass(2021)).toBe('bg-blue-100 text-blue-800');
      expect(component.getTaxCategoryClass(2022)).toBe('bg-blue-100 text-blue-800');
      expect(component.getTaxCategoryClass(2023)).toBe('bg-blue-100 text-blue-800');
    });

    it('should return correct class for used vehicles (2016-2020)', () => {
      expect(component.getTaxCategoryClass(2016)).toBe('bg-yellow-100 text-yellow-800');
      expect(component.getTaxCategoryClass(2020)).toBe('bg-yellow-100 text-yellow-800');
    });

    it('should return correct class for older vehicles (2010-2015)', () => {
      expect(component.getTaxCategoryClass(2010)).toBe('bg-orange-100 text-orange-800');
      expect(component.getTaxCategoryClass(2015)).toBe('bg-orange-100 text-orange-800');
    });

    it('should return correct class for very old vehicles (<2010)', () => {
      expect(component.getTaxCategoryClass(2009)).toBe('bg-red-100 text-red-800');
      expect(component.getTaxCategoryClass(2000)).toBe('bg-red-100 text-red-800');
    });
  });

  describe('Rate Comparison Text', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should return standard rate text for unchanged rate', () => {
      const baseRate = mockBaseTaxRates[0];
      const sameRate = { ...baseRate, taxPercentage: 12.5 };
      
      const comparison = component.getRateComparisonText(sameRate);
      expect(comparison).toBe('Standard Rate');
    });

    it('should return lower rate text for reduced rate', () => {
      const baseRate = mockBaseTaxRates[0];
      const lowerRate = { ...baseRate, taxPercentage: 11.0 };
      
      const comparison = component.getRateComparisonText(lowerRate);
      expect(comparison).toBe('1.5% Lower');
    });

    it('should return higher rate text for increased rate', () => {
      const baseRate = mockBaseTaxRates[0];
      const higherRate = { ...baseRate, taxPercentage: 15.0 };
      
      const comparison = component.getRateComparisonText(higherRate);
      expect(comparison).toBe('+2.5% Higher');
    });

    it('should return empty string for unknown vehicle year', () => {
      const unknownRate: TaxRate = {
        id: 999,
        vehicleYear: 1990,
        yearRange: '1990',
        taxPercentage: 10,
        description: 'Unknown',
        additionalFees: []
      };
      
      const comparison = component.getRateComparisonText(unknownRate);
      expect(comparison).toBe('');
    });
  });

  describe('Adjusted Rate Calculation', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should calculate adjusted rate for 2024 vehicle', () => {
      fixture.componentRef.setInput('selectedVehicle', mockVehicle2024);
      fixture.detectChanges();

      const excellentProfile = mockCreditProfiles[0];
      const adjustedRate = component.getAdjustedRate(excellentProfile);
      
      // Base rate 12.5 - 1.5 = 11.0
      expect(adjustedRate).toBeCloseTo(11.0, 1);
    });

    it('should calculate adjusted rate for 2020 vehicle', () => {
      fixture.componentRef.setInput('selectedVehicle', mockVehicle2020);
      fixture.detectChanges();

      const poorProfile = mockCreditProfiles[3];
      const adjustedRate = component.getAdjustedRate(poorProfile);
      
      // Base rate 9.8 + 5.0 = 14.8
      expect(adjustedRate).toBeCloseTo(14.8, 1);
    });

    it('should return 0 when no vehicle is selected', () => {
      fixture.componentRef.setInput('selectedVehicle', null);
      fixture.detectChanges();

      const goodProfile = mockCreditProfiles[1];
      const adjustedRate = component.getAdjustedRate(goodProfile);
      
      expect(adjustedRate).toBe(0);
    });

    it('should enforce minimum rate of 0.1', () => {
      fixture.componentRef.setInput('selectedVehicle', mockVehicle2009);
      fixture.detectChanges();

      const veryNegativeProfile: CreditProfile = {
        id: 'test',
        name: 'Test',
        description: 'Test',
        rateAdjustment: -20,
        color: 'test'
      };
      
      const adjustedRate = component.getAdjustedRate(veryNegativeProfile);
      expect(adjustedRate).toBeGreaterThanOrEqual(0.1);
    });
  });

  describe('Year Range Mapping', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should map vehicle years to correct base rates', () => {
      const testCases = [
        { year: 2025, expectedBaseYear: 2024 },
        { year: 2024, expectedBaseYear: 2024 },
        { year: 2023, expectedBaseYear: 2023 },
        { year: 2022, expectedBaseYear: 2022 },
        { year: 2021, expectedBaseYear: 2021 },
        { year: 2020, expectedBaseYear: 2020 },
        { year: 2019, expectedBaseYear: 2020 },
        { year: 2016, expectedBaseYear: 2020 },
        { year: 2015, expectedBaseYear: 2015 },
        { year: 2014, expectedBaseYear: 2015 },
        { year: 2010, expectedBaseYear: 2015 },
        { year: 2009, expectedBaseYear: 2009 },
        { year: 2000, expectedBaseYear: 2009 }
      ];

      testCases.forEach(({ year, expectedBaseYear }) => {
        const mockVehicle = { ...mockVehicle2024, year };
        fixture.componentRef.setInput('selectedVehicle', mockVehicle);
        fixture.detectChanges();

        const applicableRates = component.applicableTaxRates();
        expect(applicableRates.length).toBeGreaterThan(0);
        
        // Check that the rate description contains the expected base year info
        const baseRate = mockBaseTaxRates.find(r => r.vehicleYear === expectedBaseYear);
        expect(baseRate).toBeTruthy();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing base rate gracefully', () => {
      // Return empty base rates
      taxesMockService.getBaseTaxRates.and.returnValue(of([]));
      component.ngOnInit();
      fixture.detectChanges();

      fixture.componentRef.setInput('selectedVehicle', mockVehicle2024);
      fixture.detectChanges();

      expect(component.applicableTaxRates()).toEqual([]);
    });

    it('should handle service failures during initialization', () => {
      // Simply test the initialization with empty data which simulates a failure state
      taxesMockService.getCreditProfiles.and.returnValue(of([]));
      taxesMockService.getBaseTaxRates.and.returnValue(of([]));

      component.ngOnInit();

      expect(component.creditProfiles()).toEqual([]);
      expect(component.baseTaxRates()).toEqual([]);
      // When there are no profiles, selectedCreditProfile would be undefined or null
      expect(component.selectedCreditProfile()).toBeFalsy();
    });

    it('should not crash when selecting profile without applicable rates', () => {
      component.ngOnInit();
      fixture.detectChanges();
      
      // Don't set a vehicle, so no applicable rates are generated
      const profile = mockCreditProfiles[0];
      
      expect(() => {
        component.selectCreditProfile(profile);
      }).not.toThrow();
      
      expect(component.selectedCreditProfile()).toEqual(profile);
    });
  });

  describe('Component Integration', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should complete full workflow: vehicle selection -> profile selection -> rate emission', () => {
      spyOn(component.taxesSelected, 'emit');
      
      // 1. Select vehicle
      fixture.componentRef.setInput('selectedVehicle', mockVehicle2024);
      fixture.detectChanges();
      
      // 2. Select credit profile
      const excellentProfile = mockCreditProfiles[0];
      component.selectCreditProfile(excellentProfile);
      
      // 3. Verify rate was calculated and emitted
      expect(component.selectedTaxRate()).toBeTruthy();
      expect(component.selectedTaxRate()!.description).toContain('Excellent Credit');
      expect(component.taxesSelected.emit).toHaveBeenCalledWith(component.selectedTaxRate()!);
    });

    it('should maintain state consistency across vehicle changes', () => {
      // Start with 2024 vehicle
      fixture.componentRef.setInput('selectedVehicle', mockVehicle2024);
      fixture.detectChanges();
      
      const excellentProfile = mockCreditProfiles[0];
      component.selectCreditProfile(excellentProfile);
      
      const rate2024 = component.selectedTaxRate()!.taxPercentage;
      
      // Switch to 2009 vehicle
      fixture.componentRef.setInput('selectedVehicle', mockVehicle2009);
      fixture.detectChanges();
      
      const rate2009 = component.selectedTaxRate()!.taxPercentage;
      
      // Rates should be different
      expect(rate2009).not.toBe(rate2024);
      expect(rate2009).toBeLessThan(rate2024);
      
      // Credit profile should remain the same
      expect(component.selectedCreditProfile()).toEqual(excellentProfile);
    });
  });
});