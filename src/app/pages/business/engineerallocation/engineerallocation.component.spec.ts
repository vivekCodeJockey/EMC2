import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerallocationComponent } from './engineerallocation.component';

describe('EngineerallocationComponent', () => {
  let component: EngineerallocationComponent;
  let fixture: ComponentFixture<EngineerallocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EngineerallocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineerallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
