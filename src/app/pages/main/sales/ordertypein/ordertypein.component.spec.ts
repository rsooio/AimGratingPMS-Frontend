import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdertypeinComponent } from './ordertypein.component';

describe('OrdertypeinComponent', () => {
  let component: OrdertypeinComponent;
  let fixture: ComponentFixture<OrdertypeinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdertypeinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdertypeinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
