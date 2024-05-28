import { IAjuda, NewAjuda } from './ajuda.model';

export const sampleWithRequiredData: IAjuda = {
  id: 'c37aa348-018f-4b69-b4f8-a44875d2228c',
  titulo: 'tempo oversleep hm',
};

export const sampleWithPartialData: IAjuda = {
  id: '53313758-2a85-4c39-9c78-f97de8c5a9bd',
  titulo: 'live',
};

export const sampleWithFullData: IAjuda = {
  id: '8f97013c-c038-4623-9125-f7778ccbb612',
  titulo: 'particular',
};

export const sampleWithNewData: NewAjuda = {
  titulo: 'gracefully',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
