import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAjuda } from 'app/entities/ajuda/ajuda.model';
import { AjudaService } from 'app/entities/ajuda/service/ajuda.service';
import { IAssunto } from 'app/entities/assunto/assunto.model';
import { AssuntoService } from 'app/entities/assunto/service/assunto.service';
import { TopicoService } from '../service/topico.service';
import { ITopico } from '../topico.model';
import { TopicoFormService, TopicoFormGroup } from './topico-form.service';

@Component({
  standalone: true,
  selector: 'jhi-topico-update',
  templateUrl: './topico-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TopicoUpdateComponent implements OnInit {
  isSaving = false;
  topico: ITopico | null = null;

  ajudasSharedCollection: IAjuda[] = [];
  assuntosSharedCollection: IAssunto[] = [];

  protected topicoService = inject(TopicoService);
  protected topicoFormService = inject(TopicoFormService);
  protected ajudaService = inject(AjudaService);
  protected assuntoService = inject(AssuntoService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TopicoFormGroup = this.topicoFormService.createTopicoFormGroup();

  compareAjuda = (o1: IAjuda | null, o2: IAjuda | null): boolean => this.ajudaService.compareAjuda(o1, o2);

  compareAssunto = (o1: IAssunto | null, o2: IAssunto | null): boolean => this.assuntoService.compareAssunto(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ topico }) => {
      this.topico = topico;
      if (topico) {
        this.updateForm(topico);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const topico = this.topicoFormService.getTopico(this.editForm);
    if (topico.id !== null) {
      this.subscribeToSaveResponse(this.topicoService.update(topico));
    } else {
      this.subscribeToSaveResponse(this.topicoService.create(topico));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITopico>>): void {
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

  protected updateForm(topico: ITopico): void {
    this.topico = topico;
    this.topicoFormService.resetForm(this.editForm, topico);

    this.ajudasSharedCollection = this.ajudaService.addAjudaToCollectionIfMissing<IAjuda>(
      this.ajudasSharedCollection,
      ...(topico.ajudas ?? []),
    );
    this.assuntosSharedCollection = this.assuntoService.addAssuntoToCollectionIfMissing<IAssunto>(
      this.assuntosSharedCollection,
      ...(topico.assuntos ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ajudaService
      .query()
      .pipe(map((res: HttpResponse<IAjuda[]>) => res.body ?? []))
      .pipe(map((ajudas: IAjuda[]) => this.ajudaService.addAjudaToCollectionIfMissing<IAjuda>(ajudas, ...(this.topico?.ajudas ?? []))))
      .subscribe((ajudas: IAjuda[]) => (this.ajudasSharedCollection = ajudas));

    this.assuntoService
      .query()
      .pipe(map((res: HttpResponse<IAssunto[]>) => res.body ?? []))
      .pipe(
        map((assuntos: IAssunto[]) =>
          this.assuntoService.addAssuntoToCollectionIfMissing<IAssunto>(assuntos, ...(this.topico?.assuntos ?? [])),
        ),
      )
      .subscribe((assuntos: IAssunto[]) => (this.assuntosSharedCollection = assuntos));
  }
}
