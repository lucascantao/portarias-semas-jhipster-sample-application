import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAssunto } from 'app/entities/assunto/assunto.model';
import { AssuntoService } from 'app/entities/assunto/service/assunto.service';
import { ISetor } from 'app/entities/setor/setor.model';
import { SetorService } from 'app/entities/setor/service/setor.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { PortariaService } from '../service/portaria.service';
import { IPortaria } from '../portaria.model';
import { PortariaFormService, PortariaFormGroup } from './portaria-form.service';

@Component({
  standalone: true,
  selector: 'jhi-portaria-update',
  templateUrl: './portaria-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PortariaUpdateComponent implements OnInit {
  isSaving = false;
  portaria: IPortaria | null = null;

  assuntosSharedCollection: IAssunto[] = [];
  setorsSharedCollection: ISetor[] = [];
  usuariosSharedCollection: IUsuario[] = [];

  protected portariaService = inject(PortariaService);
  protected portariaFormService = inject(PortariaFormService);
  protected assuntoService = inject(AssuntoService);
  protected setorService = inject(SetorService);
  protected usuarioService = inject(UsuarioService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PortariaFormGroup = this.portariaFormService.createPortariaFormGroup();

  compareAssunto = (o1: IAssunto | null, o2: IAssunto | null): boolean => this.assuntoService.compareAssunto(o1, o2);

  compareSetor = (o1: ISetor | null, o2: ISetor | null): boolean => this.setorService.compareSetor(o1, o2);

  compareUsuario = (o1: IUsuario | null, o2: IUsuario | null): boolean => this.usuarioService.compareUsuario(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ portaria }) => {
      this.portaria = portaria;
      if (portaria) {
        this.updateForm(portaria);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const portaria = this.portariaFormService.getPortaria(this.editForm);
    if (portaria.id !== null) {
      this.subscribeToSaveResponse(this.portariaService.update(portaria));
    } else {
      this.subscribeToSaveResponse(this.portariaService.create(portaria));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPortaria>>): void {
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

  protected updateForm(portaria: IPortaria): void {
    this.portaria = portaria;
    this.portariaFormService.resetForm(this.editForm, portaria);

    this.assuntosSharedCollection = this.assuntoService.addAssuntoToCollectionIfMissing<IAssunto>(
      this.assuntosSharedCollection,
      portaria.assunto,
    );
    this.setorsSharedCollection = this.setorService.addSetorToCollectionIfMissing<ISetor>(this.setorsSharedCollection, portaria.setor);
    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(
      this.usuariosSharedCollection,
      portaria.usuario,
      portaria.updatedBy,
      portaria.deletedBy,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.assuntoService
      .query()
      .pipe(map((res: HttpResponse<IAssunto[]>) => res.body ?? []))
      .pipe(map((assuntos: IAssunto[]) => this.assuntoService.addAssuntoToCollectionIfMissing<IAssunto>(assuntos, this.portaria?.assunto)))
      .subscribe((assuntos: IAssunto[]) => (this.assuntosSharedCollection = assuntos));

    this.setorService
      .query()
      .pipe(map((res: HttpResponse<ISetor[]>) => res.body ?? []))
      .pipe(map((setors: ISetor[]) => this.setorService.addSetorToCollectionIfMissing<ISetor>(setors, this.portaria?.setor)))
      .subscribe((setors: ISetor[]) => (this.setorsSharedCollection = setors));

    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(
        map((usuarios: IUsuario[]) =>
          this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(
            usuarios,
            this.portaria?.usuario,
            this.portaria?.updatedBy,
            this.portaria?.deletedBy,
          ),
        ),
      )
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));
  }
}
