import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientpriceComponent } from './clientprice.component';

describe('ClientpriceComponent', () => {
  let component: ClientpriceComponent;
  let fixture: ComponentFixture<ClientpriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientpriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientpriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
