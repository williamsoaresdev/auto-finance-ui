import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Brand } from '../../types';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css'
})
export class BrandComponent {
  brandSelected = output<Brand>();

  selectedBrand = signal<Brand | null>(null);

  // Mock data - marcas internacionais
  brands: Brand[] = [
    {
      id: 1,
      name: 'Toyota',
      country: 'Japan',
      established: 1937
    },
    {
      id: 2,
      name: 'Ford',
      country: 'USA',
      established: 1903
    },
    {
      id: 3,
      name: 'BMW',
      country: 'Germany',
      established: 1916
    },
    {
      id: 4,
      name: 'Mercedes-Benz',
      country: 'Germany',
      established: 1926
    },
    {
      id: 5,
      name: 'Audi',
      country: 'Germany',
      established: 1909
    },
    {
      id: 6,
      name: 'Honda',
      country: 'Japan',
      established: 1946
    },
    {
      id: 7,
      name: 'Nissan',
      country: 'Japan',
      established: 1933
    },
    {
      id: 8,
      name: 'Volkswagen',
      country: 'Germany',
      established: 1937
    },
    {
      id: 9,
      name: 'Hyundai',
      country: 'South Korea',
      established: 1967
    },
    {
      id: 10,
      name: 'Chevrolet',
      country: 'USA',
      established: 1911
    }
  ];

  onBrandSelect(brand: Brand): void {
    this.selectedBrand.set(brand);
    this.brandSelected.emit(brand);
  }

  getBrandInitials(brandName: string): string {
    return brandName.split(' ').map(word => word[0]).join('').toUpperCase();
  }
}