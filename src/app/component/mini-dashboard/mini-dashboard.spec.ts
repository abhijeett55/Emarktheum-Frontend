import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniDashboard } from './mini-dashboard';

describe('MiniDashboard', () => {
  let component: MiniDashboard;
  let fixture: ComponentFixture<MiniDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
