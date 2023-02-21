import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotallocationComponent } from './slotallocation.component';

describe('SlotallocationComponent', () => {
  let component: SlotallocationComponent;
  let fixture: ComponentFixture<SlotallocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlotallocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
