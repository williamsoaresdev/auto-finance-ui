import { Component, input, output, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Brand, VehicleModel, VehicleCategory, FuelType, TransmissionType } from '../../types';
import { VehiclesMockService } from '../../services/vehicles-mock.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css'
})
export class VehicleComponent implements OnInit {
  selectedBrand = input<Brand | null>(null);
  vehicleSelected = output<VehicleModel>();

  selectedVehicle = signal<VehicleModel | null>(null);
  filteredVehicles = signal<VehicleModel[]>([]);
  vehicles = signal<VehicleModel[]>([]);

  constructor(private vehiclesMockService: VehiclesMockService) {
    effect(() => {
      const brand = this.selectedBrand();
      if (brand) {
        this.loadVehiclesByBrand(brand.id);
        this.selectedVehicle.set(null);
      } else {
        this.filteredVehicles.set([]);
      }
    });
  }

  ngOnInit(): void {
    this.loadAllVehicles();
  }

  private loadAllVehicles(): void {
    this.vehiclesMockService.getAllVehicles().pipe(
      tap((vehicles: VehicleModel[]) => this.vehicles.set(vehicles)),
      catchError((error: any) => {
        console.error('Error loading vehicles:', error);
        return of(false);
      }),
    ).subscribe();
  }

  private loadVehiclesByBrand(brandId: number): void {
    this.vehiclesMockService.getVehiclesByBrandId(brandId).pipe(
      tap((vehicles: VehicleModel[]) => this.filteredVehicles.set(vehicles)),
      catchError((error: any) => {
        console.error('Error loading vehicles by brand:', error);
        return of(false);
      }),
    ).subscribe();
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