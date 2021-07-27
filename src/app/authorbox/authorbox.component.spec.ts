import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorboxComponent } from './authorbox.component';

describe('AuthorboxComponent', () => {
  let component: AuthorboxComponent;
  let fixture: ComponentFixture<AuthorboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
