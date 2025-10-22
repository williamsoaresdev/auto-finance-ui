import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Brand } from '../types';

@Injectable({
  providedIn: 'root'
})
export class BrandsMockService {

  constructor() { }

  /**
   * Retorna todas as marcas disponíveis
   * @returns Observable<Brand[]>
   */
  getAllBrands(): Observable<Brand[]> {
    const brands: Brand[] = [
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
      },
      {
        id: 11,
        name: 'Fiat',
        country: 'Italy',
        established: 1899
      },
      {
        id: 12,
        name: 'Renault',
        country: 'France',
        established: 1899
      },
      {
        id: 13,
        name: 'Peugeot',
        country: 'France',
        established: 1810
      },
      {
        id: 14,
        name: 'Citroën',
        country: 'France',
        established: 1919
      },
      {
        id: 15,
        name: 'Jeep',
        country: 'USA',
        established: 1941
      }
    ];

    return of(brands);
  }
}