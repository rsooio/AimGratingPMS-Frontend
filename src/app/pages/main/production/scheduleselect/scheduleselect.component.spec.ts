import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleselectComponent } from './scheduleselect.component';

describe('ScheduleselectComponent', () => {
  let component: ScheduleselectComponent;
  let fixture: ComponentFixture<ScheduleselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleselectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
