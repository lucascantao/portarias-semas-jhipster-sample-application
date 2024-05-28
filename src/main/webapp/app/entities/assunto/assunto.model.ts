import dayjs from 'dayjs/esm';

export interface IAssunto {
  id: number;
  nome?: string | null;
  descricao?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  deletedAt?: dayjs.Dayjs | null;
}

export type NewAssunto = Omit<IAssunto, 'id'> & { id: null };
