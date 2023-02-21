import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotpaswordComponent } from './forgotpasword.component';

describe('ForgotpaswordComponent', () => {
  let component: ForgotpaswordComponent;
  let fixture: ComponentFixture<ForgotpaswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotpaswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotpaswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
