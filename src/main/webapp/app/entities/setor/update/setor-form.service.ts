import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISetor, NewSetor } from '../setor.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISetor for edit and NewSetorFormGroupInput for create.
 */
type SetorFormGroupInput = ISetor | PartialWithRequiredKeyOf<NewSetor>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ISetor | NewSetor> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

type SetorFormRawValue = FormValueOf<ISetor>;

type NewSetorFormRawValue = FormValueOf<NewSetor>;

type SetorFormDefaults = Pick<NewSetor, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

type SetorFormGroupContent = {
  id: FormControl<SetorFormRawValue['id'] | NewSetor['id']>;
  nome: FormControl<SetorFormRawValue['nome']>;
  sigla: FormControl<SetorFormRawValue['sigla']>;
  createdAt: FormControl<SetorFormRawValue['createdAt']>;
  updatedAt: FormControl<SetorFormRawValue['updatedAt']>;
  deletedAt: FormControl<SetorFormRawValue['deletedAt']>;
};

export type SetorFormGroup = FormGroup<SetorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SetorFormService {
  createSetorFormGroup(setor: SetorFormGroupInput = { id: null }): SetorFormGroup {
    const setorRawValue = this.convertSetorToSetorRawValue({
      ...this.getFormDefaults(),
      ...setor,
    });
    return new FormGroup<SetorFormGroupContent>({
      id: new FormControl(
        { value: setorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(setorRawValue.nome, {
        validators: [Validators.required],
      }),
      sigla: new FormControl(setorRawValue.sigla, {
        validators: [Validators.required],
      }),
      createdAt: new FormControl(setorRawValue.createdAt),
      updatedAt: new FormControl(setorRawValue.updatedAt),
      deletedAt: new FormControl(setorRawValue.deletedAt),
    });
  }

  getSetor(form: SetorFormGroup): ISetor | NewSetor {
    return this.convertSetorRawValueToSetor(form.getRawValue() as SetorFormRawValue | NewSetorFormRawValue);
  }

  resetForm(form: SetorFormGroup, setor: SetorFormGroupInput): void {
    const setorRawValue = this.convertSetorToSetorRawValue({ ...this.getFormDefaults(), ...setor });
    form.reset(
      {
        ...setorRawValue,
        id: { value: setorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SetorFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
      deletedAt: currentTime,
    };
  }

  private convertSetorRawValueToSetor(rawSetor: SetorFormRawValue | NewSetorFormRawValue): ISetor | NewSetor {
    return {
      ...rawSetor,
      createdAt: dayjs(rawSetor.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawSetor.updatedAt, DATE_TIME_FORMAT),
      deletedAt: dayjs(rawSetor.deletedAt, DATE_TIME_FORMAT),
    };
  }

  private convertSetorToSetorRawValue(
    setor: ISetor | (Partial<NewSetor> & SetorFormDefaults),
  ): SetorFormRawValue | PartialWithRequiredKeyOf<NewSetorFormRawValue> {
    return {
      ...setor,
      createdAt: setor.createdAt ? setor.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: setor.updatedAt ? setor.updatedAt.format(DATE_TIME_FORMAT) : undefined,
      deletedAt: setor.deletedAt ? setor.deletedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
