import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUsuario, NewUsuario } from '../usuario.model';

export type PartialUpdateUsuario = Partial<IUsuario> & Pick<IUsuario, 'id'>;

type RestOf<T extends IUsuario | NewUsuario> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type RestUsuario = RestOf<IUsuario>;

export type NewRestUsuario = RestOf<NewUsuario>;

export type PartialUpdateRestUsuario = RestOf<PartialUpdateUsuario>;

export type EntityResponseType = HttpResponse<IUsuario>;
export type EntityArrayResponseType = HttpResponse<IUsuario[]>;

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/usuarios');

  create(usuario: NewUsuario): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(usuario);
    return this.http
      .post<RestUsuario>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(usuario: IUsuario): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(usuario);
    return this.http
      .put<RestUsuario>(`${this.resourceUrl}/${this.getUsuarioIdentifier(usuario)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(usuario: PartialUpdateUsuario): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(usuario);
    return this.http
      .patch<RestUsuario>(`${this.resourceUrl}/${this.getUsuarioIdentifier(usuario)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestUsuario>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestUsuario[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUsuarioIdentifier(usuario: Pick<IUsuario, 'id'>): number {
    return usuario.id;
  }

  compareUsuario(o1: Pick<IUsuario, 'id'> | null, o2: Pick<IUsuario, 'id'> | null): boolean {
    return o1 && o2 ? this.getUsuarioIdentifier(o1) === this.getUsuarioIdentifier(o2) : o1 === o2;
  }

  addUsuarioToCollectionIfMissing<Type extends Pick<IUsuario, 'id'>>(
    usuarioCollection: Type[],
    ...usuariosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const usuarios: Type[] = usuariosToCheck.filter(isPresent);
    if (usuarios.length > 0) {
      const usuarioCollectionIdentifiers = usuarioCollection.map(usuarioItem => this.getUsuarioIdentifier(usuarioItem));
      const usuariosToAdd = usuarios.filter(usuarioItem => {
        const usuarioIdentifier = this.getUsuarioIdentifier(usuarioItem);
        if (usuarioCollectionIdentifiers.includes(usuarioIdentifier)) {
          return false;
        }
        usuarioCollectionIdentifiers.push(usuarioIdentifier);
        return true;
      });
      return [...usuariosToAdd, ...usuarioCollection];
    }
    return usuarioCollection;
  }

  protected convertDateFromClient<T extends IUsuario | NewUsuario | PartialUpdateUsuario>(usuario: T): RestOf<T> {
    return {
      ...usuario,
      createdAt: usuario.createdAt?.toJSON() ?? null,
      updatedAt: usuario.updatedAt?.toJSON() ?? null,
      deletedAt: usuario.deletedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restUsuario: RestUsuario): IUsuario {
    return {
      ...restUsuario,
      createdAt: restUsuario.createdAt ? dayjs(restUsuario.createdAt) : undefined,
      updatedAt: restUsuario.updatedAt ? dayjs(restUsuario.updatedAt) : undefined,
      deletedAt: restUsuario.deletedAt ? dayjs(restUsuario.deletedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestUsuario>): HttpResponse<IUsuario> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestUsuario[]>): HttpResponse<IUsuario[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
