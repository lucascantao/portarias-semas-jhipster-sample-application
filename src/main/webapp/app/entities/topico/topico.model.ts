import { IAjuda } from 'app/entities/ajuda/ajuda.model';

export interface ITopico {
  id: string;
  titulo?: string | null;
  ajudas?: IAjuda[] | null;
  topicos?: IAjuda[] | null;
}

export type NewTopico = Omit<ITopico, 'id'> & { id: null };
