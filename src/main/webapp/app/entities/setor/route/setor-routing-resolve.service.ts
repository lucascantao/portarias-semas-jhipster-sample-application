import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISetor } from '../setor.model';
import { SetorService } from '../service/setor.service';

const setorResolve = (route: ActivatedRouteSnapshot): Observable<null | ISetor> => {
  const id = route.params['id'];
  if (id) {
    return inject(SetorService)
      .find(id)
      .pipe(
        mergeMap((setor: HttpResponse<ISetor>) => {
          if (setor.body) {
            return of(setor.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default setorResolve;
