import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAssunto } from '../assunto.model';
import { AssuntoService } from '../service/assunto.service';

@Component({
  standalone: true,
  templateUrl: './assunto-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AssuntoDeleteDialogComponent {
  assunto?: IAssunto;

  protected assuntoService = inject(AssuntoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.assuntoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
