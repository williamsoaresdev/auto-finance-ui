import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BrandComponent } from './brand/brand.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { TaxesComponent } from './taxes/taxes.component';

import { Brand, VehicleModel, TaxRate, FinancingSimulation, SimulationStep, FeeType } from '../types';

@Component({
  selector: 'app-simulator-auto-financial',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BrandComponent, VehicleComponent, TaxesComponent],
  templateUrl: './simulator-auto-financial.component.html',
  styleUrl: './simulator-auto-financial.component.css'
})
export class SimulatorAutoFinancialComponent {
  private formBuilder = inject(FormBuilder);

  selectedBrand = signal<Brand | null>(null);
  selectedVehicle = signal<VehicleModel | null>(null);
  selectedTaxRate = signal<TaxRate | null>(null);
  simulationResult = signal<FinancingSimulation | null>(null);
  isCalculating = signal<boolean>(false);
  
  simulationForm: FormGroup;

  steps = signal<SimulationStep[]>([
    { step: 1, title: 'Brand', completed: false },
    { step: 2, title: 'Vehicle', completed: false },
    { step: 3, title: 'Rates', completed: false },
    { step: 4, title: 'Financing', completed: false }
  ]);

  constructor() {
    this.simulationForm = this.formBuilder.group({
      downPayment: ['', [Validators.required, Validators.min(0)]],
      termMonths: ['', [Validators.required, Validators.min(12), Validators.max(84)]],
      monthlyIncome: ['', [Validators.required, Validators.min(182)]]
    });
  }

  onBrandSelected(brand: Brand): void {
    this.selectedBrand.set(brand);
    this.selectedVehicle.set(null);
    this.selectedTaxRate.set(null);
    this.simulationResult.set(null);
    this.updateStepCompletion(1, true);
    this.updateStepCompletion(2, false);
    this.updateStepCompletion(3, false);
    this.updateStepCompletion(4, false);
    
    this.scrollToStep(2);
  }

  onVehicleSelected(vehicle: VehicleModel): void {
    this.selectedVehicle.set(vehicle);
    this.selectedTaxRate.set(null);
    this.simulationResult.set(null);
    this.updateStepCompletion(2, true);
    this.updateStepCompletion(3, false);
    this.updateStepCompletion(4, false);
    
    this.updateDownPaymentValidation();
    
    this.scrollToStep(3);
  }

  onTaxesSelected(taxRate: TaxRate): void {
    this.selectedTaxRate.set(taxRate);
    this.simulationResult.set(null);
    this.updateStepCompletion(3, true);
    this.updateStepCompletion(4, false);
    
    this.scrollToStep(4);
  }

  private updateStepCompletion(step: number, completed: boolean): void {
    const currentSteps = this.steps();
    const stepIndex = currentSteps.findIndex(s => s.step === step);
    if (stepIndex !== -1) {
      const updatedSteps = [...currentSteps];
      updatedSteps[stepIndex].completed = completed;
      this.steps.set(updatedSteps);
    }
  }

