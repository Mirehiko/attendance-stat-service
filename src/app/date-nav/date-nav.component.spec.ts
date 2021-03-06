import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateNavComponent } from './date-nav.component';

describe('DateNavComponent', () => {
  let component: DateNavComponent;
  let fixture: ComponentFixture<DateNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
