import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedpostComponent } from './savedpost.component';

describe('SavedpostComponent', () => {
  let component: SavedpostComponent;
  let fixture: ComponentFixture<SavedpostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavedpostComponent]
    });
    fixture = TestBed.createComponent(SavedpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
