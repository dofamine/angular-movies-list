import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(movies: any[], searchText: string): any[] {
    if (!movies) {
      return [];
    }
    if (!searchText) {
      return movies;
    }
    searchText = searchText.toLowerCase();
    return movies.filter(({ title, overview }) => {
      return title.toLowerCase().includes(searchText) || overview.toLowerCase().includes(searchText);
    });
  }
}
