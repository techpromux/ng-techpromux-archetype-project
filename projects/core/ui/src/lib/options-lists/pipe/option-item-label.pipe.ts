/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pipe, PipeTransform, inject } from '@angular/core';
import {
  OPTIONS_LISTS_MANAGER_SERVICE_TOKEN,
  OptionItemModel,
  OptionsListsManagerService,
} from '@ng-techpromux-archetype-project/core-service';
import { Observable, map, of, take } from 'rxjs';

@Pipe({
  name: 'optionItemLabel',
})
export class OptionItemLabelPipe implements PipeTransform {
  private optionsLists: OptionsListsManagerService =
    inject<OptionsListsManagerService>(OPTIONS_LISTS_MANAGER_SERVICE_TOKEN);

  constructor() {
    //
  }

  transform(
    value: string,
    listKey: string,
    ...args: unknown[]
  ): Observable<string> {
    const listModelResults = this.optionsLists.getOptionsLists([listKey], {
      orderByLabelAlphabetical: true,
    }).results;

    const listModelOptions =
      listModelResults && listModelResults.length === 1
        ? listModelResults[0]
        : null;

    if (listModelOptions) {
      return listModelOptions.options$.pipe(
        take(1),
        map((options: OptionItemModel[]) => {
          const find = options.find((option) => option.value === value);
          if (find) {
            return find.label;
          }
          return '';
        })
      );
    }
    return of('');
  }
}
