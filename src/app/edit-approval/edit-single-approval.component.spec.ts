import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSingleApprovalComponent } from './edit-single-approval.component';

describe('GetSingleApprovalComponent', () => {
  let component: EditSingleApprovalComponent;
  let fixture: ComponentFixture<EditSingleApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditSingleApprovalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSingleApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
