import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilizationDetailsComponent } from './utilization-details.component';

describe('UtilizationDetailsComponent', () => {
  let component: UtilizationDetailsComponent;
  let fixture: ComponentFixture<UtilizationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilizationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilizationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
