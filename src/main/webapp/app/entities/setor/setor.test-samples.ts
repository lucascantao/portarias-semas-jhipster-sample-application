import dayjs from 'dayjs/esm';

import { ISetor, NewSetor } from './setor.model';

export const sampleWithRequiredData: ISetor = {
  id: 24279,
  nome: 'swiftly',
  sigla: 'kennel oddly how',
};

export const sampleWithPartialData: ISetor = {
  id: 15951,
  nome: 'mmm gadzooks threat',
  sigla: 'wretched aspect',
  createdAt: dayjs('2024-05-27T16:32'),
  updatedAt: dayjs('2024-05-28T10:28'),
};

export const sampleWithFullData: ISetor = {
  id: 17237,
  nome: 'qua now',
  sigla: 'vivaciously angrily now',
  createdAt: dayjs('2024-05-28T03:37'),
  updatedAt: dayjs('2024-05-27T16:34'),
  deletedAt: dayjs('2024-05-28T12:13'),
};

export const sampleWithNewData: NewSetor = {
  nome: 'sternly detailed righteously',
  sigla: 'meager appropriate',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
