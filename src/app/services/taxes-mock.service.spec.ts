import { TestBed } from '@angular/core/testing';
import { TaxesMockService } from './taxes-mock.service';
import { FeeType } from '../types';
import { firstValueFrom } from 'rxjs';

describe('TaxesMockService', () => {
  let service: TaxesMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaxesMockService]
    });
    service = TestBed.inject(TaxesMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCreditProfiles', () => {
    it('should return credit profiles observable', async () => {
      const profiles = await firstValueFrom(service.getCreditProfiles());
      
      expect(profiles).toBeDefined();
      expect(Array.isArray(profiles)).toBe(true);
      expect(profiles.length).toBe(4);
    });

    it('should return profiles in correct order', async () => {
      const profiles = await firstValueFrom(service.getCreditProfiles());
      
      expect(profiles[0].id).toBe('excellent');
      expect(profiles[1].id).toBe('good');
      expect(profiles[2].id).toBe('fair');
      expect(profiles[3].id).toBe('poor');
    });

    it('should return profiles with correct structure', async () => {
      const profiles = await firstValueFrom(service.getCreditProfiles());
      
      profiles.forEach(profile => {
        expect(profile.id).toBeDefined();
        expect(profile.name).toBeDefined();
        expect(profile.description).toBeDefined();
        expect(profile.rateAdjustment).toBeDefined();
        expect(profile.color).toBeDefined();
        
        expect(typeof profile.id).toBe('string');
        expect(typeof profile.name).toBe('string');
        expect(typeof profile.description).toBe('string');
        expect(typeof profile.rateAdjustment).toBe('number');
        expect(typeof profile.color).toBe('string');
      });
    });

    it('should have excellent credit with best rate adjustment', async () => {
      const profiles = await firstValueFrom(service.getCreditProfiles());
      const excellentProfile = profiles.find(p => p.id === 'excellent');
      
      expect(excellentProfile).toBeDefined();
      expect(excellentProfile?.rateAdjustment).toBe(-1.5);
      expect(excellentProfile?.name).toBe('Excellent Credit');
    });

    it('should have poor credit with highest rate adjustment', async () => {
      const profiles = await firstValueFrom(service.getCreditProfiles());
      const poorProfile = profiles.find(p => p.id === 'poor');
      
      expect(poorProfile).toBeDefined();
      expect(poorProfile?.rateAdjustment).toBe(5.0);
      expect(poorProfile?.name).toBe('Poor Credit');
    });

    it('should have rate adjustments in ascending order', async () => {
      const profiles = await firstValueFrom(service.getCreditProfiles());
      const rateAdjustments = profiles.map(p => p.rateAdjustment);
      
      for (let i = 1; i < rateAdjustments.length; i++) {
        expect(rateAdjustments[i]).toBeGreaterThanOrEqual(rateAdjustments[i - 1]);
      }
    });

    it('should include Tailwind CSS classes in color property', async () => {
      const profiles = await firstValueFrom(service.getCreditProfiles());
      
      profiles.forEach(profile => {
        expect(profile.color).toContain('bg-');
        expect(profile.color).toContain('text-');
        expect(profile.color).toContain('border-');
      });
    });
  });

  describe('getBaseTaxRates', () => {
    it('should return base tax rates observable', async () => {
      const rates = await firstValueFrom(service.getBaseTaxRates());
      
      expect(rates).toBeDefined();
      expect(Array.isArray(rates)).toBe(true);
      expect(rates.length).toBe(7);
    });

    it('should return rates with correct structure', async () => {
      const rates = await firstValueFrom(service.getBaseTaxRates());
      
      rates.forEach(rate => {
        expect(rate.id).toBeDefined();
        expect(rate.vehicleYear).toBeDefined();
        expect(rate.yearRange).toBeDefined();
        expect(rate.taxPercentage).toBeDefined();
        expect(rate.description).toBeDefined();
        expect(rate.additionalFees).toBeDefined();
        
        expect(typeof rate.id).toBe('number');
        expect(typeof rate.vehicleYear).toBe('number');
        expect(typeof rate.yearRange).toBe('string');
        expect(typeof rate.taxPercentage).toBe('number');
        expect(typeof rate.description).toBe('string');
        expect(Array.isArray(rate.additionalFees)).toBe(true);
      });
    });

    it('should have rates ordered from newest to oldest vehicles', async () => {
      const rates = await firstValueFrom(service.getBaseTaxRates());
      
      expect(rates[0].vehicleYear).toBe(2024);
      expect(rates[rates.length - 1].vehicleYear).toBe(2009);
      
      // Check that years are in descending order
      for (let i = 1; i < rates.length; i++) {
        expect(rates[i].vehicleYear).toBeLessThanOrEqual(rates[i - 1].vehicleYear);
      }
    });

    it('should have tax percentages decreasing with vehicle age', async () => {
      const rates = await firstValueFrom(service.getBaseTaxRates());
      
      expect(rates[0].taxPercentage).toBe(12.5); // 2024 - highest rate
      expect(rates[rates.length - 1].taxPercentage).toBe(7.5); // 2009 - lowest rate
    });

    it('should include IPVA fee for all rates', async () => {
      const rates = await firstValueFrom(service.getBaseTaxRates());
      
      rates.forEach(rate => {
        const ipvaFee = rate.additionalFees.find(fee => fee.name === 'IPVA');
        expect(ipvaFee).toBeDefined();
        expect(ipvaFee?.type).toBe(FeeType.PERCENTAGE);
        expect(ipvaFee?.amount).toBe(4.0);
      });
    });

    it('should include mandatory insurance for all rates', async () => {
      const rates = await firstValueFrom(service.getBaseTaxRates());
      
      rates.forEach(rate => {
        const insuranceFee = rate.additionalFees.find(fee => fee.name === 'Mandatory Insurance');
        expect(insuranceFee).toBeDefined();
        expect(insuranceFee?.type).toBe(FeeType.FIXED);
        expect(insuranceFee?.amount).toBe(28.77);
      });
    });

    it('should include licensing fee for all rates', async () => {
      const rates = await firstValueFrom(service.getBaseTaxRates());
      
      rates.forEach(rate => {
        const licensingFee = rate.additionalFees.find(fee => fee.name === 'Licensing Fee');
        expect(licensingFee).toBeDefined();
        expect(licensingFee?.type).toBe(FeeType.FIXED);
        expect(licensingFee?.amount).toBe(23.22);
      });
    });

    it('should have new vehicles with registration fee', async () => {
      const rates = await firstValueFrom(service.getBaseTaxRates());
      const newVehicleRate = rates.find(rate => rate.vehicleYear === 2024);
      
      expect(newVehicleRate).toBeDefined();
      const registrationFee = newVehicleRate?.additionalFees.find(fee => fee.name === 'Registration Fee');
      expect(registrationFee).toBeDefined();
      expect(registrationFee?.amount).toBe(35.55);
    });

    it('should have older vehicles with inspection fees', async () => {
      const rates = await firstValueFrom(service.getBaseTaxRates());
      const oldVehicleRate = rates.find(rate => rate.vehicleYear === 2020);
      
      expect(oldVehicleRate).toBeDefined();
      const inspectionFee = oldVehicleRate?.additionalFees.find(fee => fee.name === 'Complete Inspection');
      expect(inspectionFee).toBeDefined();
      expect(inspectionFee?.amount).toBe(22.87);
    });

    it('should have very old vehicles with rigorous inspection', async () => {
      const rates = await firstValueFrom(service.getBaseTaxRates());
      const veryOldRate = rates.find(rate => rate.vehicleYear === 2009);
      
      expect(veryOldRate).toBeDefined();
      const rigorousInspection = veryOldRate?.additionalFees.find(fee => fee.name === 'Rigorous Inspection');
      expect(rigorousInspection).toBeDefined();
      expect(rigorousInspection?.amount).toBe(185.50);
    });

    it('should have valid fee types for all additional fees', async () => {
      const rates = await firstValueFrom(service.getBaseTaxRates());
      const validFeeTypes = Object.values(FeeType);
      
      rates.forEach(rate => {
        rate.additionalFees.forEach(fee => {
          expect(validFeeTypes).toContain(fee.type);
          expect(fee.amount).toBeGreaterThan(0);
          expect(fee.name).toBeTruthy();
        });
      });
    });

    it('should have different fee structures for different vehicle ages', async () => {
      const rates = await firstValueFrom(service.getBaseTaxRates());
      
      const newRate = rates.find(rate => rate.vehicleYear === 2024);
      const oldRate = rates.find(rate => rate.vehicleYear === 2009);
      
      expect(newRate).toBeDefined();
      expect(oldRate).toBeDefined();
      expect(newRate!.additionalFees.length).toBeLessThan(oldRate!.additionalFees.length);
    });
  });

  describe('Data Consistency', () => {
    it('should maintain consistent IPVA rate across all tax rates', async () => {
      const rates = await firstValueFrom(service.getBaseTaxRates());
      const ipvaAmounts = rates.map(rate => {
        const ipvaFee = rate.additionalFees.find(fee => fee.name === 'IPVA');
        return ipvaFee?.amount;
      });
      
      const uniqueIpvaAmounts = [...new Set(ipvaAmounts)];
      expect(uniqueIpvaAmounts.length).toBe(1);
      expect(uniqueIpvaAmounts[0]).toBe(4.0);
    });

    it('should have meaningful descriptions for all rates', async () => {
      const rates = await firstValueFrom(service.getBaseTaxRates());
      
      rates.forEach(rate => {
        expect(rate.description.length).toBeGreaterThan(10);
        expect(rate.description).toContain('vehicle');
      });
    });

    it('should have year ranges that match vehicle years', async () => {
      const rates = await firstValueFrom(service.getBaseTaxRates());
      
      rates.forEach(rate => {
        expect(rate.yearRange).toContain(rate.vehicleYear.toString());
      });
    });
  });

  describe('Service Reliability', () => {
    it('should return the same data on multiple calls', async () => {
      const firstCall = await firstValueFrom(service.getCreditProfiles());
      const secondCall = await firstValueFrom(service.getCreditProfiles());
      
      expect(firstCall).toEqual(secondCall);
    });

    it('should return observables that complete', (done) => {
      let completeCalled = false;
      
      service.getCreditProfiles().subscribe({
        next: (data) => expect(data).toBeDefined(),
        complete: () => {
          completeCalled = true;
          done();
        }
      });
      
      setTimeout(() => {
        expect(completeCalled).toBe(true);
      }, 100);
    });

    it('should handle multiple simultaneous subscriptions', () => {
      const subscription1 = service.getBaseTaxRates().subscribe();
      const subscription2 = service.getBaseTaxRates().subscribe();
      const subscription3 = service.getCreditProfiles().subscribe();
      
      expect(subscription1).toBeDefined();
      expect(subscription2).toBeDefined();
      expect(subscription3).toBeDefined();
      
      subscription1.unsubscribe();
      subscription2.unsubscribe();
      subscription3.unsubscribe();
    });
  });
});