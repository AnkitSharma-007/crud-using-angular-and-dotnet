import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchEmployeeComponent } from './fetch-employee.component';

describe('FetchEmployeeComponent', () => {
  let component: FetchEmployeeComponent;
  let fixture: ComponentFixture<FetchEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FetchEmployeeComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(FetchEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
