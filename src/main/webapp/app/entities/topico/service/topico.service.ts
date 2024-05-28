import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITopico, NewTopico } from '../topico.model';

export type PartialUpdateTopico = Partial<ITopico> & Pick<ITopico, 'id'>;

export type EntityResponseType = HttpResponse<ITopico>;
export type EntityArrayResponseType = HttpResponse<ITopico[]>;

@Injectable({ providedIn: 'root' })
export class TopicoService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/topicos');

  create(topico: NewTopico): Observable<EntityResponseType> {
    return this.http.post<ITopico>(this.resourceUrl, topico, { observe: 'response' });
  }

  update(topico: ITopico): Observable<EntityResponseType> {
    return this.http.put<ITopico>(`${this.resourceUrl}/${this.getTopicoIdentifier(topico)}`, topico, { observe: 'response' });
  }

  partialUpdate(topico: PartialUpdateTopico): Observable<EntityResponseType> {
    return this.http.patch<ITopico>(`${this.resourceUrl}/${this.getTopicoIdentifier(topico)}`, topico, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ITopico>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITopico[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTopicoIdentifier(topico: Pick<ITopico, 'id'>): string {
    return topico.id;
  }

  compareTopico(o1: Pick<ITopico, 'id'> | null, o2: Pick<ITopico, 'id'> | null): boolean {
    return o1 && o2 ? this.getTopicoIdentifier(o1) === this.getTopicoIdentifier(o2) : o1 === o2;
  }

  addTopicoToCollectionIfMissing<Type extends Pick<ITopico, 'id'>>(
    topicoCollection: Type[],
    ...topicosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const topicos: Type[] = topicosToCheck.filter(isPresent);
    if (topicos.length > 0) {
      const topicoCollectionIdentifiers = topicoCollection.map(topicoItem => this.getTopicoIdentifier(topicoItem));
      const topicosToAdd = topicos.filter(topicoItem => {
        const topicoIdentifier = this.getTopicoIdentifier(topicoItem);
        if (topicoCollectionIdentifiers.includes(topicoIdentifier)) {
          return false;
        }
        topicoCollectionIdentifiers.push(topicoIdentifier);
        return true;
      });
      return [...topicosToAdd, ...topicoCollection];
    }
    return topicoCollection;
  }
}
