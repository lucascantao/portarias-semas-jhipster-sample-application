import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITopico } from '../topico.model';
import { TopicoService } from '../service/topico.service';

const topicoResolve = (route: ActivatedRouteSnapshot): Observable<null | ITopico> => {
  const id = route.params['id'];
  if (id) {
    return inject(TopicoService)
      .find(id)
      .pipe(
        mergeMap((topico: HttpResponse<ITopico>) => {
          if (topico.body) {
            return of(topico.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default topicoResolve;
