import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JrfComponent } from './jrf.component';

describe('JrfComponent', () => {
  let component: JrfComponent;
  let fixture: ComponentFixture<JrfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JrfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JrfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
