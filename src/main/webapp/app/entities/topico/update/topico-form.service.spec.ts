import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../topico.test-samples';

import { TopicoFormService } from './topico-form.service';

describe('Topico Form Service', () => {
  let service: TopicoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicoFormService);
  });

  describe('Service methods', () => {
    describe('createTopicoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTopicoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            titulo: expect.any(Object),
            ajudas: expect.any(Object),
            assuntos: expect.any(Object),
          }),
        );
      });

      it('passing ITopico should create a new form with FormGroup', () => {
        const formGroup = service.createTopicoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            titulo: expect.any(Object),
            ajudas: expect.any(Object),
            assuntos: expect.any(Object),
          }),
        );
      });
    });

    describe('getTopico', () => {
      it('should return NewTopico for default Topico initial value', () => {
        const formGroup = service.createTopicoFormGroup(sampleWithNewData);

        const topico = service.getTopico(formGroup) as any;

        expect(topico).toMatchObject(sampleWithNewData);
      });

      it('should return NewTopico for empty Topico initial value', () => {
        const formGroup = service.createTopicoFormGroup();

        const topico = service.getTopico(formGroup) as any;

        expect(topico).toMatchObject({});
      });

      it('should return ITopico', () => {
        const formGroup = service.createTopicoFormGroup(sampleWithRequiredData);

        const topico = service.getTopico(formGroup) as any;

        expect(topico).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITopico should not enable id FormControl', () => {
        const formGroup = service.createTopicoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTopico should disable id FormControl', () => {
        const formGroup = service.createTopicoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
