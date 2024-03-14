import { Pipe, PipeTransform } from '@angular/core';
import { IMovieModel, IMovieWithFavoriteFlagModel } from 'src/app/models/movie.model';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(movies: IMovieWithFavoriteFlagModel[], searchText: string): IMovieWithFavoriteFlagModel[] {
    if (!movies) {
      return [];
    }
    if (!searchText) {
      return movies;
    }
    searchText = searchText.toLowerCase();
    return movies.filter(({ title, overview }: IMovieModel) => {
      return title.toLowerCase().includes(searchText) || overview.toLowerCase().includes(searchText);
    });
  }
}
