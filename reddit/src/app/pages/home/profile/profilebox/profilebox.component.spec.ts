import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileboxComponent } from './profilebox.component';

describe('ProfileboxComponent', () => {
  let component: ProfileboxComponent;
  let fixture: ComponentFixture<ProfileboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileboxComponent]
    });
    fixture = TestBed.createComponent(ProfileboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
