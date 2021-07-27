import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainboxComponent } from './mainbox.component';

describe('MainboxComponent', () => {
  let component: MainboxComponent;
  let fixture: ComponentFixture<MainboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
