import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducteditorComponent } from './producteditor.component';

describe('ProducteditorComponent', () => {
  let component: ProducteditorComponent;
  let fixture: ComponentFixture<ProducteditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProducteditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducteditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
