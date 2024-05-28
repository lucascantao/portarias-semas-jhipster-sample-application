import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ITopico } from 'app/entities/topico/topico.model';
import { TopicoService } from 'app/entities/topico/service/topico.service';
import { AssuntoService } from '../service/assunto.service';
import { IAssunto } from '../assunto.model';
import { AssuntoFormService, AssuntoFormGroup } from './assunto-form.service';

@Component({
  standalone: true,
  selector: 'jhi-assunto-update',
  templateUrl: './assunto-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AssuntoUpdateComponent implements OnInit {
  isSaving = false;
  assunto: IAssunto | null = null;

  topicosSharedCollection: ITopico[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected assuntoService = inject(AssuntoService);
  protected assuntoFormService = inject(AssuntoFormService);
  protected topicoService = inject(TopicoService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AssuntoFormGroup = this.assuntoFormService.createAssuntoFormGroup();

  compareTopico = (o1: ITopico | null, o2: ITopico | null): boolean => this.topicoService.compareTopico(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ assunto }) => {
      this.assunto = assunto;
      if (assunto) {
        this.updateForm(assunto);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('jhipsterSampleApplicationApp.error', { ...err, key: 'error.file.' + err.key }),
        ),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const assunto = this.assuntoFormService.getAssunto(this.editForm);
    if (assunto.id !== null) {
      this.subscribeToSaveResponse(this.assuntoService.update(assunto));
    } else {
      this.subscribeToSaveResponse(this.assuntoService.create(assunto));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAssunto>>): void {
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

  protected updateForm(assunto: IAssunto): void {
    this.assunto = assunto;
    this.assuntoFormService.resetForm(this.editForm, assunto);

    this.topicosSharedCollection = this.topicoService.addTopicoToCollectionIfMissing<ITopico>(
      this.topicosSharedCollection,
      ...(assunto.topicos ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.topicoService
      .query()
      .pipe(map((res: HttpResponse<ITopico[]>) => res.body ?? []))
      .pipe(
        map((topicos: ITopico[]) => this.topicoService.addTopicoToCollectionIfMissing<ITopico>(topicos, ...(this.assunto?.topicos ?? []))),
      )
      .subscribe((topicos: ITopico[]) => (this.topicosSharedCollection = topicos));
  }
}
