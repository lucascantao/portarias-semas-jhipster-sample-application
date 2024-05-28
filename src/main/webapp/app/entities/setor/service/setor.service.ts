import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISetor, NewSetor } from '../setor.model';

export type PartialUpdateSetor = Partial<ISetor> & Pick<ISetor, 'id'>;

type RestOf<T extends ISetor | NewSetor> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type RestSetor = RestOf<ISetor>;

export type NewRestSetor = RestOf<NewSetor>;

export type PartialUpdateRestSetor = RestOf<PartialUpdateSetor>;

export type EntityResponseType = HttpResponse<ISetor>;
export type EntityArrayResponseType = HttpResponse<ISetor[]>;

@Injectable({ providedIn: 'root' })
export class SetorService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/setors');

  create(setor: NewSetor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(setor);
    return this.http.post<RestSetor>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(setor: ISetor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(setor);
    return this.http
      .put<RestSetor>(`${this.resourceUrl}/${this.getSetorIdentifier(setor)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(setor: PartialUpdateSetor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(setor);
    return this.http
      .patch<RestSetor>(`${this.resourceUrl}/${this.getSetorIdentifier(setor)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSetor>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSetor[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSetorIdentifier(setor: Pick<ISetor, 'id'>): number {
    return setor.id;
  }

  compareSetor(o1: Pick<ISetor, 'id'> | null, o2: Pick<ISetor, 'id'> | null): boolean {
    return o1 && o2 ? this.getSetorIdentifier(o1) === this.getSetorIdentifier(o2) : o1 === o2;
  }

  addSetorToCollectionIfMissing<Type extends Pick<ISetor, 'id'>>(
    setorCollection: Type[],
    ...setorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const setors: Type[] = setorsToCheck.filter(isPresent);
    if (setors.length > 0) {
      const setorCollectionIdentifiers = setorCollection.map(setorItem => this.getSetorIdentifier(setorItem));
      const setorsToAdd = setors.filter(setorItem => {
        const setorIdentifier = this.getSetorIdentifier(setorItem);
        if (setorCollectionIdentifiers.includes(setorIdentifier)) {
          return false;
        }
        setorCollectionIdentifiers.push(setorIdentifier);
        return true;
      });
      return [...setorsToAdd, ...setorCollection];
    }
    return setorCollection;
  }

  protected convertDateFromClient<T extends ISetor | NewSetor | PartialUpdateSetor>(setor: T): RestOf<T> {
    return {
      ...setor,
      createdAt: setor.createdAt?.toJSON() ?? null,
      updatedAt: setor.updatedAt?.toJSON() ?? null,
      deletedAt: setor.deletedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restSetor: RestSetor): ISetor {
    return {
      ...restSetor,
      createdAt: restSetor.createdAt ? dayjs(restSetor.createdAt) : undefined,
      updatedAt: restSetor.updatedAt ? dayjs(restSetor.updatedAt) : undefined,
      deletedAt: restSetor.deletedAt ? dayjs(restSetor.deletedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSetor>): HttpResponse<ISetor> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSetor[]>): HttpResponse<ISetor[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
