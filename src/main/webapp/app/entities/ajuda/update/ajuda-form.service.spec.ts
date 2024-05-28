import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../ajuda.test-samples';

import { AjudaFormService } from './ajuda-form.service';

describe('Ajuda Form Service', () => {
  let service: AjudaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AjudaFormService);
  });

  describe('Service methods', () => {
    describe('createAjudaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAjudaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            titulo: expect.any(Object),
            topicos: expect.any(Object),
          }),
        );
      });

      it('passing IAjuda should create a new form with FormGroup', () => {
        const formGroup = service.createAjudaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            titulo: expect.any(Object),
            topicos: expect.any(Object),
          }),
        );
      });
    });

    describe('getAjuda', () => {
      it('should return NewAjuda for default Ajuda initial value', () => {
        const formGroup = service.createAjudaFormGroup(sampleWithNewData);

        const ajuda = service.getAjuda(formGroup) as any;

        expect(ajuda).toMatchObject(sampleWithNewData);
      });

      it('should return NewAjuda for empty Ajuda initial value', () => {
        const formGroup = service.createAjudaFormGroup();

        const ajuda = service.getAjuda(formGroup) as any;

        expect(ajuda).toMatchObject({});
      });

      it('should return IAjuda', () => {
        const formGroup = service.createAjudaFormGroup(sampleWithRequiredData);

        const ajuda = service.getAjuda(formGroup) as any;

        expect(ajuda).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAjuda should not enable id FormControl', () => {
        const formGroup = service.createAjudaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAjuda should disable id FormControl', () => {
        const formGroup = service.createAjudaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
