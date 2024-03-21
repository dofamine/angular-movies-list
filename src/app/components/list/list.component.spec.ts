import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { HttpClientModule } from '@angular/common/http';
import { FilterPipe } from 'src/app/pipes/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListComponent, FilterPipe ],
      imports: [HttpClientModule, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ngOnInit', () => {
    component.ngOnInit();
    expect(component.getMovies).toHaveBeenCalled();
  });

  it('should markAsFavorite', () => {
    component['http'].post = jasmine.createSpy().and.returnValue(of());
    component.getMovies = jasmine.createSpy().and.returnValue(of());
    component.markAsFavorite(1, false);
  });

  it('should getRating', () => {
    expect(component.getRating(8)).toEqual(4);
  });

  it('should sortByTitle', () => {
    component.movies = [{
      original_title: 'Second title'
    }, {
      original_title: 'First title'
    }];
    component.sortByTitle();
    expect(component.movies).toEqual([{original_title: 'First title'}, {original_title: 'Second title'}]);
  });

  it('should sortByDate', () => {
    component.movies = [{
      release_date: '2024-03-02'
    }, {
      release_date: '2024-03-03'
    }];
    component.sortByDate();
    expect(component.movies).toEqual([{release_date: '2024-03-03'}, {release_date: '2024-03-02'}]);
  });

  it('should sortByRating', () => {
    component.movies = [{
      vote_average: 8
    }, {
      vote_average: 9
    }];
    component.sortByRating();
    expect(component.movies).toEqual([{vote_average: 9}, {vote_average: 8}]);
  });

  it('should getMovies', () => {
    component.getPopularMovies = jasmine.createSpy();
    component.getMovies();
    expect(component.getPopularMovies).toHaveBeenCalled();
  });

  it('should getPopularMovies', () => {
    const movie = {original_title: 'Original title'};
    component['http'].get = jasmine.createSpy().and.returnValue(of({ results: [movie] }));
    component.getPopularMovies().subscribe((result) => {
      expect(result).toEqual([{...movie, isFavorite: false}]);
    });
  });
});
