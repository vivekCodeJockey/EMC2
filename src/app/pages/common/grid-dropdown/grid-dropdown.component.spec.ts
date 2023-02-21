import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridDropdownComponent } from './grid-dropdown.component';

describe('GridDropdownComponent', () => {
  let component: GridDropdownComponent;
  let fixture: ComponentFixture<GridDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
