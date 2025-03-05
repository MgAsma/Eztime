import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOrganizationWorkingHoursComponent } from './update-organization-working-hours.component';

describe('UpdateOrganizationWorkingHoursComponent', () => {
  let component: UpdateOrganizationWorkingHoursComponent;
  let fixture: ComponentFixture<UpdateOrganizationWorkingHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateOrganizationWorkingHoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateOrganizationWorkingHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
