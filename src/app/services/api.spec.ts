import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api';
import { ContactForm, ApiResponse } from '../types';
import { environment } from '../../environments/environment';

const mockContactForm: ContactForm = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '555-123-4567',
  message: 'I am interested in financing options for a new vehicle.',
  subject: 'Vehicle Financing Inquiry'
};

const MOCK_RESPONSES = {
  SUCCESS: {
    success: true,
    data: true,
    message: 'Operation completed successfully'
  },
  ERROR: {
    success: false,
    data: false,
    message: 'An error occurred',
    errors: ['Test error message']
  }
};

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('submitContactForm', () => {
    it('should submit contact form and return success', () => {
      const mockResponse: ApiResponse<boolean> = {
        success: true,
        data: true,
        message: 'Contact form submitted successfully'
      };

      service.submitContactForm(mockContactForm).subscribe(result => {
        expect(result).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/contact`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockContactForm);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('Accept')).toBe('application/json');

      req.flush(mockResponse);
    });

    it('should handle server error response', () => {
      const errorResponse = {
        success: false,
        data: false,
        message: 'Server error occurred'
      };

      service.submitContactForm(mockContactForm).subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.message).toContain('Server error occurred');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/contact`);
      req.flush(errorResponse, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network error', () => {
      const errorEvent = new ErrorEvent('Network error', {
        message: 'Network is unavailable'
      });

      service.submitContactForm(mockContactForm).subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.message).toContain('Client Error: Network is unavailable');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/contact`);
      req.error(errorEvent);
    });

    it('should handle HTTP error without custom message', () => {
      service.submitContactForm(mockContactForm).subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.message).toContain('Server Error: 404 Not Found');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/contact`);
      req.flush({}, { status: 404, statusText: 'Not Found' });
    });

    it('should use correct headers', () => {
      const mockResponse: ApiResponse<boolean> = MOCK_RESPONSES.SUCCESS;

      service.submitContactForm(mockContactForm).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/contact`);
      
      expect(req.request.headers.has('Content-Type')).toBe(true);
      expect(req.request.headers.has('Accept')).toBe(true);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('Accept')).toBe('application/json');

      req.flush(mockResponse);
    });

    it('should make POST request to correct endpoint', () => {
      const mockResponse: ApiResponse<boolean> = MOCK_RESPONSES.SUCCESS;

      service.submitContactForm(mockContactForm).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/contact`);
      expect(req.request.method).toBe('POST');
      expect(req.request.url).toBe(`${environment.apiUrl}/contact`);

      req.flush(mockResponse);
    });

    it('should send correct contact form data', () => {
      const customContactForm: ContactForm = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '555-987-6543',
        message: 'Custom message',
        subject: 'Custom subject'
      };

      service.submitContactForm(customContactForm).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/contact`);
      expect(req.request.body).toEqual(customContactForm);

      req.flush(MOCK_RESPONSES.SUCCESS);
    });
  });

  describe('error handling', () => {
    it('should handle malformed error response', () => {
      service.submitContactForm(mockContactForm).subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.message).toBeDefined();
          expect(typeof error.message).toBe('string');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/contact`);
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should log error to console', () => {
      spyOn(console, 'error');

      service.submitContactForm(mockContactForm).subscribe({
        next: () => fail('Expected an error'),
        error: () => {
          expect(console.error).toHaveBeenCalled();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/contact`);
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
