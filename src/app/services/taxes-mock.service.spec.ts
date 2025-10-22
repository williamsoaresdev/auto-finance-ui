import { TestBed } from '@angular/core/testing';
import { TaxesMockService, CreditProfile } from './taxes-mock.service';
import { TaxRate, FeeType } from '../types';

describe('TaxesMockService', () => {
  let service: TaxesMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxesMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCreditProfiles', () => {
    it('should return credit profiles observable', (done) => {
      service.getCreditProfiles().subscribe(profiles => {
        expect(profiles).toBeDefined();
        expect(profiles.length).toBe(4);
        expect(profiles[0].id).toBe('excellent');
        expect(profiles[1].id).toBe('good');
        expect(profiles[2].id).toBe('fair');
        expect(profiles[3].id).toBe('poor');
        done();
      });
    });

    it('should return profiles with correct structure', (done) => {
      service.getCreditProfiles().subscribe(profiles => {
        profiles.forEach(profile => {
          expect(profile.id).toBeDefined();
          expect(profile.name).toBeDefined();
          expect(profile.description).toBeDefined();
          expect(profile.rateAdjustment).toBeDefined();
          expect(profile.color).toBeDefined();
        });
        done();
      });
    });
  });

  describe('getBaseTaxRates', () => {
    it('should return base tax rates observable', (done) => {
      service.getBaseTaxRates().subscribe(rates => {
        expect(rates).toBeDefined();
        expect(rates.length).toBe(7);
        expect(rates[0].vehicleYear).toBe(2024);
        expect(rates[6].vehicleYear).toBe(2009);
        done();
      });
    });

    it('should return rates with correct structure', (done) => {
      service.getBaseTaxRates().subscribe(rates => {
        rates.forEach(rate => {
          expect(rate.id).toBeDefined();
          expect(rate.vehicleYear).toBeDefined();
          expect(rate.yearRange).toBeDefined();
          expect(rate.taxPercentage).toBeDefined();
          expect(rate.description).toBeDefined();
          expect(rate.additionalFees).toBeDefined();
          expect(Array.isArray(rate.additionalFees)).toBe(true);
        });
        done();
      });
    });
  });
});