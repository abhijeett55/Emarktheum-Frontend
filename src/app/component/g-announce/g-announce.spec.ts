import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GAnnounce } from './g-announce';

describe('GAnnounce', () => {
  let component: GAnnounce;
  let fixture: ComponentFixture<GAnnounce>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GAnnounce]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GAnnounce);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
