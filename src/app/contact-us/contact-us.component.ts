import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api';
import { ContactForm } from '../types';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);

  contactForm: FormGroup;
  isSubmitting = signal<boolean>(false);
  submitSuccess = signal<boolean>(false);
  submitError = signal<string>('');

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\d{10,11}$/)]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get phone() { return this.contactForm.get('phone'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting.set(true);
      this.submitError.set('');
      
      const contactData: ContactForm = this.contactForm.value;
      
      this.apiService.submitContactForm(contactData).pipe(
        tap((success: boolean) => {
          this.submitSuccess.set(true);
          this.contactForm.reset();
          console.log('Contact form submitted successfully:', success);
        }),
        catchError((error: unknown) => {
          this.submitError.set('Failed to submit contact form. Please try again.');
          console.error('Contact form submission error:', error);
          return of(false);
        }),
        finalize(() => {
          this.isSubmitting.set(false);
        }),
      ).subscribe();
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  resetForm(): void {
    this.contactForm.reset();
    this.submitSuccess.set(false);
    this.submitError.set('');
  }
}