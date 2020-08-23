import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillListItemComponent } from './bill-list-item.component';

describe('BillListItemComponent', () => {
  let component: BillListItemComponent;
  let fixture: ComponentFixture<BillListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
