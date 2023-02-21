import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridDatepickerComponent } from './grid-datepicker.component';

describe('GridDatepickerComponent', () => {
  let component: GridDatepickerComponent;
  let fixture: ComponentFixture<GridDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridDatepickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
