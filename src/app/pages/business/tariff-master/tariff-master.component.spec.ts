import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffMasterComponent } from './tariff-master.component';

describe('TariffMasterComponent', () => {
  let component: TariffMasterComponent;
  let fixture: ComponentFixture<TariffMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TariffMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TariffMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
