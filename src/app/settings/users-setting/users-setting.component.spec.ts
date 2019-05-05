import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSettingComponent } from './users-setting.component';

describe('UsersSettingComponent', () => {
  let component: UsersSettingComponent;
  let fixture: ComponentFixture<UsersSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
