import { IAjuda } from 'app/entities/ajuda/ajuda.model';
import { IAssunto } from 'app/entities/assunto/assunto.model';

export interface ITopico {
  id: string;
  titulo?: string | null;
  ajudas?: IAjuda[] | null;
  assuntos?: IAssunto[] | null;
}

export type NewTopico = Omit<ITopico, 'id'> & { id: null };
