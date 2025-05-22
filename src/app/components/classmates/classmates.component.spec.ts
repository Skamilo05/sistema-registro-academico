import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassmatesComponent } from './classmates.component';

describe('ClassmatesComponent', () => {
  let component: ClassmatesComponent;
  let fixture: ComponentFixture<ClassmatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassmatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassmatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
