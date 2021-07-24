import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficetoolsComponent } from './backofficetools.component';

describe('BackofficetoolsComponent', () => {
  let component: BackofficetoolsComponent;
  let fixture: ComponentFixture<BackofficetoolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackofficetoolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficetoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
