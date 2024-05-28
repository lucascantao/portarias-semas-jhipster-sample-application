import dayjs from 'dayjs/esm';

export interface IPerfil {
  id: number;
  nome?: string | null;
  descricao?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  deletedAt?: dayjs.Dayjs | null;
}

export type NewPerfil = Omit<IPerfil, 'id'> & { id: null };
