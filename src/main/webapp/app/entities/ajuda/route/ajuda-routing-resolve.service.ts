import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAjuda } from '../ajuda.model';
import { AjudaService } from '../service/ajuda.service';

const ajudaResolve = (route: ActivatedRouteSnapshot): Observable<null | IAjuda> => {
  const id = route.params['id'];
  if (id) {
    return inject(AjudaService)
      .find(id)
      .pipe(
        mergeMap((ajuda: HttpResponse<IAjuda>) => {
          if (ajuda.body) {
            return of(ajuda.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default ajudaResolve;
