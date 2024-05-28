import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITopico, NewTopico } from '../topico.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITopico for edit and NewTopicoFormGroupInput for create.
 */
type TopicoFormGroupInput = ITopico | PartialWithRequiredKeyOf<NewTopico>;

type TopicoFormDefaults = Pick<NewTopico, 'id' | 'ajudas' | 'assuntos'>;

type TopicoFormGroupContent = {
  id: FormControl<ITopico['id'] | NewTopico['id']>;
  titulo: FormControl<ITopico['titulo']>;
  ajudas: FormControl<ITopico['ajudas']>;
  assuntos: FormControl<ITopico['assuntos']>;
};

export type TopicoFormGroup = FormGroup<TopicoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TopicoFormService {
  createTopicoFormGroup(topico: TopicoFormGroupInput = { id: null }): TopicoFormGroup {
    const topicoRawValue = {
      ...this.getFormDefaults(),
      ...topico,
    };
    return new FormGroup<TopicoFormGroupContent>({
      id: new FormControl(
        { value: topicoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      titulo: new FormControl(topicoRawValue.titulo, {
        validators: [Validators.required],
      }),
      ajudas: new FormControl(topicoRawValue.ajudas ?? []),
      assuntos: new FormControl(topicoRawValue.assuntos ?? []),
    });
  }

  getTopico(form: TopicoFormGroup): ITopico | NewTopico {
    return form.getRawValue() as ITopico | NewTopico;
  }

  resetForm(form: TopicoFormGroup, topico: TopicoFormGroupInput): void {
    const topicoRawValue = { ...this.getFormDefaults(), ...topico };
    form.reset(
      {
        ...topicoRawValue,
        id: { value: topicoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TopicoFormDefaults {
    return {
      id: null,
      ajudas: [],
      assuntos: [],
    };
  }
}
