import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorAverageComponent } from './author-average.component';

describe('AuthorAverageComponent', () => {
  let component: AuthorAverageComponent;
  let fixture: ComponentFixture<AuthorAverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorAverageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorAverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
