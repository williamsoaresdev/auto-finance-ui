import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  ApiResponse,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  Vehicle,
  LoanApplication,
  CreateLoanApplicationRequest,
  ContactForm,
  LoanCalculatorForm,
  LoanCalculatorResult,
  HttpErrorResponse
} from '../types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl: string = environment.apiUrl;
  
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Generic HTTP Methods
  private get<T>(endpoint: string, params?: HttpParams): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
      ...this.httpOptions,
      params
    }).pipe(
      catchError(this.handleError)
    );
  }

  private post<T>(endpoint: string, data: unknown): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private put<T>(endpoint: string, data: unknown): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // User API Methods
  getUsers(): Observable<User[]> {
    return this.get<User[]>('/users').pipe(
      map(response => response.data)
    );
  }

  getUserById(id: number): Observable<User> {
    return this.get<User>(`/users/${id}`).pipe(
      map(response => response.data)
    );
  }

  createUser(userData: CreateUserRequest): Observable<User> {
    return this.post<User>('/users', userData).pipe(
      map(response => response.data)
    );
  }

  updateUser(userData: UpdateUserRequest): Observable<User> {
    return this.put<User>(`/users/${userData.id}`, userData).pipe(
      map(response => response.data)
    );
  }

  deleteUser(id: number): Observable<boolean> {
    return this.delete<boolean>(`/users/${id}`).pipe(
      map(response => response.success)
    );
  }

  // Vehicle API Methods
  getVehicles(): Observable<Vehicle[]> {
    return this.get<Vehicle[]>('/vehicles').pipe(
      map(response => response.data)
    );
  }

  getVehicleById(id: number): Observable<Vehicle> {
    return this.get<Vehicle>(`/vehicles/${id}`).pipe(
      map(response => response.data)
    );
  }

  searchVehicles(filters: Record<string, string | number>): Observable<Vehicle[]> {
    const params = new HttpParams({ fromObject: filters });
    return this.get<Vehicle[]>('/vehicles/search', params).pipe(
      map(response => response.data)
    );
  }

  // Loan Application API Methods
  getLoanApplications(): Observable<LoanApplication[]> {
    return this.get<LoanApplication[]>('/loans').pipe(
      map(response => response.data)
    );
  }

  getLoanApplicationById(id: number): Observable<LoanApplication> {
    return this.get<LoanApplication>(`/loans/${id}`).pipe(
      map(response => response.data)
    );
  }

  createLoanApplication(loanData: CreateLoanApplicationRequest): Observable<LoanApplication> {
    return this.post<LoanApplication>('/loans', loanData).pipe(
      map(response => response.data)
    );
  }

  // Loan Calculator
  calculateLoan(calculatorData: LoanCalculatorForm): Observable<LoanCalculatorResult> {
    return this.post<LoanCalculatorResult>('/loans/calculate', calculatorData).pipe(
      map(response => response.data)
    );
  }

  // Contact Form
  submitContactForm(contactData: ContactForm): Observable<boolean> {
    return this.post<boolean>('/contact', contactData).pipe(
      map(response => response.success)
    );
  }

  // Error Handling
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Server Error: ${error.status} ${error.statusText}`;
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  };
}
