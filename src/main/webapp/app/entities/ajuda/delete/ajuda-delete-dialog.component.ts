import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAjuda } from '../ajuda.model';
import { AjudaService } from '../service/ajuda.service';

@Component({
  standalone: true,
  templateUrl: './ajuda-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AjudaDeleteDialogComponent {
  ajuda?: IAjuda;

  protected ajudaService = inject(AjudaService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.ajudaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
