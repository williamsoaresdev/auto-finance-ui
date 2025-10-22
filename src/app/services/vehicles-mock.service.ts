import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { VehicleModel, VehicleCategory, FuelType, TransmissionType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class VehiclesMockService {

  constructor() { }

  /**
   * Retorna todos os veículos disponíveis
   * @returns Observable<VehicleModel[]>
   */
  getAllVehicles(): Observable<VehicleModel[]> {
    const vehicles: VehicleModel[] = [
      { id: 1, brandId: 1, name: 'Corolla', year: 2024, price: 24545, category: VehicleCategory.SEDAN, fuelType: FuelType.HYBRID, transmission: TransmissionType.AUTOMATIC, engine: '1.8L Hybrid', features: ['Hybrid', 'Automatic', 'Air Conditioning'] },
      { id: 2, brandId: 1, name: 'RAV4', year: 2024, price: 33636, category: VehicleCategory.SUV, fuelType: FuelType.HYBRID, transmission: TransmissionType.AUTOMATIC, engine: '2.5L Hybrid', features: ['AWD', 'Hybrid', 'Sunroof'] },
      { id: 3, brandId: 1, name: 'Prius', year: 2024, price: 30000, category: VehicleCategory.HATCHBACK, fuelType: FuelType.HYBRID, transmission: TransmissionType.AUTOMATIC, engine: '1.8L Hybrid', features: ['Hybrid', 'Economic', 'Technology'] },

      { id: 4, brandId: 2, name: 'Mustang', year: 2024, price: 50909, category: VehicleCategory.COUPE, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '5.0L V8', features: ['Sport', 'V8', 'Performance'] },
      { id: 5, brandId: 2, name: 'F-150', year: 2024, price: 58182, category: VehicleCategory.TRUCK, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '3.5L V6', features: ['4x4', 'Work', 'Powerful'] },
      { id: 6, brandId: 2, name: 'Explorer', year: 2024, price: 43636, category: VehicleCategory.SUV, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '2.3L Turbo', features: ['7 Seats', 'AWD', 'Family'] },

      { id: 7, brandId: 3, name: 'Series 3', year: 2024, price: 63636, category: VehicleCategory.SEDAN, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '2.0L Turbo', features: ['Luxury', 'Sport', 'Technology'] },
      { id: 8, brandId: 3, name: 'X5', year: 2024, price: 81818, category: VehicleCategory.SUV, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '3.0L Turbo', features: ['xDrive', 'Luxury', 'Premium'] },
      { id: 9, brandId: 3, name: 'i4', year: 2024, price: 69091, category: VehicleCategory.SEDAN, fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, engine: 'Electric', features: ['Electric', 'Luxury', 'Sustainable'] },

      { id: 10, brandId: 4, name: 'C-Class', year: 2024, price: 69091, category: VehicleCategory.SEDAN, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '2.0L Turbo', features: ['Luxury', 'Comfort', 'Elegant'] },
      { id: 11, brandId: 4, name: 'GLE', year: 2024, price: 94545, category: VehicleCategory.SUV, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '3.0L V6', features: ['4MATIC', 'Luxury', 'Spacious'] },
      { id: 12, brandId: 4, name: 'EQS', year: 2024, price: 123636, category: VehicleCategory.SEDAN, fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, engine: 'Electric', features: ['Electric', 'Ultra Luxury', 'Futuristic'] },

      { id: 13, brandId: 5, name: 'A4', year: 2024, price: 58182, category: VehicleCategory.SEDAN, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '2.0L Turbo', features: ['Quattro', 'Luxury', 'Dynamic'] },
      { id: 14, brandId: 5, name: 'Q7', year: 2024, price: 87273, category: VehicleCategory.SUV, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '3.0L V6', features: ['7 Seats', 'Quattro', 'Premium'] },
      { id: 15, brandId: 5, name: 'e-tron', year: 2024, price: 100000, category: VehicleCategory.SUV, fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, engine: 'Electric', features: ['Electric', 'Quattro', 'Innovation'] },

      { id: 16, brandId: 6, name: 'Civic', year: 2024, price: 22727, category: VehicleCategory.SEDAN, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '1.5L Turbo', features: ['Reliable', 'Economic', 'Modern'] },
      { id: 17, brandId: 6, name: 'CR-V', year: 2024, price: 30000, category: VehicleCategory.SUV, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '1.5L Turbo', features: ['AWD', 'Versatile', 'Family'] },
      { id: 18, brandId: 6, name: 'Accord', year: 2024, price: 28182, category: VehicleCategory.SEDAN, fuelType: FuelType.HYBRID, transmission: TransmissionType.AUTOMATIC, engine: '2.0L Hybrid', features: ['Hybrid', 'Spacious', 'Efficient'] },

      { id: 19, brandId: 7, name: 'Altima', year: 2024, price: 26364, category: VehicleCategory.SEDAN, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '2.5L', features: ['CVT', 'Comfortable', 'Safe'] },
      { id: 20, brandId: 7, name: 'Rogue', year: 2024, price: 31818, category: VehicleCategory.SUV, fuelType: FuelType.GASOLINE, transmission: TransmissionType.CVT, engine: '2.5L', features: ['AWD', 'Practical', 'Technology'] },
      { id: 21, brandId: 7, name: 'Leaf', year: 2024, price: 35455, category: VehicleCategory.HATCHBACK, fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, engine: 'Electric', features: ['Electric', 'Pioneer', 'Sustainable'] },

      { id: 22, brandId: 8, name: 'Jetta', year: 2024, price: 24545, category: VehicleCategory.SEDAN, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '1.4L Turbo', features: ['German', 'Quality', 'Modern'] },
      { id: 23, brandId: 8, name: 'Tiguan', year: 2024, price: 33636, category: VehicleCategory.SUV, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '2.0L Turbo', features: ['4Motion', 'European', 'Refined'] },
      { id: 24, brandId: 8, name: 'ID.4', year: 2024, price: 51818, category: VehicleCategory.SUV, fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, engine: 'Electric', features: ['Electric', 'German', 'Innovative'] },

      { id: 25, brandId: 9, name: 'Elantra', year: 2024, price: 20909, category: VehicleCategory.SEDAN, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '2.0L', features: ['Value', 'Warranty', 'Modern'] },
      { id: 26, brandId: 9, name: 'Tucson', year: 2024, price: 28182, category: VehicleCategory.SUV, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '2.5L', features: ['AWD', 'Design', 'Technology'] },
      { id: 27, brandId: 9, name: 'Ioniq 5', year: 2024, price: 48182, category: VehicleCategory.SUV, fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, engine: 'Electric', features: ['Electric', 'Futuristic', 'Fast'] },

      { id: 28, brandId: 10, name: 'Malibu', year: 2024, price: 26364, category: VehicleCategory.SEDAN, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '1.5L Turbo', features: ['American', 'Spacious', 'Technology'] },
      { id: 29, brandId: 10, name: 'Equinox', year: 2024, price: 31818, category: VehicleCategory.SUV, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '1.5L Turbo', features: ['AWD', 'Versatile', 'Reliable'] },
      { id: 30, brandId: 10, name: 'Bolt EV', year: 2024, price: 33636, category: VehicleCategory.HATCHBACK, fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, engine: 'Electric', features: ['Electric', 'Compact', 'Affordable'] },

      // Adicionando mais veículos para as novas marcas (11-15)
      { id: 31, brandId: 11, name: 'Uno', year: 2024, price: 16364, category: VehicleCategory.HATCHBACK, fuelType: FuelType.FLEX, transmission: TransmissionType.MANUAL, engine: '1.0L Flex', features: ['Compact', 'Economic', 'Brazilian'] },
      { id: 32, brandId: 11, name: 'Strada', year: 2024, price: 22727, category: VehicleCategory.TRUCK, fuelType: FuelType.FLEX, transmission: TransmissionType.MANUAL, engine: '1.4L Flex', features: ['Work', 'Versatile', 'Robust'] },
      { id: 33, brandId: 11, name: 'Toro', year: 2024, price: 35455, category: VehicleCategory.TRUCK, fuelType: FuelType.DIESEL, transmission: TransmissionType.AUTOMATIC, engine: '2.0L Diesel', features: ['4x4', 'Comfort', 'Modern'] },

      { id: 34, brandId: 12, name: 'Sandero', year: 2024, price: 18182, category: VehicleCategory.HATCHBACK, fuelType: FuelType.FLEX, transmission: TransmissionType.MANUAL, engine: '1.0L Flex', features: ['Economic', 'Practical', 'French'] },
      { id: 35, brandId: 12, name: 'Duster', year: 2024, price: 25455, category: VehicleCategory.SUV, fuelType: FuelType.FLEX, transmission: TransmissionType.AUTOMATIC, engine: '1.6L Flex', features: ['4x4', 'Adventure', 'Rugged'] },
      { id: 36, brandId: 12, name: 'Kwid', year: 2024, price: 15455, category: VehicleCategory.HATCHBACK, fuelType: FuelType.FLEX, transmission: TransmissionType.MANUAL, engine: '1.0L Flex', features: ['Compact', 'Affordable', 'Urban'] },

      { id: 37, brandId: 13, name: '208', year: 2024, price: 20909, category: VehicleCategory.HATCHBACK, fuelType: FuelType.FLEX, transmission: TransmissionType.AUTOMATIC, engine: '1.6L Flex', features: ['French', 'Style', 'Comfort'] },
      { id: 38, brandId: 13, name: '2008', year: 2024, price: 28182, category: VehicleCategory.SUV, fuelType: FuelType.FLEX, transmission: TransmissionType.AUTOMATIC, engine: '1.6L Flex', features: ['Crossover', 'Modern', 'Technology'] },
      { id: 39, brandId: 13, name: '3008', year: 2024, price: 45455, category: VehicleCategory.SUV, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '1.6L Turbo', features: ['Premium', 'Luxurious', 'Innovative'] },

      { id: 40, brandId: 14, name: 'C3', year: 2024, price: 19091, category: VehicleCategory.HATCHBACK, fuelType: FuelType.FLEX, transmission: TransmissionType.MANUAL, engine: '1.6L Flex', features: ['French', 'Comfort', 'Unique'] },
      { id: 41, brandId: 14, name: 'C4 Cactus', year: 2024, price: 27273, category: VehicleCategory.SUV, fuelType: FuelType.FLEX, transmission: TransmissionType.AUTOMATIC, engine: '1.6L Flex', features: ['Crossover', 'Distinctive', 'Airbump'] },
      { id: 42, brandId: 14, name: 'Berlingo', year: 2024, price: 32727, category: VehicleCategory.VAN, fuelType: FuelType.DIESEL, transmission: TransmissionType.MANUAL, engine: '1.6L Diesel', features: ['Commercial', 'Spacious', 'Practical'] },

      { id: 43, brandId: 15, name: 'Compass', year: 2024, price: 38182, category: VehicleCategory.SUV, fuelType: FuelType.FLEX, transmission: TransmissionType.AUTOMATIC, engine: '2.0L Flex', features: ['4x4', 'Adventure', 'Capable'] },
      { id: 44, brandId: 15, name: 'Renegade', year: 2024, price: 32727, category: VehicleCategory.SUV, fuelType: FuelType.FLEX, transmission: TransmissionType.AUTOMATIC, engine: '1.8L Flex', features: ['Compact', 'Off-road', 'Style'] },
      { id: 45, brandId: 15, name: 'Grand Cherokee', year: 2024, price: 85455, category: VehicleCategory.SUV, fuelType: FuelType.GASOLINE, transmission: TransmissionType.AUTOMATIC, engine: '3.6L V6', features: ['Luxury', '4x4', 'Premium'] }
    ];

    return of(vehicles);
  }

  /**
   * Retorna veículos filtrados por marca
   * @param brandId - ID da marca
   * @returns Observable<VehicleModel[]>
   */
  getVehiclesByBrandId(brandId: number): Observable<VehicleModel[]> {
    return new Observable(observer => {
      this.getAllVehicles().subscribe(vehicles => {
        const filteredVehicles = vehicles.filter(vehicle => vehicle.brandId === brandId);
        observer.next(filteredVehicles);
        observer.complete();
      });
    });
  }
}