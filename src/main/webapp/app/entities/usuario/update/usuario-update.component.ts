import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPerfil } from 'app/entities/perfil/perfil.model';
import { PerfilService } from 'app/entities/perfil/service/perfil.service';
import { ISetor } from 'app/entities/setor/setor.model';
import { SetorService } from 'app/entities/setor/service/setor.service';
import { UsuarioService } from '../service/usuario.service';
import { IUsuario } from '../usuario.model';
import { UsuarioFormService, UsuarioFormGroup } from './usuario-form.service';

@Component({
  standalone: true,
  selector: 'jhi-usuario-update',
  templateUrl: './usuario-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UsuarioUpdateComponent implements OnInit {
  isSaving = false;
  usuario: IUsuario | null = null;

  perfilsSharedCollection: IPerfil[] = [];
  setorsSharedCollection: ISetor[] = [];

  protected usuarioService = inject(UsuarioService);
  protected usuarioFormService = inject(UsuarioFormService);
  protected perfilService = inject(PerfilService);
  protected setorService = inject(SetorService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: UsuarioFormGroup = this.usuarioFormService.createUsuarioFormGroup();

  comparePerfil = (o1: IPerfil | null, o2: IPerfil | null): boolean => this.perfilService.comparePerfil(o1, o2);

  compareSetor = (o1: ISetor | null, o2: ISetor | null): boolean => this.setorService.compareSetor(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ usuario }) => {
      this.usuario = usuario;
      if (usuario) {
        this.updateForm(usuario);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const usuario = this.usuarioFormService.getUsuario(this.editForm);
    if (usuario.id !== null) {
      this.subscribeToSaveResponse(this.usuarioService.update(usuario));
    } else {
      this.subscribeToSaveResponse(this.usuarioService.create(usuario));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUsuario>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(usuario: IUsuario): void {
    this.usuario = usuario;
    this.usuarioFormService.resetForm(this.editForm, usuario);

    this.perfilsSharedCollection = this.perfilService.addPerfilToCollectionIfMissing<IPerfil>(this.perfilsSharedCollection, usuario.perfil);
    this.setorsSharedCollection = this.setorService.addSetorToCollectionIfMissing<ISetor>(this.setorsSharedCollection, usuario.setor);
  }

  protected loadRelationshipsOptions(): void {
    this.perfilService
      .query()
      .pipe(map((res: HttpResponse<IPerfil[]>) => res.body ?? []))
      .pipe(map((perfils: IPerfil[]) => this.perfilService.addPerfilToCollectionIfMissing<IPerfil>(perfils, this.usuario?.perfil)))
      .subscribe((perfils: IPerfil[]) => (this.perfilsSharedCollection = perfils));

    this.setorService
      .query()
      .pipe(map((res: HttpResponse<ISetor[]>) => res.body ?? []))
      .pipe(map((setors: ISetor[]) => this.setorService.addSetorToCollectionIfMissing<ISetor>(setors, this.usuario?.setor)))
      .subscribe((setors: ISetor[]) => (this.setorsSharedCollection = setors));
  }
}
