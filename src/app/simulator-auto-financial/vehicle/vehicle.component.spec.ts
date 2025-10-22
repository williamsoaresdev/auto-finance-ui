import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleComponent } from './vehicle.component';
import { VehiclesMockService } from '../../services/vehicles-mock.service';
import { Brand, VehicleModel, VehicleCategory, FuelType, TransmissionType } from '../../types';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const mockBrand: Brand = {
  id: 1,
  name: 'Toyota',
  country: 'Japan',
  established: 1937
};

const mockVehicles: VehicleModel[] = [
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
    features: ['Safety Sense 2.0', 'Apple CarPlay']
  },
  {
    id: 2,
    brandId: 1,
    name: 'RAV4',
    year: 2024,
    price: 28000,
    category: VehicleCategory.SUV,
    fuelType: FuelType.HYBRID,
    transmission: TransmissionType.CVT,
    engine: '2.5L Hybrid',
    features: ['AWD', 'Safety Sense 2.0']
  },
  {
    id: 3,
    brandId: 2,
    name: 'Civic',
    year: 2024,
    price: 23000,
    category: VehicleCategory.SEDAN,
    fuelType: FuelType.GASOLINE,
    transmission: TransmissionType.CVT,
    engine: '2.0L 4-Cylinder',
    features: ['Honda Sensing']
  }
];

