import dayjs from 'dayjs/esm';
import { IAssunto } from 'app/entities/assunto/assunto.model';
import { ISetor } from 'app/entities/setor/setor.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IPortaria {
  id: number;
  numero?: number | null;
  data?: dayjs.Dayjs | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  deletedAt?: dayjs.Dayjs | null;
  assunto?: IAssunto | null;
  setor?: ISetor | null;
  usuario?: IUsuario | null;
  updatedBy?: IUsuario | null;
  deletedBy?: IUsuario | null;
}

export type NewPortaria = Omit<IPortaria, 'id'> & { id: null };