  private updateDownPaymentValidation(): void {
    const vehicle = this.selectedVehicle();
    if (vehicle) {
      const downPaymentControl = this.simulationForm.get('downPayment');
      downPaymentControl?.setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(vehicle.price * 0.8)
      ]);
      downPaymentControl?.updateValueAndValidity();
    }
  }

  onCalculateFinancing(): void {
    if (this.canCalculate() && this.simulationForm.valid) {
      this.isCalculating.set(true);
      
      this.calculateFinancing();
      this.isCalculating.set(false);
      this.updateStepCompletion(4, true);
      
      this.scrollToResults();
    } else {
      this.markFormGroupTouched();
    }
  }

  private calculateFinancing(): void {
    const vehicle = this.selectedVehicle();
    const taxRate = this.selectedTaxRate();
    
    if (!vehicle || !taxRate) return;

    const formValues = this.simulationForm.value;
    const vehiclePrice = vehicle.price;
    const downPayment = Number(formValues.downPayment) || 0;
    const termMonths = Number(formValues.termMonths);
    const annualInterestRate = taxRate.taxPercentage / 100;
    const monthlyInterestRate = annualInterestRate / 12;

    const totalAdditionalFees = this.calculateTotalAdditionalFees();
    
    const financedAmount = vehiclePrice - downPayment + totalAdditionalFees;

    if (isNaN(financedAmount) || isNaN(monthlyInterestRate) || isNaN(termMonths) || 
        financedAmount <= 0 || termMonths <= 0) {
      return;
    }

    const monthlyPayment = this.calculateMonthlyPayment(
      financedAmount,
      monthlyInterestRate,
      termMonths
    );

    if (isNaN(monthlyPayment)) {
      return;
    }

    const totalAmount = monthlyPayment * termMonths + downPayment;
    const totalInterest = totalAmount - vehiclePrice - totalAdditionalFees;

    const result: FinancingSimulation = {
      brandId: this.selectedBrand()?.id,
      vehicleId: vehicle.id,
      vehiclePrice,
      downPayment,
      financedAmount,
      interestRate: taxRate.taxPercentage,
      termMonths,
      taxRate: taxRate.taxPercentage,
      additionalFees: taxRate.additionalFees,
      monthlyPayment,
      totalAmount,
      totalInterest,
      totalTaxes: totalAdditionalFees,
      totalFees: totalAdditionalFees
    };

    this.simulationResult.set(result);
  }

  private calculateMonthlyPayment(principal: number, monthlyRate: number, months: number): number {
    if (monthlyRate === 0) return principal / months;
    
    const factor = Math.pow(1 + monthlyRate, months);
    return principal * (monthlyRate * factor) / (factor - 1);
  }

  private calculateTotalAdditionalFees(): number {
    const taxRate = this.selectedTaxRate();
    const vehicle = this.selectedVehicle();
    
    if (!taxRate || !vehicle) return 0;
    
    return taxRate.additionalFees.reduce((total, fee) => {
      if (fee.type === FeeType.FIXED) {
        return total + fee.amount;
      } else {
        return total + (vehicle.price * fee.amount / 100);
      }
    }, 0);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.simulationForm.controls).forEach(key => {
      const control = this.simulationForm.get(key);
      control?.markAsTouched();
    });
  }

  canCalculate(): boolean {
    return !!(this.selectedBrand() && this.selectedVehicle() && this.selectedTaxRate());
  }

  resetSimulation(): void {
    this.selectedBrand.set(null);
    this.selectedVehicle.set(null);
    this.selectedTaxRate.set(null);
    this.simulationResult.set(null);
    this.simulationForm.reset();
    
    const resetSteps = this.steps().map(step => ({ ...step, completed: false }));
    this.steps.set(resetSteps);
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.simulationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.simulationForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      const errors = field.errors;
      
      if (errors['required']) return `${fieldName} is required`;
      if (errors['min']) return `${fieldName} must be at least ${this.formatCurrency(errors['min'].min)}`;
      if (errors['max']) return `${fieldName} cannot exceed ${this.formatCurrency(errors['max'].max)}`;
    }
    return '';
  }

  getCompletionPercentage(): number {
    const currentSteps = this.steps();
    const completedSteps = currentSteps.filter(step => step.completed).length;
    return (completedSteps / currentSteps.length) * 100;
  }

  getCurrentStep(): number {
    if (!this.selectedBrand()) return 1;
    if (!this.selectedVehicle()) return 2;
    if (!this.selectedTaxRate()) return 3;
    return 4;
  }

  private scrollToStep(step: number): void {
    setTimeout(() => {
      const element = document.getElementById(`step-${step}`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 300);
  }

  private scrollToResults(): void {
    setTimeout(() => {
      const element = document.getElementById('results-section');
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  }
}