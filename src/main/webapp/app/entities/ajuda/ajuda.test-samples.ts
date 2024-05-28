import { IAjuda, NewAjuda } from './ajuda.model';

export const sampleWithRequiredData: IAjuda = {
  id: 'a85c39c7-8f97-4de8-ac5a-9bd525c64fd7',
  titulo: 'round blah inside',
};

export const sampleWithPartialData: IAjuda = {
  id: 'ccbb6125-2f25-4a45-9a1d-a73474d877dc',
  titulo: 'loyally',
};

export const sampleWithFullData: IAjuda = {
  id: 'ea2949e4-4e42-47ac-9174-d9b0ca2a066d',
  titulo: 'young oof',
};

export const sampleWithNewData: NewAjuda = {
  titulo: 'molasses',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
