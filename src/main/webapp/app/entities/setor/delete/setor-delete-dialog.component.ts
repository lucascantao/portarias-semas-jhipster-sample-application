import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ISetor } from '../setor.model';
import { SetorService } from '../service/setor.service';

@Component({
  standalone: true,
  templateUrl: './setor-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SetorDeleteDialogComponent {
  setor?: ISetor;

  protected setorService = inject(SetorService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.setorService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
