import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildThree } from './child-three';

describe('ChildThree', () => {
  let component: ChildThree;
  let fixture: ComponentFixture<ChildThree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildThree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildThree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
