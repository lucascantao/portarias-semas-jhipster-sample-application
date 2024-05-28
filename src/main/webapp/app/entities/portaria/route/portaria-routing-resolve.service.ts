import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPortaria } from '../portaria.model';
import { PortariaService } from '../service/portaria.service';

const portariaResolve = (route: ActivatedRouteSnapshot): Observable<null | IPortaria> => {
  const id = route.params['id'];
  if (id) {
    return inject(PortariaService)
      .find(id)
      .pipe(
        mergeMap((portaria: HttpResponse<IPortaria>) => {
          if (portaria.body) {
            return of(portaria.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default portariaResolve;
