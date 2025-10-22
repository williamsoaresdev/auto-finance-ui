import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandComponent } from './brand.component';
import { BrandsMockService } from '../../services/brands-mock.service';
import { Brand } from '../../types';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const mockBrands: Brand[] = [
  {
    id: 1,
    name: 'Toyota',
    country: 'Japan',
    established: 1937
  },
  {
    id: 2,
    name: 'Honda Motor Co',
    country: 'Japan',
    established: 1946
  },
  {
    id: 3,
    name: 'Ford',
    country: 'USA',
    established: 1903
  }
];

describe('BrandComponent', () => {
  let component: BrandComponent;
  let fixture: ComponentFixture<BrandComponent>;
  let brandsMockService: jasmine.SpyObj<BrandsMockService>;

  beforeEach(async () => {
    const brandServiceSpy = jasmine.createSpyObj('BrandsMockService', ['getAllBrands']);

    await TestBed.configureTestingModule({
      imports: [BrandComponent, NoopAnimationsModule],
      providers: [
        { provide: BrandsMockService, useValue: brandServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandComponent);
    component = fixture.componentInstance;
    brandsMockService = TestBed.inject(BrandsMockService) as jasmine.SpyObj<BrandsMockService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should load brands on init', () => {
      brandsMockService.getAllBrands.and.returnValue(of(mockBrands));
      
      component.ngOnInit();
      
      expect(brandsMockService.getAllBrands).toHaveBeenCalled();
      expect(component.brands()).toEqual(mockBrands);
    });

    it('should handle service error gracefully', () => {
      spyOn(console, 'error');
      brandsMockService.getAllBrands.and.returnValue(throwError(() => new Error('Service error')));
      
      component.ngOnInit();
      
      expect(console.error).toHaveBeenCalledWith('Error loading brands:', jasmine.any(Error));
      expect(component.brands()).toEqual([]);
    });

    it('should initialize with no selected brand', () => {
      expect(component.selectedBrand()).toBeNull();
    });

    it('should initialize with empty brands array', () => {
      expect(component.brands()).toEqual([]);
    });
  });

  describe('Brand Selection', () => {
    beforeEach(() => {
      brandsMockService.getAllBrands.and.returnValue(of(mockBrands));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should select brand when onBrandSelect is called', () => {
      const brand = mockBrands[0];
      
      component.onBrandSelect(brand);
      
      expect(component.selectedBrand()).toEqual(brand);
    });

    it('should emit brandSelected event when brand is selected', () => {
      spyOn(component.brandSelected, 'emit');
      const brand = mockBrands[0];
      
      component.onBrandSelect(brand);
      
      expect(component.brandSelected.emit).toHaveBeenCalledWith(brand);
    });

    it('should allow selecting different brands', () => {
      const firstBrand = mockBrands[0];
      const secondBrand = mockBrands[1];
      
      component.onBrandSelect(firstBrand);
      expect(component.selectedBrand()).toEqual(firstBrand);
      
      component.onBrandSelect(secondBrand);
      expect(component.selectedBrand()).toEqual(secondBrand);
    });
  });

  describe('Brand Initials', () => {
    it('should generate initials for single word brand', () => {
      const initials = component.getBrandInitials('Toyota');
      expect(initials).toBe('T');
    });

    it('should generate initials for multi-word brand', () => {
      const initials = component.getBrandInitials('Honda Motor Co');
      expect(initials).toBe('HMC');
    });

    it('should handle brand with spaces correctly', () => {
      const initials = component.getBrandInitials('General Motors');
      expect(initials).toBe('GM');
    });

    it('should return uppercase initials', () => {
      const initials = component.getBrandInitials('volkswagen group');
      expect(initials).toBe('VG');
    });

    it('should handle empty string', () => {
      const initials = component.getBrandInitials('');
      expect(initials).toBe('');
    });

    it('should handle single character brand', () => {
      const initials = component.getBrandInitials('X');
      expect(initials).toBe('X');
    });
  });

  describe('Template Integration', () => {
    beforeEach(() => {
      brandsMockService.getAllBrands.and.returnValue(of(mockBrands));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display all brands in the template', () => {
      const brandElements = fixture.debugElement.queryAll(By.css('[data-testid="brand-item"]'));
      expect(brandElements.length).toBe(mockBrands.length);
    });

    it('should display brand names correctly', () => {
      const brandElements = fixture.debugElement.queryAll(By.css('[data-testid="brand-name"]'));
      
      brandElements.forEach((element, index) => {
        expect(element.nativeElement.textContent.trim()).toBe(mockBrands[index].name);
      });
    });

    it('should handle brand click events', () => {
      spyOn(component, 'onBrandSelect');
      const firstBrandElement = fixture.debugElement.query(By.css('[data-testid="brand-item"]'));
      
      firstBrandElement.nativeElement.click();
      
      expect(component.onBrandSelect).toHaveBeenCalledWith(mockBrands[0]);
    });

    it('should apply selected styling to chosen brand', () => {
      component.onBrandSelect(mockBrands[0]);
      fixture.detectChanges();
      
      const selectedBrandElement = fixture.debugElement.query(By.css('.selected'));
      expect(selectedBrandElement).toBeTruthy();
    });

    it('should display loading state when brands are being loaded', () => {
      component.brands.set([]);
      fixture.detectChanges();
      
      const loadingElement = fixture.debugElement.query(By.css('[data-testid="loading"]'));
      expect(loadingElement).toBeTruthy();
    });

    it('should hide loading state when brands are loaded', () => {
      const loadingElement = fixture.debugElement.query(By.css('[data-testid="loading"]'));
      expect(loadingElement).toBeFalsy();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      brandsMockService.getAllBrands.and.returnValue(of(mockBrands));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should have proper ARIA labels on brand items', () => {
      const brandElements = fixture.debugElement.queryAll(By.css('[data-testid="brand-item"]'));
      
      brandElements.forEach(element => {
        expect(element.nativeElement.getAttribute('aria-label')).toBeTruthy();
        expect(element.nativeElement.getAttribute('role')).toBe('button');
      });
    });

    it('should indicate selected state with ARIA attributes', () => {
      component.onBrandSelect(mockBrands[0]);
      fixture.detectChanges();
      
      const selectedElement = fixture.debugElement.query(By.css('[aria-pressed="true"]'));
      expect(selectedElement).toBeTruthy();
    });

    it('should support keyboard navigation', () => {
      const brandElements = fixture.debugElement.queryAll(By.css('[data-testid="brand-item"]'));
      
      brandElements.forEach(element => {
        expect(element.nativeElement.tabIndex).toBe(0);
      });
    });
  });

  describe('Error Handling', () => {
    it('should not crash when selecting null brand', () => {
      expect(() => {
        component.onBrandSelect(null as any);
      }).not.toThrow();
    });

    it('should handle service returning empty array', () => {
      brandsMockService.getAllBrands.and.returnValue(of([]));
      
      component.ngOnInit();
      
      expect(component.brands()).toEqual([]);
    });

    it('should handle service returning null', () => {
      brandsMockService.getAllBrands.and.returnValue(of(null as any));
      
      component.ngOnInit();
      fixture.detectChanges();
      
      expect(component.brands()).toEqual([]);
    });
  });

  describe('Component State Management', () => {
    it('should maintain selected brand state across re-renders', () => {
      brandsMockService.getAllBrands.and.returnValue(of(mockBrands));
      component.ngOnInit();
      
      const selectedBrand = mockBrands[1];
      component.onBrandSelect(selectedBrand);
      fixture.detectChanges();
      
      expect(component.selectedBrand()).toEqual(selectedBrand);
      
      // Trigger change detection again
      fixture.detectChanges();
      
      expect(component.selectedBrand()).toEqual(selectedBrand);
    });

    it('should reset selection when brands are reloaded', () => {
      brandsMockService.getAllBrands.and.returnValue(of(mockBrands));
      component.ngOnInit();
      
      component.onBrandSelect(mockBrands[0]);
      expect(component.selectedBrand()).toEqual(mockBrands[0]);
      
      // Reload brands
      const newBrands = [mockBrands[1], mockBrands[2]];
      brandsMockService.getAllBrands.and.returnValue(of(newBrands));
      component.ngOnInit();
      
      expect(component.brands()).toEqual(newBrands);
      // Selected brand should remain unless explicitly reset
      expect(component.selectedBrand()).toEqual(mockBrands[0]);
    });
  });
});