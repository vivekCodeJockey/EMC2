import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridActionsComponent } from './grid-actions.component';

describe('GridActionsComponent', () => {
  let component: GridActionsComponent;
  let fixture: ComponentFixture<GridActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
