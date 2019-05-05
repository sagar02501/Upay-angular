import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonesSettingComponent } from './zones-setting.component';

describe('ZonesSettingComponent', () => {
  let component: ZonesSettingComponent;
  let fixture: ComponentFixture<ZonesSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonesSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonesSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
