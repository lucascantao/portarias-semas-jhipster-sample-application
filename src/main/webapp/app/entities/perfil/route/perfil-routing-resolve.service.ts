import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPerfil } from '../perfil.model';
import { PerfilService } from '../service/perfil.service';

const perfilResolve = (route: ActivatedRouteSnapshot): Observable<null | IPerfil> => {
  const id = route.params['id'];
  if (id) {
    return inject(PerfilService)
      .find(id)
      .pipe(
        mergeMap((perfil: HttpResponse<IPerfil>) => {
          if (perfil.body) {
            return of(perfil.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default perfilResolve;
