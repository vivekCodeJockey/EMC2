import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorpassComponent } from './visitorpass.component';

describe('VisitorpassComponent', () => {
  let component: VisitorpassComponent;
  let fixture: ComponentFixture<VisitorpassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorpassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
