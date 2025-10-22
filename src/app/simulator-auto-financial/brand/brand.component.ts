import { Component, output, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Brand } from '../../types';
import { BrandsMockService } from '../../services/brands-mock.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css'
})
export class BrandComponent implements OnInit {
  brandSelected = output<Brand>();

  selectedBrand = signal<Brand | null>(null);
  brands = signal<Brand[]>([]);

  private brandsMockService = inject(BrandsMockService);

  ngOnInit(): void {
    this.loadBrands();
  }

  private loadBrands(): void {
    this.brandsMockService.getAllBrands().pipe(
      tap((brands) => this.brands.set(brands)),
      catchError((error) => {
        console.error('Error loading brands:', error);
        return of(false);
      }),
    ).subscribe();
  }

  onBrandSelect(brand: Brand): void {
    this.selectedBrand.set(brand);
    this.brandSelected.emit(brand);
  }

  getBrandInitials(brandName: string): string {
    return brandName.split(' ').map(word => word[0]).join('').toUpperCase();
  }
}