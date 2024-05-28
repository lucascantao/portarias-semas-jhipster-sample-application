import dayjs from 'dayjs/esm';

import { IPortaria, NewPortaria } from './portaria.model';

export const sampleWithRequiredData: IPortaria = {
  id: 27518,
  numero: 24918,
};

export const sampleWithPartialData: IPortaria = {
  id: 27854,
  numero: 30734,
  updatedAt: dayjs('2024-05-27T19:28'),
  deletedAt: dayjs('2024-05-27T23:50'),
};

export const sampleWithFullData: IPortaria = {
  id: 21709,
  numero: 13129,
  data: dayjs('2024-05-27'),
  createdAt: dayjs('2024-05-27T23:24'),
  updatedAt: dayjs('2024-05-27T20:13'),
  deletedAt: dayjs('2024-05-28T06:14'),
};

export const sampleWithNewData: NewPortaria = {
  numero: 25635,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
