import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUsuario, NewUsuario } from '../usuario.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUsuario for edit and NewUsuarioFormGroupInput for create.
 */
type UsuarioFormGroupInput = IUsuario | PartialWithRequiredKeyOf<NewUsuario>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IUsuario | NewUsuario> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

type UsuarioFormRawValue = FormValueOf<IUsuario>;

type NewUsuarioFormRawValue = FormValueOf<NewUsuario>;

type UsuarioFormDefaults = Pick<NewUsuario, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

type UsuarioFormGroupContent = {
  id: FormControl<UsuarioFormRawValue['id'] | NewUsuario['id']>;
  nome: FormControl<UsuarioFormRawValue['nome']>;
  login: FormControl<UsuarioFormRawValue['login']>;
  email: FormControl<UsuarioFormRawValue['email']>;
  createdAt: FormControl<UsuarioFormRawValue['createdAt']>;
  updatedAt: FormControl<UsuarioFormRawValue['updatedAt']>;
  deletedAt: FormControl<UsuarioFormRawValue['deletedAt']>;
  perfil: FormControl<UsuarioFormRawValue['perfil']>;
  setor: FormControl<UsuarioFormRawValue['setor']>;
};

export type UsuarioFormGroup = FormGroup<UsuarioFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UsuarioFormService {
  createUsuarioFormGroup(usuario: UsuarioFormGroupInput = { id: null }): UsuarioFormGroup {
    const usuarioRawValue = this.convertUsuarioToUsuarioRawValue({
      ...this.getFormDefaults(),
      ...usuario,
    });
    return new FormGroup<UsuarioFormGroupContent>({
      id: new FormControl(
        { value: usuarioRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(usuarioRawValue.nome),
      login: new FormControl(usuarioRawValue.login),
      email: new FormControl(usuarioRawValue.email),
      createdAt: new FormControl(usuarioRawValue.createdAt),
      updatedAt: new FormControl(usuarioRawValue.updatedAt),
      deletedAt: new FormControl(usuarioRawValue.deletedAt),
      perfil: new FormControl(usuarioRawValue.perfil),
      setor: new FormControl(usuarioRawValue.setor),
    });
  }

  getUsuario(form: UsuarioFormGroup): IUsuario | NewUsuario {
    return this.convertUsuarioRawValueToUsuario(form.getRawValue() as UsuarioFormRawValue | NewUsuarioFormRawValue);
  }

  resetForm(form: UsuarioFormGroup, usuario: UsuarioFormGroupInput): void {
    const usuarioRawValue = this.convertUsuarioToUsuarioRawValue({ ...this.getFormDefaults(), ...usuario });
    form.reset(
      {
        ...usuarioRawValue,
        id: { value: usuarioRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UsuarioFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
      deletedAt: currentTime,
    };
  }

  private convertUsuarioRawValueToUsuario(rawUsuario: UsuarioFormRawValue | NewUsuarioFormRawValue): IUsuario | NewUsuario {
    return {
      ...rawUsuario,
      createdAt: dayjs(rawUsuario.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawUsuario.updatedAt, DATE_TIME_FORMAT),
      deletedAt: dayjs(rawUsuario.deletedAt, DATE_TIME_FORMAT),
    };
  }

  private convertUsuarioToUsuarioRawValue(
    usuario: IUsuario | (Partial<NewUsuario> & UsuarioFormDefaults),
  ): UsuarioFormRawValue | PartialWithRequiredKeyOf<NewUsuarioFormRawValue> {
    return {
      ...usuario,
      createdAt: usuario.createdAt ? usuario.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: usuario.updatedAt ? usuario.updatedAt.format(DATE_TIME_FORMAT) : undefined,
      deletedAt: usuario.deletedAt ? usuario.deletedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
