import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSingleApprovalComponent } from './get-single-approval.component';

describe('GetSingleApprovalComponent', () => {
  let component: GetSingleApprovalComponent;
  let fixture: ComponentFixture<GetSingleApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetSingleApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetSingleApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
