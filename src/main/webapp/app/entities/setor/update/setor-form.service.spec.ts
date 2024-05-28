import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../setor.test-samples';

import { SetorFormService } from './setor-form.service';

describe('Setor Form Service', () => {
  let service: SetorFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetorFormService);
  });

  describe('Service methods', () => {
    describe('createSetorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSetorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            sigla: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            deletedAt: expect.any(Object),
          }),
        );
      });

      it('passing ISetor should create a new form with FormGroup', () => {
        const formGroup = service.createSetorFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            sigla: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            deletedAt: expect.any(Object),
          }),
        );
      });
    });

    describe('getSetor', () => {
      it('should return NewSetor for default Setor initial value', () => {
        const formGroup = service.createSetorFormGroup(sampleWithNewData);

        const setor = service.getSetor(formGroup) as any;

        expect(setor).toMatchObject(sampleWithNewData);
      });

      it('should return NewSetor for empty Setor initial value', () => {
        const formGroup = service.createSetorFormGroup();

        const setor = service.getSetor(formGroup) as any;

        expect(setor).toMatchObject({});
      });

      it('should return ISetor', () => {
        const formGroup = service.createSetorFormGroup(sampleWithRequiredData);

        const setor = service.getSetor(formGroup) as any;

        expect(setor).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISetor should not enable id FormControl', () => {
        const formGroup = service.createSetorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSetor should disable id FormControl', () => {
        const formGroup = service.createSetorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
