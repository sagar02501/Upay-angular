import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryDetailsComponent } from './salary-details.component';

describe('SalaryDetailsComponent', () => {
  let component: SalaryDetailsComponent;
  let fixture: ComponentFixture<SalaryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalaryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
