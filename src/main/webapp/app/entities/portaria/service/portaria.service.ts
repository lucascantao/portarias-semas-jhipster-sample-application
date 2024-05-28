import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPortaria, NewPortaria } from '../portaria.model';

export type PartialUpdatePortaria = Partial<IPortaria> & Pick<IPortaria, 'id'>;

type RestOf<T extends IPortaria | NewPortaria> = Omit<T, 'data' | 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  data?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type RestPortaria = RestOf<IPortaria>;

export type NewRestPortaria = RestOf<NewPortaria>;

export type PartialUpdateRestPortaria = RestOf<PartialUpdatePortaria>;

export type EntityResponseType = HttpResponse<IPortaria>;
export type EntityArrayResponseType = HttpResponse<IPortaria[]>;

@Injectable({ providedIn: 'root' })
export class PortariaService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/portarias');

  create(portaria: NewPortaria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(portaria);
    return this.http
      .post<RestPortaria>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(portaria: IPortaria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(portaria);
    return this.http
      .put<RestPortaria>(`${this.resourceUrl}/${this.getPortariaIdentifier(portaria)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(portaria: PartialUpdatePortaria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(portaria);
    return this.http
      .patch<RestPortaria>(`${this.resourceUrl}/${this.getPortariaIdentifier(portaria)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPortaria>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPortaria[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPortariaIdentifier(portaria: Pick<IPortaria, 'id'>): number {
    return portaria.id;
  }

  comparePortaria(o1: Pick<IPortaria, 'id'> | null, o2: Pick<IPortaria, 'id'> | null): boolean {
    return o1 && o2 ? this.getPortariaIdentifier(o1) === this.getPortariaIdentifier(o2) : o1 === o2;
  }

  addPortariaToCollectionIfMissing<Type extends Pick<IPortaria, 'id'>>(
    portariaCollection: Type[],
    ...portariasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const portarias: Type[] = portariasToCheck.filter(isPresent);
    if (portarias.length > 0) {
      const portariaCollectionIdentifiers = portariaCollection.map(portariaItem => this.getPortariaIdentifier(portariaItem));
      const portariasToAdd = portarias.filter(portariaItem => {
        const portariaIdentifier = this.getPortariaIdentifier(portariaItem);
        if (portariaCollectionIdentifiers.includes(portariaIdentifier)) {
          return false;
        }
        portariaCollectionIdentifiers.push(portariaIdentifier);
        return true;
      });
      return [...portariasToAdd, ...portariaCollection];
    }
    return portariaCollection;
  }

  protected convertDateFromClient<T extends IPortaria | NewPortaria | PartialUpdatePortaria>(portaria: T): RestOf<T> {
    return {
      ...portaria,
      data: portaria.data?.format(DATE_FORMAT) ?? null,
      createdAt: portaria.createdAt?.toJSON() ?? null,
      updatedAt: portaria.updatedAt?.toJSON() ?? null,
      deletedAt: portaria.deletedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPortaria: RestPortaria): IPortaria {
    return {
      ...restPortaria,
      data: restPortaria.data ? dayjs(restPortaria.data) : undefined,
      createdAt: restPortaria.createdAt ? dayjs(restPortaria.createdAt) : undefined,
      updatedAt: restPortaria.updatedAt ? dayjs(restPortaria.updatedAt) : undefined,
      deletedAt: restPortaria.deletedAt ? dayjs(restPortaria.deletedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPortaria>): HttpResponse<IPortaria> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPortaria[]>): HttpResponse<IPortaria[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
