import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterReadingListDeletePopupComponent } from './meter-reading-list-delete-popup.component';

describe('MeterReadingListDeletePopupComponent', () => {
  let component: MeterReadingListDeletePopupComponent;
  let fixture: ComponentFixture<MeterReadingListDeletePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterReadingListDeletePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterReadingListDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