describe('VehicleComponent', () => {
  let component: VehicleComponent;
  let fixture: ComponentFixture<VehicleComponent>;
  let vehiclesMockService: jasmine.SpyObj<VehiclesMockService>;

  beforeEach(async () => {
    const vehicleServiceSpy = jasmine.createSpyObj('VehiclesMockService', [
      'getAllVehicles',
      'getVehiclesByBrandId'
    ]);

    await TestBed.configureTestingModule({
      imports: [VehicleComponent, NoopAnimationsModule],
      providers: [
        { provide: VehiclesMockService, useValue: vehicleServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleComponent);
    component = fixture.componentInstance;
    vehiclesMockService = TestBed.inject(VehiclesMockService) as jasmine.SpyObj<VehiclesMockService>;
    
    // Set default return values for spies
    vehiclesMockService.getAllVehicles.and.returnValue(of([]));
    vehiclesMockService.getVehiclesByBrandId.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should load all vehicles on init', () => {
      vehiclesMockService.getAllVehicles.and.returnValue(of(mockVehicles));
      
      component.ngOnInit();
      
      expect(vehiclesMockService.getAllVehicles).toHaveBeenCalled();
      expect(component.vehicles()).toEqual(mockVehicles);
    });

    it('should handle service error gracefully on init', () => {
      spyOn(console, 'error');
      vehiclesMockService.getAllVehicles.and.returnValue(throwError(() => new Error('Service error')));
      
      component.ngOnInit();
      
      expect(console.error).toHaveBeenCalledWith('Error loading vehicles:', jasmine.any(Error));
      expect(component.vehicles()).toEqual([]);
    });

    it('should initialize with no selected vehicle', () => {
      expect(component.selectedVehicle()).toBeNull();
    });

    it('should initialize with empty filtered vehicles', () => {
      expect(component.filteredVehicles()).toEqual([]);
    });
  });

  describe('Brand Selection Effect', () => {
    beforeEach(() => {
      vehiclesMockService.getAllVehicles.and.returnValue(of(mockVehicles));
      vehiclesMockService.getVehiclesByBrandId.and.returnValue(of(mockVehicles.filter(v => v.brandId === 1)));
    });

    it('should load vehicles when brand is selected', () => {
      fixture.componentRef.setInput('selectedBrand', mockBrand);
      fixture.detectChanges();
      
      expect(vehiclesMockService.getVehiclesByBrandId).toHaveBeenCalledWith(mockBrand.id);
      expect(component.filteredVehicles().length).toBeGreaterThan(0);
    });

    it('should clear filtered vehicles when no brand is selected', () => {
      fixture.componentRef.setInput('selectedBrand', null);
      fixture.detectChanges();
      
      expect(component.filteredVehicles()).toEqual([]);
    });

    it('should reset selected vehicle when brand changes', () => {
      // Set initial brand and select a vehicle
      fixture.componentRef.setInput('selectedBrand', mockBrand);
      fixture.detectChanges();
      component.onVehicleSelect(mockVehicles[0]);
      
      expect(component.selectedVehicle()).toEqual(mockVehicles[0]);
      
      // Change brand
      const newBrand: Brand = { id: 2, name: 'Honda', country: 'Japan', established: 1946 };
      fixture.componentRef.setInput('selectedBrand', newBrand);
      fixture.detectChanges();
      
      expect(component.selectedVehicle()).toBeNull();
    });

    it('should handle error when loading vehicles by brand', () => {
      spyOn(console, 'error');
      vehiclesMockService.getVehiclesByBrandId.and.returnValue(throwError(() => new Error('Brand vehicles error')));
      
      fixture.componentRef.setInput('selectedBrand', mockBrand);
      fixture.detectChanges();
      
      expect(console.error).toHaveBeenCalledWith('Error loading vehicles by brand:', jasmine.any(Error));
    });
  });

  describe('Vehicle Selection', () => {
    beforeEach(() => {
      vehiclesMockService.getAllVehicles.and.returnValue(of(mockVehicles));
      vehiclesMockService.getVehiclesByBrandId.and.returnValue(of(mockVehicles.filter(v => v.brandId === 1)));
      fixture.componentRef.setInput('selectedBrand', mockBrand);
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should select vehicle when onVehicleSelect is called', () => {
      const vehicle = mockVehicles[0];
      
      component.onVehicleSelect(vehicle);
      
      expect(component.selectedVehicle()).toEqual(vehicle);
    });

    it('should emit vehicleSelected event when vehicle is selected', () => {
      spyOn(component.vehicleSelected, 'emit');
      const vehicle = mockVehicles[0];
      
      component.onVehicleSelect(vehicle);
      
      expect(component.vehicleSelected.emit).toHaveBeenCalledWith(vehicle);
    });

    it('should allow selecting different vehicles', () => {
      const firstVehicle = mockVehicles[0];
      const secondVehicle = mockVehicles[1];
      
      component.onVehicleSelect(firstVehicle);
      expect(component.selectedVehicle()).toEqual(firstVehicle);
      
      component.onVehicleSelect(secondVehicle);
      expect(component.selectedVehicle()).toEqual(secondVehicle);
    });
  });

  describe('Utility Methods', () => {
    describe('formatPrice', () => {
      it('should format price as USD currency', () => {
        const formatted = component.formatPrice(25000);
        expect(formatted).toBe('$25,000.00');
      });

      it('should handle decimal prices', () => {
        const formatted = component.formatPrice(25000.99);
        expect(formatted).toBe('$25,000.99');
      });

      it('should handle zero price', () => {
        const formatted = component.formatPrice(0);
        expect(formatted).toBe('$0.00');
      });

      it('should handle large prices', () => {
        const formatted = component.formatPrice(125000);
        expect(formatted).toBe('$125,000.00');
      });
    });

    describe('getCategoryIcon', () => {
      it('should return correct icon for sedan', () => {
        const icon = component.getCategoryIcon(VehicleCategory.SEDAN);
        expect(icon).toBe('🚗');
      });

      it('should return correct icon for SUV', () => {
        const icon = component.getCategoryIcon(VehicleCategory.SUV);
        expect(icon).toBe('🚙');
      });

      it('should return correct icon for truck', () => {
        const icon = component.getCategoryIcon(VehicleCategory.TRUCK);
        expect(icon).toBe('🚚');
      });

      it('should return default icon for unknown category', () => {
        const icon = component.getCategoryIcon('unknown' as VehicleCategory);
        expect(icon).toBe('🚗');
      });
    });

    describe('getFuelTypeLabel', () => {
      it('should return correct label for gasoline', () => {
        const label = component.getFuelTypeLabel(FuelType.GASOLINE);
        expect(label).toBe('Gasoline');
      });

      it('should return correct label for hybrid', () => {
        const label = component.getFuelTypeLabel(FuelType.HYBRID);
        expect(label).toBe('Hybrid');
      });

      it('should return correct label for electric', () => {
        const label = component.getFuelTypeLabel(FuelType.ELECTRIC);
        expect(label).toBe('Electric');
      });

      it('should return fuel type as fallback for unknown type', () => {
        const label = component.getFuelTypeLabel('unknown' as FuelType);
        expect(label).toBe('unknown');
      });
    });

    describe('getTransmissionLabel', () => {
      it('should return correct label for automatic', () => {
        const label = component.getTransmissionLabel(TransmissionType.AUTOMATIC);
        expect(label).toBe('Automatic');
      });

      it('should return correct label for manual', () => {
        const label = component.getTransmissionLabel(TransmissionType.MANUAL);
        expect(label).toBe('Manual');
      });

      it('should return correct label for CVT', () => {
        const label = component.getTransmissionLabel(TransmissionType.CVT);
        expect(label).toBe('CVT');
      });

      it('should return transmission type as fallback for unknown type', () => {
        const label = component.getTransmissionLabel('unknown' as TransmissionType);
        expect(label).toBe('unknown');
      });
    });
  });

  describe('Template Integration', () => {
    beforeEach(() => {
      vehiclesMockService.getAllVehicles.and.returnValue(of(mockVehicles));
      vehiclesMockService.getVehiclesByBrandId.and.returnValue(of(mockVehicles.filter(v => v.brandId === 1)));
      fixture.componentRef.setInput('selectedBrand', mockBrand);
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display filtered vehicles in the template', () => {
      const vehicleElements = fixture.debugElement.queryAll(By.css('[data-testid="vehicle-item"]'));
      expect(vehicleElements.length).toBe(component.filteredVehicles().length);
    });

    it('should display vehicle names correctly', () => {
      const nameElements = fixture.debugElement.queryAll(By.css('[data-testid="vehicle-name"]'));
      
      nameElements.forEach((element, index) => {
        expect(element.nativeElement.textContent.trim()).toBe(component.filteredVehicles()[index].name);
      });
    });

    it('should display formatted prices', () => {
      const priceElements = fixture.debugElement.queryAll(By.css('[data-testid="vehicle-price"]'));
      
      priceElements.forEach((element, index) => {
        const expectedPrice = component.formatPrice(component.filteredVehicles()[index].price);
        expect(element.nativeElement.textContent.trim()).toContain(expectedPrice);
      });
    });

    it('should handle vehicle click events', () => {
      spyOn(component, 'onVehicleSelect');
      const firstVehicleElement = fixture.debugElement.query(By.css('[data-testid="vehicle-item"]'));
      
      firstVehicleElement.nativeElement.click();
      
      expect(component.onVehicleSelect).toHaveBeenCalledWith(component.filteredVehicles()[0]);
    });

    it('should apply selected styling to chosen vehicle', () => {
      component.onVehicleSelect(component.filteredVehicles()[0]);
      fixture.detectChanges();
      
      const selectedVehicleElement = fixture.debugElement.query(By.css('.selected'));
      expect(selectedVehicleElement).toBeTruthy();
    });

    it('should show message when no brand is selected', () => {
      fixture.componentRef.setInput('selectedBrand', null);
      fixture.detectChanges();
      
      const messageElement = fixture.debugElement.query(By.css('[data-testid="no-brand-message"]'));
      expect(messageElement).toBeTruthy();
    });

    it('should show message when no vehicles are available', () => {
      // Clear the selected brand to ensure we're in the "no brand selected" state  
      fixture.componentRef.setInput('selectedBrand', null);
      fixture.detectChanges();
      
      // Since no brand is selected, the no-brand message should be shown
      // But we want to test the no-vehicles case, so let's set a brand with no vehicles
      const brandWithNoVehicles: Brand = { id: 999, name: 'NonExistent', country: 'Unknown', established: 2000 };
      
      // Configure mock to return empty array for this specific brand
      vehiclesMockService.getVehiclesByBrandId.and.returnValue(of([]));
      
      // Set the brand
      fixture.componentRef.setInput('selectedBrand', brandWithNoVehicles);
      fixture.detectChanges();
      
      // Since filteredVehicles starts empty and brand triggers filtering
      // The component should show the no-vehicles message
      const messageElement = fixture.debugElement.query(By.css('[data-testid="no-vehicles-message"]'));
      expect(messageElement).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      vehiclesMockService.getAllVehicles.and.returnValue(of(mockVehicles));
      vehiclesMockService.getVehiclesByBrandId.and.returnValue(of(mockVehicles.filter(v => v.brandId === 1)));
      fixture.componentRef.setInput('selectedBrand', mockBrand);
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should have proper ARIA labels on vehicle items', () => {
      const vehicleElements = fixture.debugElement.queryAll(By.css('[data-testid="vehicle-item"]'));
      
      vehicleElements.forEach(element => {
        expect(element.nativeElement.getAttribute('aria-label')).toBeTruthy();
        expect(element.nativeElement.getAttribute('role')).toBe('button');
      });
    });

    it('should indicate selected state with ARIA attributes', () => {
      component.onVehicleSelect(component.filteredVehicles()[0]);
      fixture.detectChanges();
      
      const selectedElement = fixture.debugElement.query(By.css('[aria-selected="true"]'));
      expect(selectedElement).toBeTruthy();
    });

    it('should support keyboard navigation', () => {
      const vehicleElements = fixture.debugElement.queryAll(By.css('[data-testid="vehicle-item"]'));
      
      vehicleElements.forEach(element => {
        expect(element.nativeElement.tabIndex).toBe(0);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle empty vehicles array', () => {
      vehiclesMockService.getAllVehicles.and.returnValue(of([]));
      vehiclesMockService.getVehiclesByBrandId.and.returnValue(of([]));
      
      component.ngOnInit();
      fixture.componentRef.setInput('selectedBrand', mockBrand);
      fixture.detectChanges();
      
      expect(component.vehicles()).toEqual([]);
      expect(component.filteredVehicles()).toEqual([]);
    });

    it('should handle null vehicle selection', () => {
      expect(() => {
        component.onVehicleSelect(null as any);
      }).not.toThrow();
    });

    it('should handle invalid brand ID', () => {
      vehiclesMockService.getVehiclesByBrandId.and.returnValue(of([]));
      const invalidBrand: Brand = { id: 999, name: 'Invalid', country: 'Unknown', established: 2000 };
      
      fixture.componentRef.setInput('selectedBrand', invalidBrand);
      fixture.detectChanges();
      
      expect(vehiclesMockService.getVehiclesByBrandId).toHaveBeenCalledWith(999);
      expect(component.filteredVehicles()).toEqual([]);
    });
  });
});