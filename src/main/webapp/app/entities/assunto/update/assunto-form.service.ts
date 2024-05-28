import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAssunto, NewAssunto } from '../assunto.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAssunto for edit and NewAssuntoFormGroupInput for create.
 */
type AssuntoFormGroupInput = IAssunto | PartialWithRequiredKeyOf<NewAssunto>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAssunto | NewAssunto> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

type AssuntoFormRawValue = FormValueOf<IAssunto>;

type NewAssuntoFormRawValue = FormValueOf<NewAssunto>;

type AssuntoFormDefaults = Pick<NewAssunto, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'topicos'>;

type AssuntoFormGroupContent = {
  id: FormControl<AssuntoFormRawValue['id'] | NewAssunto['id']>;
  nome: FormControl<AssuntoFormRawValue['nome']>;
  descricao: FormControl<AssuntoFormRawValue['descricao']>;
  createdAt: FormControl<AssuntoFormRawValue['createdAt']>;
  updatedAt: FormControl<AssuntoFormRawValue['updatedAt']>;
  deletedAt: FormControl<AssuntoFormRawValue['deletedAt']>;
  topicos: FormControl<AssuntoFormRawValue['topicos']>;
};

export type AssuntoFormGroup = FormGroup<AssuntoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AssuntoFormService {
  createAssuntoFormGroup(assunto: AssuntoFormGroupInput = { id: null }): AssuntoFormGroup {
    const assuntoRawValue = this.convertAssuntoToAssuntoRawValue({
      ...this.getFormDefaults(),
      ...assunto,
    });
    return new FormGroup<AssuntoFormGroupContent>({
      id: new FormControl(
        { value: assuntoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(assuntoRawValue.nome, {
        validators: [Validators.required, Validators.maxLength(1000)],
      }),
      descricao: new FormControl(assuntoRawValue.descricao),
      createdAt: new FormControl(assuntoRawValue.createdAt),
      updatedAt: new FormControl(assuntoRawValue.updatedAt),
      deletedAt: new FormControl(assuntoRawValue.deletedAt),
      topicos: new FormControl(assuntoRawValue.topicos ?? []),
    });
  }

  getAssunto(form: AssuntoFormGroup): IAssunto | NewAssunto {
    return this.convertAssuntoRawValueToAssunto(form.getRawValue() as AssuntoFormRawValue | NewAssuntoFormRawValue);
  }

  resetForm(form: AssuntoFormGroup, assunto: AssuntoFormGroupInput): void {
    const assuntoRawValue = this.convertAssuntoToAssuntoRawValue({ ...this.getFormDefaults(), ...assunto });
    form.reset(
      {
        ...assuntoRawValue,
        id: { value: assuntoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AssuntoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
      deletedAt: currentTime,
      topicos: [],
    };
  }

  private convertAssuntoRawValueToAssunto(rawAssunto: AssuntoFormRawValue | NewAssuntoFormRawValue): IAssunto | NewAssunto {
    return {
      ...rawAssunto,
      createdAt: dayjs(rawAssunto.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawAssunto.updatedAt, DATE_TIME_FORMAT),
      deletedAt: dayjs(rawAssunto.deletedAt, DATE_TIME_FORMAT),
    };
  }

  private convertAssuntoToAssuntoRawValue(
    assunto: IAssunto | (Partial<NewAssunto> & AssuntoFormDefaults),
  ): AssuntoFormRawValue | PartialWithRequiredKeyOf<NewAssuntoFormRawValue> {
    return {
      ...assunto,
      createdAt: assunto.createdAt ? assunto.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: assunto.updatedAt ? assunto.updatedAt.format(DATE_TIME_FORMAT) : undefined,
      deletedAt: assunto.deletedAt ? assunto.deletedAt.format(DATE_TIME_FORMAT) : undefined,
      topicos: assunto.topicos ?? [],
    };
  }
}
