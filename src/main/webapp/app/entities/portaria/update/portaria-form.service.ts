import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPortaria, NewPortaria } from '../portaria.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPortaria for edit and NewPortariaFormGroupInput for create.
 */
type PortariaFormGroupInput = IPortaria | PartialWithRequiredKeyOf<NewPortaria>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPortaria | NewPortaria> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

type PortariaFormRawValue = FormValueOf<IPortaria>;

type NewPortariaFormRawValue = FormValueOf<NewPortaria>;

type PortariaFormDefaults = Pick<NewPortaria, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

type PortariaFormGroupContent = {
  id: FormControl<PortariaFormRawValue['id'] | NewPortaria['id']>;
  numero: FormControl<PortariaFormRawValue['numero']>;
  data: FormControl<PortariaFormRawValue['data']>;
  createdAt: FormControl<PortariaFormRawValue['createdAt']>;
  updatedAt: FormControl<PortariaFormRawValue['updatedAt']>;
  deletedAt: FormControl<PortariaFormRawValue['deletedAt']>;
  assunto: FormControl<PortariaFormRawValue['assunto']>;
  setor: FormControl<PortariaFormRawValue['setor']>;
  usuario: FormControl<PortariaFormRawValue['usuario']>;
  updatedBy: FormControl<PortariaFormRawValue['updatedBy']>;
  deletedBy: FormControl<PortariaFormRawValue['deletedBy']>;
};

export type PortariaFormGroup = FormGroup<PortariaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PortariaFormService {
  createPortariaFormGroup(portaria: PortariaFormGroupInput = { id: null }): PortariaFormGroup {
    const portariaRawValue = this.convertPortariaToPortariaRawValue({
      ...this.getFormDefaults(),
      ...portaria,
    });
    return new FormGroup<PortariaFormGroupContent>({
      id: new FormControl(
        { value: portariaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      numero: new FormControl(portariaRawValue.numero, {
        validators: [Validators.required],
      }),
      data: new FormControl(portariaRawValue.data),
      createdAt: new FormControl(portariaRawValue.createdAt),
      updatedAt: new FormControl(portariaRawValue.updatedAt),
      deletedAt: new FormControl(portariaRawValue.deletedAt),
      assunto: new FormControl(portariaRawValue.assunto),
      setor: new FormControl(portariaRawValue.setor),
      usuario: new FormControl(portariaRawValue.usuario),
      updatedBy: new FormControl(portariaRawValue.updatedBy),
      deletedBy: new FormControl(portariaRawValue.deletedBy),
    });
  }

  getPortaria(form: PortariaFormGroup): IPortaria | NewPortaria {
    return this.convertPortariaRawValueToPortaria(form.getRawValue() as PortariaFormRawValue | NewPortariaFormRawValue);
  }

  resetForm(form: PortariaFormGroup, portaria: PortariaFormGroupInput): void {
    const portariaRawValue = this.convertPortariaToPortariaRawValue({ ...this.getFormDefaults(), ...portaria });
    form.reset(
      {
        ...portariaRawValue,
        id: { value: portariaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PortariaFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
      deletedAt: currentTime,
    };
  }

  private convertPortariaRawValueToPortaria(rawPortaria: PortariaFormRawValue | NewPortariaFormRawValue): IPortaria | NewPortaria {
    return {
      ...rawPortaria,
      createdAt: dayjs(rawPortaria.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawPortaria.updatedAt, DATE_TIME_FORMAT),
      deletedAt: dayjs(rawPortaria.deletedAt, DATE_TIME_FORMAT),
    };
  }

  private convertPortariaToPortariaRawValue(
    portaria: IPortaria | (Partial<NewPortaria> & PortariaFormDefaults),
  ): PortariaFormRawValue | PartialWithRequiredKeyOf<NewPortariaFormRawValue> {
    return {
      ...portaria,
      createdAt: portaria.createdAt ? portaria.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: portaria.updatedAt ? portaria.updatedAt.format(DATE_TIME_FORMAT) : undefined,
      deletedAt: portaria.deletedAt ? portaria.deletedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
