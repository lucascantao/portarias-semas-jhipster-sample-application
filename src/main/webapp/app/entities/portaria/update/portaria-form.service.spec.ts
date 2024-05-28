import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../portaria.test-samples';

import { PortariaFormService } from './portaria-form.service';

describe('Portaria Form Service', () => {
  let service: PortariaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortariaFormService);
  });

  describe('Service methods', () => {
    describe('createPortariaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPortariaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numero: expect.any(Object),
            data: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            deletedAt: expect.any(Object),
            assunto: expect.any(Object),
            setor: expect.any(Object),
            usuario: expect.any(Object),
            updatedBy: expect.any(Object),
            deletedBy: expect.any(Object),
          }),
        );
      });

      it('passing IPortaria should create a new form with FormGroup', () => {
        const formGroup = service.createPortariaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numero: expect.any(Object),
            data: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            deletedAt: expect.any(Object),
            assunto: expect.any(Object),
            setor: expect.any(Object),
            usuario: expect.any(Object),
            updatedBy: expect.any(Object),
            deletedBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getPortaria', () => {
      it('should return NewPortaria for default Portaria initial value', () => {
        const formGroup = service.createPortariaFormGroup(sampleWithNewData);

        const portaria = service.getPortaria(formGroup) as any;

        expect(portaria).toMatchObject(sampleWithNewData);
      });

      it('should return NewPortaria for empty Portaria initial value', () => {
        const formGroup = service.createPortariaFormGroup();

        const portaria = service.getPortaria(formGroup) as any;

        expect(portaria).toMatchObject({});
      });

      it('should return IPortaria', () => {
        const formGroup = service.createPortariaFormGroup(sampleWithRequiredData);

        const portaria = service.getPortaria(formGroup) as any;

        expect(portaria).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPortaria should not enable id FormControl', () => {
        const formGroup = service.createPortariaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPortaria should disable id FormControl', () => {
        const formGroup = service.createPortariaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
