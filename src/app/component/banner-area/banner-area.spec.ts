import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerArea } from './banner-area';

describe('BannerArea', () => {
  let component: BannerArea;
  let fixture: ComponentFixture<BannerArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerArea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
