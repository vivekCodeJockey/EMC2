import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumnetViewComponent } from './documnet-view.component';

describe('DocumnetViewComponent', () => {
  let component: DocumnetViewComponent;
  let fixture: ComponentFixture<DocumnetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumnetViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumnetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
