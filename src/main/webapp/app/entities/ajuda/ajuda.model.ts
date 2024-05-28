import { ITopico } from 'app/entities/topico/topico.model';

export interface IAjuda {
  id: string;
  titulo?: string | null;
  ajudas?: ITopico[] | null;
  topicos?: ITopico[] | null;
}

export type NewAjuda = Omit<IAjuda, 'id'> & { id: null };
