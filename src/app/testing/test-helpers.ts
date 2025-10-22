import { Component, EventEmitter } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';

declare global {
  var jasmine: any;
  var expect: any;
}

export function getTestModuleConfig() {
  return {
    imports: [
      ReactiveFormsModule,
      NoopAnimationsModule,
      HttpClientTestingModule
    ],
    providers: [
      FormBuilder,
      provideZonelessChangeDetection()
    ]
  };
}

export function createMockComponent(selector: string, componentInputs: string[] = [], componentOutputs: string[] = []): any {
  const inputsObj: any = {};
  const outputsObj: any = {};
  
  componentInputs.forEach(input => {
    inputsObj[input] = undefined;
  });
  
  componentOutputs.forEach(output => {
    outputsObj[output] = new EventEmitter();
  });

  class MockComponent {
    constructor() {
      Object.assign(this, inputsObj);
      Object.assign(this, outputsObj);
    }
  }

  return Component({
    selector: selector,
    template: `<div>Mock Component</div>`,
    standalone: true
  })(MockComponent);
}

export function triggerFormValidation(component: any, fixture: ComponentFixture<any>): void {
  component.simulationForm?.markAllAsTouched();
  fixture.detectChanges();
}

export function fillForm(form: FormGroup, data: Record<string, any>): void {
  Object.keys(data).forEach(key => {
    const control = form.get(key);
    if (control) {
      control.setValue(data[key]);
      control.markAsTouched();
    }
  });
}

export function setInputValue(
  fixture: ComponentFixture<any>,
  selector: string,
  value: string
): void {
  const input = fixture.debugElement.query(By.css(selector));
  if (input) {
    input.nativeElement.value = value;
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }
}

export function clickButton(
  fixture: ComponentFixture<any>,
  selector: string
): void {
  const button = fixture.debugElement.query(By.css(selector));
  if (button) {
    button.nativeElement.click();
    fixture.detectChanges();
  }
}

export function hasClass(
  fixture: ComponentFixture<any>,
  selector: string,
  className: string
): boolean {
  const element = fixture.debugElement.query(By.css(selector));
  return element?.nativeElement?.classList?.contains(className) || false;
}

export function getElementText(
  fixture: ComponentFixture<any>,
  selector: string
): string {
  const element = fixture.debugElement.query(By.css(selector));
  return element?.nativeElement?.textContent?.trim() || '';
}

export function elementExists(
  fixture: ComponentFixture<any>,
  selector: string
): boolean {
  return !!fixture.debugElement.query(By.css(selector));
}

export function waitForAsync(fixture: ComponentFixture<any>): Promise<void> {
  return fixture.whenStable().then(() => {
    fixture.detectChanges();
  });
}

export function createObservableSpy(returnValue: any) {
  return (jasmine as any).createSpy().and.returnValue(of(returnValue));
}

export function createErrorSpy(error: any) {
  return (jasmine as any).createSpy().and.returnValue(throwError(() => error));
}

export function testFormFieldValidation(
  form: FormGroup,
  fieldName: string,
  invalidValues: any[],
  validValues: any[]
): void {
  const field = form.get(fieldName);
  
  invalidValues.forEach(value => {
    field?.setValue(value);
    (expect as any)(field?.invalid).toBe(true);
  });
  
  validValues.forEach(value => {
    field?.setValue(value);
    (expect as any)(field?.valid).toBe(true);
  });
}

export function expectCurrencyFormat(actual: string, expected: number): void {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(expected);
  (expect as any)(actual).toBe(formatted);
}

export function expectPercentageFormat(actual: string, expected: number): void {
  (expect as any)(actual).toBe(`${expected.toFixed(1)}%`);
}

export class HttpTestHelper {
  constructor(private httpMock: HttpTestingController) {}

  expectRequest(method: string, url: string, body?: any) {
    const req = this.httpMock.expectOne(url);
    (expect as any)(req.request.method).toBe(method);
    if (body) {
      (expect as any)(req.request.body).toEqual(body);
    }
    return req;
  }

  expectGetRequest(url: string) {
    return this.expectRequest('GET', url);
  }

  expectPostRequest(url: string, body?: any) {
    return this.expectRequest('POST', url, body);
  }

  verifyNoOutstandingRequests() {
    this.httpMock.verify();
  }
}