import { ITopico, NewTopico } from './topico.model';

export const sampleWithRequiredData: ITopico = {
  id: '9f59958e-e552-4bfc-b0be-38b9be5037d2',
  titulo: 'absent',
};

export const sampleWithPartialData: ITopico = {
  id: '2f89efb2-f808-4bcc-9166-34aa42c4afe0',
  titulo: 'now',
};

export const sampleWithFullData: ITopico = {
  id: '0285bed2-9f99-49ed-89c2-f1a0abbeddba',
  titulo: 'pro',
};

export const sampleWithNewData: NewTopico = {
  titulo: 'although',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
