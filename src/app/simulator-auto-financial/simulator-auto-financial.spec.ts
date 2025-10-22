import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SimulatorAutoFinancialComponent } from './simulator-auto-financial.component';
import { Brand, VehicleModel, TaxRate, FeeType, VehicleCategory, FuelType, TransmissionType } from '../types';

// Mock child components
@Component({
  selector: 'app-brand',
  template: '<div>Mock Brand Component</div>',
  standalone: true
})
class MockBrandComponent {
  @Output() brandSelected = new EventEmitter<Brand>();
}

@Component({
  selector: 'app-vehicle',
  template: '<div>Mock Vehicle Component</div>',
  standalone: true
})
class MockVehicleComponent {
  @Input() selectedBrand: Brand | null = null;
  @Output() vehicleSelected = new EventEmitter<VehicleModel>();
}

@Component({
  selector: 'app-taxes',
  template: '<div>Mock Taxes Component</div>',
  standalone: true
})
class MockTaxesComponent {
  @Input() selectedVehicle: VehicleModel | null = null;
  @Output() taxesSelected = new EventEmitter<TaxRate>();
}

// Test data
const mockBrand: Brand = {
  id: 1,
  name: 'Toyota',
  country: 'Japan',
  established: 1937
};

const mockVehicle: VehicleModel = {
  id: 1,
  brandId: 1,
  name: 'Camry',
  year: 2024,
  price: 25000,
  category: VehicleCategory.SEDAN,
  fuelType: FuelType.GASOLINE,
  transmission: TransmissionType.AUTOMATIC,
  engine: '2.5L 4-Cylinder',
  features: ['Safety Sense 2.0', 'Apple CarPlay']
};

const mockTaxRate: TaxRate = {
  id: 1,
  vehicleYear: 2024,
  yearRange: '2024',
  taxPercentage: 4.5,
  description: 'Excellent credit rate',
  additionalFees: [
    { name: 'Documentation Fee', amount: 299, type: FeeType.FIXED },
    { name: 'Registration Fee', amount: 150, type: FeeType.FIXED }
  ]
};

const validFormData = {
  downPayment: 5000,
  termMonths: 60,
  monthlyIncome: 5000
};

