import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneComponent } from './gene.component';

describe('GeneComponent', () => {
  let component: GeneComponent;
  let fixture: ComponentFixture<GeneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneComponent]
    });
    fixture = TestBed.createComponent(GeneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
