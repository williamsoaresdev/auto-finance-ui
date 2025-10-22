import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorAutoFinancialComponent } from './simulator-auto-financial.component';

describe('SimulatorAutoFinancialComponent', () => {
  let component: SimulatorAutoFinancialComponent;
  let fixture: ComponentFixture<SimulatorAutoFinancialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulatorAutoFinancialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulatorAutoFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
