import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleeditorComponent } from './scheduleeditor.component';

describe('ScheduleeditorComponent', () => {
  let component: ScheduleeditorComponent;
  let fixture: ComponentFixture<ScheduleeditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleeditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
