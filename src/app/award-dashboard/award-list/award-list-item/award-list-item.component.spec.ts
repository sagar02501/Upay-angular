import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardListItemComponent } from './award-list-item.component';

describe('AwardListItemComponent', () => {
  let component: AwardListItemComponent;
  let fixture: ComponentFixture<AwardListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
