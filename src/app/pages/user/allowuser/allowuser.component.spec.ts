import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowuserComponent } from './allowuser.component';

describe('AllowuserComponent', () => {
  let component: AllowuserComponent;
  let fixture: ComponentFixture<AllowuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllowuserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllowuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
