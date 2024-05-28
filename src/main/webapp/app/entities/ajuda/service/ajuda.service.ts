import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAjuda, NewAjuda } from '../ajuda.model';

export type PartialUpdateAjuda = Partial<IAjuda> & Pick<IAjuda, 'id'>;

export type EntityResponseType = HttpResponse<IAjuda>;
export type EntityArrayResponseType = HttpResponse<IAjuda[]>;

@Injectable({ providedIn: 'root' })
export class AjudaService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ajudas');

  create(ajuda: NewAjuda): Observable<EntityResponseType> {
    return this.http.post<IAjuda>(this.resourceUrl, ajuda, { observe: 'response' });
  }

  update(ajuda: IAjuda): Observable<EntityResponseType> {
    return this.http.put<IAjuda>(`${this.resourceUrl}/${this.getAjudaIdentifier(ajuda)}`, ajuda, { observe: 'response' });
  }

  partialUpdate(ajuda: PartialUpdateAjuda): Observable<EntityResponseType> {
    return this.http.patch<IAjuda>(`${this.resourceUrl}/${this.getAjudaIdentifier(ajuda)}`, ajuda, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IAjuda>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAjuda[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAjudaIdentifier(ajuda: Pick<IAjuda, 'id'>): string {
    return ajuda.id;
  }

  compareAjuda(o1: Pick<IAjuda, 'id'> | null, o2: Pick<IAjuda, 'id'> | null): boolean {
    return o1 && o2 ? this.getAjudaIdentifier(o1) === this.getAjudaIdentifier(o2) : o1 === o2;
  }

  addAjudaToCollectionIfMissing<Type extends Pick<IAjuda, 'id'>>(
    ajudaCollection: Type[],
    ...ajudasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ajudas: Type[] = ajudasToCheck.filter(isPresent);
    if (ajudas.length > 0) {
      const ajudaCollectionIdentifiers = ajudaCollection.map(ajudaItem => this.getAjudaIdentifier(ajudaItem));
      const ajudasToAdd = ajudas.filter(ajudaItem => {
        const ajudaIdentifier = this.getAjudaIdentifier(ajudaItem);
        if (ajudaCollectionIdentifiers.includes(ajudaIdentifier)) {
          return false;
        }
        ajudaCollectionIdentifiers.push(ajudaIdentifier);
        return true;
      });
      return [...ajudasToAdd, ...ajudaCollection];
    }
    return ajudaCollection;
  }
}
