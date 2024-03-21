import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyComponent } from './empty.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('EmptyComponent', () => {
  let component: EmptyComponent;
  let fixture: ComponentFixture<EmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyComponent ],
      imports: [HttpClientModule],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          queryParams: of()
        }
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
