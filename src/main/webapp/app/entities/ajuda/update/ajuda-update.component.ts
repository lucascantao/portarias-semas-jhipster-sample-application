import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITopico } from 'app/entities/topico/topico.model';
import { TopicoService } from 'app/entities/topico/service/topico.service';
import { IAjuda } from '../ajuda.model';
import { AjudaService } from '../service/ajuda.service';
import { AjudaFormService, AjudaFormGroup } from './ajuda-form.service';

@Component({
  standalone: true,
  selector: 'jhi-ajuda-update',
  templateUrl: './ajuda-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AjudaUpdateComponent implements OnInit {
  isSaving = false;
  ajuda: IAjuda | null = null;

  topicosSharedCollection: ITopico[] = [];

  protected ajudaService = inject(AjudaService);
  protected ajudaFormService = inject(AjudaFormService);
  protected topicoService = inject(TopicoService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AjudaFormGroup = this.ajudaFormService.createAjudaFormGroup();

  compareTopico = (o1: ITopico | null, o2: ITopico | null): boolean => this.topicoService.compareTopico(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ajuda }) => {
      this.ajuda = ajuda;
      if (ajuda) {
        this.updateForm(ajuda);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ajuda = this.ajudaFormService.getAjuda(this.editForm);
    if (ajuda.id !== null) {
      this.subscribeToSaveResponse(this.ajudaService.update(ajuda));
    } else {
      this.subscribeToSaveResponse(this.ajudaService.create(ajuda));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAjuda>>): void {
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

  protected updateForm(ajuda: IAjuda): void {
    this.ajuda = ajuda;
    this.ajudaFormService.resetForm(this.editForm, ajuda);

    this.topicosSharedCollection = this.topicoService.addTopicoToCollectionIfMissing<ITopico>(
      this.topicosSharedCollection,
      ...(ajuda.ajudas ?? []),
      ...(ajuda.topicos ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.topicoService
      .query()
      .pipe(map((res: HttpResponse<ITopico[]>) => res.body ?? []))
      .pipe(
        map((topicos: ITopico[]) =>
          this.topicoService.addTopicoToCollectionIfMissing<ITopico>(
            topicos,
            ...(this.ajuda?.ajudas ?? []),
            ...(this.ajuda?.topicos ?? []),
          ),
        ),
      )
      .subscribe((topicos: ITopico[]) => (this.topicosSharedCollection = topicos));
  }
}
