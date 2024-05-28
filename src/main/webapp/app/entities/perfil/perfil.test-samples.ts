import dayjs from 'dayjs/esm';

import { IPerfil, NewPerfil } from './perfil.model';

export const sampleWithRequiredData: IPerfil = {
  id: 25705,
  nome: 'safely massage mare',
};

export const sampleWithPartialData: IPerfil = {
  id: 5020,
  nome: 'keen wilted till',
  createdAt: dayjs('2024-05-28T00:10'),
  updatedAt: dayjs('2024-05-28T06:19'),
  deletedAt: dayjs('2024-05-28T08:08'),
};

export const sampleWithFullData: IPerfil = {
  id: 420,
  nome: 'short-term roughhouse',
  descricao: '../fake-data/blob/hipster.txt',
  createdAt: dayjs('2024-05-28T03:00'),
  updatedAt: dayjs('2024-05-28T00:49'),
  deletedAt: dayjs('2024-05-27T21:38'),
};

export const sampleWithNewData: NewPerfil = {
  nome: 'furthermore whether dramatize',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
