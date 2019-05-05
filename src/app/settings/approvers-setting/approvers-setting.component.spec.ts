import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproversSettingComponent } from './approvers-setting.component';

describe('ApproversSettingComponent', () => {
  let component: ApproversSettingComponent;
  let fixture: ComponentFixture<ApproversSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproversSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproversSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
