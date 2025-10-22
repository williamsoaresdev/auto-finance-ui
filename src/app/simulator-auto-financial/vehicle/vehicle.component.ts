import { Component, input, output, signal, OnChanges, SimpleChanges, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Brand, VehicleModel, VehicleCategory, FuelType, TransmissionType } from '../../types';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css'
})
export class VehicleComponent implements OnChanges {
  selectedBrand = input<Brand | null>(null);
  vehicleSelected = output<VehicleModel>();

  selectedVehicle = signal<VehicleModel | null>(null);
  filteredVehicles = signal<VehicleModel[]>([]);

  vehicles: VehicleModel[] = [
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
    { id: 30, brandId: 10, name: 'Bolt EV', year: 2024, price: 33636, category: VehicleCategory.HATCHBACK, fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, engine: 'Electric', features: ['Electric', 'Compact', 'Affordable'] }
  ];

  constructor() {
    // Effect para atualizar filteredVehicles quando selectedBrand muda
    effect(() => {
      const brand = this.selectedBrand();
      if (brand) {
        this.filteredVehicles.set(this.vehicles.filter(vehicle => vehicle.brandId === brand.id));
        this.selectedVehicle.set(null);
      } else {
        this.filteredVehicles.set([]);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Manter para compatibilidade, mas a lógica agora é tratada pelo effect
  }

  private filterVehiclesByBrand(): void {
    const brand = this.selectedBrand();
    if (brand) {
      this.filteredVehicles.set(this.vehicles.filter(vehicle => vehicle.brandId === brand.id));
    } else {
      this.filteredVehicles.set([]);
    }
  }

  onVehicleSelect(vehicle: VehicleModel): void {
    this.selectedVehicle.set(vehicle);
    this.vehicleSelected.emit(vehicle);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  getCategoryIcon(category: VehicleCategory): string {
    const icons = {
      [VehicleCategory.SEDAN]: '🚗',
      [VehicleCategory.SUV]: '🚙',
      [VehicleCategory.HATCHBACK]: '🚗',
      [VehicleCategory.COUPE]: '🏎️',
      [VehicleCategory.CONVERTIBLE]: '🚘',
      [VehicleCategory.TRUCK]: '🚚',
      [VehicleCategory.VAN]: '🚐'
    };
    return icons[category] || '🚗';
  }

  getFuelTypeLabel(fuelType: FuelType): string {
    const labels = {
      [FuelType.GASOLINE]: 'Gasoline',
      [FuelType.DIESEL]: 'Diesel',
      [FuelType.HYBRID]: 'Hybrid',
      [FuelType.ELECTRIC]: 'Electric',
      [FuelType.FLEX]: 'Flex'
    };
    return labels[fuelType] || fuelType;
  }

  getTransmissionLabel(transmission: TransmissionType): string {
    const labels = {
      [TransmissionType.MANUAL]: 'Manual',
      [TransmissionType.AUTOMATIC]: 'Automatic',
      [TransmissionType.CVT]: 'CVT'
    };
    return labels[transmission] || transmission;
  }
}