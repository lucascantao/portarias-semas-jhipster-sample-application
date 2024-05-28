import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPerfil, NewPerfil } from '../perfil.model';

export type PartialUpdatePerfil = Partial<IPerfil> & Pick<IPerfil, 'id'>;

type RestOf<T extends IPerfil | NewPerfil> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type RestPerfil = RestOf<IPerfil>;

export type NewRestPerfil = RestOf<NewPerfil>;

export type PartialUpdateRestPerfil = RestOf<PartialUpdatePerfil>;

export type EntityResponseType = HttpResponse<IPerfil>;
export type EntityArrayResponseType = HttpResponse<IPerfil[]>;

@Injectable({ providedIn: 'root' })
export class PerfilService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/perfils');

  create(perfil: NewPerfil): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(perfil);
    return this.http
      .post<RestPerfil>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(perfil: IPerfil): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(perfil);
    return this.http
      .put<RestPerfil>(`${this.resourceUrl}/${this.getPerfilIdentifier(perfil)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(perfil: PartialUpdatePerfil): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(perfil);
    return this.http
      .patch<RestPerfil>(`${this.resourceUrl}/${this.getPerfilIdentifier(perfil)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPerfil>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPerfil[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPerfilIdentifier(perfil: Pick<IPerfil, 'id'>): number {
    return perfil.id;
  }

  comparePerfil(o1: Pick<IPerfil, 'id'> | null, o2: Pick<IPerfil, 'id'> | null): boolean {
    return o1 && o2 ? this.getPerfilIdentifier(o1) === this.getPerfilIdentifier(o2) : o1 === o2;
  }

  addPerfilToCollectionIfMissing<Type extends Pick<IPerfil, 'id'>>(
    perfilCollection: Type[],
    ...perfilsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const perfils: Type[] = perfilsToCheck.filter(isPresent);
    if (perfils.length > 0) {
      const perfilCollectionIdentifiers = perfilCollection.map(perfilItem => this.getPerfilIdentifier(perfilItem));
      const perfilsToAdd = perfils.filter(perfilItem => {
        const perfilIdentifier = this.getPerfilIdentifier(perfilItem);
        if (perfilCollectionIdentifiers.includes(perfilIdentifier)) {
          return false;
        }
        perfilCollectionIdentifiers.push(perfilIdentifier);
        return true;
      });
      return [...perfilsToAdd, ...perfilCollection];
    }
    return perfilCollection;
  }

  protected convertDateFromClient<T extends IPerfil | NewPerfil | PartialUpdatePerfil>(perfil: T): RestOf<T> {
    return {
      ...perfil,
      createdAt: perfil.createdAt?.toJSON() ?? null,
      updatedAt: perfil.updatedAt?.toJSON() ?? null,
      deletedAt: perfil.deletedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPerfil: RestPerfil): IPerfil {
    return {
      ...restPerfil,
      createdAt: restPerfil.createdAt ? dayjs(restPerfil.createdAt) : undefined,
      updatedAt: restPerfil.updatedAt ? dayjs(restPerfil.updatedAt) : undefined,
      deletedAt: restPerfil.deletedAt ? dayjs(restPerfil.deletedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPerfil>): HttpResponse<IPerfil> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPerfil[]>): HttpResponse<IPerfil[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
