import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAssunto, NewAssunto } from '../assunto.model';

export type PartialUpdateAssunto = Partial<IAssunto> & Pick<IAssunto, 'id'>;

type RestOf<T extends IAssunto | NewAssunto> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type RestAssunto = RestOf<IAssunto>;

export type NewRestAssunto = RestOf<NewAssunto>;

export type PartialUpdateRestAssunto = RestOf<PartialUpdateAssunto>;

export type EntityResponseType = HttpResponse<IAssunto>;
export type EntityArrayResponseType = HttpResponse<IAssunto[]>;

@Injectable({ providedIn: 'root' })
export class AssuntoService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/assuntos');

  create(assunto: NewAssunto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(assunto);
    return this.http
      .post<RestAssunto>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(assunto: IAssunto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(assunto);
    return this.http
      .put<RestAssunto>(`${this.resourceUrl}/${this.getAssuntoIdentifier(assunto)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(assunto: PartialUpdateAssunto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(assunto);
    return this.http
      .patch<RestAssunto>(`${this.resourceUrl}/${this.getAssuntoIdentifier(assunto)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAssunto>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAssunto[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAssuntoIdentifier(assunto: Pick<IAssunto, 'id'>): number {
    return assunto.id;
  }

  compareAssunto(o1: Pick<IAssunto, 'id'> | null, o2: Pick<IAssunto, 'id'> | null): boolean {
    return o1 && o2 ? this.getAssuntoIdentifier(o1) === this.getAssuntoIdentifier(o2) : o1 === o2;
  }

  addAssuntoToCollectionIfMissing<Type extends Pick<IAssunto, 'id'>>(
    assuntoCollection: Type[],
    ...assuntosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const assuntos: Type[] = assuntosToCheck.filter(isPresent);
    if (assuntos.length > 0) {
      const assuntoCollectionIdentifiers = assuntoCollection.map(assuntoItem => this.getAssuntoIdentifier(assuntoItem));
      const assuntosToAdd = assuntos.filter(assuntoItem => {
        const assuntoIdentifier = this.getAssuntoIdentifier(assuntoItem);
        if (assuntoCollectionIdentifiers.includes(assuntoIdentifier)) {
          return false;
        }
        assuntoCollectionIdentifiers.push(assuntoIdentifier);
        return true;
      });
      return [...assuntosToAdd, ...assuntoCollection];
    }
    return assuntoCollection;
  }

  protected convertDateFromClient<T extends IAssunto | NewAssunto | PartialUpdateAssunto>(assunto: T): RestOf<T> {
    return {
      ...assunto,
      createdAt: assunto.createdAt?.toJSON() ?? null,
      updatedAt: assunto.updatedAt?.toJSON() ?? null,
      deletedAt: assunto.deletedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAssunto: RestAssunto): IAssunto {
    return {
      ...restAssunto,
      createdAt: restAssunto.createdAt ? dayjs(restAssunto.createdAt) : undefined,
      updatedAt: restAssunto.updatedAt ? dayjs(restAssunto.updatedAt) : undefined,
      deletedAt: restAssunto.deletedAt ? dayjs(restAssunto.deletedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAssunto>): HttpResponse<IAssunto> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAssunto[]>): HttpResponse<IAssunto[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
