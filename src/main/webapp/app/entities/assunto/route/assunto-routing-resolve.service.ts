import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAssunto } from '../assunto.model';
import { AssuntoService } from '../service/assunto.service';

const assuntoResolve = (route: ActivatedRouteSnapshot): Observable<null | IAssunto> => {
  const id = route.params['id'];
  if (id) {
    return inject(AssuntoService)
      .find(id)
      .pipe(
        mergeMap((assunto: HttpResponse<IAssunto>) => {
          if (assunto.body) {
            return of(assunto.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default assuntoResolve;
