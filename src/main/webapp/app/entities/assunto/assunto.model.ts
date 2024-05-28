import dayjs from 'dayjs/esm';
import { ITopico } from 'app/entities/topico/topico.model';

export interface IAssunto {
  id: number;
  nome?: string | null;
  descricao?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  deletedAt?: dayjs.Dayjs | null;
  topicos?: ITopico[] | null;
}

export type NewAssunto = Omit<IAssunto, 'id'> & { id: null };
