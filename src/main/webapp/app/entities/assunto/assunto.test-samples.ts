import dayjs from 'dayjs/esm';

import { IAssunto, NewAssunto } from './assunto.model';

export const sampleWithRequiredData: IAssunto = {
  id: 30322,
  nome: 'new town',
};

export const sampleWithPartialData: IAssunto = {
  id: 9435,
  nome: 'aha',
  updatedAt: dayjs('2024-05-28T12:35'),
  deletedAt: dayjs('2024-05-28T11:14'),
};

export const sampleWithFullData: IAssunto = {
  id: 4835,
  nome: 'splurge',
  descricao: '../fake-data/blob/hipster.txt',
  createdAt: dayjs('2024-05-27T18:59'),
  updatedAt: dayjs('2024-05-27T20:20'),
  deletedAt: dayjs('2024-05-28T02:41'),
};

export const sampleWithNewData: NewAssunto = {
  nome: 'beneath',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
