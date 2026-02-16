import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItems } from './new-items';

describe('NewItems', () => {
  let component: NewItems;
  let fixture: ComponentFixture<NewItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
