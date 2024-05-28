import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPerfil, NewPerfil } from '../perfil.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPerfil for edit and NewPerfilFormGroupInput for create.
 */
type PerfilFormGroupInput = IPerfil | PartialWithRequiredKeyOf<NewPerfil>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPerfil | NewPerfil> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

type PerfilFormRawValue = FormValueOf<IPerfil>;

type NewPerfilFormRawValue = FormValueOf<NewPerfil>;

type PerfilFormDefaults = Pick<NewPerfil, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

type PerfilFormGroupContent = {
  id: FormControl<PerfilFormRawValue['id'] | NewPerfil['id']>;
  nome: FormControl<PerfilFormRawValue['nome']>;
  descricao: FormControl<PerfilFormRawValue['descricao']>;
  createdAt: FormControl<PerfilFormRawValue['createdAt']>;
  updatedAt: FormControl<PerfilFormRawValue['updatedAt']>;
  deletedAt: FormControl<PerfilFormRawValue['deletedAt']>;
};

export type PerfilFormGroup = FormGroup<PerfilFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PerfilFormService {
  createPerfilFormGroup(perfil: PerfilFormGroupInput = { id: null }): PerfilFormGroup {
    const perfilRawValue = this.convertPerfilToPerfilRawValue({
      ...this.getFormDefaults(),
      ...perfil,
    });
    return new FormGroup<PerfilFormGroupContent>({
      id: new FormControl(
        { value: perfilRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(perfilRawValue.nome, {
        validators: [Validators.required, Validators.maxLength(1000)],
      }),
      descricao: new FormControl(perfilRawValue.descricao),
      createdAt: new FormControl(perfilRawValue.createdAt),
      updatedAt: new FormControl(perfilRawValue.updatedAt),
      deletedAt: new FormControl(perfilRawValue.deletedAt),
    });
  }

  getPerfil(form: PerfilFormGroup): IPerfil | NewPerfil {
    return this.convertPerfilRawValueToPerfil(form.getRawValue() as PerfilFormRawValue | NewPerfilFormRawValue);
  }

  resetForm(form: PerfilFormGroup, perfil: PerfilFormGroupInput): void {
    const perfilRawValue = this.convertPerfilToPerfilRawValue({ ...this.getFormDefaults(), ...perfil });
    form.reset(
      {
        ...perfilRawValue,
        id: { value: perfilRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PerfilFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
      deletedAt: currentTime,
    };
  }

  private convertPerfilRawValueToPerfil(rawPerfil: PerfilFormRawValue | NewPerfilFormRawValue): IPerfil | NewPerfil {
    return {
      ...rawPerfil,
      createdAt: dayjs(rawPerfil.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawPerfil.updatedAt, DATE_TIME_FORMAT),
      deletedAt: dayjs(rawPerfil.deletedAt, DATE_TIME_FORMAT),
    };
  }

  private convertPerfilToPerfilRawValue(
    perfil: IPerfil | (Partial<NewPerfil> & PerfilFormDefaults),
  ): PerfilFormRawValue | PartialWithRequiredKeyOf<NewPerfilFormRawValue> {
    return {
      ...perfil,
      createdAt: perfil.createdAt ? perfil.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: perfil.updatedAt ? perfil.updatedAt.format(DATE_TIME_FORMAT) : undefined,
      deletedAt: perfil.deletedAt ? perfil.deletedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
