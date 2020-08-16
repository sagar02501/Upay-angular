import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardDashboardComponent } from './award-dashboard.component';

describe('AwardDashboardComponent', () => {
  let component: AwardDashboardComponent;
  let fixture: ComponentFixture<AwardDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
