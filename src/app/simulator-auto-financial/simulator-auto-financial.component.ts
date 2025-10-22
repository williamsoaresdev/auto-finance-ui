import { Component } from '@angular/core';
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
  selectedBrand: Brand | null = null;
  selectedVehicle: VehicleModel | null = null;
  selectedTaxRate: TaxRate | null = null;
  
  simulationForm: FormGroup;
  simulationResult: FinancingSimulation | null = null;
  isCalculating = false;

  steps: SimulationStep[] = [
    { step: 1, title: 'Brand', completed: false },
    { step: 2, title: 'Vehicle', completed: false },
    { step: 3, title: 'Rates', completed: false },
    { step: 4, title: 'Financing', completed: false }
  ];

  constructor(private formBuilder: FormBuilder) {
    this.simulationForm = this.formBuilder.group({
      downPayment: ['', [Validators.required, Validators.min(0)]],
      termMonths: ['', [Validators.required, Validators.min(12), Validators.max(84)]],
      monthlyIncome: ['', [Validators.required, Validators.min(182)]]
    });
  }

  onBrandSelected(brand: Brand): void {
    this.selectedBrand = brand;
    this.selectedVehicle = null;
    this.selectedTaxRate = null;
    this.simulationResult = null;
    this.updateStepCompletion(1, true);
    this.updateStepCompletion(2, false);
    this.updateStepCompletion(3, false);
    this.updateStepCompletion(4, false);
    
    this.scrollToStep(2);
  }

  onVehicleSelected(vehicle: VehicleModel): void {
    this.selectedVehicle = vehicle;
    this.selectedTaxRate = null;
    this.simulationResult = null;
    this.updateStepCompletion(2, true);
    this.updateStepCompletion(3, false);
    this.updateStepCompletion(4, false);
    
    this.updateDownPaymentValidation();
    
    this.scrollToStep(3);
  }

  onTaxesSelected(taxRate: TaxRate): void {
    this.selectedTaxRate = taxRate;
    this.simulationResult = null;
    this.updateStepCompletion(3, true);
    this.updateStepCompletion(4, false);
    
    this.scrollToStep(4);
  }

  private updateStepCompletion(step: number, completed: boolean): void {
    const stepIndex = this.steps.findIndex(s => s.step === step);
    if (stepIndex !== -1) {
      this.steps[stepIndex].completed = completed;
    }
  }

  private updateDownPaymentValidation(): void {
    if (this.selectedVehicle) {
      const downPaymentControl = this.simulationForm.get('downPayment');
      downPaymentControl?.setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(this.selectedVehicle.price * 0.8)
      ]);
      downPaymentControl?.updateValueAndValidity();
    }
  }

  onCalculateFinancing(): void {
    if (this.canCalculate() && this.simulationForm.valid) {
      this.isCalculating = true;
      
      this.calculateFinancing();
      this.isCalculating = false;
      this.updateStepCompletion(4, true);
      
      this.scrollToResults();
    } else {
      this.markFormGroupTouched();
    }
  }

  private calculateFinancing(): void {
    if (!this.selectedVehicle || !this.selectedTaxRate) return;

    const formValues = this.simulationForm.value;
    const vehiclePrice = this.selectedVehicle.price;
    const downPayment = Number(formValues.downPayment) || 0;
    const termMonths = Number(formValues.termMonths);
    const annualInterestRate = this.selectedTaxRate.taxPercentage / 100;
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

    this.simulationResult = {
      brandId: this.selectedBrand?.id,
      vehicleId: this.selectedVehicle.id,
      vehiclePrice,
      downPayment,
      financedAmount,
      interestRate: this.selectedTaxRate.taxPercentage,
      termMonths,
      taxRate: this.selectedTaxRate.taxPercentage,
      additionalFees: this.selectedTaxRate.additionalFees,
      monthlyPayment,
      totalAmount,
      totalInterest,
      totalTaxes: totalAdditionalFees,
      totalFees: totalAdditionalFees
    };
  }

  private calculateMonthlyPayment(principal: number, monthlyRate: number, months: number): number {
    if (monthlyRate === 0) return principal / months;
    
    const factor = Math.pow(1 + monthlyRate, months);
    return principal * (monthlyRate * factor) / (factor - 1);
  }

  private calculateTotalAdditionalFees(): number {
    if (!this.selectedTaxRate || !this.selectedVehicle) return 0;
    
    return this.selectedTaxRate.additionalFees.reduce((total, fee) => {
      if (fee.type === FeeType.FIXED) {
        return total + fee.amount;
      } else {
        return total + (this.selectedVehicle!.price * fee.amount / 100);
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
    return !!(this.selectedBrand && this.selectedVehicle && this.selectedTaxRate);
  }

  resetSimulation(): void {
    this.selectedBrand = null;
    this.selectedVehicle = null;
    this.selectedTaxRate = null;
    this.simulationResult = null;
    this.simulationForm.reset();
    this.steps.forEach(step => step.completed = false);
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
    const completedSteps = this.steps.filter(step => step.completed).length;
    return (completedSteps / this.steps.length) * 100;
  }

  getCurrentStep(): number {
    if (!this.selectedBrand) return 1;
    if (!this.selectedVehicle) return 2;
    if (!this.selectedTaxRate) return 3;
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