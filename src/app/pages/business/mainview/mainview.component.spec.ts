import { ComponentFixture, TestBed } from '@angular/core/testing';

import { mainViewComponent } from './mainview.component';

describe('CustomerViewComponent', () => {
  let component: mainViewComponent;
  let fixture: ComponentFixture<mainViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ mainViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(mainViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
