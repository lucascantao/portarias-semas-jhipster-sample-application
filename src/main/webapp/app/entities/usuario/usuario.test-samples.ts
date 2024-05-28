import dayjs from 'dayjs/esm';

import { IUsuario, NewUsuario } from './usuario.model';

export const sampleWithRequiredData: IUsuario = {
  id: 19757,
};

export const sampleWithPartialData: IUsuario = {
  id: 28258,
  nome: 'partially ouch hm',
  login: 'cancel curly month',
  createdAt: dayjs('2024-05-28T00:08'),
};

export const sampleWithFullData: IUsuario = {
  id: 30241,
  nome: 'salmon',
  login: 'and accidentally pledge',
  email: 'Fabricio90@hotmail.com',
  createdAt: dayjs('2024-05-28T11:09'),
  updatedAt: dayjs('2024-05-28T02:06'),
  deletedAt: dayjs('2024-05-28T09:18'),
};

export const sampleWithNewData: NewUsuario = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
