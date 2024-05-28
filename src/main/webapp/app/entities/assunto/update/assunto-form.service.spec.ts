import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../assunto.test-samples';

import { AssuntoFormService } from './assunto-form.service';

describe('Assunto Form Service', () => {
  let service: AssuntoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssuntoFormService);
  });

  describe('Service methods', () => {
    describe('createAssuntoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAssuntoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            descricao: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            deletedAt: expect.any(Object),
            topicos: expect.any(Object),
          }),
        );
      });

      it('passing IAssunto should create a new form with FormGroup', () => {
        const formGroup = service.createAssuntoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            descricao: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            deletedAt: expect.any(Object),
            topicos: expect.any(Object),
          }),
        );
      });
    });

    describe('getAssunto', () => {
      it('should return NewAssunto for default Assunto initial value', () => {
        const formGroup = service.createAssuntoFormGroup(sampleWithNewData);

        const assunto = service.getAssunto(formGroup) as any;

        expect(assunto).toMatchObject(sampleWithNewData);
      });

      it('should return NewAssunto for empty Assunto initial value', () => {
        const formGroup = service.createAssuntoFormGroup();

        const assunto = service.getAssunto(formGroup) as any;

        expect(assunto).toMatchObject({});
      });

      it('should return IAssunto', () => {
        const formGroup = service.createAssuntoFormGroup(sampleWithRequiredData);

        const assunto = service.getAssunto(formGroup) as any;

        expect(assunto).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAssunto should not enable id FormControl', () => {
        const formGroup = service.createAssuntoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAssunto should disable id FormControl', () => {
        const formGroup = service.createAssuntoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