describe('SimulatorAutoFinancialComponent', () => {
  let component: SimulatorAutoFinancialComponent;
  let fixture: ComponentFixture<SimulatorAutoFinancialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SimulatorAutoFinancialComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MockBrandComponent,
        MockVehicleComponent,
        MockTaxesComponent
      ],
      providers: [FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(SimulatorAutoFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with correct validators', () => {
      expect(component.simulationForm).toBeDefined();
      expect(component.simulationForm.get('downPayment')).toBeDefined();
      expect(component.simulationForm.get('termMonths')).toBeDefined();
      expect(component.simulationForm.get('monthlyIncome')).toBeDefined();
    });

    it('should have initial form values as empty', () => {
      expect(component.simulationForm.get('downPayment')?.value).toBe('');
      expect(component.simulationForm.get('termMonths')?.value).toBe('');
      expect(component.simulationForm.get('monthlyIncome')?.value).toBe('');
    });

    it('should validate required fields', () => {
      const form = component.simulationForm;
      
      expect(form.get('downPayment')?.hasError('required')).toBe(true);
      expect(form.get('termMonths')?.hasError('required')).toBe(true);
      expect(form.get('monthlyIncome')?.hasError('required')).toBe(true);
    });

    it('should validate minimum values', () => {
      const form = component.simulationForm;
      
      form.get('downPayment')?.setValue(-100);
      form.get('termMonths')?.setValue(6);
      form.get('monthlyIncome')?.setValue(100);

      expect(form.get('downPayment')?.hasError('min')).toBe(true);
      expect(form.get('termMonths')?.hasError('min')).toBe(true);
      expect(form.get('monthlyIncome')?.hasError('min')).toBe(true);
    });

    it('should validate maximum term months', () => {
      const form = component.simulationForm;
      form.get('termMonths')?.setValue(100);
      
      expect(form.get('termMonths')?.hasError('max')).toBe(true);
    });
  });

  describe('Step Management', () => {
    it('should initialize with 4 steps', () => {
      expect(component.steps().length).toBe(4);
      expect(component.steps()[0].title).toBe('Brand');
      expect(component.steps()[1].title).toBe('Vehicle');
      expect(component.steps()[2].title).toBe('Rates');
      expect(component.steps()[3].title).toBe('Financing');
    });

    it('should initialize all steps as not completed', () => {
      component.steps().forEach(step => {
        expect(step.completed).toBe(false);
      });
    });

    it('should update step completion correctly', () => {
      component.onBrandSelected(mockBrand);
      expect(component.steps()[0].completed).toBe(true);
      expect(component.steps()[1].completed).toBe(false);
    });
  });

  describe('Brand Selection', () => {
    it('should handle brand selection', () => {
      component.onBrandSelected(mockBrand);
      
      expect(component.selectedBrand()).toEqual(mockBrand);
      expect(component.selectedVehicle()).toBeNull();
      expect(component.selectedTaxRate()).toBeNull();
      expect(component.simulationResult()).toBeNull();
    });

    it('should update step completion on brand selection', () => {
      component.onBrandSelected(mockBrand);
      
      expect(component.steps()[0].completed).toBe(true);
      expect(component.steps()[1].completed).toBe(false);
      expect(component.steps()[2].completed).toBe(false);
      expect(component.steps()[3].completed).toBe(false);
    });
  });

  describe('Vehicle Selection', () => {
    beforeEach(() => {
      component.onBrandSelected(mockBrand);
    });

    it('should handle vehicle selection', () => {
      component.onVehicleSelected(mockVehicle);
      
      expect(component.selectedVehicle()).toEqual(mockVehicle);
      expect(component.selectedTaxRate()).toBeNull();
      expect(component.simulationResult()).toBeNull();
    });

    it('should update step completion on vehicle selection', () => {
      component.onVehicleSelected(mockVehicle);
      
      expect(component.steps()[1].completed).toBe(true);
      expect(component.steps()[2].completed).toBe(false);
      expect(component.steps()[3].completed).toBe(false);
    });

    it('should update down payment validation when vehicle is selected', () => {
      component.onVehicleSelected(mockVehicle);
      
      const downPaymentControl = component.simulationForm.get('downPayment');
      downPaymentControl?.setValue(mockVehicle.price * 0.9); // 90% of vehicle price
      
      expect(downPaymentControl?.hasError('max')).toBe(true);
    });
  });

  describe('Tax Rate Selection', () => {
    beforeEach(() => {
      component.onBrandSelected(mockBrand);
      component.onVehicleSelected(mockVehicle);
    });

    it('should handle tax rate selection', () => {
      component.onTaxesSelected(mockTaxRate);
      
      expect(component.selectedTaxRate()).toEqual(mockTaxRate);
      expect(component.simulationResult()).toBeNull();
    });

    it('should update step completion on tax rate selection', () => {
      component.onTaxesSelected(mockTaxRate);
      
      expect(component.steps()[2].completed).toBe(true);
      expect(component.steps()[3].completed).toBe(false);
    });
  });

  describe('Financial Calculation', () => {
    beforeEach(() => {
      component.onBrandSelected(mockBrand);
      component.onVehicleSelected(mockVehicle);
      component.onTaxesSelected(mockTaxRate);
      
      // Set valid form data
      Object.keys(validFormData).forEach(key => {
        component.simulationForm.get(key)?.setValue(validFormData[key as keyof typeof validFormData]);
      });
    });

    it('should calculate financing when all data is available', () => {
      component.onCalculateFinancing();
      
      expect(component.simulationResult()).toBeDefined();
      expect(component.simulationResult()?.vehiclePrice).toBe(mockVehicle.price);
      expect(component.simulationResult()?.downPayment).toBe(validFormData.downPayment);
    });

    it('should mark step 4 as completed after calculation', () => {
      component.onCalculateFinancing();
      
      expect(component.steps()[3].completed).toBe(true);
    });

    it('should calculate monthly payment correctly', () => {
      component.onCalculateFinancing();
      
      const result = component.simulationResult();
      expect(result?.monthlyPayment).toBeGreaterThan(0);
      expect(result?.totalAmount).toBeGreaterThan(result?.vehiclePrice || 0);
    });

    it('should include additional fees in calculation', () => {
      component.onCalculateFinancing();
      
      const result = component.simulationResult();
      const expectedTotalFees = mockTaxRate.additionalFees.reduce((sum, fee) => sum + fee.amount, 0);
      
      expect(result?.totalFees).toBe(expectedTotalFees);
    });

    it('should not calculate with invalid form', () => {
      component.simulationForm.get('downPayment')?.setValue(-100);
      
      component.onCalculateFinancing();
      
      expect(component.simulationResult()).toBeNull();
    });

    it('should not calculate without required selections', () => {
      component.selectedBrand.set(null);
      
      component.onCalculateFinancing();
      
      expect(component.simulationResult()).toBeNull();
    });
  });

  describe('Utility Methods', () => {
    it('should check if calculation is possible', () => {
      expect(component.canCalculate()).toBe(false);
      
      component.onBrandSelected(mockBrand);
      expect(component.canCalculate()).toBe(false);
      
      component.onVehicleSelected(mockVehicle);
      expect(component.canCalculate()).toBe(false);
      
      component.onTaxesSelected(mockTaxRate);
      expect(component.canCalculate()).toBe(true);
    });

    it('should format currency correctly', () => {
      const formatted = component.formatCurrency(25000);
      expect(formatted).toBe('$25,000.00');
    });

    it('should format percentage correctly', () => {
      const formatted = component.formatPercentage(4.5);
      expect(formatted).toBe('4.5%');
    });

    it('should detect invalid fields', () => {
      const form = component.simulationForm;
      form.get('downPayment')?.setValue('');
      form.get('downPayment')?.markAsTouched();
      
      expect(component.isFieldInvalid('downPayment')).toBe(true);
    });

    it('should get field error messages', () => {
      const form = component.simulationForm;
      form.get('downPayment')?.setValue('');
      form.get('downPayment')?.markAsTouched();
      
      const error = component.getFieldError('downPayment');
      expect(error).toContain('required');
    });

    it('should calculate completion percentage', () => {
      expect(component.getCompletionPercentage()).toBe(0);
      
      component.onBrandSelected(mockBrand);
      expect(component.getCompletionPercentage()).toBe(25);
      
      component.onVehicleSelected(mockVehicle);
      expect(component.getCompletionPercentage()).toBe(50);
    });

    it('should get current step', () => {
      expect(component.getCurrentStep()).toBe(1);
      
      component.onBrandSelected(mockBrand);
      expect(component.getCurrentStep()).toBe(2);
      
      component.onVehicleSelected(mockVehicle);
      expect(component.getCurrentStep()).toBe(3);
      
      component.onTaxesSelected(mockTaxRate);
      expect(component.getCurrentStep()).toBe(4);
    });
  });

  describe('Reset Functionality', () => {
    beforeEach(() => {
      component.onBrandSelected(mockBrand);
      component.onVehicleSelected(mockVehicle);
      component.onTaxesSelected(mockTaxRate);
      
      Object.keys(validFormData).forEach(key => {
        component.simulationForm.get(key)?.setValue(validFormData[key as keyof typeof validFormData]);
      });
      
      component.onCalculateFinancing();
    });

    it('should reset all selections and form', () => {
      component.resetSimulation();
      
      expect(component.selectedBrand()).toBeNull();
      expect(component.selectedVehicle()).toBeNull();
      expect(component.selectedTaxRate()).toBeNull();
      expect(component.simulationResult()).toBeNull();
      
      expect(component.simulationForm.get('downPayment')?.value).toBeNull();
      expect(component.simulationForm.get('termMonths')?.value).toBeNull();
      expect(component.simulationForm.get('monthlyIncome')?.value).toBeNull();
    });

    it('should reset all step completion status', () => {
      component.resetSimulation();
      
      component.steps().forEach(step => {
        expect(step.completed).toBe(false);
      });
    });
  });

  describe('Integration', () => {
    it('should complete full simulation flow', () => {
      // Step 1: Select brand
      component.onBrandSelected(mockBrand);
      expect(component.getCurrentStep()).toBe(2);
      
      // Step 2: Select vehicle
      component.onVehicleSelected(mockVehicle);
      expect(component.getCurrentStep()).toBe(3);
      
      // Step 3: Select tax rate
      component.onTaxesSelected(mockTaxRate);
      expect(component.getCurrentStep()).toBe(4);
      
      // Step 4: Fill form and calculate
      Object.keys(validFormData).forEach(key => {
        component.simulationForm.get(key)?.setValue(validFormData[key as keyof typeof validFormData]);
      });
      
      component.onCalculateFinancing();
      
      expect(component.getCompletionPercentage()).toBe(100);
      expect(component.simulationResult()).toBeDefined();
    });
  });
});
