import dayjs from 'dayjs/esm';

import { IAssunto, NewAssunto } from './assunto.model';

export const sampleWithRequiredData: IAssunto = {
  id: 19251,
  nome: 'haze analysis deceivingly',
};

export const sampleWithPartialData: IAssunto = {
  id: 8520,
  nome: 'death splurge',
  descricao: '../fake-data/blob/hipster.txt',
  createdAt: dayjs('2024-05-27T18:59'),
  deletedAt: dayjs('2024-05-27T20:20'),
};

export const sampleWithFullData: IAssunto = {
  id: 16617,
  nome: 'beneath',
  descricao: '../fake-data/blob/hipster.txt',
  createdAt: dayjs('2024-05-27T16:56'),
  updatedAt: dayjs('2024-05-27T20:02'),
  deletedAt: dayjs('2024-05-27T16:02'),
};

export const sampleWithNewData: NewAssunto = {
  nome: 'qua aside',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
