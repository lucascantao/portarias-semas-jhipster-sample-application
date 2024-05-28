import dayjs from 'dayjs/esm';

export interface ISetor {
  id: number;
  nome?: string | null;
  sigla?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  deletedAt?: dayjs.Dayjs | null;
}

export type NewSetor = Omit<ISetor, 'id'> & { id: null };
