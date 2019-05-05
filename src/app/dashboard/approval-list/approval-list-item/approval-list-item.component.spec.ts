import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalListItemComponent } from './approval-list-item.component';

describe('ApprovalListItemComponent', () => {
  let component: ApprovalListItemComponent;
  let fixture: ComponentFixture<ApprovalListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
