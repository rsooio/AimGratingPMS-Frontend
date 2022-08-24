import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdereditorComponent } from './ordereditor.component';

describe('OrdereditorComponent', () => {
  let component: OrdereditorComponent;
  let fixture: ComponentFixture<OrdereditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdereditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdereditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
