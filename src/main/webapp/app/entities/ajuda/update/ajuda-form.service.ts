import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAjuda, NewAjuda } from '../ajuda.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAjuda for edit and NewAjudaFormGroupInput for create.
 */
type AjudaFormGroupInput = IAjuda | PartialWithRequiredKeyOf<NewAjuda>;

type AjudaFormDefaults = Pick<NewAjuda, 'id' | 'topicos'>;

type AjudaFormGroupContent = {
  id: FormControl<IAjuda['id'] | NewAjuda['id']>;
  titulo: FormControl<IAjuda['titulo']>;
  topicos: FormControl<IAjuda['topicos']>;
};

export type AjudaFormGroup = FormGroup<AjudaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AjudaFormService {
  createAjudaFormGroup(ajuda: AjudaFormGroupInput = { id: null }): AjudaFormGroup {
    const ajudaRawValue = {
      ...this.getFormDefaults(),
      ...ajuda,
    };
    return new FormGroup<AjudaFormGroupContent>({
      id: new FormControl(
        { value: ajudaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      titulo: new FormControl(ajudaRawValue.titulo, {
        validators: [Validators.required],
      }),
      topicos: new FormControl(ajudaRawValue.topicos ?? []),
    });
  }

  getAjuda(form: AjudaFormGroup): IAjuda | NewAjuda {
    return form.getRawValue() as IAjuda | NewAjuda;
  }

  resetForm(form: AjudaFormGroup, ajuda: AjudaFormGroupInput): void {
    const ajudaRawValue = { ...this.getFormDefaults(), ...ajuda };
    form.reset(
      {
        ...ajudaRawValue,
        id: { value: ajudaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AjudaFormDefaults {
    return {
      id: null,
      topicos: [],
    };
  }
}
