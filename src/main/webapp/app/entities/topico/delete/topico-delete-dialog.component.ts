import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITopico } from '../topico.model';
import { TopicoService } from '../service/topico.service';

@Component({
  standalone: true,
  templateUrl: './topico-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TopicoDeleteDialogComponent {
  topico?: ITopico;

  protected topicoService = inject(TopicoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.topicoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
