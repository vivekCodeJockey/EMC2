import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardMasterComponent } from './standard-master.component';

describe('StandardMasterComponent', () => {
  let component: StandardMasterComponent;
  let fixture: ComponentFixture<StandardMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
